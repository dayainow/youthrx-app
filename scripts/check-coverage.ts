/**
 * 처방 엔진 커버리지 점검 — `npx tsx scripts/check-coverage.ts`
 *
 * 부스에서 "처방 가능한 내역이 없습니다"가 뜨는 조합이 하나도 없어야 한다.
 * 정책 목록이나 자격 필터를 손볼 때마다 돌려보는 용도.
 */
import { prescribe } from '../src/engine/prescribe';
import { restoreFromUrl, buildQrUrl } from '../src/engine/qr';
import { SERIES_LIST, AGE_BANDS } from '../src/engine/types';
import type { Answers, Situation, Direction } from '../src/engine/types';

const SITUATIONS: Situation[] = ['학생', '취업준비생', '직장인', '프리랜서', '휴식'];
const DIRECTIONS: Direction[] = ['현금', '주거', '성장', '마음'];

/** 화면이 정책을 최소 몇 개는 보여줘야 하는지 */
const MIN_POLICIES = 2;

const failures: string[] = [];
let total = 0;
let thinnest = Infinity;

for (const situation of SITUATIONS)
  for (const age of AGE_BANDS)
    for (const s1 of SERIES_LIST)
      for (const s2 of SERIES_LIST)
        for (const s3 of SERIES_LIST)
          for (const direction of DIRECTIONS) {
            const answers: Answers = { situation, age, s1, s2, s3, direction };
            const p = prescribe(answers);
            const where = `${situation}/${age}/${s1}>${s2}>${s3}/${direction}`;
            total++;
            thinnest = Math.min(thinnest, p.policies.length);

            if (p.policies.length < MIN_POLICIES) {
              failures.push(`정책 ${p.policies.length}개 — ${where}`);
            }
            if (p.policyEmojis.length !== p.policies.length) {
              failures.push(`이모지 개수 불일치 — ${where}`);
            }
          }

// QR 로 넘어간 폰 화면이 태블릿과 같은 아이콘을 보여주는지 표본으로 확인한다.
for (const situation of SITUATIONS) {
  const answers: Answers = {
    situation,
    age: '24-29',
    s1: '주거',
    s2: '금융',
    s3: '심리',
    direction: '주거',
  };
  const tablet = prescribe(answers);
  const url = buildQrUrl('https://example.com/r', tablet, answers);
  const phone = restoreFromUrl(url.slice(url.indexOf('?')));

  if (JSON.stringify(tablet.policyEmojis) !== JSON.stringify(phone.policyEmojis)) {
    failures.push(`QR 복원 후 아이콘 불일치 — ${situation}`);
  }
}

console.log(`조합 ${total}개 검사, 최소 정책 수 ${thinnest}개`);

if (failures.length) {
  console.error(`\n실패 ${failures.length}건:`);
  failures.slice(0, 20).forEach((f) => console.error('  ' + f));
  process.exit(1);
}

console.log('통과 — 빈 처방전이 나오는 조합 없음');
