export type Role = 'Citizen' | 'Authority';
export type Language = 'en' | 'ur';

export type IssueCategory = 'Roads' | 'Garbage' | 'Water' | 'Electricity';

export type IssueStatus = 'Submitted' | 'In Progress' | 'Resolved';

export type KarachiTown = 
  | 'Clifton & DHA'
  | 'Saddar'
  | 'Gulshan-e-Iqbal'
  | 'North Nazimabad'
  | 'Korangi'
  | 'Malir'
  | 'Keamari & Lyari'
  | 'Jamshed Town';

export interface Report {
  id: string;
  category: IssueCategory;
  title?: string;
  description: string;
  location: string;
  karachiTown: KarachiTown;
  coordinates?: { lat: number; lng: number };
  photoUrl?: string;
  submittedBy: string;
  createdAt: number;
  slaTotalSeconds: number; // e.g. 600 for 10-minute emergency, 3600 for 1h, etc.
  slaRemainingSeconds: number;
  status: IssueStatus;
  isEmergency?: boolean;
  assignedCrew?: string;
  proofOfWorkUrl?: string;
  proofNote?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  town?: string;
  ward?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  tone?: 'Friendly' | 'Formal' | 'Urgent';
}
