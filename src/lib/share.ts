import { WARDS, wardTitle } from '../data/wards';
import type { WardId } from '../data/types';

export const CONTENT_VERSION_PARAM = '1';

/** 서비스 기본 주소 (해시 제외) */
export function serviceUrl(): string {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}`;
}

/** 부서 코드와 콘텐츠 버전만 담는다. 닉네임·원응답·점수는 넣지 않는다. */
export function buildShareUrl(ward: WardId): string {
  return `${serviceUrl()}#/result/${ward}?v=${CONTENT_VERSION_PARAM}`;
}

export type ShareOutcome = 'shared' | 'cancelled' | 'unsupported' | 'failed';

export async function shareResultLink(ward: WardId): Promise<ShareOutcome> {
  const url = buildShareUrl(ward);
  const data: ShareData = {
    title: '나의 첫 병동',
    text: `나의 병동 취향은 ${wardTitle(ward)}! 나는 어떤 병동과 잘 맞을까?`,
    url,
  };
  if (typeof navigator.share !== 'function') return 'unsupported';
  if (typeof navigator.canShare === 'function' && !navigator.canShare(data)) return 'unsupported';
  try {
    await navigator.share(data);
    return 'shared';
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled';
    return 'failed';
  }
}

export async function shareImageFile(blob: Blob, ward: WardId): Promise<ShareOutcome> {
  const file = new File([blob], `first-ward-${ward.toLowerCase()}.png`, { type: 'image/png' });
  const data: ShareData = { files: [file], title: '나의 첫 병동', text: wardTitle(ward) };
  if (typeof navigator.share !== 'function' || typeof navigator.canShare !== 'function') return 'unsupported';
  if (!navigator.canShare({ files: [file] })) return 'unsupported';
  try {
    await navigator.share(data);
    return 'shared';
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled';
    return 'failed';
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* 아래 대안으로 진행 */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** 다운로드 링크로 저장을 시도한다. 성공 여부를 확실히 알 수 없으므로 미리보기 대안을 항상 함께 둔다. */
export function downloadBlob(blob: Blob, ward: WardId): boolean {
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `나의첫병동-${WARDS[ward].department.replace(/\s/g, '')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    return true;
  } catch {
    return false;
  }
}

/** 결과 이미지 렌더러는 필요한 시점에 동적으로 불러온다. */
export async function renderShareImage(ward: WardId, nickname: string | null): Promise<Blob> {
  const mod = await import('./shareImage');
  return mod.renderShareCard(ward, nickname);
}
