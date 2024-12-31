import { DocumentData } from "firebase/firestore"
import { searchUsers } from "./firebase"

interface IUserInfo {
  id: string
  name: string
  email: string
  photoUrl: string
  hasCompletedOnboarding: boolean
  location: {
    long: string
    lat: string
  }
  skills: string[]
  distance: number
}

export const fetchResults = async (skills: string | string[], searching_user: any) => {
  let skill_weight = -1000
  let distance_weight = 1

  // in km
  const calculate_physical_distance = (lon1: number, lat1: number, lon2: number, lat2: number) => {
    // d = 2R × sin⁻¹(√[sin²((θ₂ - θ₁)/2) + cosθ₁ × cosθ₂ × sin²((φ₂ - φ₁)/2)])

    let physical_distance = 0

    lon1 = lon1 * Math.PI / 180
    lat1 = lat1 * Math.PI / 180
    lon2 = lon2 * Math.PI / 180
    lat2 = lat2 * Math.PI / 180

    physical_distance = 2 * 6371 *
      Math.asin(
        Math.sqrt(
          Math.pow(Math.sin((lat1 - lat2) / 2), 2) +
          Math.cos(lat1) *
          Math.cos(lat2) *
          Math.pow(Math.sin((lon1 - lon2) / 2), 2)
        )
      );

    return Math.trunc(physical_distance)
  }

  const calculate_distance = (user: DocumentData, searching_user: IUserInfo) => {
    let distance = 0

    searching_user.skills.map((skill: string) => {
      if (user.skills.includes(skill)) {
        distance += 1 * skill_weight
      }
      else {
        distance -= 1 * skill_weight
      }
    });
    const actualDistance = calculate_physical_distance(Number(user.location.long), Number(user.location.lat), Number(searching_user.location.long), Number(searching_user.location.lat))
    distance += distance_weight * actualDistance

    return [distance, actualDistance]
  }

  const sort_match = (matching_users: DocumentData[], searching_user: IUserInfo) => {
    let sorted_users: { [key: number]: DocumentData[] } = {}

    matching_users.map((user) => {
      const [distance, actualDistance] = calculate_distance(user, searching_user)
      user.distance = actualDistance
      if (sorted_users[distance] == undefined) {
        sorted_users[distance] = []
      }
      sorted_users[distance].push(user)
    });

    return sorted_users
  }


  const matching_users = await searchUsers(skills)
  const sorted_match = sort_match(matching_users, searching_user)

  const array: IUserInfo[] = []

  Object.keys(sorted_match).sort((a, b) => a - b)
    .map((distance) => {
      sorted_match[Number(distance)].map((user) => {
        return array.push(user)
      })
    })

  return array;
}