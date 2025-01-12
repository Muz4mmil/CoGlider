import { doc, collection, addDoc, serverTimestamp, updateDoc, query, orderBy, onSnapshot, where, getDocs, getDoc, or } from "firebase/firestore";
import { db } from "@/configs/firebase-config";
import { getUserInfo } from "./firebase";

interface IMessages { id: string; [key: string]: any }

export const createRoom = async (myId: string, userId: string) => {
  const chatsRef = collection(db, "chats")
  const q = query(chatsRef, where("participants", "array-contains", myId))
  const snapshot = await getDocs(q)

  const existingChat = snapshot.docs.find((doc) => doc.data().participants.includes(userId));

  if (existingChat) {
    return existingChat.id
  }

  const chatData = {
    participants: [myId, userId],
    lastMessage: "",
    lastMessageTimestamp: null,
    lastMessageReadBy: []
  }

  const newChat = await addDoc(chatsRef, chatData)
  return newChat.id;
}

export const sendMessage = async (chatId: string, userId: string, senderName: string | null | undefined, text: string) => {
  const messageData = {
    senderId: userId,
    text,
    timestamp: serverTimestamp(),
    read: false,
  };

  try {
    const chatDoc = await getDoc(doc(db, "chats", chatId));
    const participants = chatDoc.data()?.participants;
    const recipientId = participants.find((id: string) => id !== userId);

    const recipientDoc = await getDoc(doc(db, "users", recipientId));
    const recipientToken = recipientDoc.data()?.expoPushToken;

    await addDoc(collection(doc(db, "chats", chatId), "messages"), messageData);

    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: text,
      lastMessageTimestamp: serverTimestamp(),
      lastMessageReadBy: [userId],
    });

    if (recipientToken) {
      setTimeout(async () => {
        const chatDoc = await getDoc(doc(db, "chats", chatId));
        const isReadInChat = chatDoc.data()?.lastMessageReadBy.includes(recipientId);
        if (!isReadInChat) {
          await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: recipientToken,
              title: senderName,
              body: text,
              data: { chatId, senderId: userId }
            }),
          });
        }
      }, 1000);
    }

    console.log("Message sent!");
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};

export const getMessages = async (chatId: string, callback: (messages: IMessages[]) => void) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));

  onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(messages)
  })
}

export const getChatList = async (userId: string, callback: React.Dispatch<React.SetStateAction<IMessages[]>>) => {
  const chatRef = collection(db, "chats")

  const q = query(chatRef, where("participants", "array-contains", userId))

  onSnapshot(q, async (snapshot) => {
    const chatList = await Promise.all(snapshot.docs.map(async (doc) => {
      const messagesRef = collection(db, "chats", doc.id, "messages");
      const messagesSnapshot = await getDocs(messagesRef);
      if (!messagesSnapshot.empty) {
        const otherParticipantId = doc.data().participants.find((id: string) => id !== userId);
        const otherUserInfo = await getUserInfo(otherParticipantId);
        return {
          id: doc.id,
          ...doc.data(),
          otherUserInfo: { id: otherParticipantId, ...otherUserInfo }
        };
      }
      return null;
    }));

    const filteredChatList = chatList.filter(chat => chat !== null);
    filteredChatList.sort((a: IMessages, b: IMessages) => {
      const aTimestamp = a.lastMessageTimestamp?.toDate();
      const bTimestamp = b.lastMessageTimestamp?.toDate();
      return bTimestamp - aTimestamp;
    });
    callback(filteredChatList)
  })
}

