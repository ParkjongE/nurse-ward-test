import { QUESTIONS, TAG_DESCRIPTIONS, TAG_SUMMARY_PHRASES } from '../data/questions';
import { WARDS } from '../data/wards';
import type { Answers, Choice, Question, TasteTag, WardId } from '../data/types';

export type Reason = {
  questionId: number;
  choice: Choice;
  contribution: 1 | 2;
  tag: TasteTag;
  tagDescription: string;
};

/**
 * 해당 부서에 실제로 점수를 준 선택만으로 이유를 최대 limit개 고른다.
 * 기여도 2점 우선 → 문항 번호 오름차순, 서로 다른 태그 우선, 부족하면 같은 태그로 보충.
 */
export function extractReasons(
  answers: Answers,
  ward: WardId,
  limit = 3,
  questions: Question[] = QUESTIONS,
): Reason[] {
  const candidates: Reason[] = [];
  for (const q of questions) {
    const choice = q.choices.find((ch) => ch.id === answers[q.id]);
    const weight = choice?.weights[ward];
    if (!choice || !weight) continue;
    candidates.push({
      questionId: q.id,
      choice,
      contribution: weight,
      tag: choice.tag,
      tagDescription: TAG_DESCRIPTIONS[choice.tag],
    });
  }
  candidates.sort((a, b) => b.contribution - a.contribution || a.questionId - b.questionId);

  const picked: Reason[] = [];
  const usedTags = new Set<TasteTag>();
  for (const r of candidates) {
    if (picked.length >= limit) break;
    if (usedTags.has(r.tag)) continue;
    picked.push(r);
    usedTags.add(r.tag);
  }
  for (const r of candidates) {
    if (picked.length >= limit) break;
    if (!picked.includes(r)) picked.push(r);
  }
  // 화면에는 문항 순서대로 보여준다.
  return picked.sort((a, b) => a.questionId - b.questionId);
}

/** 받침 유무에 따라 조사를 고른다. 고정 문구에만 사용한다(닉네임에는 쓰지 않음). */
export function josa(word: string, noFinal: string, withFinal: string): string {
  const last = word.charCodeAt(word.length - 1);
  if (last < 0xac00 || last > 0xd7a3) return `${word}${noFinal}(${withFinal})`;
  return (last - 0xac00) % 28 === 0 ? `${word}${noFinal}` : `${word}${withFinal}`;
}

export const withWaGwa = (word: string) => josa(word, '와', '과');

export function buildSummary(nickname: string, ward: WardId, reasons: Reason[]): string {
  const w = WARDS[ward];
  const tags: TasteTag[] = [];
  // 기여도가 높은 근거의 태그부터
  for (const r of [...reasons].sort((a, b) => b.contribution - a.contribution || a.questionId - b.questionId)) {
    if (!tags.includes(r.tag)) tags.push(r.tag);
  }
  const phrases = tags.slice(0, 2).map((t) => TAG_SUMMARY_PHRASES[t]);
  const tastePart = phrases.length >= 2 ? `${withWaGwa(phrases[0])} ${phrases[1]}` : phrases[0];
  return `${nickname}님은 이번 질문에서 ${tastePart}에 가까운 선택을 했어요. 이런 취향을 ${withWaGwa(w.linkSentence)} 연결해, ‘${w.alias}’ 유형으로 소개해드려요.`;
}
