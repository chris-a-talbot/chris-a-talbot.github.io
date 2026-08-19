import type { Project } from './types';

export const projects: Project[] = [
  {
    slug: 'argscape',
    title: 'ARGscape',
    tagline: 'Ancestral Recombination Graph Visualization',
    description: 'Explore ancestry through space, time, and the genome. A web-based tool for visualizing complex genetic ancestry patterns in population genetics.',
    href: 'https://argscape.com',
    image: '/images/argscape_homepage.png',
    full: true,
    role: 'lead'
  },
  {
    slug: 'slim-vscode',
    title: 'SLiM VS Code Tools',
    tagline: 'VS Code Extension for SLiM',
    description: 'A comprehensive VS Code extension for working with SLiM, providing syntax highlighting, IntelliSense, and integrated development tools for evolutionary simulation scripting.',
    href: 'https://github.com/slim-community/slim-vscode-tools',
    logo: '/images/slim_logo.jpg',
    full: true,
    role: 'lead'
  },
  {
    slug: 'anstett-lab',
    title: 'Anstett Lab Website',
    tagline: 'The Anstett Lab - Evolutionary Ecology of Change',
    description: 'The lab website for the Anstett Lab at Cornell University.',
    href: 'https://anstettlab.chris-a-talbot.com',
    image: '/images/anstettlab_homepage.png',
    role: 'lead'
  },
  {
    slug: 'messer-lab',
    title: 'Messer Lab Website',
    tagline: 'Coming Soon',
    description: 'The renovated lab website for the Messer Lab at Cornell University.',
    href: 'https://messerlab.chris-a-talbot.com',
    image: '/images/messerlab_homepage.png',
    role: 'lead'
  },
  {
    slug: 'slim',
    title: 'SLiM',
    tagline: 'Genetically Explicit Forward Simulation Software',
    description: 'SLiM is a genetically explicit forward simulation software package for population genetics and evolutionary biology. It is highly flexible, with a built-in scripting language, and has a cross-platform graphical modeling environment called SLiMgui.',
    href: 'https://github.com/MesserLab/SLiM',
    logo: '/images/slim_logo.jpg',
    full: true,
    role: 'contributor'
  }
];
