import type { ArchitectureNode } from "../types";

export const architectureNodes: ArchitectureNode[] = [
  { id: "client", label: "CLIENT", description: "Authenticated client applications requesting vehicle data" },
  { id: "api-key", label: "API KEY AUTH", description: "API-key validation and access control at the gateway" },
  { id: "fastapi", label: "FASTAPI", description: "Async gateway handling routing, validation, and response assembly" },
  { id: "router", label: "ROUTER", description: "Routes requests to the appropriate domain service layer" },
  { id: "service", label: "SERVICE LAYER", description: "Domain-specific integration modules for upstream providers" },
  { id: "redis", label: "REDIS CACHE", description: "Token caching and hot-path response acceleration" },
  { id: "upstream", label: "EXTERNAL PROVIDERS", description: "Heterogeneous upstream vehicle verification APIs" },
  { id: "response", label: "RESPONSE", description: "Raw provider payloads before normalization" },
  { id: "normalizer", label: "NORMALIZATION", description: "Standardizes heterogeneous responses into one client contract" },
  { id: "mongodb", label: "MONGODB LOG", description: "Audit logging and request tracking for operations" },
];

export const architectureServices = [
  "LOOKUP MODULE",
  "REGISTRY MODULE",
  "INTEGRATION MODULE",
  "DATA MODULE",
];
