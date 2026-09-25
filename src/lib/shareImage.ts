import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { NurseCharacter } from '../components/NurseCharacter';
import { WARDS } from '../data/wards';
import type { WardId } from '../data/types';
import { serviceUrl } from './share';

const W = 1080;
const H = 1350;
const FONT = '"Pretendard Variable", Pretendard, "Noto Sans KR", system-ui, sans-serif';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image load failed'));
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fitText(ctx: CanvasRenderingContext2D, text: string, weight: number, size: number, maxWidth: number) {
  let s = size;
  ctx.font = `${weight} ${s}px ${FONT}`;
  while (ctx.measureText(text).width > maxWidth && s > 20) {
    s -= 2;
    ctx.font = `${weight} ${s}px ${FONT}`;
  }
}

async function ensureFonts() {
  if (!document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load(`800 72px ${FONT}`, '나의 첫 병동'),
      document.fonts.load(`600 40px ${FONT}`, '나의 첫 병동'),
      document.fonts.load(`400 30px ${FONT}`, '나의 첫 병동'),
    ]);
    await document.fonts.ready;
  } catch {
    /* 시스템 글꼴로 대체 */
  }
}

/** 1080×1350 공유 카드. 개인화 이유와 응답 원문은 넣지 않는다. */
export async function renderShareCard(ward: WardId, nickname: string | null): Promise<Blob> {
  const w = WARDS[ward];
  await ensureFonts();

  const svg = renderToStaticMarkup(createElement(NurseCharacter, { variant: ward, backdrop: w.accent }));
  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  const character = await loadImage(svgUrl);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unsupported');

  // 배경
  ctx.fillStyle = '#F6FBF8';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = w.accent;
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.arc(W - 80, 120, 220, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(60, H - 120, 180, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // 명찰 카드
  const cx = 90;
  const cy = 150;
  const cw = W - 180;
  const ch = 1060;
  ctx.save();
  ctx.shadowColor = 'rgba(23,61,57,0.12)';
  ctx.shadowBlur = 48;
  ctx.shadowOffsetY = 16;
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, cx, cy, cw, ch, 56);
  ctx.fill();
  ctx.restore();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#146B5D';
  roundRect(ctx, cx, cy, cw, ch, 56);
  ctx.stroke();

  // 명찰 클립
  ctx.fillStyle = '#146B5D';
  roundRect(ctx, W / 2 - 90, cy - 36, 180, 60, 22);
  ctx.fill();
  ctx.fillStyle = '#F6FBF8';
  roundRect(ctx, W / 2 - 50, cy - 16, 100, 18, 9);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // 서비스명
  ctx.fillStyle = '#146B5D';
  ctx.font = `700 34px ${FONT}`;
  ctx.fillText('나의 첫 병동', W / 2, cy + 86);

  let y = cy + 86;
  if (nickname) {
    y += 52;
    ctx.fillStyle = '#526B65';
    fitText(ctx, `${nickname}님의 병동 취향`, 600, 34, cw - 120);
    ctx.fillText(`${nickname}님의 병동 취향`, W / 2, y);
  }

  // 캐릭터
  const charH = nickname ? 560 : 600;
  const charW = charH * 0.8;
  ctx.drawImage(character, W / 2 - charW / 2, y + 24, charW, charH);
  y += 24 + charH;

  // 부서명·별칭
  y += 56;
  ctx.fillStyle = '#526B65';
  fitText(ctx, w.department, 700, 44, cw - 120);
  ctx.fillText(w.department, W / 2, y);
  y += 84;
  ctx.fillStyle = '#173D39';
  fitText(ctx, w.alias, 800, 76, cw - 120);
  ctx.fillText(w.alias, W / 2, y);

  // 태그 3개
  y += 72;
  ctx.font = `600 30px ${FONT}`;
  const pad = 26;
  const gap = 16;
  const widths = w.tags.map((t) => ctx.measureText(t).width + pad * 2);
  const total = widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1);
  let x = W / 2 - total / 2;
  w.tags.forEach((t, i) => {
    ctx.fillStyle = w.accent;
    roundRect(ctx, x, y - 40, widths[i], 58, 29);
    ctx.fill();
    ctx.fillStyle = '#173D39';
    ctx.fillText(t, x + widths[i] / 2, y);
    x += widths[i] + gap;
  });

  // 하단 안내
  ctx.fillStyle = '#146B5D';
  ctx.font = `700 30px ${FONT}`;
  ctx.fillText('재미용 취향 테스트', W / 2, H - 92);
  ctx.fillStyle = '#526B65';
  const address = serviceUrl().replace(/^https?:\/\//, '').replace(/\/$/, '');
  fitText(ctx, address, 500, 26, W - 160);
  ctx.fillText(address, W / 2, H - 50);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/png');
  });
}
