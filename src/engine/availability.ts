import { koreanDate } from './dates';
import type { Policy } from './types';

export function policyAvailability(policy: Policy, today = koreanDate()) {
  const window = policy.applicationWindow;
  if (!window) return { state: 'check', label: '모집 공고 확인', priority: 1 } as const;
  if (today < window.start) return { state: 'upcoming', label: '모집 예정', priority: 2 } as const;
  if (today > window.end) return { state: 'closed', label: '해당 모집 종료', priority: 3 } as const;
  return { state: 'open', label: '접수 기간 · 마감 확인', priority: 0 } as const;
}
