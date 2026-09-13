import { type ReactNode } from "react";

export interface NavItem {
  label: string;
  href: string;
}

export interface EmailConfig {
  address: string;
  enabled: boolean;
}

export interface SiteConfig {
  name: string;
  title: string;
  role: string;
  tagline: string;
  description: string;
  location: string;
  email: EmailConfig;
  phone: string;
  linkedin: string;
  available: boolean;
  noticePeriodDays?: number;
  resumePath: string;
  nav: NavItem[];
  footerNav: NavItem[];
}

export interface AboutCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  summary: string;
  highlights: string[];
  technologies: string[];
}

export interface ProjectCaseStudy {
  overview: string;
  problem: string;
  architecture: string;
  built: string[];
  challenges: string[];
  solutions: string[];
  decisions: string[];
}

export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  stack: string[];
  features: string[];
  highlight: string;
  accent: string;
  caseStudy: ProjectCaseStudy;
  showArchitecture?: boolean;
}

export interface SkillCategory {
  id: string;
  title: string;
  items: string[];
}

export interface SkillNode {
  id: string;
  label: string;
  category: string;
  description: string;
  related: string[];
  projects: string[];
}

export interface SkillCategoryGroup {
  id: string;
  title: string;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  description: string;
}

export interface ApproachStep {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface Principle {
  id: string;
  text: string;
}

export interface TerminalLine {
  command: string;
  output: string;
}

export interface MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}
