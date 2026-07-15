/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EnglishLevel = 'beginner' | 'intermediate' | 'advanced';

export interface ExerciseQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  translation: string;
  explanation: string;
}

export interface Exercise {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  translation: string;
  explanation: string;
  questions?: ExerciseQuestion[];
}

export interface ListeningQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface ListeningComprehension {
  passage: string;
  passagePt?: string;
  questions: ListeningQuestion[];
}

export interface Lesson {
  id: string;
  level: EnglishLevel;
  title: string;
  titlePt: string;
  introductionPt: string;
  vocabulary: { en: string; pt: string; pronunciation: string }[];
  dialoguePt: string;
  dialogue: { speaker: string; textEn: string; textPt: string }[];
  explanationPt: string;
  exercise: Exercise;
  discussionPrompt?: string;
  discussionPromptPt?: string;
  speakingScenario?: {
    prompt: string;
    promptPt: string;
  };
  listeningComprehension?: ListeningComprehension;
  categories?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface UserProgress {
  level: EnglishLevel;
  xp: number;
  streak: number;
  completedLessons: string[];
  lastActiveDate: string | null;
}

export interface StudyGroup {
  groupId: string;
  name: string;
  description: string;
  levelFocus: 'Iniciante' | 'Intermédio' | 'Avançado';
  creatorId: string;
  creatorName: string;
  memberCount: number;
  createdAt: any;
  updatedAt: any;
}

export interface GroupMember {
  userId: string;
  name: string;
  role: 'Creator' | 'Member';
  joinedAt: any;
}

export interface GroupMessage {
  messageId: string;
  senderId: string;
  senderName: string;
  text: string;
  audioUrl?: string;
  audioDuration?: number;
  audioSize?: number;
  reports?: string[];
  isReported: boolean;
  createdAt: any;
}

export interface InspirationCard {
  cardId: string;
  imageUrl: string;
  category: 'Vocabulário' | 'Erro Comum' | 'Dica de Inglês';
  englishContent: string;
  portugueseTranslation: string;
  pronunciation?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Certificate {
  certificateId: string;
  userId: string;
  userName: string;
  uniqueCode: string;
  completedAt: any;
}

export interface GroupChallengeResponse {
  responseId: string;
  groupId: string;
  userId: string;
  userName: string;
  prompt: string;
  text?: string;
  audioUrl?: string;
  audioDuration?: number;
  audioSize?: number;
  reactions?: { [emoji: string]: string[] };
  createdAt: any;
}

export interface LeitnerWordProgress {
  en: string;
  box: number; // 1 to 5
  nextReviewDate: string; // ISO String datetime representation
  lastReviewedAt: string; // ISO String datetime representation
}

export interface VocabularyProgress {
  userId: string;
  words: { [wordEn: string]: LeitnerWordProgress };
  updatedAt: any;
}

export interface LessonRecording {
  recordingId: string;
  userId: string;
  lessonId: string;
  lessonTitle: string;
  speakingPrompt: string;
  audioUrl: string;
  duration: number;
  createdAt: any;
  transcript?: string;
  feedbackPt?: string;
  matchLevel?: 'excelente' | 'bom' | 'pratique_mais';
}

export interface PhrasePack {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessonIds: string[];
  scenarioId?: string;
  learningGoal?: string;
}



