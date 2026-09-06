import type { Answers, Prescription, Series, Direction, AgeBand, Situation } from './types';
import { SERIES_LIST, AGE_BANDS } from './types';
import { POLICIES } from './policies';
import { prescribe, seedFromAnswers, pickPolicyEmojis } from './prescribe';

/**
 * 9절 — QR 링크.
 *
 *   https://결과페이지주소/r?c=주거&r=현금&p=HS01,HS03&s=학생&a=24-29&k=2,1,1,0
 *
 * QR 생성은 순수 계산이라 인터넷이 필요 없다. 태블릿은 링크를 그림으로 그릴 뿐
 * 서버를 호출하지 않는다. 닉네임 등 개인정보는 링크에 담지 않는다.
 */

const SITUATIONS: Situation[] = ['학생', '취업준비생', '직장인', '프리랜서', '휴식'];
const DIRECTIONS: Direction[] = ['현금', '주거', '성장', '마음'];

export interface ResultParams {
  main: Series;
  sub: Series;
  direction: Direction;
  policyIds: string[];
  situation: Situation;
  age: AgeBand;
  /** 처방명·명언을 태블릿과 동일하게 재현하기 위한 seed */
  seed: number;
}

/** 처방 결과 → 쿼리스트링 */
export function encodeResult(p: Prescription, a: Answers): string {
  const q = new URLSearchParams({
    c: p.main,
    b: p.sub,
    r: a.direction,
    p: p.policies.map((x) => x.id).join(','),
    s: a.situation,
    a: a.age,
    z: String(seedFromAnswers(a)),
  });
  return q.toString();
}

/** 전체 QR 링크 문자열 */
export function buildQrUrl(base: string, p: Prescription, a: Answers): string {
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}${encodeResult(p, a)}`;
}

const isOneOf = <T extends string>(list: readonly T[], v: string | null): T | null =>
  v && (list as readonly string[]).includes(v) ? (v as T) : null;

/** 쿼리스트링 → 결과 파라미터. 값이 깨졌으면 null 을 돌려 폴백을 태운다. */
export function decodeResult(search: string): ResultParams | null {
  const q = new URLSearchParams(search);
  const main = isOneOf(SERIES_LIST, q.get('c'));
  const sub = isOneOf(SERIES_LIST, q.get('b'));
  const direction = isOneOf(DIRECTIONS, q.get('r'));
  const situation = isOneOf(SITUATIONS, q.get('s'));
  const age = isOneOf(AGE_BANDS, q.get('a'));
  if (!main || !direction) return null;

  const ids = (q.get('p') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((id) => POLICIES.some((p) => p.id === id));

  const seed = Number(q.get('z'));

  return {
    main,
    sub: sub ?? main,
    direction,
    policyIds: ids,
    situation: situation ?? '취업준비생',
    age: age ?? '24-29',
    seed: Number.isFinite(seed) ? seed : 0,
  };
}

/**
 * 링크 값이 하나도 없거나 깨졌을 때 쓰는 폴백 응답.
 * 결과 페이지가 빈 화면을 보이지 않게 한다.
 */
export const FALLBACK_ANSWERS: Answers = {
  situation: '취업준비생',
  age: '24-29',
  s1: '일자리',
  s2: '금융',
  s3: '심리',
  direction: '성장',
};

/** 링크만으로 처방전을 복원한다 (폰 결과 페이지용) */
export function restoreFromUrl(search: string): Prescription {
  const parsed = decodeResult(search);
  if (!parsed) return prescribe(FALLBACK_ANSWERS);

  const listed = parsed.policyIds
    .map((id) => POLICIES.find((p) => p.id === id)!)
    .filter(Boolean);

  // 링크에 담긴 계열·방향으로 처방전을 다시 지은 뒤,
  // 정책 목록만 링크에 실린 것으로 덮어써 태블릿 화면과 일치시킨다.
  const base = prescribe(
    {
      situation: parsed.situation,
      age: parsed.age,
      s1: parsed.main,
      s2: parsed.sub,
      s3: parsed.sub,
      direction: parsed.direction,
    },
    // 링크에 실린 seed 를 그대로 써야 태블릿과 처방명·명언이 일치한다.
    parsed.seed,
  );

  // 정책을 덮어쓸 때 이모지도 함께 다시 매겨야 카드와 아이콘이 어긋나지 않는다.
  return listed.length
    ? { ...base, policies: listed, policyEmojis: pickPolicyEmojis(listed, base.pillEmoji) }
    : base;
}
