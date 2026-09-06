import type {
  Answers, Policy, Prescription, Scores, Series, AgeBand, Situation, Direction,
} from './types';
import { SERIES_LIST } from './types';
import { POLICIES } from './policies';
import { PILL_NAMES, COMFORT, QUOTES, SUB_LINE, DIRECTION_AFFINITY } from './content';

/**
 * 결정적 의사난수 (mulberry32).
 * 태블릿과 QR로 연결되는 폰 결과 페이지가 같은 처방명·명언을 보여줘야 하므로
 * Math.random() 을 쓰지 않고 응답값에서 만든 seed 로 뽑는다.
 */
function makeRng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/** 문자열 → 32bit 정수 해시 (seed 생성용) */
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seedFromAnswers(a: Answers): number {
  return hashString([a.situation, a.age, a.s1, a.s2, a.s3, a.direction].join('|'));
}

/**
 * 5절 — 점수 계산.
 * 4계열 0점에서 시작, S1 +2점, S2·S3 각 +1점.
 */
export function computeScores(a: Answers): Scores {
  const scores: Scores = { 주거: 0, 일자리: 0, 금융: 0, 심리: 0 };
  scores[a.s1] += 2;
  scores[a.s2] += 1;
  scores[a.s3] += 1;
  return scores;
}

/**
 * 5절 — 순위 결정.
 * 동점이면 ① S1이 고른 쪽, 그래도 같으면 ② R1과 어울리는 쪽 우선.
 * 그래도 같으면 SERIES_LIST 순서로 안정 정렬한다.
 */
export function rankSeries(scores: Scores, a: Answers): Series[] {
  const affinity = DIRECTION_AFFINITY[a.direction];
  return [...SERIES_LIST].sort((x, y) => {
    if (scores[y] !== scores[x]) return scores[y] - scores[x];
    // ① S1 우선
    if (x === a.s1) return -1;
    if (y === a.s1) return 1;
    // ② R1 방향과 어울리는 계열 우선
    if (x === affinity) return -1;
    if (y === affinity) return 1;
    return SERIES_LIST.indexOf(x) - SERIES_LIST.indexOf(y);
  });
}

/**
 * 7절 — 나이·상황으로 거르기.
 * 소득 조건은 부스에서 확인 불가하므로 필터에 쓰지 않는다.
 */
export function isEligible(p: Policy, age: AgeBand, situation: Situation): boolean {
  if (!p.ages.includes(age)) return false;
  if (p.situations && !p.situations.includes(situation)) return false;
  return true;
}

/**
 * 7절 — 추천 정책 고르기.
 * 메인 계열에서 자격 통과분을 R1 방향 일치 우선으로 정렬해 2~3개.
 * 부족하면 보조 계열 → 나머지 계열 순으로 채운다.
 */
export function pickPolicies(
  a: Answers,
  order: Series[],
  count = 3,
  pool: Policy[] = POLICIES,
): Policy[] {
  const direction: Direction = a.direction;

  const rank = (p: Policy) => (p.direction === direction ? 0 : 1);

  const fromSeries = (s: Series) =>
    pool
      .filter((p) => p.series === s && isEligible(p, a.age, a.situation))
      .sort((x, y) => rank(x) - rank(y) || x.id.localeCompare(y.id));

  const picked: Policy[] = [];
  for (const s of order) {
    for (const p of fromSeries(s)) {
      if (picked.length >= count) break;
      if (!picked.some((q) => q.id === p.id)) picked.push(p);
    }
    if (picked.length >= count) break;
  }

  // 자격 필터가 너무 빡빡해 2개 미만이면 나이 조건만 지키고 상황 조건을 푼다.
  if (picked.length < 2) {
    for (const s of order) {
      for (const p of pool.filter((q) => q.series === s && q.ages.includes(a.age))) {
        if (picked.length >= count) break;
        if (!picked.some((q) => q.id === p.id)) picked.push(p);
      }
      if (picked.length >= count) break;
    }
  }

  return picked.slice(0, count);
}

/**
 * 6절 — 처방전 한 장을 완성한다. 순수 함수, 네트워크·저장 없음.
 *
 * seedOverride 는 QR 링크로 넘어온 seed 를 그대로 쓰기 위한 것.
 * 폰 결과 페이지가 태블릿과 같은 처방명·명언을 보여주려면 반드시 필요하다.
 */
export function prescribe(a: Answers, seedOverride?: number): Prescription {
  const scores = computeScores(a);
  const order = rankSeries(scores, a);
  const main = order[0];
  const sub = order[1];

  const rng = makeRng(seedOverride ?? seedFromAnswers(a));
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length) % arr.length];

  // 이름과 이모지가 어긋나지 않도록 처방명 하나를 뽑아 함께 쓴다.
  const pill = pick(PILL_NAMES[main]);

  return {
    main,
    sub,
    scores,
    pillName: pill.name,
    pillEmoji: pill.emoji,
    comfort: pick(COMFORT[main]),
    quote: pick(QUOTES),
    subLine: SUB_LINE[sub],
    policies: pickPolicies(a, order),
  };
}
