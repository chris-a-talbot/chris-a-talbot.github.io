import type { Publication } from './types';

/**
 * Single source of truth for publications. Rendered both on the homepage
 * (PublicationList) and in the CV section (CV.svelte).
 */
export const publications: Publication[] = [
  {
    year: '2026',
    authors: 'Talbot, C. A., Bradburd, G. S.',
    title:
      'ARGscape: A modular, interactive tool for manipulation of spatiotemporal ancestral recombination graphs',
    venue: 'Bioinformatics',
    status: 'published',
    preprint: 'arXiv:2510.07255 [q-bio.PE]'
  },
  {
    year: '2026',
    authors: 'Glos, R., Soule, A. R., ..., Talbot, C. A., ..., Weber, M. G.',
    title:
      'Micromorphology and Chemistry of Mite Domatia: Mutualistic Trait Convergence and Variation across Eight Sympatric North American Species',
    venue: 'Symbiosis',
    status: 'published'
  },
  {
    year: '2025',
    authors: 'Graham, C. D. K., ..., Talbot, C. A., Yerks, A. L., Weber, M. G.',
    title:
      'Mite domatia and associated mite density in a North American Eastern Deciduous Forest in Michigan',
    venue: 'Ecology and Evolution',
    status: 'published'
  },
  {
    year: '2026',
    authors: 'Talbot, C. A., Weber, M. G.',
    title:
      'Opposing seasonal dynamics in phylogenetic and flower color diversity of co-flowering wildflower assemblages',
    venue: 'Ecosphere',
    status: 'in-review',
    statusLabel: 'In Revision',
    preprint: 'bioRxiv 2025.10.21.683724'
  },
  {
    year: '2026',
    authors: 'Talbot, C. A., Bradburd, G. S.',
    title:
      'Optimizing temporal sampling strategies for spatial population genetic inference using ancestral recombination graphs',
    venue: 'Genetics',
    status: 'in-prep'
  },
  {
    year: '2026',
    authors: 'Talbot, C. A., Kern, A. D.',
    title:
      'slim-vscode-tools: A comprehensive language server and development environment for SLiM forward-time simulations',
    venue: 'Bioinformatics',
    status: 'in-prep'
  }
];

export const publicationsByStatus = {
  published: publications.filter((p) => p.status === 'published'),
  inReview: publications.filter((p) => p.status === 'in-review'),
  inPrep: publications.filter((p) => p.status === 'in-prep')
};

/** CV-style sentence describing where a publication stands, e.g. "Published in Bioinformatics." */
export function venueLine(pub: Publication): string {
  switch (pub.status) {
    case 'published':
      return `Published in ${pub.venue}.`;
    case 'in-review':
      return `${pub.statusLabel ?? 'In Review'} at ${pub.venue}.`;
    case 'in-prep':
      return `In Preparation for ${pub.venue}.`;
  }
}
