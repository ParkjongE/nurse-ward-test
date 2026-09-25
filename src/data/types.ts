export type WardId = 'ER' | 'ICU' | 'OR' | 'MED' | 'PED' | 'PSY' | 'ONC';

export const WARD_ORDER: readonly WardId[] = ['ER', 'ICU', 'OR', 'MED', 'PED', 'PSY', 'ONC'];

export type ChoiceId = 'A' | 'B' | 'C' | 'D';

export type TasteTag =
  | '우선순위 정리'
  | '변화 관찰'
  | '경청'
  | '흐름 조율'
  | '절차 준비'
  | '눈높이 설명'
  | '꾸준한 동행'
  | '상황 전환'
  | '패턴 탐색'
  | '신뢰 형성';

export type Choice = {
  id: ChoiceId;
  text: string;
  tag: TasteTag;
  weights: Partial<Record<WardId, 1 | 2>>;
};

export type Question = { id: number; text: string; choices: Choice[] };

export type ReferenceId = 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'R8' | 'R9' | 'R10' | 'R11' | 'R12';

export type Ward = {
  id: WardId;
  department: string;
  /** '병동' | '부서' — 소개 제목("어떤 병동인가요" / "어떤 부서인가요")에 사용 */
  unitWord: '병동' | '부서';
  alias: string;
  nameplate: string;
  tags: [string, string, string];
  linkSentence: string;
  about: string;
  interestScene: string;
  goodToKnow: string;
  observeQuestion: string;
  imageKey: string;
  references: ReferenceId[];
  /** 결과별 포인트 배경 */
  accent: string;
};

export type Answers = Record<number, ChoiceId>;
