export interface Profile {
  name: string;
  title: string;
  tagline: string;
  roles: string[];
  about: string;
  facts: string[];
  photo: string;
  photoAlt: string;
  resume: string;
  email: string;
  phone: string;
  location: string;
  availability: string;
  linkedin: string;
  github: string;
  twitter: string;
  instagram: string;
  seoTitle: string;
  seoDescription: string;
  footerNote: string;
}

interface Base {
  id: string;
  order?: number;
  createdAt?: string;
}

export interface Stat extends Base {
  value: string;
  label: string;
}

export interface Project extends Base {
  title: string;
  summary: string;
  details: string;
  category: string;
  image: string;
  video: string;
  demoLink: string;
  codeLink: string;
  tags: string[];
  highlights: string[];
  year: string;
  featured: boolean;
  images?: string[];
}

export interface Experience extends Base {
  role: string;
  company: string;
  location: string;
  type: string;
  start: string;
  end: string;
  current: boolean;
  summary: string;
  bullets: string[];
  logo: string;
  details?: string;
  image?: string;
  video?: string;
  images?: string[];
  website?: string;
}

export interface Education extends Base {
  school: string;
  degree: string;
  start: string;
  end: string;
  grade: string;
  details: string;
  logo: string;
}

export interface Skill extends Base {
  name: string;
  category: string;
  level: string;
}

export interface Goal extends Base {
  title: string;
  description: string;
  type: string;
}

export interface Achievement extends Base {
  title: string;
  detail: string;
  kind: string;
  year: string;
}

export interface Message extends Base {
  name: string;
  email: string;
  message: string;
  read: boolean;
}

export interface MediaItem extends Base {
  name: string;
  type: string;
  size: number;
}

export interface Portfolio {
  profile: Profile;
  stats: Stat[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  goals: Goal[];
  achievements: Achievement[];
  posts?: any[];
}
