
export interface Message {
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export enum InterviewStatus {
  IDLE = 'IDLE',
  SYSTEM_CHECK = 'SYSTEM_CHECK',
  TESTING = 'TESTING',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR'
}

export interface AudioConfig {
  sampleRate: number;
  channels: number;
}
