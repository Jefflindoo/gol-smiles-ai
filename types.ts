
export interface UserData {
  id: string;
  timestamp: number;
  operador: string;
  tipo: string[];
  tkt: string;
  localizador: string;
  dataVoo: string;
  bio: string;
}

export interface AIAnalysis {
  greeting: string;
  professionalTitle: string;
  improvedBio: string;
  suggestedTags: string[];
  summary: string;
}

export enum AppState {
  IDLE = 'IDLE',
  SUBMITTING = 'SUBMITTING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
