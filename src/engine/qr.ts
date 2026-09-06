import type { Answers, Prescription, Situation, Direction } from './types';
import { SERIES_LIST, AGE_BANDS } from './types';
import { POLICIES } from './policies';
import { prescribe, pickPolicyEmojis } from './prescribe';
import { isDate } from './dates';

// 행사 배포본의 문구/정책 ID와 함께 고정한다. 구버전을 다른 결과로 바꾸지 않는다.
export const RESULT_VERSION = '2';
export const CONTENT_VERSION = '2026-09-festival';
const SITUATIONS: Situation[] = ['학생', '취업준비생', '직장인', '프리랜서', '휴식'];
const DIRECTIONS: Direction[] = ['현금', '주거', '성장', '마음'];
export interface ResultParams { answers: Answers; policyIds: string[]; issuedOn: string }

/** 원래 6개 답변을 숫자로 전달해 점수, 동점 순위, 문구 seed를 보존한다. */
export function encodeResult(p: Prescription, a: Answers): string {
  return new URLSearchParams({
    v: RESULT_VERSION, cv: CONTENT_VERSION,
    q: [SITUATIONS.indexOf(a.situation), AGE_BANDS.indexOf(a.age),
      SERIES_LIST.indexOf(a.s1), SERIES_LIST.indexOf(a.s2), SERIES_LIST.indexOf(a.s3),
      DIRECTIONS.indexOf(a.direction)].join(''),
    p: p.policies.map((policy) => policy.id).join(','), d: p.issuedOn,
  }).toString();
}
export function buildQrUrl(base: string, p: Prescription, a: Answers): string {
  const url = new URL(base);
  url.hash = '';
  new URLSearchParams(encodeResult(p, a)).forEach((value, key) => url.searchParams.set(key, value));
  return url.toString();
}
export function decodeResult(search: string): ResultParams | null {
  const q = new URLSearchParams(search);
  if (['v', 'cv', 'q', 'p', 'd'].some((key) => q.getAll(key).length !== 1)) return null;
  if (q.get('v') !== RESULT_VERSION || q.get('cv') !== CONTENT_VERSION) return null;
  const values = q.get('q') ?? '';
  if (!/^[0-4][0-3]{5}$/.test(values)) return null;
  const [s, a, s1, s2, s3, direction] = [...values].map(Number);
  const policyIds = (q.get('p') ?? '').split(',');
  if (policyIds.length < 1 || policyIds.length > 3 || new Set(policyIds).size !== policyIds.length ||
      policyIds.some((id) => !POLICIES.some((p) => p.id === id))) return null;
  const issuedOn = q.get('d') ?? '';
  if (!isDate(issuedOn)) return null;
  return {
    answers: { situation: SITUATIONS[s], age: AGE_BANDS[a], s1: SERIES_LIST[s1],
      s2: SERIES_LIST[s2], s3: SERIES_LIST[s3], direction: DIRECTIONS[direction] },
    policyIds, issuedOn,
  };
}
/** 잘못된 링크는 임의의 결과로 대체하지 않는다. */
export function restoreFromUrl(search: string): Prescription | null {
  const parsed = decodeResult(search);
  if (!parsed) return null;
  const base = prescribe(parsed.answers, undefined, parsed.issuedOn);
  const policies = parsed.policyIds.map((id) => POLICIES.find((p) => p.id === id)!);
  return { ...base, policies, policyEmojis: pickPolicyEmojis(policies, base.pillEmoji) };
}
