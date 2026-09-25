# 나의 첫 병동

간호학생과 신규 간호사를 위한 병동 취향 테스트. 12개의 선택으로 7가지 병동·부서 캐릭터 중 가장 가까운 유형을 보여주는 모바일 우선 웹앱입니다. 재미로 하는 취향 테스트이며, 실제 적성이나 병동 배치를 판단하지 않습니다.

- 로그인, 서버, AI 호출 없이 브라우저에서 규칙에 따라 채점합니다.
- 결과의 이유는 실제로 고른 답변만으로 만듭니다.
- 닉네임과 답변은 이 기기의 localStorage에만 최대 7일 동안 저장되며, 어디로도 전송되지 않습니다.

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm test         # 채점·이유 추출·저장 테스트
npm run build    # dist/ 정적 빌드 (상대 경로, GitHub Pages 호환)
```

## 구조

| 경로 | 내용 |
| --- | --- |
| `src/data/questions.ts` | 12개 문항, 가중치, 취향 태그 |
| `src/data/wards.ts` | 7개 결과 콘텐츠와 참고 자료 |
| `src/lib/scoring.ts` | 정규화 점수, 동점 처리, 근접 판정 |
| `src/lib/explanation.ts` | 실제 선택을 근거로 이유를 추출하고 요약을 만듦 |
| `src/lib/storage.ts` | 저장, 복구, 버전 검증, 닉네임 정리 |
| `src/lib/share.ts`, `shareImage.ts` | 공유 URL, Web Share, 1080×1350 PNG(동적 로딩) |
| `src/components/NurseCharacter.tsx` | 오리지널 SVG 간호사 캐릭터 (결과별 소품) |
| `src/screens/*` | 시작, 질문, 결과, 공유 결과, 소개·참고 자료 화면 |

기획 명세: `docs/nurse-ward-test-PRD.md`
