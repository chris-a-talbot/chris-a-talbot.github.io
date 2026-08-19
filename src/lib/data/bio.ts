import type { Education, Experience } from './types';

export const name = 'Chris Talbot';

/** Set under the portrait, one line per entry, so it doesn't overhang the photo. */
export const heroTagline = ['Studying human influence', 'on evolution'];

export const bio = `Hey, I'm Chris. I'm a PhD student in Computational Biology at Cornell University, and an NSF Graduate Research Fellow. My interests center around how living things respond to human actions—land-use change, climate change, harvesting, and so on. I aim to use evolutionary ecology to develop methods and tools for conservation and management of biodiversity under global change, guided by rigorous statistical and computational frameworks. My approaches primarily involve probabilistic modeling, simulations, community science, and spatiotemporal data. I'm also passionate about making science clear and accessible. I'm currently the graduate coordinator for the McNair Scholars at Cornell, where I mentor undergraduates on the hidden curriculum of academia.`;

export const contact = {
  /** Written for people, not scrapers. Rendered as text, never as a mailto: link. */
  email: 'cat267[at]cornell[dot]edu',
  github: 'https://github.com/chris-a-talbot',
  linkedin: 'https://www.linkedin.com/in/chris-talbot',
  website: 'chris-a-talbot.com'
};

export const education: Education[] = [
  {
    degree: 'Ph.D.',
    field: 'Computational Biology',
    institution: 'Cornell University',
    location: 'Ithaca, NY',
    year: '2025-Present',
    advisor: 'Philipp Messer',
    notes: [
      'Key Funding: National Science Foundation Graduate Research Fellowship Program (2025-2030)'
    ]
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

export const profileImage = '/images/profile.jpg';
