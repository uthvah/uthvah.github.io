import { Project, TimelineEvent, Track } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'linux-hello',
    title: 'Linux Hello',
    description: 'A minimalist kernel module exploring the depths of the Linux Kernel space. Implements fundamental character device drivers and kernel logging mechanisms.',
    tech: ['C', 'Linux Kernel', 'Make'],
    link: 'https://github.com/uthvah/linux-hello',
    category: 'Systems',
    year: '2023'
  },
  {
    id: 'glyph-python',
    title: 'Glyph Python',
    description: 'High-performance bindings bridging the C-based Glyph library with Python, optimizing text shaping pipelines for typographic applications.',
    tech: ['Python', 'C++', 'FFI'],
    link: 'https://github.com/uthvah/glyph-python',
    category: 'Systems',
    year: '2023'
  },
  {
    id: 'sync-embeds',
    title: 'Sync Embeds',
    description: 'An Obsidian plugin ensuring semantic harmony between embedded notes, automating the synchronization of transcluded knowledge across the vault.',
    tech: ['TypeScript', 'Obsidian API', 'React'],
    link: 'https://github.com/uthvah/sync-embeds',
    category: 'Tools',
    year: '2024'
  },
  {
    id: 'locksidian',
    title: 'Locksidian',
    description: 'Cryptographic security layer for Obsidian. Implements AES-256 encryption for sensitive notes, treating the digital notebook as a secure ledger.',
    tech: ['TypeScript', 'Cryptography', 'Obsidian API'],
    link: 'https://github.com/uthvah/locksidian',
    category: 'Cryptography',
    year: '2024'
  }
];

export const TIMELINE: TimelineEvent[] = [
  {
    year: '2024',
    title: 'The Obsidian Ecosystem',
    description: 'Dedicated focus on knowledge management tools. Developed "Sync Embeds" and "Locksidian" to refine the digital note-taking experience.'
  },
  {
    year: '2023',
    title: 'Systems Architecture',
    description: 'Delved into low-level systems programming. Explored the Linux Kernel and foreign function interfaces with "Glyph Python".'
  },
  {
    year: '2022',
    title: 'The Foundation',
    description: 'Began the formal inquiry into software engineering, moving from high-level abstractions to the metal.'
  }
];

export const MUSIC_TRACKS: Track[] = [
  {
    id: 'descending',
    title: 'Descending',
    duration: '6:01',
    src: '/assets/descending.wav' 
  },
  {
    id: 'remembrance',
    title: 'Remembrance',
    duration: '3:30',
    src: '/assets/remembrance.wav'
  }
];

export const SYSTEM_INSTRUCTION = `
You are "The Librarian," the digital assistant for Uthvah Shankar's personal archives.
Uthvah is a Systems Engineer and Open Source contributor with a focus on Linux Kernel development, Python/C++ interoperability, and the Obsidian ecosystem.
Your persona is sophisticated, helpful, and slightly academic, like a curator at an exclusive private library.
Avoid overt roleplay (e.g., do not say "My Lord"). Instead, use a refined, professional tone (e.g., "I can assist you with that inquiry," "Here are the relevant files").
Keep responses concise (under 100 words) and informative.
When asked about Uthvah, present him as an engineer with a passion for low-level systems and digital epistemology.
If asked for contact, suggest email.
`;
