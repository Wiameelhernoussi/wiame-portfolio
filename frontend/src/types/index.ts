export interface KeyFigure {
  label: string;
  value: string;
  sub?: string;
}

export interface LanguageItem {
  language: string;
  level: string;
}

export interface Profile {
  id: number;
  full_name: string;
  title: string;
  pitch: string;
  availability_badge: string;
  about_bio: string;
  location: string;
  email: string;
  phone: string;
  github_url: string;
  linkedin_url: string;
  cv_url: string;
  avatar_url: string;
  key_figures: KeyFigure[];
  languages: LanguageItem[];
  interests: string[];
  social_links: Record<string, string>;
  updated_at?: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectGalleryImage {
  url: string;
  caption?: string;
  order?: number;
}

export interface ProjectLinks {
  github?: string;
  demo?: string;
  video?: string;
  pdf?: string;
}

export interface ProjectNavigation {
  prev_slug?: string | null;
  prev_title?: string | null;
  next_slug?: string | null;
  next_title?: string | null;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  category: string;
  short_description: string;
  long_description: string;
  technologies: string[];
  start_date: string;
  end_date: string;
  status: "Completed" | "Ongoing" | string;
  is_featured: boolean;
  cover_image: string;
  gallery_images: ProjectGalleryImage[];
  metrics: ProjectMetric[];
  links: ProjectLinks;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  navigation?: ProjectNavigation;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  highlights: string[];
  technologies: string[];
  order_index: number;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  order_index: number;
}

export interface Skill {
  id: number;
  name: string;
  category: "AI & Machine Learning" | "Data" | "Engineering" | "Languages & Databases" | string;
  level: number;
  order_index: number;
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  issue_date: string;
  image_url: string;
  pdf_url: string;
  verification_url: string;
  order_index: number;
  is_visible: boolean;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  sender_ip: string;
  created_at: string;
}

export interface SiteSetting {
  id: number;
  site_title: string;
  meta_description: string;
  keywords: string;
  og_image_url: string;
  accent_color: string;
  primary_color: string;
  section_visibility: Record<string, boolean>;
}

export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface DashboardSummary {
  projects_count: number;
  certificates_count: number;
  unread_messages_count: number;
  total_visits: number;
  visits_today: number;
}
