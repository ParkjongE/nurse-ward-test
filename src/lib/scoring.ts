import { QUESTIONS } from '../data/questions';
import { WARD_ORDER, type Answers, type Question, type WardId } from '../data/types';

export type WardScore = {
  ward: WardId;
  raw: number;
  max: number;
  /** 해당 부서에 2점을 준 답변 선택 횟수 */
  primaryPicks: number;
};

export type ScoreResult = {
  ranking: WardScore[];
  top: WardId;
  second: WardId;
  /** normalized 기준 1위와 완전히 같은 점수인 부서들 (정렬 순서) */
  coTop: WardId[];
  /** 1위·2위 normalized 차이가 CLOSE_THRESHOLD 이하 */
  isClose: boolean;
  /** 1위·2위 normalized 완전 동점 */
  isTie: boolean;
};

/** 제작자 설정값. 연구로 검증된 기준이 아니다. */
export const CLOSE_THRESHOLD_PERCENT = 8;

/** 각 부서가 12문항에서 얻을 수 있는 이론상 최대점수 (표에서 계산) */
export function computeMaxScores(questions: Question[] = QUESTIONS): Record<WardId, number> {
  const max = Object.fromEntries(WARD_ORDER.map((w) => [w, 0])) as Record<WardId, number>;
  for (const q of questions) {
    for (const w of WARD_ORDER) {
      max[w] += Math.max(0, ...q.choices.map((ch) => ch.weights[w] ?? 0));
    }
  }
  return max;
}

const MAX_SCORES = computeMaxScores();

export function isCompleteAnswers(answers: Answers, questions: Question[] = QUESTIONS): boolean {
  return questions.every((q) => q.choices.some((ch) => ch.id === answers[q.id]));
}

/** 두 부서의 normalized 비교를 교차곱으로 수행한다. 양수면 a가 앞선다. */
function compareNormalized(a: WardScore, b: WardScore): number {
  return a.raw * b.max - b.raw * a.max;
}

export function compareWardScores(a: WardScore, b: WardScore): number {
  const byNormalized = compareNormalized(a, b);
  if (byNormalized !== 0) return -byNormalized;
  if (a.primaryPicks !== b.primaryPicks) return b.primaryPicks - a.primaryPicks;
  return WARD_ORDER.indexOf(a.ward) - WARD_ORDER.indexOf(b.ward);
}

/** 모든 문항에 유효한 답이 있어야 한다. 아니면 null. */
export function scoreAnswers(answers: Answers, questions: Question[] = QUESTIONS): ScoreResult | null {
  if (!isCompleteAnswers(answers, questions)) return null;
  const maxScores = questions === QUESTIONS ? MAX_SCORES : computeMaxScores(questions);

  const scores = new Map<WardId, WardScore>(
    WARD_ORDER.map((w) => [w, { ward: w, raw: 0, max: maxScores[w], primaryPicks: 0 }]),
  );
  for (const q of questions) {
    const choice = q.choices.find((ch) => ch.id === answers[q.id]);
    if (!choice) return null;
    for (const [ward, weight] of Object.entries(choice.weights) as [WardId, number][]) {
      const s = scores.get(ward)!;
      s.raw += weight;
      if (weight === 2) s.primaryPicks += 1;
    }
  }

  const ranking = [...scores.values()].sort(compareWardScores);
  const [first, second] = ranking;
  const coTop = ranking.filter((s) => compareNormalized(s, first) === 0).map((s) => s.ward);
  const diffNumerator = first.raw * second.max - second.raw * first.max; // (n1 - n2) * m1 * m2
  const isClose = diffNumerator * 100 <= CLOSE_THRESHOLD_PERCENT * first.max * second.max;

  return {
    ranking,
    top: first.ward,
    second: second.ward,
    coTop,
    isClose,
    isTie: diffNumerator === 0,
  };
}
