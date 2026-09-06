import assert from 'node:assert/strict';
import { prescribe, isEligible, pickPolicies } from '../src/engine/prescribe';
import { restoreFromUrl, buildQrUrl, encodeResult } from '../src/engine/qr';
import { SERIES_LIST, AGE_BANDS } from '../src/engine/types';
import type { Answers, Situation, Direction } from '../src/engine/types';
import { POLICIES } from '../src/engine/policies';
import { policyAvailability } from '../src/engine/availability';
import { koreanDate, isDate } from '../src/engine/dates';
import { flowReducer, initialFlow, STEP_LOADING, STEP_RESULT } from '../src/hooks/usePrescription';
import { idleRemaining } from '../src/hooks/useIdleReset';

const situations: Situation[] = ['학생', '취업준비생', '직장인', '프리랜서', '휴식'];
const directions: Direction[] = ['현금', '주거', '성장', '마음'];
const today = '2026-09-07';
let total = 0;
let longestQr = 0;
for (const situation of situations)
  for (const age of AGE_BANDS)
    for (const s1 of SERIES_LIST)
      for (const s2 of SERIES_LIST)
        for (const s3 of SERIES_LIST)
          for (const direction of directions) {
            const answers: Answers = { situation, age, s1, s2, s3, direction };
            const kiosk = prescribe(answers, undefined, today);
            assert.ok(kiosk.policies.length >= 2 && kiosk.policies.length <= 3);
            assert.equal(Object.values(kiosk.scores).reduce((a, b) => a + b), 4);
            assert.equal(new Set(kiosk.policies.map((p) => p.id)).size, kiosk.policies.length);
            kiosk.policies.forEach((p) => {
              assert.ok(isEligible(p, age, situation), p.id);
              assert.notEqual(policyAvailability(p, today).state, 'closed');
            });
            const url = buildQrUrl('https://example.com/r', kiosk, answers);
            const mobile = restoreFromUrl(new URL(url).search);
            assert.deepEqual(mobile, kiosk, `QR 불일치: ${JSON.stringify(answers)}`);
            longestQr = Math.max(longestQr, url.length);
            total++;
          }
console.log(`${total}개 응답 조합: 정책 자격·개수, QR 전체 결과·점수·문구·발급일 일치 통과 (최장 URL ${longestQr}자)`);

const a: Answers = { situation: '학생', age: '24-29', s1: '주거', s2: '금융', s3: '심리', direction: '주거' };
const p = prescribe(a, undefined, today);
const valid = encodeResult(p, a);
for (const invalid of ['', '?c=주거&r=주거', valid + '&q=000000', valid + '&v=2', valid.replace('v=2', 'v=9'), valid.replace('2026-09-festival', 'unknown')]) {
  assert.equal(restoreFromUrl(invalid), null);
}
for (const [key, value] of [['q', '00000'], ['q', '999999'], ['q', '-11111'], ['p', ''], ['p', 'BAD'], ['p', 'HS02,HS02'], ['p', 'HS01,HS02,HS03,HS04'], ['d', '2026-02-30']]) {
  const params = new URLSearchParams(valid); params.set(key, value);
  assert.equal(restoreFromUrl(params.toString()), null, `${key}=${value}`);
}
const baseWithQuery = new URL(buildQrUrl('https://example.com/r?venue=mapo&q=old#section', p, a));
assert.equal(baseWithQuery.searchParams.get('venue'), 'mapo');
assert.equal(baseWithQuery.searchParams.getAll('q').length, 1);
assert.equal(baseWithQuery.hash, '');
assert.deepEqual(restoreFromUrl(baseWithQuery.search), p);
assert.equal(koreanDate(new Date('2026-09-06T16:00:00Z')), today);
assert.equal(isDate('2026-02-30'), false);
assert.equal(isDate('2028-02-29'), true);

const closed = POLICIES.find((p) => p.id === 'HS01')!;
assert.equal(policyAvailability(closed, '2026-05-05').state, 'upcoming');
assert.equal(policyAvailability(closed, '2026-05-06').state, 'open');
assert.equal(policyAvailability(closed, '2026-05-19').state, 'open');
assert.equal(policyAvailability(closed, '2026-05-20').state, 'closed');
// No silent relaxation of situation/age eligibility to pad the result.
const unsuitable = { ...POLICIES[0], applicationWindow: undefined, situations: ['직장인'] as Situation[] };
assert.deepEqual(pickPolicies(a, [...SERIES_LIST], 3, [unsuitable], today), []);
const openPolicy = { ...POLICIES[1], id: 'OPEN', applicationWindow: { start: today, end: today } };
const unknownPolicy = { ...POLICIES[1], id: 'UNKNOWN', applicationWindow: undefined };
assert.equal(pickPolicies(a, [...SERIES_LIST], 1, [unknownPolicy, openPolicy], today)[0].id, 'OPEN');

let flow = flowReducer(initialFlow, { type: 'next', today });
assert.equal(flowReducer(flow, { type: 'next', today }), flow, '시작 버튼 연타 방지');
assert.equal(flowReducer(flow, { type: 'answer', key: 'age', value: '24-29' }), flow);
flow = flowReducer(flow, { type: 'answer', key: 'situation', value: '학생' });
assert.equal(flowReducer(flow, { type: 'answer', key: 'situation', value: '학생' }), flow, '선택지 연타 방지');
flow = flowReducer(flow, { type: 'previous' });
assert.equal(flow.answers.situation, '학생');
flow = flowReducer(flow, { type: 'answer', key: 'situation', value: '직장인' });
assert.equal(flow.answers.situation, '직장인');
for (const [key, value] of Object.entries(a).filter(([key]) => key !== 'situation')) flow = flowReducer(flow, { type: 'answer', key, value });
assert.equal(flow.step, STEP_LOADING);
flow = flowReducer(flow, { type: 'next', today });
assert.equal(flow.step, STEP_RESULT);
assert.deepEqual(flowReducer(flow, { type: 'reset' }), initialFlow);
assert.equal(idleRemaining(89_999), null);
assert.equal(idleRemaining(90_000), 30);
assert.equal(idleRemaining(119_999), 1);
assert.equal(idleRemaining(120_000), 0);
console.log('잘못된 QR·날짜·모집 경계·중복 입력·이전 답변 수정·초기화·미사용 시간 검사 통과');
