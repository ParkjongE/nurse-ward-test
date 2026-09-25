import { describe, expect, it } from 'vitest';
import { QUESTIONS } from '../data/questions';
import { WARD_ORDER, type Answers, type ChoiceId, type WardId } from '../data/types';
import { WARDS } from '../data/wards';
import { buildSummary, extractReasons } from './explanation';
import { computeMaxScores, scoreAnswers } from './scoring';
import { DEFAULT_NICKNAME, displayNickname, parseStoredState, sanitizeNickname } from './storage';

function answersFrom(pattern: string): Answers {
  const a: Answers = {};
  [...pattern].forEach((ch, i) => (a[i + 1] = ch as ChoiceId));
  return a;
}

/** 고정 시드 의사난수 (mulberry32) */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// PRD 10장: 1위 결과 예시 답변 (Q1~Q12)
const EXAMPLES: Record<WardId, string> = {
  ER: 'ACBBCCBBCDCD',
  ICU: 'CDBABBBBCAAC',
  OR: 'AACADCDABCCA',
  MED: 'DCCCBCAABDDC',
  PED: 'ABBBBDCDBCBD',
  PSY: 'CBBCCCCBCACC',
  ONC: 'DADBDCADCACA',
};

describe('문항 데이터', () => {
  it('12문항 × 4선택지, 각 선택지는 2점 1개와 1점 1개를 가진다', () => {
    expect(QUESTIONS).toHaveLength(12);
    QUESTIONS.forEach((q, i) => {
      expect(q.id).toBe(i + 1);
      expect(q.choices.map((c) => c.id)).toEqual(['A', 'B', 'C', 'D']);
      for (const c of q.choices) {
        expect(c.text.length).toBeGreaterThan(0);
        const vals = Object.values(c.weights).sort();
        expect(vals).toEqual([1, 2]);
      }
    });
  });

  it('최대점수는 PRD 값과 일치하고 모두 0보다 크다', () => {
    expect(computeMaxScores()).toEqual({ ER: 16, ICU: 19, OR: 18, MED: 19, PED: 17, PSY: 18, ONC: 19 });
  });
});

describe('채점', () => {
  it.each(Object.entries(EXAMPLES))('%s 예시 답변은 해당 부서가 1위', (ward, pattern) => {
    expect(scoreAnswers(answersFrom(pattern))?.top).toBe(ward);
  });

  it('미완료 응답은 결과를 만들지 않는다', () => {
    const a = answersFrom('ACBBCCBBCDC');
    expect(scoreAnswers(a)).toBeNull();
  });

  it('같은 응답은 항상 같은 결과·순위·이유를 만든다', () => {
    const a = answersFrom(EXAMPLES.ICU);
    const r1 = scoreAnswers(a)!;
    const r2 = scoreAnswers({ ...a })!;
    expect(r1).toEqual(r2);
    expect(extractReasons(a, r1.top)).toEqual(extractReasons({ ...a }, r2.top));
  });

  it('답변을 바꾸면 누적 없이 다시 계산된다', () => {
    const a = answersFrom(EXAMPLES.ER);
    const changed = { ...a, 1: 'C' as ChoiceId };
    const back = { ...changed, 1: a[1] };
    expect(scoreAnswers(back)).toEqual(scoreAnswers(a));
  });

  it('고정 시드 17 균등 임의 응답 50,000개에서 7개 결과 모두 도달', () => {
    const rand = mulberry32(17);
    const counts = Object.fromEntries(WARD_ORDER.map((w) => [w, 0])) as Record<WardId, number>;
    const ids: ChoiceId[] = ['A', 'B', 'C', 'D'];
    for (let n = 0; n < 50_000; n++) {
      const a: Answers = {};
      for (const q of QUESTIONS) a[q.id] = ids[Math.floor(rand() * 4)];
      const r = scoreAnswers(a)!;
      counts[r.top] += 1;
      // 이유는 항상 1위 부서에 실제로 점수를 준 선택이어야 한다
      const reasons = extractReasons(a, r.top);
      expect(reasons.length).toBeGreaterThan(0);
      for (const reason of reasons) {
        expect(a[reason.questionId]).toBe(reason.choice.id);
        expect(reason.choice.weights[r.top]).toBeGreaterThan(0);
      }
    }
    for (const w of WARD_ORDER) expect(counts[w]).toBeGreaterThan(0);
    // 편중 확인용 로그 (실제 사용자 분포가 아님)
    console.log('구조 확인용 분포', counts);
  });

  it('동점 정렬은 2점 선택 횟수 → 고정 코드 순서', () => {
    // 전 문항 A: ER·OR·PSY·MED가 섞이는 조합. 결과가 결정적인지만 확인
    const a = answersFrom('AAAAAAAAAAAA');
    const r = scoreAnswers(a)!;
    const again = scoreAnswers(a)!;
    expect(r.ranking.map((s) => s.ward)).toEqual(again.ranking.map((s) => s.ward));
    for (let i = 1; i < r.ranking.length; i++) {
      const p = r.ranking[i - 1];
      const c = r.ranking[i];
      const diff = p.raw * c.max - c.raw * p.max;
      expect(diff).toBeGreaterThanOrEqual(0);
      if (diff === 0) {
        const tieOk =
          p.primaryPicks > c.primaryPicks ||
          (p.primaryPicks === c.primaryPicks && WARD_ORDER.indexOf(p.ward) < WARD_ORDER.indexOf(c.ward));
        expect(tieOk).toBe(true);
      }
    }
  });

  it('근접 판정은 normalized 차이 0.08 이하', () => {
    const rand = mulberry32(3);
    const ids: ChoiceId[] = ['A', 'B', 'C', 'D'];
    for (let n = 0; n < 2000; n++) {
      const a: Answers = {};
      for (const q of QUESTIONS) a[q.id] = ids[Math.floor(rand() * 4)];
      const r = scoreAnswers(a)!;
      const [f, s] = r.ranking;
      const diff = f.raw / f.max - s.raw / s.max;
      if (Math.abs(diff - 0.08) > 1e-9) expect(r.isClose).toBe(diff < 0.08);
      expect(r.isTie).toBe(f.raw * s.max === s.raw * f.max);
    }
  });
});

describe('이유 추출', () => {
  it('ICU 예시: 기여도 2점 우선, 서로 다른 태그 최대 3개', () => {
    const a = answersFrom(EXAMPLES.ICU);
    const reasons = extractReasons(a, 'ICU');
    expect(reasons.length).toBe(3);
    expect(new Set(reasons.map((r) => r.tag)).size).toBe(3);
    // ICU 2점 선택은 모두 '패턴 탐색'(Q3·Q8·Q10)이므로 가장 앞선 Q3 하나 + 다른 태그 1점 선택으로 채운다
    expect(reasons.map((r) => [r.questionId, r.contribution])).toEqual([
      [3, 2],
      [7, 1],
      [11, 1],
    ]);
  });

  it('후보가 1개면 1개만 보여준다', () => {
    // ER에 기여하는 답이 Q1 A 하나뿐인 조합
    const a = answersFrom('ABBADADADBBA');
    const reasons = extractReasons(a, 'ER');
    const expected = QUESTIONS.filter((q) => q.choices.find((c) => c.id === a[q.id])!.weights.ER).length;
    expect(reasons.length).toBe(Math.min(expected, 3));
  });

  it('태그가 부족하면 같은 태그의 다른 문항으로 보충', () => {
    // 모든 문항에서 ONC에 기여하는 '꾸준한 동행' 위주 선택
    const a = answersFrom('DDDBACDDCCBA');
    const reasons = extractReasons(a, 'ONC');
    expect(reasons.length).toBe(3);
  });

  it('요약은 닉네임과 부서 연결 문장, 별칭을 포함한다', () => {
    const a = answersFrom(EXAMPLES.ICU);
    const reasons = extractReasons(a, 'ICU');
    const s = buildSummary('종희', 'ICU', reasons);
    expect(s.startsWith('종희님은 이번 질문에서')).toBe(true);
    expect(s).toContain(WARDS.ICU.linkSentence);
    expect(s).toContain('‘변화 탐정’ 유형으로 소개해드려요.');
  });
});

describe('닉네임과 저장', () => {
  it('닉네임 정리', () => {
    expect(sanitizeNickname('  종희  ')).toBe('종희');
    expect(sanitizeNickname('a\nb\tc')).toBe('abc');
    expect(sanitizeNickname('가나다라마바사아자차카타파하')).toBe('가나다라마바사아자차카타');
    expect(sanitizeNickname('👩‍⚕️👩‍⚕️👩‍⚕️👩‍⚕️👩‍⚕️👩‍⚕️👩‍⚕️👩‍⚕️👩‍⚕️👩‍⚕️👩‍⚕️👩‍⚕️👩‍⚕️')).toBe('👩‍⚕️'.repeat(12));
    expect(sanitizeNickname('<img src=x onerror=alert(1)>')).toBe('<img src=x o');
    expect(displayNickname('   ')).toBe(DEFAULT_NICKNAME);
  });

  it('손상·버전 불일치·만료 저장은 폐기', () => {
    const now = Date.now();
    const good = {
      schemaVersion: 1,
      contentVersion: '1.0',
      nickname: '종희',
      answers: { 1: 'A', 2: 'B' },
      currentQuestion: 3,
      phase: 'quiz',
      updatedAt: now,
    };
    expect(parseStoredState(JSON.stringify(good), now)?.answers).toEqual({ 1: 'A', 2: 'B' });
    expect(parseStoredState('{broken', now)).toBeNull();
    expect(parseStoredState(JSON.stringify({ ...good, contentVersion: '0.9' }), now)).toBeNull();
    expect(parseStoredState(JSON.stringify({ ...good, updatedAt: now - 8 * 864e5 }), now)).toBeNull();
    expect(parseStoredState(JSON.stringify({ ...good, answers: { 1: 'Z' } }), now)).toBeNull();
    expect(parseStoredState(JSON.stringify({ ...good, currentQuestion: 99 }), now)).toBeNull();
  });
});
