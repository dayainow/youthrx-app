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
      '몇 가지만 골라주시면 알맞은 정책을 찾아드릴게요.',
    ],
  ],
  /** 선택 직후 짧은 맞장구 */
  ack: [
    '그렇군요.',
    '네, 알겠습니다.',
    '잘 알겠어요.',
    '네, 확인했어요.',
    '좋아요, 다음으로 가볼까요.',
  ],
  /** 조제 중 연출 (3절) */
  loading: [
    '고민 영양제를 열심히 조제하고 있어요...',
    '선택한 답변에 어울리는 정책을 찾고 있어요.',
    '나에게 필요한 도움을 정리하고 있어요...',
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

/**
 * 직전 답변에 맞춘 맞장구 (베타 피드백 #4·#6).
 *
 * 한 벌의 맞장구를 모든 문항에 돌려 쓰면 답이 어긋난다.
 * 나이처럼 사실을 확인하는 문항은 담백하게 받고, 고민을 꺼내는 문항에서만
 * 공감을 얹는다. S2·S3 는 고르는 값(계열)이 같아도 묻는 것이 다르므로
 * 반드시 따로 적는다. 표를 비워두면 타입 검사에서 걸린다.
 */
type AckTable = {
  situation: Record<Situation, string[]>;
  age: Record<AgeBand, string[]>;
  /** S1 — 가장 큰 고민 */
  s1: Record<Series, string[]>;
  /** S2 — 돈을 먼저 쓰는 곳 */
  s2: Record<Series, string[]>;
  /** S3 — 잠들기 전 떠오르는 생각 */
  s3: Record<Series, string[]>;
};

export const ACK_BY_ANSWER: AckTable = {
  situation: {
    학생: ['학생이시군요. 학교 다니면서 챙길 것도 많으시죠.', '학생이시군요, 잘 알겠어요.'],
    취업준비생: ['취업을 준비하고 계시군요. 그 시간을 지나고 계시네요.', '취업 준비 중이시군요, 알겠습니다.'],
    직장인: ['직장에 다니고 계시는군요. 오늘도 일하고 오셨겠어요.', '직장에 다니고 계시는군요, 잘 알겠어요.'],
    프리랜서: ['프리랜서·창업 쪽이시군요. 직접 만들어가고 계시네요.', '프리랜서·창업 중이시군요, 알겠습니다.'],
    휴식: ['잠시 쉬어가는 중이시군요. 그것도 필요한 시간이에요.', '잠시 쉬고 계시는군요, 잘 알겠어요.'],
  },
  age: {
    '19-23': ['19~23세로 맞춰서 볼게요.', '네, 19~23세 기준으로 찾아볼게요.'],
    '24-29': ['24~29세로 맞춰서 볼게요.', '네, 24~29세 기준으로 찾아볼게요.'],
    '30-34': ['30~34세로 맞춰서 볼게요.', '네, 30~34세 기준으로 찾아볼게요.'],
    '35-39': ['35~39세로 맞춰서 볼게요. 이 구간까지 되는 정책도 챙길게요.', '네, 35~39세 기준으로 찾아볼게요.'],
  },
  s1: {
    주거: ['월세와 주거비가 제일 무겁게 느껴지시는군요.', '지금은 사는 곳 문제가 가장 크시군요.'],
    일자리: ['취업과 이직 쪽이 가장 큰 고민이시군요.', '지금은 일자리 문제가 제일 크시군요.'],
    금융: ['돈 문제가 제일 크시군요. 요즘 물가가 정말 그렇죠.', '지금은 통장 사정이 가장 큰 고민이시군요.'],
    심리: ['마음이 많이 지치셨군요. 잘 말씀해 주셨어요.', '지금은 마음 쪽이 가장 힘드시군요.'],
  },
  s2: {
    주거: ['고정비부터 챙기시는군요.', '월세와 공과금이 먼저군요.'],
    금융: ['차곡차곡 모으시는 편이군요.', '저축이 먼저시군요.'],
    일자리: ['배우는 데 쓰시는군요.', '자기 계발에 먼저 쓰시는군요.'],
    심리: ['나를 위해 쓰시는군요. 그것도 꼭 필요하죠.', '나를 챙기는 소비가 먼저군요.'],
  },
  s3: {
    주거: ['그 생각이 떠오르면 쉽게 잠들기 어렵죠.', '계약과 월세 걱정이 밤까지 따라오는군요.'],
    일자리: ['그 생각이 밤까지 따라오는군요.', '결과를 기다리는 밤은 유난히 길죠.'],
    금융: ['잔고를 확인하고 나면 마음이 무거워지죠.', '통장 걱정이 밤까지 이어지는군요.'],
    심리: ['그런 밤이 있죠. 잘 들었어요.', '아무 이유 없이 지치는 날이 있죠.'],
  },
};

/**
 * 직전 질문·답변에 어울리는 맞장구를 고른다.
 * 표에 없는 조합(방향 질문 등)은 어디에 붙어도 어색하지 않은 중립 맞장구로 물러난다.
 */
export function ackFor(questionKey?: string, answer?: string): string {
  const byQuestion: Record<string, Record<string, string[]> | undefined> = ACK_BY_ANSWER;
  const lines = questionKey && answer ? byQuestion[questionKey]?.[answer] : undefined;
  return lines && lines.length > 0 ? randomOf(lines) : randomOf(CHAT.ack);
}
