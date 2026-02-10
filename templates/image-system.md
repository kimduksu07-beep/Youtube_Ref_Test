# 나노바나나프로 2D 애니메이션 이미지 프롬프트 가이드

## 공통 스타일 (모든 장면에 반드시 포함)
2D flat animation, soft pastel color palette,
clean minimal background, warm lighting,
Korean YouTube content style, 16:9 aspect ratio,
NanoBanana Pro style, consistent character design

## 캐릭터 기본 설정 (채널 공식 캐릭터 — 모든 장면에서 동일하게 유지)

### 캐릭터 외형 (Scene 1에서 반드시 이대로 정의)
- 체형: 둥글고 귀여운 2등신 캐릭터, 작고 통통한 몸
- 피부: 하얀색/밝은 하늘색, 매끈한 질감
- 얼굴: 완전한 원형, 심플한 이목구비
- 눈: 크고 동그란 검은 눈동자, 동그란 안경 착용
- 안경: 둥근 원형 프레임, 검은색 테
- 입: 작고 단순한 미소 (점 또는 작은 곡선)
- 머리카락: 없음 (매끈한 흰색 머리)
- 의상: 남색(navy) 오버사이즈 후디, 약간 큰 사이즈로 귀여운 느낌
- 손: 작고 단순한 형태, 후디 소매에 살짝 가려짐
- 발: 작고 짧은 다리, 신발 없이 단순한 형태
- 참고: "PSYCH" 노트는 채널 프로필 전용 소품이며, 영상 장면에서는 포함하지 않는다

### 영문 프롬프트용 캐릭터 묘사 (모든 장면에 이 문장 포함)
"A cute round 2-head-proportion character with white/light blue smooth skin,
large round black eyes behind circular black-framed glasses,
no hair, wearing an oversized navy hoodie,
small simple hands partially hidden by hoodie sleeves,
short stubby legs, minimal facial features with a small gentle smile,
chibi-style, 2D flat animation, NanoBanana Pro style"

### 장면별 캐릭터 포즈 변형
- 설명 장면: 한 손을 들어 가리키는 포즈, 또는 턱에 손을 대고 생각하는 포즈
- 감정 장면: 해당 감정 표현 (눈 모양만 변경)
  - 슬픔: 눈이 반달 모양으로 축 처짐
  - 놀람: 눈이 더 커지고 입이 O 모양
  - 기쁨: 눈이 ^ ^ 모양으로 웃음
  - 걱정: 눈썹이 팔자, 입이 구불구불
- 실천 장면: 두 주먹을 쥐고 파이팅 포즈, 자신감 있는 표정
- 마무리: 한 손을 흔들며 인사하는 포즈
- 공감 장면: 두 손을 가슴에 모으는 포즈

### Scene 2 이후 프롬프트 필수 포함 문구
"same character as Scene 1 - round white chibi character
with circular glasses and navy oversized hoodie"

## 장면 유형별 가이드

### 후크/인트로 장면 (주목도 높게)
- 구도: 클로즈업 또는 극적 앵글
- 색상: 고대비 (보라+노랑, 빨강+검정)
- 요소: 물음표, 느낌표, 강조 이펙트
- 배경: 그라데이션 또는 방사형 집중선

### 설명/교육 장면 (차분하게)
- 구도: 미디엄 샷, 캐릭터 + 개념 시각화
- 색상: 차분한 블루/그린/민트
- 요소: 추상 개념을 시각적 메타포로 변환
- 배경: 깨끗한 단색 또는 부드러운 그라데이션

### 감정/공감 장면 (따뜻하게)
- 구도: 캐릭터 감정 클로즈업
- 색상: 웜톤 (오렌지, 코랄, 피치)
- 요소: 하트, 별, 따뜻한 빛 이펙트
- 배경: 부드러운 보케 효과

### 실천/해결 장면 (밝고 활기차게)
- 구도: 캐릭터가 행동하는 모습
- 색상: 밝은 그린/옐로우
- 요소: 체크마크, 화살표, 성장 이미지
- 배경: 밝은 톤, 위를 향하는 구도

### 마무리/CTA 장면 (희망적)
- 구도: 캐릭터가 시청자를 향해 미소/손인사
- 색상: 따뜻한 선셋 톤
- 요소: 구독 버튼 암시, 밝은 미래 이미지
- 배경: 밝고 개방적

## 심리학 개념 → 시각적 메타포 변환 예시
- 불안 → 가슴 위의 무거운 돌
- 자존감 → 거울 속 자신에게 미소
- 트라우마 → 깨진 꽃병에서 자라는 꽃
- 경계 → 보이지 않는 보호막/버블
- 회복 → 어둠에서 빛으로 걸어가는 길
- 내면아이 → 성인 캐릭터 옆의 작은 아이
- 가스라이팅 → 주변이 안개로 뒤덮인 공간
- 애착 → 두 캐릭터를 연결하는 빛나는 실
- 우울 → 비 내리는 창가에 앉은 캐릭터
- 자기돌봄 → 자신을 안아주는 캐릭터
- 분노 → 머리 위로 빨간 연기가 피어오르는 모습
- 거절 → 깨진 다리 위에 서있는 캐릭터

## Negative Prompt (모든 장면 공통)
realistic, 3D render, photographic, dark horror,
gore, violence, nsfw, deformed, ugly, blurry,
low quality, watermark, text overlay

---

## 영상 루프 & 전환 설계 규칙 (image-to-video 10초 기준)

### 기본 원칙
- image-to-video 도구는 1장의 이미지에서 약 10초 영상을 생성한다
- 따라서 하나의 스크립트 장면(약 30~60초)에는 여러 장의 이미지가 필요하다
- 각 장면을 "서브 컷(sub-cut)"으로 세분화한다

### 서브 컷 구조
하나의 [장면 N]을 아래처럼 나눈다:

[장면 N] (약 50초 분량이라면)
├── 컷 N-A: 도입 이미지 (10초) — 캐릭터 등장 또는 배경 설정
├── 컷 N-B: 핵심 이미지 (10초) — 메인 내용 시각화
├── 컷 N-C: 반응 이미지 (10초) — 캐릭터 감정 표현
├── 컷 N-D: 전환 이미지 (10초) — 다음 장면으로 자연스럽게 연결
└── 컷 N-E: (필요 시) 보조 이미지 (10초) — 추가 설명 또는 예시

### 루프 & 연결 규칙

1. 같은 장면 내 서브 컷 연결:
   - 배경색이 동일해야 한다
   - 캐릭터 위치가 크게 변하지 않아야 한다
   - 포즈만 미세하게 변경 (예: 손 위치, 고개 방향)
   → 프롬프트에 "slight variation of previous cut, same background" 포함

2. 장면 간 전환:
   - 마지막 서브 컷과 다음 장면 첫 서브 컷의 색상을 그라데이션으로 연결
   - 전환 컷에는 "transitioning background from [색상A] to [색상B]" 포함
   - 캐릭터는 유지하되 배경만 서서히 변경

3. 루프 가능한 컷 표시:
   - 설명이 긴 구간에서는 "loopable" 태그 추가
   - loopable 컷: 시작과 끝이 자연스럽게 이어지는 단순 동작
   → 프롬프트에 "seamless loop, subtle idle animation,
      character slightly swaying or blinking" 포함

### 컷당 프롬프트 추가 태그
- [LOOP]: 이 컷은 반복 재생 가능하도록 설계
- [TRANSITION-IN]: 이전 장면에서 자연스럽게 전환되는 진입 컷
- [TRANSITION-OUT]: 다음 장면으로 자연스럽게 전환되는 퇴장 컷
- [HERO]: 이 장면의 핵심 이미지 (가장 중요한 컷)

### 서브 컷 수 계산 기준
- 스크립트 장면의 글자 수 ÷ 150자 = 대략적인 소요 시간(초) ÷ 10 = 필요 서브 컷 수
- 최소 2컷, 최대 6컷
