import { NurseCharacter } from './NurseCharacter';

/** 1024px 이상에서만 보이는 왼쪽 캐릭터 소개 영역 (장식) */
export function SidePanel() {
  return (
    <aside className="side" aria-hidden="true">
      <div className="side__card">
        <div className="hospital-bg">
          <span className="hospital-bg__window" />
          <span className="hospital-bg__window hospital-bg__window--2" />
          <span className="hospital-bg__curtain" />
        </div>
        <p className="bubble side__bubble">정답은 없어요. 더 끌리는 쪽을 골라주세요!</p>
        <NurseCharacter variant="hero" className="side__nurse" />
        <p className="side__brand">나의 첫 병동</p>
      </div>
    </aside>
  );
}
