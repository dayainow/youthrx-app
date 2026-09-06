/**
 * 청년정책 처방전 — 오프라인 추천 엔진 타입 정의
 *
 * 구현안내서 4·5·7·8절 기준.
 * 네트워크가 없는 태블릿에서 동작하므로 모든 판정은 순수 함수로만 수행한다.
 */

/** 처방 계열 = 결과지 종류 4종 (구현안내서 8절) */
export type Series = '주거' | '일자리' | '금융' | '심리';

export const SERIES_LIST: Series[] = ['주거', '일자리', '금융', '심리'];

/** F1 — 지금 나는? (거르는 질문, 점수 없음) */
export type Situation = '학생' | '취업준비생' | '직장인' | '프리랜서' | '휴식';

/** F2 — 나이대는? (거르는 질문, 점수 없음) */
export type AgeBand = '19-23' | '24-29' | '30-34' | '35-39';

export const AGE_BANDS: AgeBand[] = ['19-23', '24-29', '30-34', '35-39'];

/** R1 — 방향 정하는 질문. 같은 계열 안에서 우선순위를 가른다. */
export type Direction = '현금' | '주거' | '성장' | '마음';

/** 정책 1건 (구현안내서 9절 데이터 스키마) */
export interface Policy {
  id: string;
  series: Series;
  title: string;
  /** 대상·조건 — 소득 조건은 거르지 않고 화면에 그대로 보여준다 */
  target: string;
  /** 핵심 지원 내용 */
  support: string;
  /** 신청기간 */
  period: string;
  /** 추천 이유 한 줄 */
  reason: string;
  url: string;
  /** R1 방향 태그 — 일치하면 우선 노출 */
  direction: Direction;
  /** 신청 가능 연령대. 전체 허용이면 AGE_BANDS 전체 */
  ages: AgeBand[];
  /** 대상 상황. null 이면 전체 허용 */
  situations: Situation[] | null;
  applicationWindow?: { start: string; end: string };
  checkedAt?: string;
  sourceUrl?: string;
  eligibilityNote?: string;
}

/** 사용자 응답 7문항 */
export interface Answers {
  /** F1 */
  situation: Situation;
  /** F2 */
  age: AgeBand;
  /** S1 — 가장 중요, +2점 */
  s1: Series;
  /** S2 — +1점 */
  s2: Series;
  /** S3 — +1점 */
  s3: Series;
  /** R1 */
  direction: Direction;
}

export type Scores = Record<Series, number>;

/** 최종 처방전 결과 */
export interface Prescription {
  issuedOn: string;
  /** 메인 처방 계열 = 결과지 종류 */
  main: Series;
  /** 보조 처방 계열 (한 줄만 노출) */
  sub: Series;
  scores: Scores;
  /** 계열별 처방명 16개 중 1개 (이름 + 전용 이모지) */
  pillName: string;
  pillEmoji: string;
  /** 계열별 위로 문구 */
  comfort: string;
  /** 명언 1개 */
  quote: string;
  /** 보조 처방 한 줄 */
  subLine: string;
  /** 추천 정책 2~3개 */
  policies: Policy[];
  /** policies 와 같은 순서의 약 이모지 — 카드마다 다른 아이콘을 보여주려고 함께 내려준다 */
  policyEmojis: string[];
}
