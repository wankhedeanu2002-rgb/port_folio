import type { SkillCategory } from "../types";

export const skillCategories: SkillCategory[] = [
  {
    id: "backend",
    title: "Backend",
    items: [
      "Python",
      "FastAPI",
      "Pydantic",
      "AsyncIO",
      "REST APIs",
      "WebSockets",
      "Socket.IO",
    ],
  },
  {
    id: "databases",
    title: "Databases",
    items: ["MongoDB", "Redis", "NoSQL"],
  },
  {
    id: "security",
    title: "Security",
    items: ["JWT", "RBAC", "API Security"],
  },
  {
    id: "cloud",
    title: "Cloud & Infrastructure",
    items: [
      "Azure VM",
      "AWS EC2",
      "Ubuntu",
      "Nginx",
      "systemd",
      "Load Balancing",
    ],
  },
  {
    id: "data-ml",
    title: "Data / ML",
    items: ["PyTorch", "NumPy", "Pandas"],
  },
  {
    id: "tools",
    title: "Tools",
    items: ["Git", "GitHub", "Postman", "Slack API", "JavaScript", "TypeScript", "React"],
  },
];
