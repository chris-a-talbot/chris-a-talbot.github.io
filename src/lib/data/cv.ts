import type { Funding, Talk } from './types';

export const summaryPoints = [
  'First-gen academic and biologist with years of experience in lab, field, and computational work.',
  'Interested in patterns and drivers of ecological organization across spatiotemporal scales under global change.',
  'Exploring emerging methods for complex systems, including community science and machine learning.'
];

export const cvPdfLink = '/files/CV.pdf';

export const contactInfo = {
  location: 'Ithaca, New York',
  website: 'chris-a-talbot.com',
  email: 'christopher.a.talbot@gmail.com',
  phone: '(269) 751-9444',
  fields: 'Population Genetics, Computational Biology, Evolutionary Ecology',
  interests: 'Population genetics, global change, stochastic modeling, conservation',
  techs: 'Python, R, C++, Rust, TypeScript, SLiM'
};

export const totalFunding = '$174,280';

export const education = [
  {
    degree: 'Ph.D. Computational Biology',
    institution: 'Cornell University',
    period: '2025-Present',
    details: [
      'Advisor: Dr. Philipp Messer',
      'Key Funding: National Science Foundation Graduate Research Fellowship Program (2025-2030)'
    ]
  },
  {
    degree: 'B.S. Ecology, Evolution, and Biodiversity',
    institution: 'University of Michigan (UMich)',
    period: '2024',
    gpa: '3.74',
    details: [
      'Graduated with Highest Honors under the supervision of Dr. Marjorie Weber',
      'Honors Thesis: Patterns of floral color in communities of common Northeast American wildflowers',
      'Coursework: Statistics & probability, programming & data structures, genetics, macroevolution, ethnobotany'
    ]
  },
  {
    degree: 'Associates of General Studies',
    institution: 'Grand Rapids Community College (GRCC)',
    period: '2020',
    gpa: '3.9',
    details: [
      'Computer Science & Mathematics Concentration',
      'Coursework: C++ programming, database development, web application programming, information security'
    ]
  }
];

export const research = [
  {
    title: 'Doctoral Researcher',
    lab: 'Messer Lab',
    institution: 'Cornell University - Computational Biology',
    period: '2025-Present'
  },
  {
    title: 'Research Programmer',
    lab: 'Bradburd Lab',
    institution: 'UMich - Ecology & Evolutionary Biology (EEB)',
    period: '2024-2025',
    description: 'Testing, documenting, and visualizing novel geographic evolutionary inference methods'
  },
  {
    title: 'Lab Technician',
    lab: 'Weber Lab',
    institution: 'UMich - EEB',
    period: '2022-2025',
    description: 'Patterns of floral color in communities of common Northeast American wildflowers'
  },
  {
    title: 'Undergraduate Researcher',
    lab: 'Márquez Lab',
    institution: 'UMich - EEB',
    period: '2021-2022',
    description: 'Optimizing CRISPR-Cas9 genetic modification in Phyllobates poison-dart frogs'
  }
];

export const publications = {
  published: [
    {
      year: '2025',
      authors: 'Graham, C. D. K., ..., Talbot, C. A., Yerks, A. L., & Weber, M. G.',
      title: 'Mite domatia and associated mite density in a North American Eastern Deciduous Forest in Michigan.',
      journal: 'Ecology and Evolution',
      status: 'Published'
    }
  ],
  inReview: [
    {
      year: '2025',
      authors: 'Talbot, C. A., Bradburd, G.S.',
      title: 'ARGscape: A modular, interactive tool for manipulation of spatiotemporal ancestral recombination graphs.',
      journal: 'Bioinformatics',
      status: 'In Review',
      preprint: 'arXiv:2510.07255 [q-bio.PE]'
    },
    {
      year: '2025',
      authors: 'Talbot, C. A., Weber, M. G.',
      title: 'Opposing seasonal dynamics in phylogenetic and flower color diversity of co-flowering wildflower assemblages.',
      journal: 'Ecology',
      status: 'In Review',
      preprint: 'bioRxiv 2025.10.21.683724'
    }
  ],
  inPrep: [
    {
      year: '2025',
      authors: 'Talbot, C. A., Bradburd, G. S.',
      title: 'Optimizing temporal sampling strategies for spatial population genetic inference using ancestral recombination graphs.',
      journal: 'Genetics',
      status: 'In Preparation'
    },
    {
      year: '2025',
      authors: 'Talbot, C. A., Kern, A. D.',
      title: 'slim-vscode-tools: A comprehensive language server and development environment for SLiM forward-time simulations.',
      journal: 'Bioinformatics',
      status: 'In Preparation'
    }
  ]
};

export const funding: Funding[] = [
  {
    title: 'Graduate Research Fellowship',
    source: 'National Science Foundation',
    year: '2025-2030',
    amount: '$159,000',
    status: 'awarded'
  },
  {
    title: "Graduate School Dean's Scholar Fellowship",
    source: 'Cornell University',
    year: '2025',
    amount: '$2,000',
    status: 'awarded'
  },
  {
    title: "Chancellor's Fellowship",
    source: 'University of California-Berkeley',
    year: 'Offered 2025',
    status: 'declined'
  },
  {
    title: 'Eugene Cota-Robles Fellowship',
    source: 'University of California-Davis',
    year: 'Offered 2025',
    status: 'declined'
  },
  {
    title: 'Eugene Cota-Robles Fellowship',
    source: 'University of California-Santa Cruz',
    year: 'Offered 2025',
    status: 'declined'
  },
  {
    title: 'Biological Station Student Fellowship',
    source: 'UMich Biological Station',
    year: '2023',
    amount: '$1,680',
    status: 'awarded'
  },
  {
    title: 'Student Research Grant',
    source: 'UMich UROP',
    year: '2022-2023',
    amount: '$5,000',
    status: 'awarded'
  },
  {
    title: 'Travel Grant',
    source: 'SACNAS',
    year: '2022',
    amount: '$2,500',
    status: 'awarded'
  },
  {
    title: 'Biomedical & Life Sciences Summer Fellowship',
    source: 'UMich UROP',
    year: '2022',
    amount: '$4,000',
    status: 'awarded'
  },
  {
    title: 'Community College Summer Institute Fellowship',
    source: 'UMich - School of Information',
    year: '2019',
    amount: '$100',
    status: 'awarded'
  }
];

export const software = [
  {
    name: 'SLiM',
    role: 'Open-Source Contributor',
    period: '2025-Present',
    description: 'Messer Lab, Cornell University',
    href: 'https://github.com/MesserLab/SLiM'
  },
  {
    name: 'ARGscape',
    role: 'Open-Source Lead',
    period: '2025-Present',
    href: 'https://argscape.com'
  },
  {
    name: 'slim-vscode-tools',
    role: 'Open-Source Lead',
    period: '2025-Present',
    description: 'VS Code extension and language server',
    href: 'https://github.com/slim-community/slim-vscode-tools'
  }
];

export const invitedTalks: Talk[] = [
  {
    year: '2025',
    title: 'tskit-dev Seminar',
    venue: 'tskit-dev Seminar',
    location: 'Virtual',
    type: 'invited'
  },
  {
    year: 'Upcoming 2025',
    title: 'ARGEvol Conference',
    venue: 'ARGEvol Conference',
    location: 'Porto, Portugal',
    type: 'invited'
  },
  {
    year: 'Upcoming 2025',
    title: 'ARGEvol Spatial ARG Workshop',
    venue: 'ARGEvol Spatial ARG Workshop',
    location: 'Porto, Portugal',
    type: 'invited',
    note: 'Workshop Contributor'
  }
];

export const contributedTalks: Talk[] = [
  {
    year: '2024',
    title: 'Third Joint Congress on Evolutionary Biology',
    venue: 'Third Joint Congress on Evolutionary Biology',
    location: 'Montreal, QC',
    type: 'contributed'
  },
  {
    year: '2024',
    title: 'Botany 2024',
    venue: 'Botany 2024',
    location: 'Grand Rapids, MI',
    type: 'contributed',
    note: 'Lightning Talk'
  },
  {
    year: '2024',
    title: 'UMich Ecology & Evolutionary Biology',
    venue: 'UMich Ecology & Evolutionary Biology',
    location: 'Ann Arbor, MI',
    type: 'defense',
    note: 'Honors Thesis Defense'
  }
];

export const posters: Talk[] = [
  {
    year: '2024',
    title: 'Third Joint Congress on Evolutionary Biology',
    venue: 'Third Joint Congress on Evolutionary Biology',
    location: 'Montreal, QC',
    type: 'poster'
  },
  {
    year: '2024',
    title: 'Botany 2024',
    venue: 'Botany 2024',
    location: 'Grand Rapids, MI',
    type: 'poster'
  },
  {
    year: '2022',
    title: 'UMich Undergraduate Research Opportunity Program Symposium',
    venue: 'UMich UROP Symposium',
    location: 'Ann Arbor, MI',
    type: 'poster'
  }
];

export const awards = [
  {
    title: 'Highest Honors in Ecology & Evolutionary Biology',
    source: 'University of Michigan',
    year: '2024'
  },
  {
    title: "President's Scholar",
    source: 'Grand Rapids Community College (GRCC)',
    year: '2020',
    description: '1 semester'
  },
  {
    title: "Dean's Scholar",
    source: 'GRCC',
    year: '2019-2020',
    description: '4 semesters'
  },
  {
    title: 'Phi Theta Kappa Honors Society',
    source: 'GRCC',
    year: '2019',
    description: 'Invited Member'
  }
];

export const teaching = [
  {
    role: 'Volunteer Lesson Planner',
    organization: 'Discover Cayuga Lake/Trout in the Classroom',
    period: '2025-Present'
  },
  {
    role: 'Volunteer Presenter',
    organization: 'Skype a Scientist',
    period: '2025-Present'
  },
  {
    role: 'Docent (Volunteer Educator)',
    organization: 'Matthaei Botanical Gardens & Nichols Arboretum',
    period: '2023-2025'
  },
  {
    role: 'Peer GRFP Reviewer',
    organization: 'Cornell University',
    period: '2025'
  },
  {
    role: 'Test Writer & Proctor, Forestry & Botany (Volunteer)',
    organization: 'UMich Science Olympiad',
    period: '2023-2025'
  },
  {
    role: 'Director of Percussion',
    organization: 'Lake Orion Community Schools, Lake Orion, MI',
    period: '2022-2023'
  },
  {
    role: 'Transfer Student Peer Mentor',
    organization: 'UMich - LSA Transfer Bridges Program',
    period: '2022-2023'
  },
  {
    role: 'Director of Percussion',
    organization: 'Spring Lake Public Schools, Spring Lake, MI',
    period: '2019-2022'
  },
  {
    role: 'Freelance Percussion Instructor & Composer',
    organization: '8 school districts across Michigan',
    period: '2018-2022'
  },
  {
    role: 'Professional Peer Tutor',
    organization: 'GRCC Drop-in Tutoring Labs - Mathematics, Language Arts',
    period: '2019-2020'
  }
];

export const service = [
  {
    role: 'Percussionist',
    organization: 'Straits of Mackinac Concert Band, Mackinaw City, MI',
    period: '2024-2025'
  },
  {
    role: 'Co-Founder, President, and Volunteer',
    organization: 'Students for Public Power @UM',
    period: '2023-2025'
  },
  {
    role: 'Shift Leader',
    organization: 'Biggby Coffee, Grand Rapids, MI',
    period: '2021-2023'
  },
  {
    role: 'Seasonal Retail Lead',
    organization: 'John Ball Zoo, Grand Rapids, MI',
    period: '2019'
  }
];

export const languages = [
  {
    language: 'TypeScript',
    level: 'C1',
    description: 'Advanced'
  },
  {
    language: 'R',
    level: 'B2',
    description: 'Intermediate'
  },
  {
    language: 'C++',
    level: 'B2',
    description: 'Intermediate'
  },
  {
    language: 'Python',
    level: 'B2',
    description: 'Intermediate'
  },
  {
    language: 'German',
    level: 'B2',
    description: 'Intermediate'
  },
  {
    language: 'Nishnaabemwin (Eastern Ojibwe)',
    level: 'A1',
    description: 'Beginner'
  }
];

export const certifications = [
  {
    title: 'Certified Michigan Naturalist',
    source: 'Michigan State University Extension',
    year: '2024'
  }
];

export const memberships = [
  {
    organization: 'American Society of Naturalists',
    period: '2024-Present'
  },
  {
    organization: 'Society for the Study of Evolution',
    period: '2022-Present'
  },
  {
    organization: 'Botanical Society of America',
    period: '2024-2025'
  }
];

export const extracurriculars = [
  {
    activity: 'Percussionist',
    organization: 'Cornell Symphony Orchestra',
    period: '2025-Present'
  },
  {
    activity: 'Founding Member',
    organization: 'UMich Ecological Restoration Club',
    period: '2023-2025'
  },
  {
    activity: 'Vice President',
    organization: 'GRCC Programmers',
    period: '2019-2020'
  },
  {
    activity: 'Ensemble & Section Leader, Performer',
    organization: 'Genesis Percussion Ensemble',
    period: '2014-2020'
  }
];
