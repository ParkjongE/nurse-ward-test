import type { ReferenceId, Ward, WardId } from './types';

export const WARDS: Record<WardId, Ward> = {
  ER: {
    id: 'ER',
    department: '응급실',
    unitWord: '부서',
    alias: '우선순위 나침반',
    nameplate: '달라지는 상황 속에서 다음 방향을 찾는 나침반',
    tags: ['#우선순위', '#상황전환', '#팀소통'],
    linkSentence: '응급실에서 변화하는 요구를 파악하고 팀과 정보를 공유하는 업무',
    about:
      '갑작스러운 질환이나 손상으로 방문한 환자를 평가하고 필요한 처치와 검사, 입원 또는 귀가 과정이 이어지도록 돕는 부서예요. 긴급한 필요를 파악하고 우선순위를 판단하는 과정이 중요해요. 실제 역할은 교육 수준과 병원 체계에 따라 달라요.',
    interestScene: '새로운 상황이 들어올 때 정보를 정리하고, 팀과 공유하며 다음 과정을 연결하는 장면.',
    goodToKnow:
      '예측하기 어려운 흐름과 빠른 변화가 있어요. 재미있는 돌발 상황을 좋아하는 것과 실제 응급 상황에 대처할 준비는 별개이며 교육과 경험이 필요해요.',
    observeQuestion: '팀은 어떤 정보를 먼저 공유하고, 변경된 우선순위를 어떻게 전달할까?',
    imageKey: 'nurse-er',
    references: ['R1'],
    accent: '#FDE3D3',
  },
  ICU: {
    id: 'ICU',
    department: '중환자실',
    unitWord: '부서',
    alias: '변화 탐정',
    nameplate: '작은 변화를 이어서 큰 흐름을 읽는 탐정',
    tags: ['#변화관찰', '#패턴탐색', '#집중'],
    linkSentence: '중환자실에서 환자의 상태 변화를 살피고 팀과 함께 의미를 파악하는 업무',
    about:
      '위중한 환자에게 집중적인 관찰과 복합적인 간호를 제공하는 부서예요. 환자 상태, 모니터링 정보와 치료 반응을 함께 살피며 여러 직종과 협력해요. 환자와 가족을 지원하는 소통도 중요해요.',
    interestScene: '작은 상태 변화와 기록을 비교하며 의미를 배우고 팀과 공유하는 장면.',
    goodToKnow:
      '숫자나 장비만 다루는 곳은 아니에요. 급격한 변화에 대응하는 교육, 여러 정보를 함께 보는 연습과 가족 소통이 필요해요.',
    observeQuestion: '모니터 정보와 직접 관찰한 환자 상태를 어떻게 함께 해석할까?',
    imageKey: 'nurse-icu',
    references: ['R2', 'R8'],
    accent: '#DCEEFB',
  },
  OR: {
    id: 'OR',
    department: '수술실',
    unitWord: '부서',
    alias: '준비 지휘자',
    nameplate: '필요한 순간을 위해 순서와 준비를 맞추는 지휘자',
    tags: ['#절차준비', '#협업', '#도구관심'],
    linkSentence: '수술실에서 준비와 안전 확인, 팀의 순서를 맞추는 업무',
    about:
      '수술이 안전하게 진행되도록 환자 간호와 수술 준비를 담당하는 부서예요. 기구와 물품을 준비·관리하는 역할, 수술실 안의 간호와 환경을 조정하는 역할 등이 협력해요. 구체적인 역할 구분은 기관마다 달라요.',
    interestScene: '다음 단계에 필요한 준비를 예상하고 팀의 흐름에 맞춰 움직이는 장면.',
    goodToKnow:
      '계획된 수술에도 변화가 생길 수 있어요. 절차 준수뿐 아니라 의사소통, 집중 유지와 신체적 부담에 대한 이해도 필요해요.',
    observeQuestion: '각자의 준비가 다른 팀원의 다음 행동과 어떻게 이어질까?',
    imageKey: 'nurse-or',
    references: ['R3'],
    accent: '#CDEDEA',
  },
  MED: {
    id: 'MED',
    department: '내과계 병동',
    unitWord: '병동',
    alias: '연결 코디네이터',
    nameplate: '여러 갈래의 하루를 하나로 이어주는 코디네이터',
    tags: ['#흐름조율', '#넓은관심', '#연결'],
    linkSentence: '내과계 병동에서 여러 간호 요구와 검사·치료·교육 과정을 연결하는 업무',
    about:
      '다양한 내과적 질환의 입원 환자를 돌보며 상태 관찰, 투약, 검사 준비와 환자 교육 등을 수행하는 병동이에요. 여러 환자의 요구와 치료 일정을 살피며 팀과 조율하는 장면이 많아요. 세부 진료과에 따라 일과는 달라져요.',
    interestScene: '흩어진 요청과 일정을 연결하고 환자의 다음 과정을 준비하는 장면.',
    goodToKnow:
      '단순하거나 쉬운 병동이라는 뜻은 아니에요. 다양한 질환과 급격한 상태 변화, 여러 업무의 우선순위를 함께 배우게 돼요.',
    observeQuestion: '검사·투약·교육 일정이 겹칠 때 팀은 어떻게 조율할까?',
    imageKey: 'nurse-med',
    references: ['R4', 'R8'],
    accent: '#DDF3EA',
  },
  PED: {
    id: 'PED',
    department: '소아병동',
    unitWord: '병동',
    alias: '눈높이 통역가',
    nameplate: '낯선 이야기를 이해할 수 있는 말로 바꾸는 통역가',
    tags: ['#눈높이설명', '#가족소통', '#표현의유연함'],
    linkSentence: '소아병동에서 아동의 발달과 이해 수준을 고려하고 가족과 소통하는 업무',
    about:
      '아동의 발달 단계와 건강 상태를 고려해 간호하고 보호자와 함께 돌봄을 이어가는 병동이에요. 아이의 표현을 살피고 이해할 수 있는 방법으로 설명하며 가족의 궁금증을 함께 다뤄요.',
    interestScene: '그림이나 비유, 놀이 요소를 활용해 낯선 설명을 이해하기 쉽게 전달하는 장면.',
    goodToKnow:
      '아이를 좋아하는 마음만으로 결정되는 부서는 아니에요. 연령별 차이와 안전한 간호를 배우고, 아동과 보호자의 서로 다른 요구도 살펴야 해요.',
    observeQuestion: '같은 설명도 아동의 나이와 보호자의 궁금증에 따라 어떻게 달라질까?',
    imageKey: 'nurse-ped',
    references: ['R5'],
    accent: '#FFF1CC',
  },
  PSY: {
    id: 'PSY',
    department: '정신건강의학과 병동',
    unitWord: '병동',
    alias: '대화 동행자',
    nameplate: '말과 표정 사이에서 함께 걸을 속도를 찾는 동행자',
    tags: ['#경청', '#신뢰형성', '#차분한소통'],
    linkSentence: '정신건강의학과 병동에서 신뢰를 쌓으며 환자의 상태와 요구를 살피는 업무',
    about:
      '정신건강 문제를 겪는 환자의 상태를 살피고 치료와 일상 회복을 지원하는 병동이에요. 치료적 의사소통과 교육, 안전한 환경 유지, 팀 기반의 간호가 함께 이뤄져요. 단순 상담만 하는 부서는 아니에요.',
    interestScene: '상대의 말을 듣고 질문 방식을 조절하면서 신뢰를 쌓는 장면.',
    goodToKnow:
      '경청뿐 아니라 전문적인 관계의 경계, 안전과 상태 변화에 대한 교육도 중요해요. 개인적인 친밀함과 치료적 관계를 동일하게 보지 않아요.',
    observeQuestion: '공감하면서도 전문적인 관계의 경계를 어떻게 유지할까?',
    imageKey: 'nurse-psy',
    references: ['R6'],
    accent: '#DDD9F2',
  },
  ONC: {
    id: 'ONC',
    department: '종양병동',
    unitWord: '병동',
    alias: '여정 메이트',
    nameplate: '한 번의 만남 너머 다음 과정까지 함께 보는 메이트',
    tags: ['#꾸준한동행', '#과정이해', '#교육과지원'],
    linkSentence: '종양병동에서 치료 과정에 맞춰 교육과 증상 관리, 환자·가족 지원을 이어가는 업무',
    about:
      '암 환자의 치료와 회복 과정에서 상태를 살피고 치료 관련 증상 관리, 교육과 정서적 지원을 제공하는 병동이에요. 치료 과정과 환자의 요구에 맞춰 여러 직종과 협력해요. 모든 환자가 같은 치료 경로나 입원 기간을 갖는 것은 아니에요.',
    interestScene: '치료 단계가 바뀔 때 필요한 설명과 지원을 함께 준비하는 장면.',
    goodToKnow:
      '따뜻한 동행과 함께 치료 안전과 복잡한 증상에 대한 학습이 중요해요. 어려운 감정을 혼자 감당하는 희생형 이미지로 받아들이지 않도록 해요.',
    observeQuestion: '치료 단계가 달라질 때 교육 내용과 지원 방식은 어떻게 바뀔까?',
    imageKey: 'nurse-onc',
    references: ['R7'],
    accent: '#FBE1E4',
  },
};

export function isWardId(value: unknown): value is WardId {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(WARDS, value);
}

export function wardTitle(id: WardId): string {
  const w = WARDS[id];
  return `${w.department}의 ${w.alias}`;
}

export type Reference = { id: ReferenceId; title: string; note: string; url: string };

export const REFERENCES: Reference[] = [
  {
    id: 'R1',
    title: 'ENA — Introduction to Triage',
    note: '응급 환자의 즉각적 필요를 파악하는 집중 사정에 관한 공개 검색 설명 참고. 원문 직접 열기는 오류가 있어 전문 검토는 하지 못함.',
    url: 'https://www.ena.org/education/search-courses/introduction-triage',
  },
  {
    id: 'R2',
    title: 'AACN — Scope and Standards for Critical Care Nursing Practice',
    note: '중환자 간호의 공개 소개와 협업 범위 확인. 로그인 뒤 지침 전문은 미열람.',
    url: 'https://www.aacn.org/nursing-excellence/standards/aacn-scope-and-standards-for-critical-care-nursing-practice',
  },
  {
    id: 'R3',
    title: 'AORN — Consider a Career in the OR',
    note: '수술실 간호 역할·협업·업무 요구 참고. 미국 제도를 한국 자격 범위로 옮기지 않음.',
    url: 'https://www.aorn.org/article/consider-a-career-in-the-or',
  },
  {
    id: 'R4',
    title: 'AMSN — Medical-Surgical Nursing Definition',
    note: '다양한 상태의 환자 간호와 시간 관리·조정이라는 넓은 역할 참고. 한국 내과계 병동만을 정의하는 자료는 아님.',
    url: 'https://amsn.org/Practice-Resources/Medical-Surgical-Nursing-Definition',
  },
  {
    id: 'R5',
    title: 'Society of Pediatric Nurses — Pediatric Core Competencies',
    note: '아동·가족 중심 간호와 신규 간호사 교육의 공개 개요 참고.',
    url: 'https://www.pedsnurses.org/core-competencies',
  },
  {
    id: 'R6',
    title: 'APNA — Psychiatric-Mental Health Nursing',
    note: '정신건강 간호 범위의 공개 검색 설명 참고. 원문 직접 열기는 403으로 제한되어 전문 검토는 하지 못함.',
    url: 'https://www.apna.org/about-psychiatric-nursing/',
  },
  {
    id: 'R7',
    title: 'Oncology Nursing Society — The Oncology Nursing Specialty',
    note: '치료 안전, 증상 관리, 교육, 환자와 돌봄 제공자 지원 참고.',
    url: 'https://www.ons.org/publications-research/onf/47/2/oncology-nursing-specialty',
  },
  {
    id: 'R8',
    title: '서울아산병원 시뮬레이션센터 — 간호사 대상 교육 프로그램',
    note: '신규·중환자·응급·소아·항암 간호 교육 내용의 국내 사례 참고. 모든 병원의 공통 운영 기준이라는 뜻은 아님.',
    url: 'https://sim.amc.seoul.kr/asan/depts/sim/K/content.do?menuId=4903',
  },
  {
    id: 'R9',
    title: 'W3C WAI — Multi-page Forms',
    note: '문항 분리, 진행 안내와 기존 입력 유지 참고.',
    url: 'https://www.w3.org/WAI/tutorials/forms/multi-page/',
  },
  {
    id: 'R10',
    title: 'W3C WAI — Target Size Enhanced',
    note: '터치 영역 설계 참고. 48px은 자체 설계값.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced',
  },
  {
    id: 'R11',
    title: 'MDN — Web Share API',
    note: '네이티브 공유와 지원 여부 검사 참고.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API',
  },
  {
    id: 'R12',
    title: 'ETS — Validity Evidence Supporting the Interpretation and Use of TOEFL iBT Scores',
    note: '해석의 용도와 근거를 구분해야 한다는 검사 타당도 개념 참고. 간호 부서 매칭 검증 자료가 아님.',
    url: 'https://www.ets.org/research/policy_research_reports/publications/periodical/2020/kgqi.html',
  },
];
