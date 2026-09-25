import { useEffect, useRef, useState } from 'react';
import type { WardId } from '../data/types';
import {
  buildShareUrl,
  copyText,
  downloadBlob,
  renderShareImage,
  shareImageFile,
  shareResultLink,
} from '../lib/share';

type Props = {
  ward: WardId;
  nickname: string;
  onRestart: () => void;
};

export function ShareActions({ ward, nickname, onRestart }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [status, setStatus] = useState('');
  const url = buildShareUrl(ward);

  const share = async () => {
    const outcome = await shareResultLink(ward);
    if (outcome === 'unsupported' || outcome === 'failed') setFallback(true);
  };

  const copy = async () => {
    const ok = await copyText(url);
    setStatus(ok ? '링크를 복사했어요.' : '복사하지 못했어요. 아래 주소를 길게 눌러 복사해주세요.');
  };

  return (
    <section className="card section actions" aria-label="저장과 공유">
      <div className="actions__row">
        <button type="button" className="btn btn--primary" onClick={() => setDialogOpen(true)}>
          결과 이미지 저장
        </button>
        <button type="button" className="btn btn--secondary" onClick={share}>
          친구에게 공유
        </button>
        <button type="button" className="btn btn--ghost" onClick={onRestart}>
          다시 해보기
        </button>
      </div>

      {fallback && (
        <div className="share-fallback">
          <p>이 브라우저에서는 바로 공유할 수 없어요. 링크를 복사해서 보내주세요.</p>
          <label className="field__label" htmlFor="share-url">
            공유 링크
          </label>
          <div className="copyrow">
            <input
              id="share-url"
              className="field__input"
              readOnly
              value={url}
              onFocus={(e) => e.currentTarget.select()}
            />
            <button type="button" className="btn btn--secondary btn--small" onClick={copy}>
              링크 복사
            </button>
          </div>
          <p className="fineprint">공유 링크에는 부서 유형만 담기고 닉네임과 답변은 들어가지 않아요.</p>
        </div>
      )}
      <p className="sr-status" role="status" aria-live="polite">
        {status}
      </p>

      {dialogOpen && <ImageSaveDialog ward={ward} nickname={nickname} onClose={() => setDialogOpen(false)} />}
    </section>
  );
}

function ImageSaveDialog({ ward, nickname, onClose }: { ward: WardId; nickname: string; onClose: () => void }) {
  const [includeName, setIncludeName] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState(false);
  const [status, setStatus] = useState('');
  const [canShareFile, setCanShareFile] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(document.activeElement);

  useEffect(() => {
    let cancelled = false;
    let objectUrl = '';
    setBlob(null);
    setError(false);
    renderShareImage(ward, includeName ? nickname : null)
      .then((b) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(b);
        setBlob(b);
        setPreviewUrl(objectUrl);
        try {
          const f = new File([b], 'result.png', { type: 'image/png' });
          setCanShareFile(typeof navigator.canShare === 'function' && navigator.canShare({ files: [f] }));
        } catch {
          setCanShareFile(false);
        }
      })
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [ward, nickname, includeName]);

  useEffect(() => {
    const el = dialogRef.current;
    el?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && el) {
        const focusables = el.querySelectorAll<HTMLElement>('button, input, [href], [tabindex]:not([tabindex="-1"])');
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    const openerEl = opener.current;
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      if (openerEl instanceof HTMLElement) openerEl.focus();
    };
  }, [onClose]);

  const save = () => {
    if (!blob) return;
    const ok = downloadBlob(blob, ward);
    setStatus(ok ? '저장을 시작했어요. 저장되지 않으면 이미지를 길게 눌러 저장해주세요.' : '이미지를 길게 눌러 저장해주세요.');
  };

  const shareFile = async () => {
    if (!blob) return;
    const outcome = await shareImageFile(blob, ward);
    if (outcome === 'failed' || outcome === 'unsupported') setStatus('이미지를 공유하지 못했어요. 저장 후 직접 보내주세요.');
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="save-title" ref={dialogRef} tabIndex={-1}>
        <div className="dialog__head">
          <h2 id="save-title" className="section__title">
            결과 이미지 저장
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="닫기">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <label className="toggle">
          <input type="checkbox" checked={includeName} onChange={(e) => setIncludeName(e.target.checked)} />
          <span className="toggle__track" aria-hidden="true" />
          <span>닉네임 포함</span>
        </label>

        <div className="preview">
          {error ? (
            <p className="notice">이미지를 만들지 못했어요. 결과 화면을 캡처해서 저장해주세요.</p>
          ) : blob ? (
            <img src={previewUrl} alt="저장할 결과 이미지 미리보기" className="preview__img" />
          ) : (
            <p className="preview__loading">이미지를 준비하고 있어요…</p>
          )}
        </div>
        <p className="fineprint">저장이 안 되면 미리보기 이미지를 길게 눌러 저장할 수 있어요.</p>

        <div className="actions__row">
          <button type="button" className="btn btn--primary" onClick={save} disabled={!blob}>
            이미지 저장
          </button>
          {canShareFile && (
            <button type="button" className="btn btn--secondary" onClick={shareFile} disabled={!blob}>
              이미지로 공유
            </button>
          )}
        </div>
        <p className="sr-status" role="status" aria-live="polite">
          {status}
        </p>
      </div>
    </div>
  );
}
