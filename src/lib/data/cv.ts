import type { Funding, Talk } from './types';

/**
 * Mirrors the PDF at static/files/CV.pdf. When a new CV is issued, overwrite
 * that file (keep the name) and update `cvUpdated` plus any changed sections.
 */
export const cvPdfLink = '/files/CV.pdf';
export const cvUpdated = 'August 2026';

export const contactInfo = {
  status: 'Ph.D. Student in Computational Biology at Cornell University',
  location: 'Ithaca, New York',
  website: 'chris-a-talbot.com',
  email: 'cat267[at]cornell[dot]edu',
  fields: 'Population Genetics, Computational Biology, Evolutionary Ecology',
  interests: 'Global change, rapid evolution, stochastic modeling, conservation',
  techs: 'C, C++, Python, TypeScript, CUDA, Cerebras, SLiM'
};

export const education = [
  {
    degree: 'Ph.D. Computational Biology',
    institution: 'Cornell University',
    period: '2025-Present',
    details: [
      'Advisor: Dr. Philipp Messer',
      'Coursework: High-performance and parallel computing, population genetics'
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
      'Math & CS Coursework: Statistics & probability, programming & data structures, real analysis, discrete math',
      'Biology Coursework: genetics, macroevolution, woody plants, ethnobotany, field ecology'
    ]
  },
  {
    degree: 'Associate of General Studies',
    institution: 'Grand Rapids Community College (GRCC)',
    period: '2020',
    gpa: '3.9',
    details: [
      'Computer Science & Mathematics Concentration',
      'Coursework: C++ programming, database development, web application programming, information security',
      'Invited member of Phi Theta Kappa Honors Society'
    ]
  }
];

export const research = [
  {
    title: 'Doctoral Researcher',
    lab: 'Messer Lab',
    href: 'https://messerlab.org',
    institution: 'Cornell University - Computational Biology',
    period: '2025-Present'
  },
  {
    title: 'Research Programmer',
    lab: 'Bradburd Lab',
    href: 'https://www.genescape.org',
    institution: 'UMich - Ecology & Evolutionary Biology (EEB)',
    period: '2024-2025'
  },
  {
    title: 'Undergraduate Researcher, Lab Technician',
    lab: 'Weber Lab',
    href: 'https://theweberlab.com',
    institution: 'UMich - EEB',
    period: '2022-2025'
  },
  {
    title: 'Undergraduate Researcher',
    lab: 'Márquez Lab',
    href: 'https://www.biol.vt.edu/faculty/Marquez.html',
    institution: 'UMich - EEB',
    period: '2021-2022'
  }
];

export const totalFunding = '$174,180';

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
  }
];

export const invitedTalks: Talk[] = [
  {
    year: '2025',
    venue: 'ARGEvol Conference',
    location: 'Porto, Portugal',
    type: 'invited'
  },
  {
    year: '2025',
    venue: 'ARGEvol Spatial ARG Workshop',
    location: 'Porto, Portugal',
    type: 'invited',
    note: 'Workshop Contributor'
  },
  {
    year: '2025',
    venue: 'tskit-dev Seminar',
    location: 'Virtual',
    type: 'invited'
  }
];

export const contributedTalks: Talk[] = [
  {
    year: '2024',
    venue: 'Third Joint Congress on Evolutionary Biology',
    location: 'Montreal, QC',
    type: 'contributed'
  },
  {
    year: '2024',
    venue: 'Botany 2024',
    location: 'Grand Rapids, MI',
    type: 'contributed',
    note: 'Lightning Talk'
  },
  {
    year: '2024',
    venue: 'UMich Ecology & Evolutionary Biology',
    location: 'Ann Arbor, MI',
    type: 'defense',
    note: 'Honors Thesis Defense'
  }
];

export const posters: Talk[] = [
  {
    year: '2024',
    venue: 'Third Joint Congress on Evolutionary Biology',
    location: 'Montreal, QC',
    type: 'poster',
    href: '/files/posters/Evolution_2024_Poster.pdf'
  },
  {
    year: '2024',
    venue: 'Botany 2024',
    location: 'Grand Rapids, MI',
    type: 'poster',
    href: '/files/posters/Botany_2024_Poster.pdf'
  }
];

export const software = [
  {
    name: 'SLiM',
    role: 'Open-Source Contributor',
    period: '2025-Present',
    description:
      'Contribute to maintenance of software for simulating genetics, evolution, and ecology',
    href: 'https://github.com/MesserLab/SLiM'
  },
  {
    name: 'ARGscape',
    role: 'Open-Source Lead',
    period: '2025-Present',
    description: 'Design and maintain software for simulating, analyzing, and visualizing genomic data',
    href: 'https://argscape.com'
  },
  {
    name: 'slim-vscode-tools',
    role: 'Open-Source Lead',
    period: '2025-Present',
    description:
      'Design and maintain software for streamlining SLiM programming through a language server and IDE extension',
    href: 'https://github.com/slim-community/slim-vscode-tools'
  }
];

export const undergraduateMentoring = [
  {
    role: 'McNair Scholars Graduate Coordinator',
    organization: 'Cornell University',
    href: 'https://oadi.cornell.edu/signature-programs/ronald-e-mcnair-post-baccalaureate-achievement-program',
    period: '2026-Present',
    description: 'Paid position involving teaching courses, direct mentorship, and program administration'
  },
  {
    role: 'Peer GRFP Mentor',
    organization: 'Cornell University',
    period: '2025',
    description: 'Paid position involving direct mentorship and peer review for GRFP applicants'
  },
  {
    role: 'Transfer Student Peer Mentor',
    organization: 'UMich - LSA Transfer Bridges Program',
    period: '2022-2023',
    description:
      'Paid position mentoring prospective transfer students and reviewing application materials'
  }
];

export const undergraduateTeaching = [
  {
    role: 'Co-Instructor',
    organization: 'Cornell McNair Scholars Summer Writing Course',
    href: 'https://oadi.cornell.edu/signature-programs/ronald-e-mcnair-post-baccalaureate-achievement-program',
    period: '2026'
  },
  {
    role: 'Course Assistant',
    organization: '"Insights From Trees," University of Michigan Biological Station',
    href: 'https://lsa.umich.edu/umbs/students/courses/insights-from-trees--science--art--and-observation-in-a-noisy-wo.html',
    period: '2024, 2025'
  },
  {
    role: 'Professional Peer Tutor',
    organization: 'GRCC Drop-in Tutoring Labs - Mathematics, Language Arts',
    href: 'https://www.grcc.edu/students-resources/academic-support-tutoring-services',
    period: '2019-2020'
  }
];

export const k12Teaching = [
  {
    role: 'Volunteer Curriculum Developer',
    organization: 'Discover Cayuga Lake, Ithaca, NY',
    href: 'https://discovercayugalake.org/',
    period: '2025-Present'
  },
  {
    role: 'Volunteer Educator',
    organization: 'Skype a Scientist',
    href: 'https://www.skypeascientist.com/',
    period: '2025-Present'
  },
  {
    role: 'Docent (Volunteer Educator)',
    organization: 'Matthaei Botanical Gardens & Nichols Arboretum',
    href: 'https://mbgna.umich.edu/',
    period: '2023-2025'
  },
  {
    role: 'Test Writer & Proctor, Forestry & Botany (Volunteer)',
    organization: 'UMich Science Olympiad',
    href: 'https://www.umichscioly.org/',
    period: '2023-2025'
  },
  {
    role: 'Director of Percussion',
    organization: 'Lake Orion Community Schools, Lake Orion, MI',
    href: 'https://www.lodragonbands.org/',
    period: '2022-2023'
  },
  {
    role: 'Director of Percussion',
    organization: 'Spring Lake Public Schools, Spring Lake, MI',
    href: 'https://springlakebands.org/',
    period: '2019-2022'
  },
  {
    role: 'Freelance Percussion Instructor & Composer',
    organization: '8 school districts across Michigan',
    period: '2018-2022'
  }
];

export const service = [
  {
    role: 'Ad-hoc Peer Reviewer',
    organization: 'Evolution Letters',
    period: '2026'
  },
  {
    role: 'Co-Founder, President, and Volunteer',
    organization: 'Students for Public Power @UM',
    period: '2023-2025'
  }
];

export const memberships = [
  {
    organization: 'American Genetics Association',
    period: '2026-Present'
  },
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

export const languages = [
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

export const extracurriculars = [
  {
    activity: 'Percussionist',
    organization: 'Cornell Percussion Ensemble',
    period: '2025-2026'
  },
  {
    activity: 'Percussionist',
    organization: 'Straits of Mackinac Concert Band, Mackinaw City, MI',
    period: '2024-2025'
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
  }
];
