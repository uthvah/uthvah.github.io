export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  link: string;
  category: 'Systems' | 'Tools' | 'Cryptography';
  year: string;
}

export enum ChatRole {
  USER = 'user',
  MODEL = 'model',
}

export interface ChatMessage {
  role: ChatRole;
  text: string;
  timestamp: number;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface Track {
  id: string;
  title: string;
  duration: string;
  src: string; // Placeholder path
}
