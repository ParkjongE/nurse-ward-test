import { useEffect, useRef, type ReactNode } from 'react';
import { NurseCharacter } from '../components/NurseCharacter';
import { REFERENCES, WARDS, wardTitle } from '../data/wards';
import { WARD_ORDER } from '../data/types';

function InfoPage({ title, children }: { title: string; children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div className="page">
      <header className="topbar topbar--result">
        <a className="topbar__brand" href="#/">
          나의 첫 병동
        </a>
      </header>
      <section className="card section">
        <h1 className="section__title section__title--page" ref={ref} tabIndex={-1}>
          {title}
        </h1>
        {children}
      </section>
      <a className="btn btn--primary btn--large" href="#/">
        테스트 하러 가기
      </a>
    </div>
  );
}

export function AboutScreen() {
  return (
    <InfoPage title="테스트 소개">
      <p>
        ‘나의 첫 병동’은 간호학생과 신규 간호사가 12개의 일상·실습 상상 질문에 답하고, 자신의 선택과 연결된 간호
        부서 캐릭터를 만나보는 재미용 취향 테스트예요.
      </p>
      <p>
        각 답변은 제작자가 부서 테마에 연결해 둔 규칙에 따라 점수가 매겨져요. 부서마다 선택지에 등장하는 횟수가 달라서,
        각 부서가 얻을 수 있는 최대점수로 나눈 값으로 순위를 정해요. 결과 화면의 이유는 실제로 고른 답변만으로 만들어요.
      </p>
      <p>
        이 테스트는 임상 능력이나 성격을 측정하는 검증된 심리검사가 아니고, 실제 적성이나 병동 배치를 판단하지 않아요. 응급실과
        수술실은 엄밀히 병동과 다른 부서라서 ‘병동·부서’라고 불러요.
      </p>
      <p>
        로그인과 서버 없이 이 브라우저 안에서만 계산해요. 닉네임과 답변은 어디로도 전송되지 않고, 이 기기에 최대 7일 동안만
        저장돼요. 첫 화면의 ‘내 기록 지우기’로 언제든 지울 수 있어요.
      </p>
      <h2 className="section__title section__title--small">일곱 가지 유형</h2>
      <ul className="typelist">
        {WARD_ORDER.map((id) => (
          <li key={id}>
            <a href={`#/result/${id}?v=1`} className="typelist__item" style={{ background: WARDS[id].accent }}>
              <NurseCharacter variant={id} className="typelist__nurse" />
              <span>{wardTitle(id)}</span>
            </a>
          </li>
        ))}
      </ul>
    </InfoPage>
  );
}

export function ReferencesScreen() {
  return (
    <InfoPage title="참고 자료">
      <p>
        검색 및 공개 내용 확인일 2026년 9월 25일. 아래 문서는 업무 소개와 화면 설계 판단에 사용했어요. 질문·가중치·별칭·성향
        연결은 이 테스트를 위해 새로 설계했으며, 아래 자료가 그 심리학적 타당성을 입증하지는 않아요. 해외 자격·업무 범위를
        국내에 그대로 적용하지 않아요.
      </p>
      <ul className="reflist reflist--full">
        {REFERENCES.map((r) => (
          <li key={r.id}>
            <a href={r.url} target="_blank" rel="noopener noreferrer">
              [{r.id}] {r.title}
            </a>
            <p className="fineprint">{r.note}</p>
          </li>
        ))}
      </ul>
    </InfoPage>
  );
}

export function NotFoundScreen() {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div className="page notfound">
      <NurseCharacter variant="hero" className="notfound__nurse" />
      <h1 className="section__title section__title--page" ref={ref} tabIndex={-1}>
        결과를 찾을 수 없어요
      </h1>
      <p>주소가 올바르지 않거나 아직 모든 문항에 답하지 않았어요.</p>
      <a className="btn btn--primary btn--large" href="#/">
        내 병동 취향 알아보기
      </a>
    </div>
  );
}
