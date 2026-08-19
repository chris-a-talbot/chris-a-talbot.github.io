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
  /** The lab's own site, linked from the lab name. */
  href?: string;
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
  /** A screenshot, shown full-bleed above the card's text. */
  image?: string;
  /** A mark, set beside the text instead. Use one or the other, not both. */
  logo?: string;
  /** Spans both columns of the portfolio grid. */
  full?: boolean;
  role: 'lead' | 'contributor';
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
