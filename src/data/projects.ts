import type { Project } from "../types";

export const projects: Project[] = [
  {
    id: "challan-flow",
    number: "01",
    title: "Challan Flow",
    category: "Traffic Challan Operations CMS",
    description:
      "Full-stack operations platform for monitoring, processing, and recovering failed traffic challan payments.",
    stack: ["React 19", "TypeScript", "FastAPI", "MongoDB"],
    features: [
      "Real-time challan monitoring with search, filtering, and pagination",
      "Dashboard analytics and payment retry workflows",
      "Receipt download and failure screenshot diagnostics",
      "Deleted logs with restore capability",
      "JWT authentication, RBAC, and CSV export",
      "Optimized MongoDB queries for large operational datasets",
    ],
    highlight:
      "Solved multi-MB MongoDB payload performance issues by separating screenshot detection from screenshot delivery and lazy-loading failure images.",
    accent: "from-emerald-500/20 to-cyan-500/10",
    caseStudy: {
      overview:
        "Challan Flow is an operations CMS for teams managing traffic challan payment failures at scale — combining real-time monitoring, recovery workflows, and diagnostic tooling.",
      problem:
        "Operations teams needed visibility into failed payments, the ability to retry transactions, and access to failure evidence without slow page loads caused by large MongoDB payloads.",
      architecture:
        "React 19 dashboard communicating with FastAPI services over authenticated REST APIs, backed by MongoDB for operational data with JWT + RBAC access control.",
      built: [
        "Real-time monitoring dashboard with search, filters, and pagination",
        "Payment retry and receipt download workflows",
        "Failure screenshot diagnostics with lazy-loaded image delivery",
        "Deleted logs management with restore capability",
        "CSV export and role-based access for operations teams",
      ],
      challenges: [
        "Multi-MB MongoDB documents slowed list views when failure screenshots were embedded inline",
        "Operations users needed fast search across large challan datasets",
        "Role-based access had to gate sensitive payment and diagnostic data",
      ],
      solutions: [
        "Separated screenshot detection metadata from screenshot file delivery",
        "Implemented lazy-loading for failure images on demand",
        "Optimized MongoDB queries and pagination for list endpoints",
        "Applied JWT authentication with RBAC for secure operational access",
      ],
      decisions: [
        "Kept screenshot metadata in MongoDB but deferred binary delivery to separate requests",
        "Used FastAPI for typed, async API endpoints with clear RBAC middleware",
        "Structured React views around operational workflows rather than raw data tables",
      ],
    },
  },
  {
    id: "vehicle-intelligence-api",
    number: "02",
    title: "Vehicle Intelligence API",
    category: "Vehicle Data Aggregation Gateway",
    description:
      "Production-grade vehicle data aggregation API integrating multiple vehicle verification sources behind a standardized authenticated API.",
    stack: ["Python", "FastAPI", "Redis", "MongoDB"],
    features: [
      "Multi-domain vehicle lookups, challan workflows, and identifier mapping",
      "API-key authentication with Redis token caching",
      "MongoDB audit logging and XML/JSON transformation",
      "Standardized responses with token refresh and API performance tracking",
    ],
    highlight:
      "Built a response normalization layer that converts heterogeneous upstream API responses into a consistent client-facing contract.",
    accent: "from-blue-500/20 to-indigo-500/10",
    showArchitecture: true,
    caseStudy: {
      overview:
        "Vehicle Intelligence API aggregates Indian vehicle verification data from multiple upstream providers into one authenticated, standardized gateway.",
      problem:
        "Clients needed a single API contract across multiple vehicle data domains — but upstream providers returned inconsistent formats and authentication models.",
      architecture:
        "FastAPI gateway with API-key auth, Redis token cache, service-layer routing to upstream providers, response normalization, and MongoDB audit logging.",
      built: [
        "Unified API surface across multiple vehicle data domains",
        "API-key authentication with Redis-backed token caching",
        "Service layer routing to heterogeneous upstream providers",
        "Response normalization into a consistent client contract",
        "MongoDB audit logging and performance tracking",
      ],
      challenges: [
        "Upstream APIs returned mixed XML and JSON with different field naming",
        "Token management across providers required caching and refresh logic",
        "Audit requirements needed persistent logging without slowing responses",
      ],
      solutions: [
        "Built a normalization layer mapping provider responses to a standard schema",
        "Cached tokens in Redis with refresh handling per provider",
        "Logged requests asynchronously to MongoDB for audit trails",
        "Tracked API performance metrics for operational visibility",
      ],
      decisions: [
        "Separated provider integration into dedicated service modules per domain",
        "Used Redis for hot-path token caching to reduce upstream auth latency",
        "Standardized all client responses regardless of upstream format",
      ],
    },
  },
  {
    id: "vehicle-api-monitoring",
    number: "03",
    title: "Vehicle API Monitoring Platform",
    category: "API Operations & Monitoring Dashboard",
    description:
      "Full-stack platform for monitoring vehicle-data APIs, managing clients and API access, syncing live gateway profiles, and visualizing API usage.",
    stack: ["React", "TypeScript", "FastAPI", "MongoDB", "Redis"],
    features: [
      "API monitoring with client and access management",
      "Analytics and billing-related configuration",
      "Redis gateway profile sync and dual MongoDB architecture",
      "Client-side caching, role-based access, and exportable reports",
    ],
    highlight:
      "Designed a monitoring architecture connecting application MongoDB, a read-only response database, Redis gateway profiles, and a React analytics dashboard.",
    accent: "from-violet-500/20 to-purple-500/10",
    caseStudy: {
      overview:
        "A full-stack operations platform giving teams visibility into vehicle-data API usage, client access, and gateway configuration across production systems.",
      problem:
        "Operations teams needed centralized monitoring of API usage, client management, and live gateway profile synchronization across multiple data stores.",
      architecture:
        "React analytics dashboard backed by FastAPI, with application MongoDB, read-only response database, and Redis for gateway profile sync.",
      built: [
        "API monitoring dashboard with usage analytics",
        "Client management and API access control",
        "Redis-synchronized gateway profiles for live configuration",
        "Dual MongoDB architecture separating app state from response data",
        "Exportable reports with role-based access",
      ],
      challenges: [
        "Gateway profiles needed live sync without stale configuration in production",
        "Analytics queries had to run against large response datasets efficiently",
        "Multiple user roles required granular access to monitoring and billing config",
      ],
      solutions: [
        "Synced gateway profiles through Redis for low-latency configuration reads",
        "Separated application MongoDB from read-only response database",
        "Implemented client-side caching for dashboard performance",
        "Applied RBAC across monitoring, client, and billing configuration views",
      ],
      decisions: [
        "Used dual MongoDB stores to isolate write-heavy app data from read-heavy analytics",
        "Redis became the source of truth for live gateway profile propagation",
        "Structured React views around operational personas — monitoring, clients, billing",
      ],
    },
  },
];
