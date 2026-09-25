import { REFERENCES, WARDS } from '../data/wards';
import type { WardId } from '../data/types';

export function RefChips({ ward }: { ward: WardId }) {
  return (
    <span className="refchips">
      {WARDS[ward].references.map((r) => {
        const ref = REFERENCES.find((x) => x.id === r)!;
        return (
          <a key={r} href={ref.url} target="_blank" rel="noopener noreferrer" className="refchip" title={ref.title}>
            {r}
          </a>
        );
      })}
    </span>
  );
}

/** 결과 5·6·8번: 부서 소개, 흥미 장면, 미리 알아둘 점, 실습 관찰 질문 (고정 정보) */
export function WardInfo({ ward }: { ward: WardId }) {
  const w = WARDS[ward];
  return (
    <>
      <section className="card section" aria-labelledby={`about-${ward}`}>
        <h2 id={`about-${ward}`} className="section__title">
          어떤 {w.unitWord}인가요?
        </h2>
        <p>
          {w.about} <RefChips ward={ward} />
        </p>
      </section>

      <div className="twocol">
        <section className="card section section--soft" aria-labelledby={`scene-${ward}`}>
          <h2 id={`scene-${ward}`} className="section__title section__title--small">
            이런 장면에 흥미를 느낄 수 있어요
          </h2>
          <p>{w.interestScene}</p>
        </section>
        <section className="card section section--cream" aria-labelledby={`know-${ward}`}>
          <h2 id={`know-${ward}`} className="section__title section__title--small">
            미리 알아두면 좋아요
          </h2>
          <p>{w.goodToKnow}</p>
        </section>
      </div>

      <section className="card section section--observe" aria-labelledby={`observe-${ward}`}>
        <h2 id={`observe-${ward}`} className="section__title section__title--small">
          실습 때 이런 걸 관찰해보세요
        </h2>
        <p className="observe">“{w.observeQuestion}”</p>
      </section>
    </>
  );
}

export function WardTags({ ward }: { ward: WardId }) {
  return (
    <ul className="tags" aria-label="테마 태그">
      {WARDS[ward].tags.map((t) => (
        <li key={t} className="tag" style={{ background: WARDS[ward].accent }}>
          {t}
        </li>
      ))}
    </ul>
  );
}
