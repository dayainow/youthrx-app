/**
 * 청년정책 처방전 — 오프라인 추천 엔진.
 *
 * 네트워크·서버·저장소를 일절 쓰지 않는 순수 로직 모듈.
 * 태블릿 앱과 폰 결과 페이지가 이 파일 하나만 공유하면 표시가 일치한다.
 */
export * from './types';
export { POLICIES } from './policies';
export { PILL_NAMES, COMFORT, QUOTES, SUB_LINE, DIRECTION_AFFINITY } from './content';
export {
  prescribe, computeScores, rankSeries, pickPolicies, isEligible, seedFromAnswers,
} from './prescribe';
export {
  buildQrUrl, encodeResult, decodeResult, restoreFromUrl,
} from './qr';
export * from './chatScript';
