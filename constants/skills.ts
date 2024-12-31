export const skillsList = {
  "Developer Roles": [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Mobile App Developer",
    "DevOps Engineer",
    "Cloud Developer",
    "Software Engineer",
    "System Architect",
    "API Developer",
    "Game Developer",
    "Blockchain Developer",
    "Database Developer"
  ],
  "Specialized Roles": [
    "UI/UX Designer",
    "Product Manager",
    "Scrum Master",
    "Technical Lead",
    "Solution Architect",
    "Data Scientist",
    "ML Engineer",
    "AI Engineer",
    "Security Engineer",
    "QA Engineer",
    "Technical Writer"
  ],
  "Frontend Technologies": [
    "React Developer",
    "Angular Developer",
    "Vue.js Developer",
    "Next.js Developer",
    "HTML/CSS",
    "JavaScript",
    "TypeScript",
    "Tailwind CSS",
    "Redux",
    "WebGL",
    "Svelte"
  ],
  "Backend Technologies": [
    "Node.js Developer",
    "Python Developer",
    "Java Developer",
    "PHP Developer",
    "Ruby Developer",
    "Go Developer",
    "C# Developer",
    "Rust Developer",
    "Express.js",
    "Django",
    "Spring Boot",
    "Laravel"
  ],
  "Mobile Technologies": [
    "React Native Developer",
    "iOS Developer",
    "Android Developer",
    "Flutter Developer",
    "Kotlin",
    "Swift",
    "Xamarin",
    "Mobile UI Design"
  ],
  "AI & Data": [
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Natural Language Processing",
    "Computer Vision",
    "Data Analytics",
    "Big Data",
    "TensorFlow",
    "PyTorch",
    "OpenAI",
    "Data Engineering"
  ],
  "Cloud & DevOps": [
    "AWS Developer",
    "Azure Developer",
    "Google Cloud",
    "Cloud Architecture",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Jenkins",
    "Terraform",
    "Microservices",
    "Serverless"
  ],
  "Database": [
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "Elasticsearch",
    "SQL Server",
    "Oracle",
    "GraphQL",
    "Database Design"
  ]
} as const;

export const allSkills = Object.values(skillsList).flat();

export type SkillsCategory = keyof typeof skillsList;

export type Skill = typeof allSkills[number];