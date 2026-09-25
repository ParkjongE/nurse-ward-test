import { useEffect, useId, useState, type FormEvent } from 'react';
import { NurseCharacter } from '../components/NurseCharacter';
import { NICKNAME_MAX, nicknameLength, sanitizeNickname } from '../lib/storage';

type Props = {
  initialNickname: string;
  resumePending: boolean;
  resumeLabel: string;
  onStart: (nickname: string) => void;
  onResume: () => void;
  onStartOver: () => void;
  onErase: () => void;
  notice: string;
  onNoticeShown: () => void;
};

export function IntroScreen(props: Props) {
  const { initialNickname, resumePending, resumeLabel, onStart, onResume, onStartOver, onErase, notice, onNoticeShown } =
    props;
  const [nickname, setNickname] = useState(initialNickname);
  const [confirmErase, setConfirmErase] = useState(false);
  const [status, setStatus] = useState('');
  const inputId = useId();
  const hintId = useId();

  useEffect(() => {
    setNickname(initialNickname);
  }, [initialNickname]);

  useEffect(() => {
    if (!notice) return;
    setStatus(notice);
    onNoticeShown();
  }, [notice, onNoticeShown]);

  const length = nicknameLength(sanitizeNickname(nickname));
  const tooLong = nicknameLength(nickname.trim()) > NICKNAME_MAX;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onStart(nickname);
  };

  return (
    <div className="intro">
      <header className="topbar topbar--intro">
        <span className="topbar__brand">나의 첫 병동</span>
      </header>

      <section className="intro__hero" aria-labelledby="intro-title">
        <p className="intro__label">간호학생 · 신규 간호사를 위한 취향 테스트</p>
        <h1 id="intro-title" className="intro__title">
          나는 어떤 병동과
          <br />
          잘 맞을까?
        </h1>
        <p className="intro__desc">
          실습 전에도, 첫 출근 전에도.
          <br />
          12개의 선택으로 나의 간호 스타일을 만나보세요.
        </p>

        <div className="intro__stage">
          <div className="hospital-bg" aria-hidden="true">
            <span className="hospital-bg__window" />
            <span className="hospital-bg__window hospital-bg__window--2" />
            <span className="hospital-bg__curtain" />
          </div>
          <NurseCharacter variant="hero" className="intro__nurse" />
          <p className="bubble intro__bubble">정답은 없어요. 더 끌리는 쪽을 골라주세요!</p>
        </div>
      </section>

      {resumePending ? (
        <section className="card resume" aria-labelledby="resume-title">
          <h2 id="resume-title" className="resume__title">
            이전에 하던 테스트가 있어요
          </h2>
          <p className="resume__text">이 브라우저에 저장된 답변이 있어요. 이어서 할까요?</p>
          <div className="stack">
            <button type="button" className="btn btn--primary" onClick={onResume}>
              {resumeLabel}
            </button>
            <button type="button" className="btn btn--ghost" onClick={onStartOver}>
              새로 시작하기
            </button>
          </div>
        </section>
      ) : (
        <form className="intro__form" onSubmit={submit} noValidate>
          <label htmlFor={inputId} className="field__label">
            어떻게 불러드릴까요? (선택)
          </label>
          <input
            id={inputId}
            className="field__input"
            type="text"
            inputMode="text"
            autoComplete="nickname"
            enterKeyHint="go"
            placeholder="별명으로 입력해도 좋아요"
            value={nickname}
            aria-describedby={hintId}
            aria-invalid={tooLong || undefined}
            onChange={(e) => setNickname(e.target.value)}
          />
          <p id={hintId} className={tooLong ? 'field__hint field__hint--warn' : 'field__hint'}>
            {tooLong ? `${NICKNAME_MAX}자까지만 사용돼요.` : `${length} / ${NICKNAME_MAX}자 · 비워두면 ‘예비 간호사’로 불러드려요`}
          </p>
          <button type="submit" className="btn btn--primary btn--large">
            내 병동 취향 알아보기
          </button>
          <p className="intro__meta">12문항 · 약 3분 · 로그인 없이</p>
        </form>
      )}

      <p className="fineprint">재미로 보는 취향 테스트예요. 실제 적성이나 병동 배치를 판단하는 검사는 아니에요.</p>

      <footer className="footer">
        <nav aria-label="보조 메뉴" className="footer__links">
          <a href="#/about">테스트 소개</a>
          <a href="#/references">참고 자료</a>
          <button type="button" className="linklike" onClick={() => setConfirmErase(true)}>
            내 기록 지우기
          </button>
        </nav>
        {confirmErase && (
          <div className="confirm" role="group" aria-label="기록 삭제 확인">
            <p>닉네임과 답변을 포함해 이 브라우저에 저장된 기록을 모두 지울까요?</p>
            <div className="confirm__actions">
              <button
                type="button"
                className="btn btn--danger btn--small"
                onClick={() => {
                  setConfirmErase(false);
                  onErase();
                }}
              >
                모두 지우기
              </button>
              <button type="button" className="btn btn--ghost btn--small" onClick={() => setConfirmErase(false)}>
                취소
              </button>
            </div>
          </div>
        )}
        <p className="sr-status" role="status" aria-live="polite">
          {status}
        </p>
      </footer>
    </div>
  );
}
