import { useEffect, useMemo, useRef } from 'react';
import { NurseCharacter } from '../components/NurseCharacter';
import { ShareActions } from '../components/ShareActions';
import { RefChips, WardInfo, WardTags } from '../components/WardInfo';
import { REFERENCES, WARDS, wardTitle } from '../data/wards';
import type { Answers, WardId } from '../data/types';
import { buildSummary, extractReasons, josa, withWaGwa, type Reason } from '../lib/explanation';
import { scoreAnswers } from '../lib/scoring';
import { displayNickname } from '../lib/storage';

type Props = {
  nickname: string;
  answers: Answers;
  onRestart: () => void;
};

function ReasonList({ reasons }: { reasons: Reason[] }) {
  return (
    <ol className="reasons">
      {reasons.map((r) => (
        <li key={r.questionId} className="reason">
          <span className="reason__q">Q{r.questionId}</span>
          <div>
            <p className="reason__pick">“{r.choice.text}”{josa(r.choice.text, '를', '을').slice(r.choice.text.length)} 골랐어요.</p>
            <p className="reason__why">{r.tagDescription}.</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ResultScreen({ nickname, answers, onRestart }: Props) {
  const name = displayNickname(nickname);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const result = useMemo(() => {
    const score = scoreAnswers(answers);
    if (!score) return null;
    const reasons = extractReasons(answers, score.top, 3);
    const secondReasons = extractReasons(answers, score.second, 2);
    return { score, reasons, secondReasons, summary: buildSummary(name, score.top, reasons) };
  }, [answers, name]);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  if (!result || result.reasons.length === 0) {
    // 1위 부서에 기여한 선택이 없다면 문항 매핑 오류다. 일반 결과를 만들지 않는다.
    return (
      <div className="page">
        <section className="card section">
          <h1 className="section__title">결과를 만들 수 없어요</h1>
          <p>답변을 확인하는 중에 문제가 생겼어요. 처음부터 다시 해주세요.</p>
          <button type="button" className="btn btn--primary" onClick={onRestart}>
            다시 해보기
          </button>
        </section>
      </div>
    );
  }

  const { score, reasons, secondReasons, summary } = result;
  const top: WardId = score.top;
  const w = WARDS[top];
  const second = WARDS[score.second];

  let closeNote = '';
  if (score.coTop.length >= 3) {
    closeNote = `이번 선택에서는 ${score.coTop.map((id) => wardTitle(id)).join(', ')}의 점수가 같았어요. 모두 함께 살펴보세요.`;
  } else if (score.isTie) {
    closeNote = `이번 선택에서는 두 유형의 점수가 같았어요. ${withWaGwa(wardTitle(top))} ${josa(wardTitle(score.second), '를', '을')} 함께 소개해드려요.`;
  } else if (score.isClose) {
    closeNote = `두 가지 취향이 비슷하게 나타났어요. ${withWaGwa(wardTitle(top))} ${josa(wardTitle(score.second), '를', '을')} 함께 살펴보세요.`;
  }

  return (
    <div className="page result" style={{ ['--accent' as string]: w.accent }}>
      <header className="topbar topbar--result">
        <a className="topbar__brand" href="#/">
          나의 첫 병동
        </a>
      </header>

      {/* 1. 명찰 카드 */}
      <section className="nameplate" aria-labelledby="result-title">
        <span className="nameplate__clip" aria-hidden="true" />
        <p className="nameplate__owner">{name}님의 병동 취향</p>
        <NurseCharacter variant={top} backdrop={w.accent} className="nameplate__nurse" />
        <h1 id="result-title" className="nameplate__title" ref={headingRef} tabIndex={-1}>
          <span className="nameplate__dept">{w.department}의</span>
          <span className="nameplate__alias">{w.alias}</span>
        </h1>
        <p className="nameplate__line">{w.nameplate}</p>
        <p className="nameplate__caption">이번 답변에서 가장 가까웠던 유형</p>
        {/* 3. 태그 */}
        <WardTags ward={top} />
      </section>

      {closeNote && (
        <p className="closenote" role="note">
          {closeNote}
        </p>
      )}

      {/* 2. 개인화 요약 */}
      <section className="card section" aria-labelledby="summary-title">
        <h2 id="summary-title" className="section__title">
          {name}님은 이런 선택을 해서 이 유형이 나왔어요
        </h2>
        <p className="summary">{summary}</p>
      </section>

      {/* 4. 이 결과가 나온 이유 */}
      <section className="card section" aria-labelledby="why-title">
        <h2 id="why-title" className="section__title">
          이 결과가 나온 이유
        </h2>
        <ReasonList reasons={reasons} />
      </section>

      {/* 5·6·8 */}
      <WardInfo ward={top} />

      {/* 7. 2위 */}
      <section className="card section second" aria-labelledby="second-title" style={{ background: second.accent }}>
        <p className="second__eyebrow">함께 살펴볼 취향</p>
        <div className="second__body">
          <NurseCharacter variant={second.id} className="second__nurse" />
          <div>
            <h2 id="second-title" className="section__title">
              {wardTitle(second.id)}
            </h2>
            <p>{second.nameplate}</p>
          </div>
        </div>
        {secondReasons.length > 0 && (
          <details className="details">
            <summary>이 취향이 함께 보인 선택</summary>
            <ReasonList reasons={secondReasons} />
          </details>
        )}
        <details className="details">
          <summary>어떤 {second.unitWord}인가요?</summary>
          <p>
            {second.about} <RefChips ward={second.id} />
          </p>
        </details>
        <a className="linklike" href={`#/result/${second.id}?v=1`}>
          {second.department} 소개 전체 보기
        </a>
      </section>

      {/* 9. 저장·공유·다시하기 */}
      <ShareActions ward={top} nickname={name} onRestart={onRestart} />

      {/* 10. 고지와 참고 자료 */}
      <section className="disclaimer" aria-label="안내">
        <p>
          이번 선택을 바탕으로 만든 재미용 결과예요. 모든 부서에서 관찰·소통·협업은 중요하며, 실제 경험은 병원과 팀에 따라
          달라요.
        </p>
        <details className="details">
          <summary>참고 자료</summary>
          <p className="fineprint">
            부서 소개는 아래 공개 자료를 참고했어요. 질문·가중치·별칭과 성향 연결은 제작자가 재미를 위해 설계한 규칙이며
            심리검사로 검증된 것이 아니에요.
          </p>
          <ul className="reflist">
            {[...new Set([...w.references, ...second.references])].map((id) => {
              const ref = REFERENCES.find((r) => r.id === id)!;
              return (
                <li key={id}>
                  <a href={ref.url} target="_blank" rel="noopener noreferrer">
                    [{ref.id}] {ref.title}
                  </a>
                </li>
              );
            })}
          </ul>
          <a href="#/references">전체 참고 자료 보기</a>
        </details>
      </section>
    </div>
  );
}
