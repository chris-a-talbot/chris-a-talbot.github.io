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

export type PublicationStatus = 'published' | 'in-review' | 'in-prep';

export interface Publication {
  year: string;
  authors: string;
  title: string;
  /** Journal name only — no status text. */
  venue: string;
  status: PublicationStatus;
  /** Overrides the default wording for in-review work, e.g. "In Revision". */
  statusLabel?: string;
  /** Preprint identifier, e.g. "arXiv:2510.07255 [q-bio.PE]". */
  preprint?: string;
  href?: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  href: string;
  image: string;
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
  venue: string;
  location: string;
  type: 'invited' | 'contributed' | 'poster' | 'defense';
  href?: string;
  note?: string;
}
