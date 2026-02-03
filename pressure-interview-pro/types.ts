
export interface Message {
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export enum InterviewStatus {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR'
}

export interface AudioConfig {
  sampleRate: number;
  channels: number;
}
