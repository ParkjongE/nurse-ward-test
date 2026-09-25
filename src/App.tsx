import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { QUESTIONS, QUESTION_COUNT } from './data/questions';
import type { Answers, ChoiceId } from './data/types';
import { navigate, prefersReducedMotion, useRoute } from './lib/route';
import { isCompleteAnswers } from './lib/scoring';
import {
  clearState,
  hasProgress,
  initialState,
  loadState,
  sanitizeNickname,
  saveState,
  type QuizState,
  type StorageStatus,
} from './lib/storage';
import { IntroScreen } from './screens/IntroScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { ResultScreen } from './screens/ResultScreen';
import { SharedResultScreen } from './screens/SharedResultScreen';
import { AboutScreen, NotFoundScreen, ReferencesScreen } from './screens/InfoScreens';
import { RevealScreen } from './screens/RevealScreen';
import { SidePanel } from './components/SidePanel';

const REVEAL_MS = 800;

const MILESTONES: Record<number, string> = {
  4: '좋아요, 나만의 스타일이 조금씩 보여요.',
  8: '이제 네 번의 선택만 남았어요.',
};

function firstUnanswered(answers: Answers): number {
  const q = QUESTIONS.find((qq) => !answers[qq.id]);
  return q ? q.id : QUESTION_COUNT;
}

export default function App() {
  const route = useRoute();
  const [boot] = useState(loadState);
  const [state, setState] = useState<QuizState>(() => boot.state ?? initialState());
  const [storage, setStorage] = useState<StorageStatus>(boot.status);
  /** 저장된 진행 기록이 있으면 이어서 하기 / 새로 시작하기를 먼저 묻는다 */
  const [resumePending, setResumePending] = useState<boolean>(() => hasProgress(boot.state));
  const [revealing, setRevealing] = useState(false);
  const [notice, setNotice] = useState('');
  const [milestone, setMilestone] = useState<{ q: number; text: string }>({ q: 0, text: '' });
  const skipNextSave = useRef(true);

  // 응답이 바뀔 때마다 저장한다. 첫 렌더(불러온 값)와 기록 삭제 직후는 건너뛴다.
  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    setStorage(saveState(state));
  }, [state]);

  const update = useCallback((patch: Partial<QuizState>) => {
    setState((s) => ({ ...s, ...patch, updatedAt: Date.now() }));
  }, []);

  // 경로와 상태를 맞춘다. 아직 답하지 않은 문항 너머로는 건너뛰지 못한다.
  useEffect(() => {
    if (resumePending || route.name !== 'quiz') return;
    const limit = isCompleteAnswers(state.answers) ? QUESTION_COUNT : firstUnanswered(state.answers);
    if (route.q > limit) {
      navigate({ name: 'quiz', q: limit }, true);
      return;
    }
    if (state.phase !== 'quiz' || state.currentQuestion !== route.q) {
      update({ phase: 'quiz', currentQuestion: route.q });
    }
  }, [route, state.answers, state.phase, state.currentQuestion, resumePending, update]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const start = (rawNickname: string) => {
    setResumePending(false);
    setState({ ...initialState(sanitizeNickname(rawNickname)), phase: 'quiz' });
    navigate({ name: 'quiz', q: 1 });
  };

  const resume = () => {
    setResumePending(false);
    if (state.phase === 'result' && isCompleteAnswers(state.answers)) {
      navigate({ name: 'result' });
    } else {
      navigate({ name: 'quiz', q: Math.min(state.currentQuestion, firstUnanswered(state.answers)) });
    }
  };

  /** 다시 하기 / 새로 시작하기: 응답과 결과는 지우고 닉네임은 유지한다. */
  const startOver = () => {
    setResumePending(false);
    setState(initialState(state.nickname));
    navigate({ name: 'intro' });
  };

  /** 내 기록 지우기: 닉네임을 포함한 저장 전체를 지운다. */
  const eraseAll = () => {
    clearState();
    setResumePending(false);
    skipNextSave.current = true;
    setState(initialState());
    setNotice('이 브라우저에 저장된 기록을 모두 지웠어요.');
  };

  const answer = (questionId: number, choice: ChoiceId) => {
    update({ answers: { ...state.answers, [questionId]: choice } });
  };

  const next = (questionId: number) => {
    if (!state.answers[questionId]) return;
    if (questionId < QUESTION_COUNT) {
      setMilestone({ q: questionId + 1, text: MILESTONES[questionId] ?? '' });
      navigate({ name: 'quiz', q: questionId + 1 });
      return;
    }
    if (!isCompleteAnswers(state.answers)) {
      navigate({ name: 'quiz', q: firstUnanswered(state.answers) });
      return;
    }
    update({ phase: 'result' });
    if (prefersReducedMotion()) {
      navigate({ name: 'result' });
      return;
    }
    setRevealing(true);
    window.setTimeout(() => {
      setRevealing(false);
      navigate({ name: 'result' });
    }, REVEAL_MS);
  };

  const prev = (questionId: number) => {
    setMilestone({ q: 0, text: '' });
    navigate(questionId <= 1 ? { name: 'intro' } : { name: 'quiz', q: questionId - 1 });
  };

  if (revealing) {
    return (
      <div className="shell">
        <main className="app app--wide">
          <RevealScreen />
        </main>
      </div>
    );
  }

  const intro = (
    <IntroScreen
      initialNickname={state.nickname}
      resumePending={resumePending}
      resumeLabel={state.phase === 'result' && isCompleteAnswers(state.answers) ? '내 결과 다시 보기' : '이어서 하기'}
      onStart={start}
      onResume={resume}
      onStartOver={startOver}
      onErase={eraseAll}
      notice={notice}
      onNoticeShown={() => setNotice('')}
    />
  );

  let content: ReactNode;
  let split = false;
  switch (route.name) {
    case 'intro':
      split = true;
      content = intro;
      break;
    case 'quiz':
      split = true;
      content = resumePending ? (
        intro
      ) : (
        <QuestionScreen
          key={route.q}
          question={QUESTIONS[route.q - 1]}
          selected={state.answers[route.q]}
          storageBlocked={storage === 'blocked'}
          milestone={milestone.q === route.q ? milestone.text : ''}
          onSelect={(c) => answer(route.q, c)}
          onNext={() => next(route.q)}
          onPrev={() => prev(route.q)}
        />
      );
      break;
    case 'result':
      content = isCompleteAnswers(state.answers) ? (
        <ResultScreen nickname={state.nickname} answers={state.answers} onRestart={startOver} />
      ) : (
        <NotFoundScreen />
      );
      break;
    case 'shared':
      content = (
        <SharedResultScreen
          ward={route.ward}
          hasOwnProgress={hasProgress(state)}
          ownResultReady={state.phase === 'result' && isCompleteAnswers(state.answers)}
          onResume={resume}
          onStartNew={startOver}
        />
      );
      break;
    case 'about':
      content = <AboutScreen />;
      break;
    case 'references':
      content = <ReferencesScreen />;
      break;
    default:
      content = <NotFoundScreen />;
  }

  return (
    <div className={split ? 'shell shell--split' : 'shell'}>
      {split && <SidePanel />}
      <main className={split ? 'app app--narrow' : 'app app--wide'}>{content}</main>
    </div>
  );
}
