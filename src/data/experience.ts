import type { ExperienceItem } from "../types";

export const experience: ExperienceItem[] = [
  {
    id: "glossaryhub",
    role: "Software Developer",
    company: "GlossaryHub",
    location: "Pune, India",
    period: "Sep 2025 – Present",
    summary:
      "Building production FastAPI services, real-time monitoring systems, and cloud-deployed backend infrastructure.",
    highlights: [
      "Developed FastAPI REST APIs with JWT authentication and RBAC",
      "Optimized API performance with Redis caching and MongoDB query tuning",
      "Built PyTorch inference pipelines for production ML workloads",
      "Deployed services on Azure VM and AWS EC2 with Ubuntu, Nginx, and systemd",
      "Implemented Slack monitoring and event-driven systems with Socket.IO and WebSockets",
    ],
    technologies: [
      "FastAPI",
      "Python",
      "MongoDB",
      "Redis",
      "JWT",
      "RBAC",
      "PyTorch",
      "Azure VM",
      "AWS EC2",
      "Ubuntu",
      "Nginx",
      "systemd",
      "Socket.IO",
      "WebSockets",
    ],
  },
  {
    id: "splashgain",
    role: "Project Coordinator Intern",
    company: "Splashgain Technology Solutions Pvt. Ltd.",
    location: "Pune, India",
    period: "Dec 2024 – Aug 2025",
    summary:
      "Supported Python automation, data processing pipelines, and API integration for production systems.",
    highlights: [
      "Built Python automation for data extraction, validation, and transformation",
      "Worked with NumPy and Pandas for feature engineering and data processing",
      "Supported AI/ML workflows and API integration across systems",
      "Performed debugging and performance testing on production pipelines",
    ],
    technologies: [
      "Python",
      "NumPy",
      "Pandas",
      "API Integration",
      "Data Processing",
      "Performance Testing",
    ],
  },
];
