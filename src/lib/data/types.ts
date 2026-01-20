export interface Education {
  degree: string;
  field: string;
  institution: string;
  location: string;
  year: string;
  gpa?: string;
  honors?: string;
  advisor?: string;
  thesis?: {
    title: string;
    href: string;
  };
  notes?: string[];
}

export interface Experience {
  role: string;
  lab: string;
  institution: string;
  department: string;
  period: string;
  project?: string;
}

export interface Publication {
  year: string;
  authors: string;
  title: string;
  venue: string;
  status: 'published' | 'in-review' | 'in-prep';
  href?: string;
  arxiv?: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  href: string;
  image: string;
  featured: boolean;
  role: 'lead' | 'contributor';
  technologies?: string[];
}

export interface Funding {
  title: string;
  source: string;
  year: string;
  amount?: string;
  status?: 'awarded' | 'offered' | 'declined';
}

export interface Talk {
  year: string;
  title: string;
  venue: string;
  location: string;
  type: 'invited' | 'contributed' | 'poster' | 'defense';
  href?: string;
  note?: string;
}

export interface CVSection {
  title: string;
  items: Array<Record<string, unknown>>;
}
