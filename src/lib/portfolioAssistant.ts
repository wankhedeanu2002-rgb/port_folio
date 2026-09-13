import { aboutIntro, approachSteps, heroTags, principles, site } from "@/data/site";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import {
  getNodeById,
  skillCategoryGroups,
  skillNodes,
} from "@/data/skillNetwork";

export type Intent =
  | "greeting"
  | "about"
  | "role"
  | "summary"
  | "skills"
  | "python"
  | "fastapi"
  | "mongodb"
  | "redis"
  | "backend"
  | "api"
  | "security"
  | "jwt"
  | "rbac"
  | "async"
  | "websockets"
  | "experience"
  | "current_company"
  | "previous_experience"
  | "projects"
  | "challan_project"
  | "vehicle_api_project"
  | "deployment"
  | "cloud"
  | "azure"
  | "aws"
  | "linux"
  | "nginx"
  | "performance"
  | "caching"
  | "education"
  | "contact"
  | "email"
  | "linkedin"
  | "github"
  | "resume"
  | "hire"
  | "availability"
  | "notice_period"
  | "location"
  | "phone"
  | "name"
  | "tagline"
  | "principles"
  | "approach"
  | "ml"
  | "frontend"
  | "monitoring_project"
  | "help"
  | "technology_comparison"
  | "off_topic"
  | "unknown";

export interface ChatAction {
  label: string;
  href: string;
  external?: boolean;
}

export interface AssistantReply {
  content: string;
  actions?: ChatAction[];
}

export interface ContextMessage {
  role: "user" | "assistant";
  content: string;
}

const OFF_TOPIC: { pattern: RegExp; reply: string }[] = [
  {
    pattern: /\b(weather|temperature|forecast|rain today)\b/,
    reply:
      "I'm focused on Anand's professional background, projects, and technical experience. I don't have information about the weather.",
  },
  {
    pattern: /\b(salary|compensation|pay|ctc|package|how much does he earn|expected salary|lpa)\b/,
    reply: "I don't have salary information in Anand's portfolio.",
  },
  {
    pattern: /\b(age|how old|birthday|date of birth|marital|married|single|religion|caste)\b/,
    reply: "I don't have personal details like that in Anand's portfolio.",
  },
  {
    pattern: /\b(relocate|relocation|remote work|work from home|wfh|hybrid)\b/,
    reply:
      "Anand is based in Pune, Maharashtra, India. I don't have specific relocation or remote-work preferences listed on the portfolio — you can ask him directly.",
  },
];

const SKILL_ALIASES: Record<string, string> = {
  py: "python",
  mongo: "mongodb",
  socketio: "socketio",
  "socket io": "socketio",
  ec2: "aws",
  "azure vm": "azure",
  ml: "pytorch",
  "machine learning": "pytorch",
  ai: "pytorch",
  js: "javascript",
  ts: "typescript",
  postgresql: "mongodb",
  sql: "mongodb",
  docker: "nginx",
  kubernetes: "nginx",
  k8s: "nginx",
};

const INTENT_MERGE: Partial<Record<Intent, Intent>> = {
  email: "contact",
  linkedin: "contact",
  phone: "contact",
  hire: "contact",
  name: "about",
  tagline: "role",
  azure: "cloud",
  aws: "cloud",
  linux: "cloud",
  nginx: "cloud",
  deployment: "cloud",
  caching: "performance",
};

const INTENT_KEYWORDS: Record<Intent, string[]> = {
  greeting: ["hello", "hi", "hey", "hii", "heya", "howdy", "good morning", "good evening", "greetings", "what s up", "whats up", "namaste"],
  about: ["about anand", "who is anand", "tell me about anand", "background", "who are you", "introduce", "introduction", "describe anand", "about him"],
  role: ["role", "what does anand do", "what kind of developer", "job title", "what is his role", "specialize", "specialises", "specializes", "focus", "profession", "what does he do", "developer type"],
  name: ["your name", "his name", "what is anand", "full name", "who is he"],
  tagline: ["tagline", "motto", "headline"],
  summary: ["tell me everything", "full overview", "complete profile", "everything about", "overall summary", "complete picture"],
  skills: ["skills", "technologies", "tech stack", "stack", "what does he know", "what tools", "programming languages", "what can he do", "expertise", "proficient", "strong in"],
  python: ["python"],
  fastapi: ["fastapi", "fast api"],
  mongodb: ["mongodb", "mongo db", "mongo"],
  redis: ["redis"],
  backend: ["backend", "back end", "server side", "server-side"],
  api: ["rest api", "restful", "api", "apis", "endpoint"],
  security: ["security", "authentication", "auth"],
  jwt: ["jwt", "json web token", "bearer token"],
  rbac: ["rbac", "role based", "role-based", "permissions"],
  async: ["async", "asyncio", "asynchronous", "concurrent"],
  websockets: ["websocket", "websockets", "socket.io", "socket io", "real time", "real-time"],
  experience: ["experience", "work history", "career", "employment", "where does he work", "where does anand work", "professional experience", "how much experience", "years of experience", "work experience", "companies"],
  current_company: ["current role", "current job", "current company", "where he works now", "glossaryhub", "glossary hub", "present", "working now", "job now"],
  previous_experience: ["previous", "intern", "past job", "splashgain", "earlier role", "internship", "first job"],
  projects: ["projects", "portfolio projects", "built", "case study", "what has he built"],
  challan_project: ["challan", "challan flow", "traffic challan", "payment failure"],
  vehicle_api_project: [
    "vehicle intelligence",
    "vehicle api",
    "vehicle data",
    "vehicle verification",
    "monitoring platform",
    "api monitoring",
  ],
  monitoring_project: [
    "monitoring platform",
    "api monitoring",
    "monitoring dashboard",
    "api operations",
    "gateway profile",
    "usage analytics",
  ],
  deployment: ["deploy", "deployment", "production", "hosting", "infrastructure setup"],
  cloud: ["cloud", "infrastructure", "devops"],
  azure: ["azure"],
  aws: ["aws", "ec2"],
  linux: ["linux", "ubuntu"],
  nginx: ["nginx"],
  performance: ["performance", "optimize", "optimization", "latency", "fast response"],
  caching: ["cache", "caching"],
  ml: ["pytorch", "machine learning", "ml", "numpy", "pandas", "data science", "inference", "ai ml", "feature engineering"],
  frontend: ["react", "typescript", "frontend", "full stack", "fullstack", "full-stack", "dashboard ui", "javascript"],
  principles: ["principles", "philosophy", "values", "engineering values", "beliefs"],
  approach: ["approach", "methodology", "how he works", "workflow", "process", "how does he build"],
  location: ["location", "where is he", "where is anand", "where does he live", "based in", "city", "pune", "india", "where from"],
  phone: ["phone", "mobile", "number", "call", "whatsapp", "contact number"],
  help: ["help", "what can you", "what do you know", "what can i ask", "suggest", "options", "topics"],
  education: ["education", "degree", "university", "college", "school", "graduate", "studied", "qualification", "bachelor", "masters"],
  contact: ["contact", "reach", "get in touch", "email him", "call him", "how to reach", "connect with"],
  email: ["email", "mail address", "e-mail", "email address", "send email"],
  linkedin: ["linkedin", "linked in"],
  github: ["github", "git hub", "repository", "repo"],
  resume: ["resume", "cv", "curriculum"],
  hire: ["hire", "hiring", "recruit", "job offer", "available for work", "freelance"],
  availability: ["available", "open to work", "looking for", "opportunities"],
  notice_period: [
    "notice period",
    "notice preiod",
    "days notice",
    "day notice",
    "how many days",
    "how many day",
    "joining date",
    "when can he join",
    "when can you join",
    "how soon can",
    "relieving",
    "last working day",
  ],
  technology_comparison: [" vs ", " versus ", "compare", "difference between", "better than"],
  off_topic: [],
  unknown: [],
};

const GENERAL_TECH: Partial<Record<Intent, string>> = {
  redis:
    "Redis is an in-memory data store often used for caching, session storage, and fast token lookups in backend systems.",
  mongodb:
    "MongoDB is a document database suited to flexible schemas, operational data, and audit logging in API-driven applications.",
  fastapi:
    "FastAPI is a modern Python web framework for building typed, async REST APIs with automatic OpenAPI documentation.",
  python:
    "Python is widely used for backend services, automation, data processing, and ML integration in production systems.",
  jwt: "JWT (JSON Web Tokens) are commonly used for stateless authentication between clients and API services.",
  rbac: "RBAC (role-based access control) restricts features and data based on a user's assigned role.",
};

export const QUICK_QUESTIONS = [
  "What does Anand specialize in?",
  "Tell me about his backend experience",
  "What technologies does he use?",
  "What is his notice period?",
  "Where does he work currently?",
  "How can I contact Anand?",
];

export const INITIAL_ASSISTANT_MESSAGE = `Hi! I'm Anand's portfolio assistant.

I can tell you about Anand's experience, skills, projects, tech stack, notice period, location, contact details, and professional background.

What would you like to know?`;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\bpreiode\b/g, "period")
    .replace(/\bperoid\b/g, "period")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isGreeting(text: string): boolean {
  return /^(hi+|hey+|hello+|howdy|yo|sup|hii+|gm|good morning|good evening|good afternoon|greetings|namaste)\b/.test(
    text,
  );
}

function mergeIntents(intents: Intent[]): Intent[] {
  const merged: Intent[] = [];
  const seen = new Set<Intent>();

  for (const intent of intents) {
    const resolved = INTENT_MERGE[intent] ?? intent;
    if (seen.has(resolved)) continue;
    seen.add(resolved);
    merged.push(resolved);
  }

  return merged;
}

function findSkillInQuery(text: string): (typeof skillNodes)[number] | undefined {
  for (const [alias, target] of Object.entries(SKILL_ALIASES)) {
    if (includesKeyword(text, alias)) {
      const node = skillNodes.find((n) => n.id === target);
      if (node) return node;
    }
  }

  for (const node of skillNodes) {
    const id = node.id.replace(/-/g, " ");
    const label = node.label.toLowerCase();
    const terms = [node.id, id, label];

    if (terms.some((term) => (term.length <= 3 ? includesKeyword(text, term) : text.includes(term)))) {
      return node;
    }
  }
  return undefined;
}

function isSkillQuestion(text: string): boolean {
  return /\b(does|do|can|is|has|have|know|knew|use|uses|used|work with|experience with|familiar|proficient|skilled in|good at|expert in)\b/.test(
    text,
  );
}

function experienceTimeline(): string {
  return experience
    .map((e) => `• ${e.role} at ${e.company} (${e.period}) — ${e.location}`)
    .join("\n");
}

function searchPortfolio(query: string): AssistantReply | null {
  const words = query.split(" ").filter((w) => w.length > 3);
  if (words.length === 0) return null;

  const hits: string[] = [];

  for (const e of experience) {
    const blob = [e.role, e.company, e.summary, ...e.highlights, ...e.technologies].join(" ").toLowerCase();
    if (words.some((w) => blob.includes(w))) {
      hits.push(`${e.role} at ${e.company}: ${e.summary}`);
    }
  }

  for (const p of projects) {
    const blob = [p.title, p.description, p.category, ...p.stack, ...p.features, p.highlight].join(" ").toLowerCase();
    if (words.some((w) => blob.includes(w))) {
      hits.push(`${p.title}: ${p.description}`);
    }
  }

  for (const node of skillNodes) {
    const blob = `${node.label} ${node.description}`.toLowerCase();
    if (words.some((w) => blob.includes(w))) {
      hits.push(`${node.label}: ${node.description}`);
    }
  }

  const unique = [...new Set(hits)].slice(0, 4);
  if (unique.length === 0) return null;

  return {
    content: `Here's what I found in Anand's portfolio related to your question:\n\n${unique.map((h) => `• ${h}`).join("\n")}`,
    actions: [
      { label: "View Projects", href: "#projects" },
      { label: "View Experience", href: "#experience" },
    ],
  };
}

function includesKeyword(text: string, keyword: string): boolean {
  if (keyword.includes(" ")) return text.includes(keyword);
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`).test(text);
}

function scoreIntents(text: string): [Intent, number][] {
  const scores = new Map<Intent, number>();

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS) as [Intent, string[]][]) {
    if (intent === "off_topic" || intent === "unknown") continue;
    for (const keyword of keywords) {
      if (includesKeyword(text, keyword)) {
        const weight = keyword.split(" ").length > 1 ? 3 : keyword.length > 5 ? 2 : 1;
        scores.set(intent, (scores.get(intent) ?? 0) + weight);
      }
    }
  }

  if (/\b(he|him|his|anand)\b/.test(text) && text.includes("do")) {
    scores.set("role", (scores.get("role") ?? 0) + 2);
  }

  return [...scores.entries()].sort((a, b) => b[1] - a[1]);
}

function pickIntents(text: string): Intent[] {
  const ranked = scoreIntents(text);
  if (ranked.length === 0) return ["unknown"];

  const topScore = ranked[0][1];
  const threshold = Math.max(2, topScore * 0.45);
  let picked = ranked.filter(([, s]) => s >= threshold).map(([i]) => i);

  if (picked.length === 0) {
    picked = [ranked[0][0]];
  }

  if (picked.includes("greeting") && picked.length > 1 && topScore > 2) {
    return picked.filter((i) => i !== "greeting");
  }

  return picked.slice(0, 4);
}

function isFollowUp(text: string): boolean {
  return /\b(which one|which project|that project|those|that one|it uses|them|the first|the second|tell me more|more detail|more about that|go on|continue|what else|and what about)\b/.test(
    text,
  );
}

function findTechInProjects(tech: string): typeof projects {
  const t = tech.toLowerCase();
  return projects.filter(
    (p) =>
      p.stack.some((s) => s.toLowerCase().includes(t)) ||
      p.caseStudy.built.some((b) => b.toLowerCase().includes(t)) ||
      p.description.toLowerCase().includes(t),
  );
}

function formatProjectList(list: typeof projects): string {
  return list
    .map((p) => `• ${p.title} — ${p.description}`)
    .join("\n");
}

function skillsByCategory(): string {
  return skillCategoryGroups
    .map((group) => {
      const labels = skillNodes
        .filter((n) => n.category === group.id)
        .map((n) => n.label);
      if (labels.length === 0) return "";
      return `${group.title}:\n${labels.map((l) => `• ${l}`).join("\n")}`;
    })
    .filter(Boolean)
    .join("\n\n");
}

function contactBlock(): string {
  const lines = [
    site.email.enabled && site.email.address
      ? `Email: ${site.email.address}`
      : null,
    site.phone ? `Phone: ${site.phone}` : null,
    `LinkedIn: linkedin.com/in/anand-vankhede`,
    `Location: ${site.location}`,
  ].filter(Boolean);

  return lines.join("\n");
}

function contactActions(): ChatAction[] {
  const actions: ChatAction[] = [
    { label: "Contact", href: "#contact" },
    { label: "LinkedIn", href: site.linkedin, external: true },
  ];
  if (site.email.enabled && site.email.address) {
    actions.unshift({
      label: "Email",
      href: `mailto:${site.email.address}`,
      external: true,
    });
  }
  if (site.resumePath) {
    actions.push({ label: "View Resume", href: site.resumePath, external: true });
  }
  return actions;
}

function handleFollowUp(text: string, history: ContextMessage[]): AssistantReply | null {
  const lastAssistant = [...history].reverse().find((m) => m.role === "assistant");
  if (!lastAssistant) return null;

  const lastUser = [...history].reverse().find((m) => m.role === "user");
  const contextBlob = `${lastAssistant.content} ${lastUser?.content ?? ""}`.toLowerCase();

  if (/\b(tell me more|more detail|more about|go on|continue|expand)\b/.test(text)) {
    if (/project/i.test(contextBlob)) {
      return respondForIntent("projects", text, ["projects"]);
    }
    if (/experience|glossaryhub|splashgain|role at/i.test(contextBlob)) {
      return respondForIntent("experience", text, ["experience"]);
    }
    if (/stack|technolog|python|fastapi/i.test(contextBlob)) {
      return respondForIntent("skills", text, ["skills"]);
    }
    if (/contact|email|phone|linkedin/i.test(contextBlob)) {
      return respondForIntent("contact", text, ["contact"]);
    }
  }

  if (/\bredis\b/.test(text) && /project/i.test(lastAssistant.content)) {
    const matches = findTechInProjects("redis");
    if (matches.length === 0) {
      return {
        content:
          "Based on his portfolio, Redis appears most prominently in the Vehicle Intelligence API and Vehicle API Monitoring Platform projects — used for token caching and gateway profile sync.",
        actions: [{ label: "View Projects", href: "#projects" }],
      };
    }
    return {
      content: `From his discussed projects, these use Redis:\n\n${formatProjectList(matches)}`,
      actions: [{ label: "View Projects", href: "#projects" }],
    };
  }

  const techMatch = text.match(
    /\b(python|fastapi|mongodb|redis|react|typescript|pytorch|jwt|nginx|azure|aws)\b/,
  );
  if (techMatch) {
    const tech = techMatch[1];
    if (/project/i.test(lastAssistant.content) || /\b(which|what about)\b/.test(text)) {
      const matches = findTechInProjects(tech);
      if (matches.length > 0) {
        return {
          content: `These portfolio projects relate to ${tech}:\n\n${formatProjectList(matches)}`,
          actions: [{ label: "View Projects", href: "#projects" }],
        };
      }
    }
    const node = findSkillInQuery(tech);
    if (node) return portfolioTechAnswer(node.id, node.label, text);
  }

  if (/\b(contact|email|phone|reach him)\b/.test(text)) {
    return respondForIntent("contact", text, ["contact"]);
  }

  return null;
}

function respondForIntent(intent: Intent, text: string, _allIntents: Intent[]): AssistantReply {
  const current = experience[0];
  const previous = experience[1];

  switch (intent) {
    case "greeting":
      return {
        content: `Hello! I'm Anand's portfolio assistant.

Ask me about his backend experience, skills, projects, technologies, notice period (${site.noticePeriodDays ?? 15} days), or how to contact him.`,
        actions: contactActions().slice(0, 3),
      };

    case "about":
    case "role":
    case "name":
      return {
        content: `${site.name} is a ${site.role} based in ${site.location}.\n\n${site.tagline}\n\n${site.description}\n\n${aboutIntro}`,
        actions: [
          { label: "View Projects", href: "#projects" },
          { label: "Contact Anand", href: "#contact" },
        ],
      };

    case "tagline":
      return {
        content: `Anand's tagline on this portfolio:\n\n"${site.tagline}"`,
        actions: [{ label: "View About", href: "#about" }],
      };

    case "location":
      return {
        content: `Anand is based in ${site.location}.\n\nHis current role at GlossaryHub is also in Pune, India.`,
        actions: [{ label: "Contact", href: "#contact" }],
      };

    case "phone":
      return site.phone
        ? {
            content: `Anand's phone number listed on the portfolio: ${site.phone}`,
            actions: [
              { label: "Contact", href: "#contact" },
              { label: "Email", href: `mailto:${site.email.address}`, external: true },
            ],
          }
        : { content: "I don't have a phone number in Anand's portfolio yet." };

    case "principles":
      return {
        content: `Anand's engineering principles from the portfolio:\n\n${principles.map((p) => `• ${p.text}`).join("\n")}`,
        actions: [{ label: "View About", href: "#about" }],
      };

    case "approach":
      return {
        content: `How Anand approaches backend work:\n\n${approachSteps.map((s) => `${s.number}. ${s.title}\n${s.description}`).join("\n\n")}`,
        actions: [{ label: "View About", href: "#about" }],
      };

    case "ml":
      return {
        content: `Data / ML experience in Anand's portfolio:

Current role (GlossaryHub):
• Built PyTorch inference pipelines for production ML workloads

Previous role (Splashgain intern):
• Worked with NumPy and Pandas for feature engineering and data processing
• Supported AI/ML workflows and API integration

Related stack items: ${["PyTorch", "NumPy", "Pandas", "Python"].join(", ")}`,
        actions: [{ label: "View Experience", href: "#experience" }],
      };

    case "frontend":
      return {
        content: `Anand's portfolio shows full-stack delivery alongside backend work:

• Challan Flow — React 19 + TypeScript dashboard with FastAPI backend
• Vehicle API Monitoring Platform — React analytics dashboard with FastAPI, MongoDB, and Redis

His primary focus is backend engineering, but he has built production operational UIs in React and TypeScript.`,
        actions: [{ label: "View Projects", href: "#projects" }],
      };

    case "monitoring_project": {
      const monitor = projects.find((x) => x.id === "vehicle-api-monitoring")!;
      return {
        content: `${monitor.title} — ${monitor.category}

${monitor.caseStudy.overview}

Key features:
${monitor.features.map((f) => `• ${f}`).join("\n")}

Highlight: ${monitor.highlight}`,
        actions: [{ label: "View Projects", href: "#projects" }],
      };
    }

    case "help":
      return {
        content: `You can ask me about Anand's:

• Background and role (${site.role})
• Work experience at GlossaryHub and Splashgain
• Projects — Challan Flow, Vehicle Intelligence API, API Monitoring Platform
• Tech stack — Python, FastAPI, MongoDB, Redis, Azure, AWS, and more
• Notice period (${site.noticePeriodDays ?? 15} days) and availability
• Location, contact, email, phone, LinkedIn, and resume

Try a quick question below or type your own.`,
        actions: contactActions().slice(0, 3),
      };

    case "summary":
      return {
        content: `Overview of ${site.name} — ${site.role} (${site.location})

Professional focus
${site.description}

Current role
${current?.role} at ${current?.company} (${current?.period})

Previous role
${previous?.role} at ${previous?.company} (${previous?.period})

Core technologies
${heroTags.join(", ")}

Projects
${projects.map((p) => `• ${p.title}`).join("\n")}

Contact
${contactBlock()}

Want me to go deeper into his projects, experience, or technical stack?`,
        actions: [
          { label: "View Experience", href: "#experience" },
          { label: "View Stack", href: "#stack" },
        ],
      };

    case "skills":
      return {
        content: `Anand primarily works with Python backend technologies. Here is his stack from the portfolio:\n\n${skillsByCategory()}`,
        actions: [{ label: "View Stack", href: "#stack" }],
      };

    case "python":
      return portfolioTechAnswer("python", "Python", text);
    case "fastapi":
      return portfolioTechAnswer("fastapi", "FastAPI", text);
    case "mongodb":
      return portfolioTechAnswer("mongodb", "MongoDB", text);
    case "redis":
      return portfolioTechAnswer("redis", "Redis", text);
    case "jwt":
      return portfolioTechAnswer("jwt", "JWT", text);
    case "rbac":
      return portfolioTechAnswer("rbac", "RBAC", text);
    case "async":
      return portfolioTechAnswer("asyncio", "AsyncIO", text);
    case "websockets":
      return {
        content: `Anand has worked with WebSockets and Socket.IO for real-time and event-driven systems.\n\nAt GlossaryHub, he implemented Slack monitoring and event-driven systems with Socket.IO and WebSockets alongside FastAPI services.`,
        actions: [{ label: "View Experience", href: "#experience" }],
      };

    case "backend":
    case "api":
      return {
        content: `Anand focuses on backend engineering — REST APIs with FastAPI, authentication (JWT, RBAC), MongoDB data modeling, Redis caching, async workloads, and production deployment on Azure/AWS.\n\n${aboutIntro}`,
        actions: [
          { label: "View Stack", href: "#stack" },
          { label: "View Projects", href: "#projects" },
        ],
      };

    case "security":
      return {
        content: `Security-related work in Anand's portfolio includes JWT authentication, RBAC, API-key access, and secure-by-default API design across projects like Challan Flow and Vehicle Intelligence API.`,
        actions: [{ label: "View Stack", href: "#stack" }],
      };

    case "experience":
      if (/\b(how much|how many|years|duration|total)\b/.test(text)) {
        return {
          content: `Based on Anand's portfolio, his listed professional timeline is:

${experienceTimeline()}

For role-specific details, ask about his current GlossaryHub role or previous Splashgain internship.`,
          actions: [{ label: "View Experience", href: "#experience" }],
        };
      }
      return {
        content: experience
          .map(
            (e) =>
              `• ${e.role} at ${e.company}
${e.location} · ${e.period}
${e.summary}

Key work:
${e.highlights.map((h) => `• ${h}`).join("\n")}`,
          )
          .join("\n\n"),
        actions: [{ label: "View Experience", href: "#experience" }],
      };

    case "current_company":
      return current
        ? {
            content: `Anand's current role is ${current.role} at ${current.company} (${current.period}), based in ${current.location}.

${current.summary}

${current.highlights.map((h) => `• ${h}`).join("\n")}`,
            actions: [{ label: "View Experience", href: "#experience" }],
          }
        : { content: "I don't have current employment details in the portfolio yet." };

    case "previous_experience":
      return previous
        ? {
            content: `Anand's previous role was ${previous.role} at ${previous.company} (${previous.period}).

${previous.summary}

${previous.highlights.map((h) => `• ${h}`).join("\n")}`,
            actions: [{ label: "View Experience", href: "#experience" }],
          }
        : { content: "I don't have previous experience details in the portfolio yet." };

    case "projects":
      return {
        content: `Anand has built production systems including:

${projects.map((p) => `${p.title} (${p.category})
${p.description}
Stack: ${p.stack.join(", ")}`).join("\n\n")}`,
        actions: [{ label: "View Projects", href: "#projects" }],
      };

    case "challan_project": {
      const p = projects.find((x) => x.id === "challan-flow")!;
      return {
        content: `${p.title} — ${p.category}

${p.caseStudy.overview}

Problem: ${p.caseStudy.problem}

Highlight: ${p.highlight}

Stack: ${p.stack.join(", ")}`,
        actions: [{ label: "View Projects", href: "#projects" }],
      };
    }

    case "vehicle_api_project": {
      const intel = projects.find((x) => x.id === "vehicle-intelligence-api")!;
      const monitor = projects.find((x) => x.id === "vehicle-api-monitoring")!;
      if (text.includes("monitor")) {
        return {
          content: `${monitor.title} — ${monitor.category}

${monitor.caseStudy.overview}

${monitor.highlight}`,
          actions: [{ label: "View Projects", href: "#projects" }],
        };
      }
      return {
        content: `${intel.title} — ${intel.category}

${intel.caseStudy.overview}

${intel.highlight}

He also built the ${monitor.title} for API operations and monitoring.`,
        actions: [{ label: "View Projects", href: "#projects" }],
      };
    }

    case "deployment":
    case "cloud":
    case "azure":
    case "aws":
    case "linux":
    case "nginx":
      return {
        content: `Anand's portfolio includes cloud and infrastructure experience:\n\n• Azure VM and AWS EC2 deployment\n• Ubuntu Linux servers\n• Nginx reverse proxy configuration\n• systemd for service management\n\nThis appears in his GlossaryHub role and operational project work.`,
        actions: [{ label: "View Experience", href: "#experience" }],
      };

    case "performance":
    case "caching":
      return {
        content: `Performance work in Anand's portfolio includes Redis caching, MongoDB query tuning, payload optimization, and lazy-loading strategies — notably solving multi-MB MongoDB payload issues in Challan Flow by separating screenshot metadata from image delivery.`,
        actions: [{ label: "View Projects", href: "#projects" }],
      };

    case "education":
      return {
        content: "I don't have education details in Anand's portfolio yet.",
      };

    case "contact":
    case "email":
    case "linkedin":
    case "hire":
      return {
        content: `You can reach Anand through:

${contactBlock()}${site.noticePeriodDays ? `\nNotice period: ${site.noticePeriodDays} days` : ""}${site.available ? "\n\nHe is marked as available for opportunities on this portfolio." : ""}`,
        actions: contactActions(),
      };

    case "github":
      return {
        content:
          "Anand's portfolio lists GitHub as a tool in his stack, but no public GitHub profile URL is included in the site data yet.",
        actions: [{ label: "View Stack", href: "#stack" }],
      };

    case "resume":
      return site.resumePath
        ? {
            content: "You can view or download Anand's resume using the link below.",
            actions: [{ label: "View Resume", href: site.resumePath, external: true }],
          }
        : { content: "A resume file is not currently linked on this portfolio." };

    case "availability":
      return site.available
        ? {
            content: `Yes — Anand's portfolio indicates he is available for opportunities as a ${site.role} in ${site.location}.${site.noticePeriodDays ? `\n\nHis notice period is ${site.noticePeriodDays} days.` : ""}`,
            actions: contactActions(),
          }
        : {
            content: "Availability status is not explicitly listed on the portfolio right now.",
            actions: contactActions(),
          };

    case "notice_period":
      return site.noticePeriodDays
        ? {
            content: `Anand's notice period is ${site.noticePeriodDays} days.

For hiring or interview coordination, you can reach him using the contact options below.`,
            actions: contactActions(),
          }
        : {
            content: "I don't have notice period information in Anand's portfolio yet.",
            actions: contactActions(),
          };

    case "technology_comparison":
      return {
        content:
          "I can share how technologies appear in Anand's portfolio, but I don't have enough context for a detailed comparison from this question alone. Try asking about a specific tool — for example FastAPI, MongoDB, or Redis.",
        actions: [{ label: "View Stack", href: "#stack" }],
      };

    default:
      return { content: "I don't have that information in Anand's portfolio yet." };
  }
}

function portfolioTechAnswer(nodeId: string, label: string, text: string): AssistantReply {
  const node = getNodeById(nodeId);

  const general =
    GENERAL_TECH[nodeId as keyof typeof GENERAL_TECH] ??
    GENERAL_TECH[label.toLowerCase() as keyof typeof GENERAL_TECH];

  if (!node) {
    return general
      ? { content: general }
      : { content: `I don't have specific ${label} details in the portfolio yet.` };
  }

  const relatedProjects = node.projects
    .map((id) => projects.find((p) => p.id === id)?.title)
    .filter(Boolean);

  let content = `${label} in Anand's portfolio: ${node.description}`;

  if (relatedProjects.length > 0) {
    content += `\n\nRelated projects: ${relatedProjects.join(", ")}.`;
  }

  const expMentions = experience.flatMap((e) =>
    e.technologies.some((t) => t.toLowerCase().includes(label.toLowerCase())) ||
    e.highlights.some((h) => h.toLowerCase().includes(label.toLowerCase()))
      ? [`${e.role} at ${e.company}`]
      : [],
  );

  if (expMentions.length > 0) {
    content += `\n\nExperience: ${[...new Set(expMentions)].join("; ")}.`;
  }

  if (general && /\b(what is|what's|explain|why|how does)\b/.test(text)) {
    content += `\n\nIn general: ${general}`;
  }

  return {
    content,
    actions: [{ label: "View Stack", href: "#stack" }],
  };
}

function combineReplies(replies: AssistantReply[]): AssistantReply {
  if (replies.length === 0) {
    return {
      content:
        "I'm focused on Anand's professional background, projects, and technical experience. Try asking about his skills, experience, projects, or how to contact him.",
      actions: [
        { label: "View Projects", href: "#projects" },
        { label: "Contact", href: "#contact" },
      ],
    };
  }
  if (replies.length === 1) return replies[0];
  const content = replies.map((r) => r.content).join("\n\n---\n\n");
  const actions = replies.flatMap((r) => r.actions ?? []);
  const uniqueActions = actions.filter(
    (a, i, arr) => arr.findIndex((b) => b.href === a.href) === i,
  );
  return { content, actions: uniqueActions.slice(0, 4) };
}

export function getAssistantReply(
  userMessage: string,
  history: ContextMessage[] = [],
): AssistantReply {
  const text = normalize(userMessage);
  if (!text) {
    return { content: "Please type a question about Anand's experience, skills, or projects." };
  }

  for (const item of OFF_TOPIC) {
    if (item.pattern.test(text)) {
      return { content: item.reply };
    }
  }

  if (isFollowUp(text)) {
    const followUp = handleFollowUp(text, history);
    if (followUp) return followUp;
  }

  if (isGreeting(text)) {
    return respondForIntent("greeting", text, ["greeting"]);
  }

  if (/^(thanks|thank you|ty|thx)\b/.test(text)) {
    return {
      content:
        "You're welcome! Ask anytime about Anand's backend work, projects, notice period, or contact details.",
    };
  }

  if (/^(bye|goodbye|see you|cya)\b/.test(text)) {
    return {
      content: "Goodbye! Feel free to come back if you have more questions about Anand's work.",
    };
  }

  if (/\b(okay|ok|cool|nice|great|awesome|got it|understood|perfect)\b/.test(text) && text.split(" ").length <= 3) {
    return {
      content: "Glad that helped! Ask if you'd like to know more about Anand's experience, projects, stack, or contact details.",
    };
  }

  const skillNode = findSkillInQuery(text);
  if (skillNode && (isSkillQuestion(text) || text.split(" ").length <= 4)) {
    return portfolioTechAnswer(skillNode.id, skillNode.label, text);
  }

  let intents = mergeIntents(pickIntents(text));

  if (intents.length === 1 && intents[0] === "unknown") {
    if (/^(thanks|thank you|ty)\b/.test(text)) {
      return {
        content: "You're welcome! Ask anytime about Anand's backend work, projects, or contact details.",
      };
    }

    const searched = searchPortfolio(text);
    if (searched) return searched;

    return {
      content:
        "I'm focused on Anand's professional background, projects, and technical experience. Try asking about his skills, experience, projects, or how to contact him.",
      actions: [
        { label: "View Projects", href: "#projects" },
        { label: "Contact", href: "#contact" },
      ],
    };
  }

  const replies = intents.map((intent) => respondForIntent(intent, text, intents));
  return combineReplies(replies);
}

export const CHATBOT_OPEN_KEY = "portfolio-chatbot-open";
