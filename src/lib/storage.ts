import { QUESTIONS, QUESTION_COUNT } from '../data/questions';
import type { Answers, ChoiceId } from '../data/types';

export const STORAGE_KEY = 'first-ward:quiz:v1';
export const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export const DEFAULT_NICKNAME = '예비 간호사';
export const NICKNAME_MAX = 12;

export type Phase = 'intro' | 'quiz' | 'result';

export type QuizState = {
  schemaVersion: 1;
  contentVersion: '1.0';
  nickname: string;
  answers: Answers;
  /** 1-based 문항 번호 */
  currentQuestion: number;
  phase: Phase;
  updatedAt: number;
};

export function initialState(nickname = ''): QuizState {
  return {
    schemaVersion: 1,
    contentVersion: '1.0',
    nickname,
    answers: {},
    currentQuestion: 1,
    phase: 'intro',
    updatedAt: Date.now(),
  };
}

function graphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter('ko', { granularity: 'grapheme' });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

/** 제어 문자·줄바꿈 제거, 앞뒤 공백 제거, 최대 12 사용자 인식 문자. 비어 있으면 ''. */
export function sanitizeNickname(input: string): string {
  const cleaned = input.replace(new RegExp('[\\u0000-\\u001F\\u007F-\\u009F\\u2028\\u2029]', 'g'), '').trim();
  return graphemes(cleaned).slice(0, NICKNAME_MAX).join('').trim();
}

export function displayNickname(nickname: string): string {
  return sanitizeNickname(nickname) || DEFAULT_NICKNAME;
}

export function nicknameLength(input: string): number {
  return graphemes(input).length;
}

function isValidAnswers(value: unknown): value is Answers {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  for (const [key, choice] of Object.entries(value as Record<string, unknown>)) {
    const q = QUESTIONS.find((qq) => String(qq.id) === key);
    if (!q || !q.choices.some((ch) => ch.id === (choice as ChoiceId))) return false;
  }
  return true;
}

/** 손상·버전 불일치·만료 데이터는 null로 처리한다. */
export function parseStoredState(raw: string | null, now = Date.now()): QuizState | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!data || typeof data !== 'object') return null;
  const s = data as Partial<QuizState>;
  if (s.schemaVersion !== 1 || s.contentVersion !== '1.0') return null;
  if (typeof s.updatedAt !== 'number' || now - s.updatedAt > MAX_AGE_MS || s.updatedAt > now + 60_000) return null;
  if (typeof s.nickname !== 'string') return null;
  if (!isValidAnswers(s.answers)) return null;
  if (typeof s.currentQuestion !== 'number' || !Number.isInteger(s.currentQuestion)) return null;
  if (s.currentQuestion < 1 || s.currentQuestion > QUESTION_COUNT) return null;
  if (s.phase !== 'intro' && s.phase !== 'quiz' && s.phase !== 'result') return null;
  const answers: Answers = {};
  for (const [k, v] of Object.entries(s.answers)) answers[Number(k)] = v;
  return {
    schemaVersion: 1,
    contentVersion: '1.0',
    nickname: sanitizeNickname(s.nickname),
    answers,
    currentQuestion: s.currentQuestion,
    phase: s.phase,
    updatedAt: s.updatedAt,
  };
}

export type StorageStatus = 'ok' | 'blocked';

export function loadState(): { state: QuizState | null; status: StorageStatus } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const state = parseStoredState(raw);
    if (raw && !state) window.localStorage.removeItem(STORAGE_KEY);
    return { state, status: 'ok' };
  } catch {
    return { state: null, status: 'blocked' };
  }
}

export function saveState(state: QuizState): StorageStatus {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return 'ok';
  } catch {
    return 'blocked';
  }
}

export function clearState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* 저장 차단 환경: 지울 것이 없다 */
  }
}

/** 이어서 할 만한 진행 기록이 있는지 */
export function hasProgress(state: QuizState | null): boolean {
  return !!state && (Object.keys(state.answers).length > 0 || state.phase === 'result');
}
