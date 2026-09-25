import { useEffect, useRef, useState } from 'react';
import { NurseCharacter } from '../components/NurseCharacter';
import { QUESTION_COUNT } from '../data/questions';
import type { ChoiceId, Question } from '../data/types';

type Props = {
  question: Question;
  selected: ChoiceId | undefined;
  storageBlocked: boolean;
  /** 4·8문항 완료 직후 한 번 보여줄 짧은 안내 */
  milestone?: string;
  onSelect: (choice: ChoiceId) => void;
  onNext: () => void;
  onPrev: () => void;
};

const pad = (n: number) => String(n).padStart(2, '0');

export function QuestionScreen(props: Props) {
  const { question, selected, storageBlocked, onSelect, onNext, onPrev } = props;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [milestone, setMilestone] = useState(props.milestone ?? '');
  const isLast = question.id === QUESTION_COUNT;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!milestone) return;
    const t = window.setTimeout(() => setMilestone(''), 2600);
    return () => window.clearTimeout(t);
  }, [milestone]);

  const progress = ((question.id - 1) / QUESTION_COUNT) * 100;

  return (
    <div className="quiz">
      <header className="topbar">
        <button type="button" className="icon-btn" onClick={onPrev} aria-label={question.id === 1 ? '처음 화면으로' : '이전 문항'}>
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="topbar__brand">나의 첫 병동</span>
        <span className="topbar__count" aria-hidden="true">
          {pad(question.id)} / {QUESTION_COUNT}
        </span>
      </header>

      <div
        className="progress"
        role="progressbar"
        aria-label="진행 상황"
        aria-valuemin={1}
        aria-valuemax={QUESTION_COUNT}
        aria-valuenow={question.id}
        aria-valuetext={`${QUESTION_COUNT}문항 중 ${question.id}번째`}
      >
        <span className="progress__bar" style={{ width: `${Math.max(progress, 4)}%` }} />
      </div>

      <div className="sr-status" role="status" aria-live="polite">
        {milestone && <p className="milestone">{milestone}</p>}
        {storageBlocked && question.id === 1 && (
          <p className="notice">이 브라우저에서는 새로고침하면 답변이 사라질 수 있어요.</p>
        )}
      </div>

      <form
        className="quiz__form"
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
      >
        <div className="quiz__nurse-wrap" aria-hidden="true">
          <NurseCharacter variant="question" className="quiz__nurse" />
        </div>
        <fieldset className="clipboard">
          <legend className="quiz__legend">
            <span className="sr-only">
              {QUESTION_COUNT}문항 중 {question.id}번.{' '}
            </span>
            <span className="quiz__qnum" aria-hidden="true">
              Q{question.id}
            </span>
            <h1 className="quiz__question" ref={headingRef} tabIndex={-1}>
              {question.text}
            </h1>
          </legend>
          <span className="clipboard__clip" aria-hidden="true" />
          <p className="quiz__guide">정답은 없어요. 지금 더 끌리는 답 하나를 골라주세요.</p>

          <div className="choices">
            {question.choices.map((ch) => {
              const id = `q${question.id}-${ch.id}`;
              const checked = selected === ch.id;
              return (
                <div className="choice" key={ch.id}>
                  <input
                    type="radio"
                    id={id}
                    name={`q${question.id}`}
                    value={ch.id}
                    checked={checked}
                    onChange={() => onSelect(ch.id)}
                    className="choice__input"
                  />
                  <label htmlFor={id} className="choice__label">
                    <span className="choice__mark" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="choice__text">{ch.text}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>

        <div className="sticky-cta">
          <button type="submit" className="btn btn--primary btn--large" disabled={!selected} aria-disabled={!selected}>
            {isLast ? '내 결과 보기' : '다음'}
          </button>
        </div>
      </form>
    </div>
  );
}
