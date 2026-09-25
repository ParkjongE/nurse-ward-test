export function RevealScreen() {
  return (
    <div className="reveal" role="status" aria-live="polite">
      <div className="reveal__badge" aria-hidden="true">
        <span className="reveal__clip" />
        <span className="reveal__face reveal__face--front">
          <span className="reveal__line" />
          <span className="reveal__line reveal__line--short" />
        </span>
        <span className="reveal__face reveal__face--back" />
      </div>
      <p className="reveal__text">선택한 답변으로 명찰을 준비하고 있어요.</p>
    </div>
  );
}
