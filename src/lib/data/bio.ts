import type { Education, Experience } from './types';

export const name = 'Chris Talbot';

export const tagline = 'Computational Biology · Population Genetics · Evolutionary Ecology';

export const bio = `Hey, I'm Chris. I'm a PhD student in Computational Biology at Cornell University, advised by Philipp Messer. I'm interested in how genetic diversity is distributed through space and time, how that diversity is shaped by evolutionary processes, and how that diversity responds to global change. I aim to use evolutionary ecology to develop methods and tools for conservation and management of biodiversity under global change, guided by rigorous statistical and computational frameworks. I'm fascinated with emerging methods for evaluating complex systems, including community science, machine learning, and simulations.`;

export const status = {
  position: 'Ph.D. Student in Computational Biology',
  institution: 'Cornell University',
  lab: 'Messer Lab',
  location: 'Ithaca, New York'
};

export const contact = {
  email: 'cat267@cornell.edu',
  github: 'https://github.com/chris-a-talbot',
  linkedin: 'https://www.linkedin.com/in/chris-talbot',
  website: 'chris-a-talbot.com'
};

export const fields = [
  'Population Genetics',
  'Computational Biology',
  'Evolutionary Ecology'
];

export const interests = [
  'Population genetics',
  'Global change',
  'Stochastic modeling',
  'Conservation'
];

export const technologies = ['Python', 'R', 'C++', 'Rust', 'TypeScript', 'SLiM'];

export const education: Education[] = [
  {
    degree: 'Ph.D.',
    field: 'Computational Biology',
    institution: 'Cornell University',
    location: 'Ithaca, NY',
    year: '2025-Present',
    advisor: 'Philipp Messer',
    notes: ['Key Funding: National Science Foundation Graduate Research Fellowship Program (2025-2030)']
  },
  {
    degree: 'B.S.',
    field: 'Ecology, Evolution, and Biodiversity',
    institution: 'University of Michigan',
    location: 'Ann Arbor, MI',
    year: '2024',
    gpa: '3.74',
    honors: 'Highest Honors',
    thesis: {
      title: 'Patterns of floral color in communities of common Northeast American wildflowers',
      href: '/files/honors_thesis.pdf'
    }
  },
  {
    degree: 'A.G.S.',
    field: 'General Studies (Computer Science & Mathematics)',
    institution: 'Grand Rapids Community College',
    location: 'Grand Rapids, MI',
    year: '2020',
    gpa: '3.9'
  }
];

export const experience: Experience[] = [
  {
    role: 'Doctoral Researcher',
    lab: 'Messer Lab',
    institution: 'Cornell University',
    department: 'Computational Biology',
    period: '2025-Present'
  },
  {
    role: 'Research Programmer',
    lab: 'Bradburd Lab',
    institution: 'University of Michigan',
    department: 'Ecology & Evolutionary Biology',
    period: '2024-2025',
    project: 'Testing, documenting, and visualizing novel geographic evolutionary inference methods'
  },
  {
    role: 'Lab Technician',
    lab: 'Weber Lab',
    institution: 'University of Michigan',
    department: 'Ecology & Evolutionary Biology',
    period: '2022-2025',
    project: 'Patterns of floral color in communities of common Northeast American wildflowers'
  },
  {
    role: 'Undergraduate Researcher',
    lab: 'Márquez Lab',
    institution: 'University of Michigan',
    department: 'Ecology & Evolutionary Biology',
    period: '2021-2022',
    project: 'Optimizing CRISPR-Cas9 genetic modification in Phyllobates poison-dart frogs'
  }
];

export const profileImage = '/files/profile.jpg';
