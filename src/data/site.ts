import type { SiteConfig } from "../types";

export const site: SiteConfig = {
  name: "Anand Vankhede",
  title: "Anand Vankhede — Python Backend Developer",
  role: "Python / Backend Developer",
  tagline: "Building APIs, systems & products that work behind the scenes.",
  description:
    "Backend-focused developer building scalable APIs, real-time systems, data platforms, and production infrastructure with Python and modern cloud technologies.",
  location: "Pune, Maharashtra, India",
  email: {
    address: "anand.r.vankhede@gmail.com",
    enabled: true,
  },
  phone: "+91 7489634084",
  linkedin: "https://www.linkedin.com/in/anand-vankhede",
  available: true,
  noticePeriodDays: 15,
  resumePath: "/Anand_Vankhede_Resume.pdf",
  nav: [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Stack", href: "#stack" },
    { label: "Contact", href: "#contact" },
  ],
  footerNav: [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Stack", href: "#stack" },
    { label: "Contact", href: "#contact" },
  ],
};

export const heroTags = ["Python", "FastAPI", "MongoDB", "Redis", "AWS", "Azure"];

export const aboutIntro =
  "I design and ship backend systems that stay reliable under real production load — from authenticated REST APIs and data pipelines to real-time monitoring and cloud deployment on Azure and AWS.";

export const aboutCards = [
  {
    id: "api",
    title: "API ENGINEERING",
    description: "REST APIs with FastAPI, JWT auth, RBAC, and predictable contracts.",
    icon: "api",
  },
  {
    id: "databases",
    title: "DATABASES",
    description: "MongoDB modeling, Redis caching, and query optimization for production workloads.",
    icon: "database",
  },
  {
    id: "cloud",
    title: "CLOUD",
    description: "Azure VM and AWS EC2 deployment with Nginx, systemd, and load-aware configuration.",
    icon: "cloud",
  },
  {
    id: "realtime",
    title: "REAL-TIME",
    description: "WebSockets, Socket.IO, and event-driven systems for live operational visibility.",
    icon: "realtime",
  },
  {
    id: "security",
    title: "SECURITY",
    description: "JWT authentication, RBAC, API-key access, and secure-by-default API design.",
    icon: "security",
  },
  {
    id: "performance",
    title: "PERFORMANCE",
    description: "Caching strategies, payload optimization, and response-time tuning in production.",
    icon: "performance",
  },
];

export const principles = [
  { id: "simple", text: "Simple APIs." },
  { id: "predictable", text: "Predictable systems." },
  { id: "fast", text: "Fast responses." },
  { id: "secure", text: "Secure by default." },
  { id: "observable", text: "Observable in production." },
];

export const approachSteps = [
  {
    id: "understand",
    number: "01",
    title: "Understand the problem",
    description:
      "Map business requirements to system boundaries, data flows, and failure modes before writing code.",
  },
  {
    id: "design",
    number: "02",
    title: "Design the API",
    description:
      "Define clear endpoints, authentication, versioning, and response contracts that clients can rely on.",
  },
  {
    id: "model",
    number: "03",
    title: "Model the data",
    description:
      "Structure MongoDB collections and Redis keys for read/write patterns, audit trails, and scalability.",
  },
  {
    id: "optimize",
    number: "04",
    title: "Optimize the system",
    description:
      "Apply caching, query tuning, async processing, and payload separation to keep responses fast.",
  },
  {
    id: "deploy",
    number: "05",
    title: "Deploy & observe",
    description:
      "Ship on Azure/AWS with Nginx and systemd, then monitor, log, and iterate from production signals.",
  },
];

export const terminalLines = [
  { command: "whoami", output: "anand-vankhede" },
  { command: "role", output: "Python / Backend Developer" },
  { command: "stack", output: "Python\nFastAPI\nMongoDB\nRedis" },
  { command: "infrastructure", output: "Azure VM\nAWS EC2\nUbuntu\nNginx\nsystemd" },
  { command: "focus", output: "APIs\nPerformance\nSecurity\nReal-Time Systems" },
  { command: "status", output: "ONLINE" },
];
