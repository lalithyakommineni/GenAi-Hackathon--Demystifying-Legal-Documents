export interface Deadline {
  date: string;
  description: string;
}

export interface Authority {
  name: string;
  reason: string;
}

export interface AnalysisResult {
  summary: string;
  criticalAlerts: string[];
  deadlines: Deadline[];
  actionChecklist: string[];
  relevantAuthorities: Authority[];
  suggestions: string[];
}

export interface HistoryItem {
  id: string;
  title: string;
  date: string;
  analysis: AnalysisResult;
  originalText?: string;
  originalFile?: { dataUrl: string; name: string; };
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
