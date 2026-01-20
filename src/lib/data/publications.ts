import type { Publication } from './types';

export const publications: Publication[] = [
  // Published
  {
    year: '2025',
    authors: 'Graham, C. D. K., ..., Talbot, C. A., Yerks, A. L., & Weber, M. G.',
    title: 'Mite domatia and associated mite density in a North American Eastern Deciduous Forest in Michigan',
    venue: 'Ecology and Evolution',
    status: 'published'
  },

  // In Review
  {
    year: '2025',
    authors: 'Talbot, C. A., Bradburd, G. S.',
    title: 'ARGscape: A modular, interactive tool for manipulation of spatiotemporal ancestral recombination graphs',
    venue: 'Bioinformatics (In Review)',
    status: 'in-review',
    arxiv: 'arXiv:2510.07255 [q-bio.PE]'
  },
  {
    year: '2025',
    authors: 'Talbot, C. A., Weber, M. G.',
    title: 'Opposing seasonal dynamics in phylogenetic and flower color diversity of co-flowering wildflower assemblages',
    venue: 'Ecology (In Review)',
    status: 'in-review',
    arxiv: 'bioRxiv 2025.10.21.683724'
  },

  // In Preparation
  {
    year: '2025',
    authors: 'Talbot, C. A., Bradburd, G. S.',
    title: 'Optimizing temporal sampling strategies for spatial population genetic inference using ancestral recombination graphs',
    venue: 'Genetics (In Preparation)',
    status: 'in-prep'
  },
  {
    year: '2025',
    authors: 'Talbot, C. A., Kern, A. D.',
    title: 'slim-vscode-tools: A comprehensive language server and development environment for SLiM forward-time simulations',
    venue: 'Bioinformatics (In Preparation)',
    status: 'in-prep'
  }
];

export const publicationsByStatus = {
  published: publications.filter(p => p.status === 'published'),
  inReview: publications.filter(p => p.status === 'in-review'),
  inPrep: publications.filter(p => p.status === 'in-prep')
};
