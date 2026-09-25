import type { ReactNode } from 'react';
import type { WardId } from '../data/types';

export type NurseVariant = 'hero' | 'question' | WardId;

type Props = {
  variant: NurseVariant;
  /** 결과별 포인트 배경 원 */
  backdrop?: string;
  className?: string;
  /** 장식이면 스크린리더에서 숨긴다 */
  title?: string;
};

const INK = '#173D39';
const SKIN = '#FBDDC8';
const HAIR = '#4B3A34';
const SCRUB = '#93DAC7';
const SCRUB_DARK = '#6FC4AF';
const PANTS = '#7ACDB8';
const TEAL = '#146B5D';
const CORAL = '#F4B6A6';
const CREAM = '#FFF1CC';
const LAVENDER = '#DDD9F2';
const SW = 3;

const line = { stroke: INK, strokeWidth: SW, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function Head({ variant }: { variant: NurseVariant }) {
  return (
    <g>
      {/* 뒷머리 */}
      <path d="M58 104 C54 52 86 30 120 30 C154 30 186 52 182 104 C182 124 174 138 166 146 L74 146 C66 138 58 124 58 104 Z" fill={HAIR} {...line} />
      {/* 귀 */}
      <circle cx="63" cy="108" r="9" fill={SKIN} {...line} />
      <circle cx="177" cy="108" r="9" fill={SKIN} {...line} />
      {/* 얼굴 */}
      <ellipse cx="120" cy="104" rx="56" ry="50" fill={SKIN} {...line} />
      {/* 앞머리 */}
      <path
        d="M62 100 C58 52 90 36 120 36 C150 36 182 52 178 100 C172 84 164 74 154 68 C140 82 116 84 98 72 C90 82 78 88 62 100 Z"
        fill={HAIR}
        {...line}
      />
      {variant === 'OR' && (
        <g>
          <path d="M60 86 C60 44 92 26 120 26 C148 26 180 44 180 86 C160 76 80 76 60 86 Z" fill="#8CC8E8" {...line} />
          <circle cx="96" cy="56" r="4" fill="#fff" />
          <circle cx="120" cy="46" r="4" fill="#fff" />
          <circle cx="144" cy="56" r="4" fill="#fff" />
          <circle cx="108" cy="70" r="3" fill="#fff" />
          <circle cx="134" cy="70" r="3" fill="#fff" />
        </g>
      )}
      {/* 눈썹 */}
      <path d="M92 94 Q99 90 106 93" fill="none" {...line} strokeWidth={2.5} />
      <path d="M134 93 Q141 90 148 94" fill="none" {...line} strokeWidth={2.5} />
      {/* 눈 */}
      <ellipse cx="100" cy="110" rx="5.5" ry="7" fill={INK} />
      <ellipse cx="140" cy="110" rx="5.5" ry="7" fill={INK} />
      <circle cx="98" cy="107" r="2" fill="#fff" />
      <circle cx="138" cy="107" r="2" fill="#fff" />
      {/* 볼 */}
      <ellipse cx="86" cy="126" rx="9" ry="5.5" fill={CORAL} opacity="0.75" />
      <ellipse cx="154" cy="126" rx="9" ry="5.5" fill={CORAL} opacity="0.75" />
      {/* 입 */}
      <path d="M111 125 Q120 134 129 125" fill="#E98F82" {...line} strokeWidth={2.5} />
    </g>
  );
}

function Body() {
  return (
    <g>
      {/* 다리와 운동화 */}
      <rect x="94" y="236" width="23" height="46" rx="10" fill={PANTS} {...line} />
      <rect x="123" y="236" width="23" height="46" rx="10" fill={PANTS} {...line} />
      <path d="M86 290 Q86 278 100 278 L112 278 Q120 280 118 290 Z" fill="#fff" {...line} />
      <path d="M122 290 Q120 280 128 278 L140 278 Q154 278 154 290 Z" fill="#fff" {...line} />
      {/* 목 */}
      <rect x="110" y="144" width="20" height="14" fill={SKIN} {...line} />
      {/* 스크럽 상의 */}
      <path d="M78 172 Q78 152 100 150 L140 150 Q162 152 162 172 L168 246 Q120 256 72 246 Z" fill={SCRUB} {...line} />
      <path d="M104 151 L120 172 L136 151 Z" fill={SKIN} {...line} />
      <path d="M92 236 L148 236" stroke={SCRUB_DARK} strokeWidth="3" strokeLinecap="round" />
      {/* 명찰 */}
      <rect x="84" y="184" width="42" height="22" rx="7" fill={CREAM} stroke={TEAL} strokeWidth={SW} />
      <circle cx="93" cy="195" r="4" fill={CORAL} />
      <path d="M101 192 L118 192 M101 199 L113 199" stroke={TEAL} strokeWidth="2.5" strokeLinecap="round" />
      {/* 가슴 주머니와 펜 2개 */}
      <path d="M137 178 L137 192" stroke={CORAL} strokeWidth="5" strokeLinecap="round" />
      <path d="M145 176 L145 192" stroke={TEAL} strokeWidth="5" strokeLinecap="round" />
      <rect x="131" y="188" width="22" height="18" rx="4" fill={SCRUB_DARK} {...line} />
    </g>
  );
}

function LeftArm({ holding }: { holding?: boolean }) {
  const d = holding ? 'M84 168 Q70 190 80 214' : 'M84 168 Q68 194 72 222';
  const hand = holding ? { cx: 82, cy: 216 } : { cx: 72, cy: 226 };
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth="21" strokeLinecap="round" />
      <path d={d} fill="none" stroke={SCRUB} strokeWidth="15" strokeLinecap="round" />
      <circle {...hand} r="9" fill={SKIN} {...line} />
    </g>
  );
}

function RightArm() {
  const d = 'M156 168 Q176 186 170 212';
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth="21" strokeLinecap="round" />
      <path d={d} fill="none" stroke={SCRUB} strokeWidth="15" strokeLinecap="round" />
    </g>
  );
}

const RightHand = () => <circle cx="170" cy="214" r="9" fill={SKIN} {...line} />;

function Badge({ children }: { children: ReactNode }) {
  return (
    <g>
      <circle cx="96" cy="168" r="11" fill="#fff" stroke={TEAL} strokeWidth={SW} />
      {children}
    </g>
  );
}

function Clipboard() {
  return (
    <g transform="rotate(8 184 222)">
      <rect x="156" y="186" width="54" height="68" rx="7" fill="#E7C49A" {...line} />
      <rect x="162" y="197" width="42" height="50" rx="3" fill="#fff" {...line} strokeWidth={2} />
      <rect x="173" y="180" width="20" height="11" rx="4" fill={TEAL} {...line} strokeWidth={2} />
      <path d="M168 210 L196 210 M168 220 L192 220 M168 230 L198 230" stroke="#9FB8B2" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M190 236 l4 4 l8 -9" fill="none" stroke={CORAL} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function Props({ variant }: { variant: NurseVariant }) {
  switch (variant) {
    case 'hero':
    case 'question':
      return <Clipboard />;
    case 'ER':
      return (
        <g transform="rotate(6 186 222)">
          <rect x="158" y="190" width="54" height="62" rx="8" fill="#fff" {...line} />
          <rect x="158" y="190" width="54" height="16" rx="8" fill={CORAL} {...line} />
          <path d="M166 218 L200 218 M166 228 L194 228 M166 238 L184 238" stroke="#9FB8B2" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M196 234 l6 4 l-6 4" fill="none" stroke={TEAL} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case 'ICU':
      return (
        <g transform="rotate(4 186 222)">
          <rect x="154" y="188" width="62" height="54" rx="8" fill="#fff" {...line} />
          <path d="M162 226 L172 222 L180 228 L188 210 L196 218 L208 204" fill="none" stroke={TEAL} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M162 234 L208 234" stroke="#C9DAD6" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="208" cy="204" r="3.5" fill={CORAL} />
        </g>
      );
    case 'OR':
      return (
        <g transform="rotate(8 184 222)">
          <rect x="156" y="186" width="54" height="68" rx="7" fill="#CFE6F2" {...line} />
          <rect x="162" y="196" width="42" height="52" rx="3" fill="#fff" {...line} strokeWidth={2} />
          {[206, 220, 234].map((y) => (
            <g key={y}>
              <rect x="166" y={y - 5} width="10" height="10" rx="2" fill="none" stroke={TEAL} strokeWidth="2" />
              <path d={`M168 ${y} l2.5 3 l5 -6`} fill="none" stroke={TEAL} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d={`M181 ${y} L198 ${y}`} stroke="#9FB8B2" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ))}
        </g>
      );
    case 'MED':
      return (
        <g transform="rotate(5 186 222)">
          <rect x="164" y="182" width="12" height="12" rx="3" fill={CORAL} {...line} strokeWidth={2} />
          <rect x="180" y="182" width="12" height="12" rx="3" fill={CREAM} {...line} strokeWidth={2} />
          <rect x="196" y="182" width="12" height="12" rx="3" fill={LAVENDER} {...line} strokeWidth={2} />
          <rect x="156" y="190" width="58" height="60" rx="7" fill="#fff" {...line} />
          {[204, 218, 232].map((y, i) => (
            <g key={y}>
              <circle cx="166" cy={y} r="3.5" fill={[CORAL, '#F2D27A', '#B4ACE0'][i]} />
              <path d={`M174 ${y} L204 ${y}`} stroke="#9FB8B2" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ))}
          <path d="M166 204 L166 232" stroke="#C9DAD6" strokeWidth="1.5" strokeDasharray="2 3" />
        </g>
      );
    case 'PED':
      return (
        <g>
          {/* 곰 인형 */}
          <circle cx="176" cy="188" r="7" fill="#C98F6B" {...line} strokeWidth={2.5} />
          <circle cx="204" cy="188" r="7" fill="#C98F6B" {...line} strokeWidth={2.5} />
          <ellipse cx="190" cy="232" rx="22" ry="24" fill="#D9A27E" {...line} />
          <circle cx="190" cy="200" r="18" fill="#D9A27E" {...line} />
          <ellipse cx="190" cy="206" rx="8" ry="6" fill="#F3D5C0" />
          <circle cx="184" cy="197" r="2.2" fill={INK} />
          <circle cx="196" cy="197" r="2.2" fill={INK} />
          <circle cx="190" cy="204" r="2" fill={INK} />
          <path d="M184 222 Q190 216 196 222 Q190 230 184 222" fill={CORAL} />
        </g>
      );
    case 'PSY':
      return (
        <g>
          <g transform="translate(26 -104)"><path d="M162 124 h40 a10 10 0 0 1 10 10 v16 a10 10 0 0 1 -10 10 h-24 l-10 9 l1 -9 h-7 a10 10 0 0 1 -10 -10 v-16 a10 10 0 0 1 10 -10 z" fill={LAVENDER} {...line} />
          <path d="M170 138 L200 138 M170 146 L190 146" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></g>
          <g transform="translate(-6 -92)"><path d="M26 132 h30 a9 9 0 0 1 9 9 v12 a9 9 0 0 1 -9 9 h-6 l1 8 l-10 -8 h-15 a9 9 0 0 1 -9 -9 v-12 a9 9 0 0 1 9 -9 z" fill={CREAM} {...line} />
          <circle cx="32" cy="148" r="2.5" fill={INK} />
          <circle cx="41" cy="148" r="2.5" fill={INK} />
          <circle cx="50" cy="148" r="2.5" fill={INK} /></g>
          {/* 작은 의자 */}
          <g>
            <rect x="178" y="232" width="36" height="8" rx="3" fill="#E7C49A" {...line} strokeWidth={2.5} />
            <rect x="204" y="204" width="8" height="30" rx="3" fill="#E7C49A" {...line} strokeWidth={2.5} />
            <path d="M182 240 L182 262 M208 240 L208 262" {...line} strokeWidth={3} />
          </g>
        </g>
      );
    case 'ONC':
      return (
        <g transform="rotate(5 186 222)">
          <path d="M154 196 L172 190 L190 196 L212 190 L212 246 L190 252 L172 246 L154 252 Z" fill={CREAM} {...line} />
          <path d="M172 190 L172 246 M190 196 L190 252" stroke="#E2CFA0" strokeWidth="2" />
          <path d="M160 238 Q170 224 182 230 Q196 236 200 214" fill="none" stroke={TEAL} strokeWidth="3" strokeLinecap="round" strokeDasharray="1 6" />
          <circle cx="160" cy="238" r="3.5" fill={TEAL} />
          <path d="M200 214 m-6 -6 a6 6 0 1 1 12 0 c0 5 -6 11 -6 11 c0 0 -6 -6 -6 -11 z" fill={CORAL} {...line} strokeWidth={2} />
        </g>
      );
  }
}

function BadgeFor({ variant }: { variant: NurseVariant }) {
  switch (variant) {
    case 'ER':
      return (
        <Badge>
          <path d="M96 160 L100 168 L96 176 L92 168 Z" fill={CORAL} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="96" cy="168" r="1.8" fill={INK} />
        </Badge>
      );
    case 'ICU':
      return (
        <Badge>
          <circle cx="94" cy="166" r="4.5" fill="none" stroke={INK} strokeWidth="2.2" />
          <path d="M97.5 169.5 L101 173" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </Badge>
      );
    case 'MED':
      return (
        <Badge>
          <rect x="88" y="165" width="10" height="6" rx="3" fill="none" stroke={INK} strokeWidth="2" />
          <rect x="94" y="165" width="10" height="6" rx="3" fill="none" stroke={TEAL} strokeWidth="2" />
        </Badge>
      );
    case 'ONC':
      return (
        <Badge>
          <path d="M96 175 L96 167" stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
          <path d="M96 168 Q89 168 89 162 Q96 162 96 168 Z" fill="#8FD19E" stroke={TEAL} strokeWidth="1.5" />
          <path d="M96 168 Q103 167 103 161 Q96 161 96 168 Z" fill="#8FD19E" stroke={TEAL} strokeWidth="1.5" />
        </Badge>
      );
    case 'PED':
      return (
        <Badge>
          <rect x="89" y="162" width="14" height="12" rx="2" fill={CREAM} stroke={INK} strokeWidth="1.5" />
          <circle cx="93" cy="166" r="2" fill={CORAL} />
          <path d="M90 173 L95 168 L99 171 L102 168" fill="none" stroke={TEAL} strokeWidth="1.5" />
        </Badge>
      );
    case 'PSY':
      return (
        <Badge>
          <path d="M96 173 C88 167 90 161 94 162 C95 162 96 163 96 164 C96 163 97 162 98 162 C102 161 104 167 96 173 Z" fill={CORAL} stroke={INK} strokeWidth="1.5" />
        </Badge>
      );
    case 'hero':
      return (
        <Badge>
          <path d="M96 162 L96 174 M90 168 L102 168" stroke={CORAL} strokeWidth="3.5" strokeLinecap="round" />
        </Badge>
      );
    default:
      return null;
  }
}

/** 하나의 기본 인물을 유지하고 결과별로 소품과 배지만 바꾼 오리지널 간호사 캐릭터. */
export function NurseCharacter({ variant, backdrop, className, title }: Props) {
  const viewBox = variant === 'question' ? '44 22 176 214' : '0 0 240 300';
  const noHold = variant === 'PSY';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {backdrop && <circle cx="120" cy="158" r="116" fill={backdrop} />}
      <ellipse cx="120" cy="292" rx="62" ry="7" fill="rgba(23,61,57,0.10)" />
      <Body />
      <LeftArm holding={variant === 'hero'} />
      {!noHold && <RightArm />}
      {noHold && <LeftArmMirror />}
      <Props variant={variant} />
      {!noHold && <RightHand />}
      <BadgeFor variant={variant} />
      <Head variant={variant} />
    </svg>
  );
}

/** 소품을 들지 않을 때의 오른팔 */
function LeftArmMirror() {
  const d = 'M156 168 Q172 194 168 222';
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth="21" strokeLinecap="round" />
      <path d={d} fill="none" stroke={SCRUB} strokeWidth="15" strokeLinecap="round" />
      <circle cx="168" cy="226" r="9" fill={SKIN} {...line} />
    </g>
  );
}
