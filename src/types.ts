export type PlanTier = 'free' | 'medium' | 'premium';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: PlanTier;
  aiGenerationsUsed: number;
  createdAt: string;
  razorpayPayments?: Array<{
    orderId: string;
    paymentId: string;
    amount: number;
    plan: string;
    date: string;
  }>;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade?: string;
  description?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  techStack: string[];
  link?: string;
  github?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  date?: string;
}

export interface ResumeData {
  id: string;
  title: string;
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    summary: string;
  };
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  templateId: 'modern-tech' | 'minimal-executive' | 'creative-pro' | 'ats-standard' | 'vibrant-duo';
  accentColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  spacing: 'compact' | 'normal' | 'spacious';
  updatedAt?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  repoUrl?: string;
  image?: string;
  featured: boolean;
}

export interface PortfolioData {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  bio: string;
  avatarUrl?: string;
  theme: 'modern-minimal' | 'executive-slate' | 'cyber-glass' | 'creative-sunset';
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    email?: string;
  };
  skills: string[];
  projects: PortfolioProject[];
  experience: Array<{
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
  }>;
  contactEmail: string;
  statusText?: string;
  updatedAt?: string;
}
