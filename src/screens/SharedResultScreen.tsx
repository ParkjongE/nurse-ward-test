import { useEffect, useRef, useState } from 'react';
import { NurseCharacter } from '../components/NurseCharacter';
import { WardInfo, WardTags } from '../components/WardInfo';
import { WARDS } from '../data/wards';
import type { WardId } from '../data/types';
import { navigate } from '../lib/route';

type Props = {
  ward: WardId;
  hasOwnProgress: boolean;
  ownResultReady: boolean;
  onResume: () => void;
  onStartNew: () => void;
};

/** 공유 링크로 들어온 사람에게 보여주는 일반 부서 소개. 원응답이 없으므로 개인화 문구를 쓰지 않는다. */
export function SharedResultScreen({ ward, hasOwnProgress, ownResultReady, onResume, onStartNew }: Props) {
  const w = WARDS[ward];
  const [asking, setAsking] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
    setAsking(false);
  }, [ward]);

  const tryIt = () => {
    if (hasOwnProgress) setAsking(true);
    else navigate({ name: 'intro' });
  };

  return (
    <div className="page result" style={{ ['--accent' as string]: w.accent }}>
      <header className="topbar topbar--result">
        <a className="topbar__brand" href="#/">
          나의 첫 병동
        </a>
      </header>

      <section className="nameplate" aria-labelledby="shared-title">
        <span className="nameplate__clip" aria-hidden="true" />
        <p className="nameplate__owner">친구가 공유한 {w.department} 유형</p>
        <NurseCharacter variant={ward} backdrop={w.accent} className="nameplate__nurse" />
        <h1 id="shared-title" className="nameplate__title" ref={headingRef} tabIndex={-1}>
          <span className="nameplate__dept">{w.department}의</span>
          <span className="nameplate__alias">{w.alias}</span>
        </h1>
        <p className="nameplate__line">{w.nameplate}</p>
        <WardTags ward={ward} />
      </section>

      <section className="card section cta-card">
        <p>나는 어떤 병동과 잘 맞을까? 12개의 선택으로 나의 간호 스타일을 만나보세요.</p>
        {!asking ? (
          <button type="button" className="btn btn--primary btn--large" onClick={tryIt}>
            나도 테스트하기
          </button>
        ) : (
          <div className="stack" role="group" aria-label="저장된 기록 처리">
            <p className="resume__text">
              이 브라우저에 {ownResultReady ? '내 결과가' : '진행 중인 테스트가'} 저장되어 있어요. 새로 하면 저장된 기록이 바뀌어요.
            </p>
            <button type="button" className="btn btn--primary" onClick={onResume}>
              {ownResultReady ? '내 결과 보기' : '이어서 하기'}
            </button>
            <button type="button" className="btn btn--ghost" onClick={onStartNew}>
              새로 시작하기
            </button>
          </div>
        )}
      </section>

      <WardInfo ward={ward} />

      <section className="disclaimer" aria-label="안내">
        <p>
          재미로 보는 취향 테스트의 유형 소개예요. 모든 부서에서 관찰·소통·협업은 중요하며, 실제 경험은 병원과 팀에 따라
          달라요. <a href="#/references">참고 자료</a>
        </p>
      </section>
    </div>
  );
}
