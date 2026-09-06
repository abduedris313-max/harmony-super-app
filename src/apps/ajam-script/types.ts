/**
 * Harmony Ajam Script - Data Models and Type Definitions
 */

export type AjamRegion = 'Wollo' | 'Harar' | 'Jimma' | 'Bale' | 'Raya' | 'Silte' | 'Wallagga' | 'Gondar';
export type AjamLanguage = 'Amharic Ajam' | 'Oromo Ajam' | 'Harari Ajam' | 'Silte Ajam' | 'Argobba Ajam';
export type AjamCategory = 'Menzuma' | 'Zikr' | 'Tawassul' | 'Mawlid' | 'Dua' | 'Qasida' | 'Hikmah';

export interface Verse {
  lineNum: number;
  ajamText: string;
  ethiopicText: string;
  englishText: string;
  audioTimestampStart?: number;
  audioTimestampEnd?: number;
  notes?: string;
}

export interface Manuscript {
  id: string;
  titleAjam: string;
  titleEthiopic: string;
  titleEnglish: string;
  author: string;
  region: AjamRegion;
  language: AjamLanguage;
  era: string;
  category: AjamCategory;
  poeticMeter: string;
  imageUrl: string;
  audioUrl?: string;
  verses: Verse[];
  summary: string;
  historicalContext: string;
  verified: boolean;
  likesCount: number;
  contributorUid: string;
  contributorName: string;
  createdAt: string;
}

export interface Contribution {
  id: string;
  title: string;
  ajamScript: string;
  ethiopicText: string;
  englishTranslation: string;
  language: string;
  region: string;
  imageUrl?: string;
  audioUrl?: string;
  notes: string;
  contributorUid: string;
  contributorName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  savedManuscriptIds: string[];
  role: 'user' | 'scholar' | 'admin';
  bio?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  manuscriptId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  text: string;
  createdAt: string;
}

export interface AjamRule {
  soundName: string;
  ethiopicChar: string;
  latinPhonetic: string;
  ajamChar: string;
  arabicBase: string;
  diacriticDescription: string;
  exampleWordAjam: string;
  exampleWordEthiopic: string;
  exampleMeaning: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  content: string;
  keyRules: AjamRule[];
  quiz: Array<{
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  }>;
}

export interface ManuscriptAnalysisResult {
  extractedAjamText: string;
  ethiopicTranslation: string;
  englishTranslation: string;
  detectedDialect: string;
  category: string;
  authorOrEra: string;
  poeticMeter: string;
  commentary: string;
}
