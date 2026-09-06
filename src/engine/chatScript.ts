import type { Series, Direction, AgeBand, Situation } from './types';

/**
 * 약사 챗봇 대사 · 문항 정의.
 *
 * 개인정보 수집 금지 원칙:
 *  - 이름·닉네임·이메일·연락처를 묻지 않는다. 자유 입력창 자체가 없다.
 *  - 나이는 정확한 나이가 아니라 구간(19-23 / 24-29 / 30-34 / 35-39)만 고른다.
 *  - 모든 답은 정해진 선택지 탭으로만 이루어지고, 어디에도 저장하지 않는다.
 *  - 호칭은 고정 문구 '청년님' 을 쓴다.
 */

export const ADDRESS_TERM = '청년님';

/** 약사 대사는 매번 같지 않도록 패턴을 여러 개 두고 하나를 고른다. */
export interface ChatPatterns {
  greeting: string[][];
  ack: string[];
  loading: string[];
  beforeResult: string[];
}

export const CHAT: ChatPatterns = {
  /** 인트로 — 바로 환영하고 문항으로 넘어간다 */
  greeting: [
    [
      '어서 오세요, 마포 청년정책 약국입니다.',
      `오늘 여기까지 오느라 애쓰셨어요, ${ADDRESS_TERM}.`,
      '몇 가지만 골라주시면 처방전을 지어드릴게요.',
    ],
    [
      '안녕하세요, 마포 청년정책 약국이에요.',
      '요즘 청년으로 산다는 게 참 쉽지 않죠. 집도, 일도, 돈도, 마음도요.',
      '편하게 골라만 주세요.',
    ],
    [
      '반가워요. 여기는 정책을 처방해드리는 약국입니다.',
      '지금 마음에 걸리는 걸 골라주시면 그걸로 충분해요.',
    ],
  ],
  /** 선택 직후 짧은 맞장구 */
  ack: [
    '그렇군요.',
    '네, 잘 알겠어요.',
    '충분히 그럴 수 있어요.',
    '적어둘게요.',
    '그 마음 이해해요.',
    '좋아요, 다음으로 가볼까요.',
  ],
  /** 조제 중 연출 (3절) */
  loading: [
    '고민 영양제를 열심히 조제하고 있어요...',
    '내게 딱 맞는 맞춤형 정책을 약국 서버에서 찾는 중이에요!',
    '지원 조건을 하나씩 확인하는 중이에요...',
    '처방전을 작성하고 있어요. 잠시만요!',
  ],
  beforeResult: [
    '처방전이 나왔어요.',
    '오늘의 처방전을 준비했어요.',
    `${ADDRESS_TERM}께 딱 맞는 처방을 지어봤어요.`,
  ],
};

export interface Choice<T> {
  label: string;
  emoji: string;
  value: T;
}

export interface Question<T> {
  key: string;
  /** 약사가 던지는 질문 문구 (패턴 여러 개 중 하나) */
  prompts: string[];
  choices: Choice<T>[];
}

/** F1 — 지금 나는? (거르는 질문, 점수 없음) */
export const Q_SITUATION: Question<Situation> = {
  key: 'situation',
  prompts: [
    '요즘 어떤 일상을 보내고 계세요?',
    '지금 청년님은 어디에 가까우신가요?',
  ],
  choices: [
    { emoji: '🎓', label: '학생이에요', value: '학생' },
    { emoji: '💼', label: '취업을 준비하고 있어요', value: '취업준비생' },
    { emoji: '🧑‍💻', label: '직장에 다니고 있어요', value: '직장인' },
    { emoji: '🚀', label: '프리랜서·창업 중이에요', value: '프리랜서' },
    { emoji: '🌿', label: '잠시 쉬고 있어요', value: '휴식' },
  ],
};

/** F2 — 나이대는? 구간만 고른다 (개인정보 아님) */
export const Q_AGE: Question<AgeBand> = {
  key: 'age',
  prompts: [
    '나이대만 살짝 알려주세요. 정확한 나이는 묻지 않아요.',
    '정책마다 신청 가능한 나이가 달라서요. 어느 구간에 드시나요?',
  ],
  choices: [
    { emoji: '🌱', label: '19 ~ 23세', value: '19-23' },
    { emoji: '🌿', label: '24 ~ 29세', value: '24-29' },
    { emoji: '🌳', label: '30 ~ 34세', value: '30-34' },
    { emoji: '🍀', label: '35 ~ 39세', value: '35-39' },
  ],
};

/** S1 — 가장 중요, +2점 */
export const Q_S1: Question<Series> = {
  key: 's1',
  prompts: [
    '요즘 가장 해결하고 싶은 고민은 무엇인가요?',
    '머리 아픈 일이 여럿이겠지만, 지금 제일 큰 건 무엇일까요?',
  ],
  choices: [
    { emoji: '🏠', label: '월세·주거비가 부담돼요', value: '주거' },
    { emoji: '💼', label: '취업·이직·면접이 막막해요', value: '일자리' },
    { emoji: '💰', label: '물가도 오르고 통장이 텅 비어요', value: '금융' },
    { emoji: '💗', label: '번아웃·관계로 마음이 지쳤어요', value: '심리' },
  ],
};

/** S2 — +1점 */
export const Q_S2: Question<Series> = {
  key: 's2',
  prompts: [
    '돈이 조금 생기면 제일 먼저 어디에 쓰세요?',
    '월급이나 용돈이 들어오면 가장 먼저 하는 일은요?',
  ],
  choices: [
    { emoji: '🏠', label: '월세·공과금부터 냅니다', value: '주거' },
    { emoji: '🏦', label: '적금·저축 계좌에 넣어요', value: '금융' },
    { emoji: '📚', label: '학원비·자격증 준비에 써요', value: '일자리' },
    { emoji: '☕', label: '나를 위한 소비를 해요', value: '심리' },
  ],
};

/** S3 — +1점 */
export const Q_S3: Question<Series> = {
  key: 's3',
  prompts: [
    '잠들기 전에 자주 떠오르는 생각은 무엇인가요?',
    '괜히 밤에 뒤척이게 만드는 생각이 있다면요?',
  ],
  choices: [
    { emoji: '🏠', label: '계약 갱신일, 오르는 월세', value: '주거' },
    { emoji: '📄', label: '서류 탈락, 다음 면접 준비', value: '일자리' },
    { emoji: '💸', label: '텅 빈 통장 잔고', value: '금융' },
    { emoji: '😮‍💨', label: '그냥 다 지친다는 생각', value: '심리' },
  ],
};

/** R1 — 방향 정하는 질문 */
export const Q_DIRECTION: Question<Direction> = {
  key: 'direction',
  prompts: [
    '어떤 도움이 제일 반가울까요?',
    '지금 청년님께 가장 실질적인 도움은 무엇일까요?',
  ],
  choices: [
    { emoji: '💵', label: '내 지갑을 채워줄 현금성 지원', value: '현금' },
    { emoji: '🏡', label: '주거비는 Down, 생활은 Up', value: '주거' },
    { emoji: '📈', label: '한 걸음 더 — 교육·자격증·인턴', value: '성장' },
    { emoji: '🌷', label: '나를 채워줄 심리상담·문화 바우처', value: '마음' },
  ],
};

/** 진행 순서 — 거르는 질문 2 + 점수 질문 3 + 방향 질문 1 (4절) */
export const QUESTION_ORDER = [
  Q_SITUATION,
  Q_AGE,
  Q_S1,
  Q_S2,
  Q_S3,
  Q_DIRECTION,
] as const;

/** 패턴 중 하나를 무작위로 고른다 (대사 연출용이라 seed 불필요) */
export const randomOf = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
