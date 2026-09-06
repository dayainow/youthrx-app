import type { Policy } from '../engine/types';
import { policyAvailability } from '../engine/availability';

export function PolicyInfo({ policy }: { policy: Policy }) {
  return <div className="mt-4 pt-3 border-t border-[#E8E1D5] text-[13px] leading-relaxed text-[#555]">
    <p className="font-bold text-[#3E3A39]">{policy.title}</p>
    <p className="text-[#8B4513] mt-1">{policyAvailability(policy).label} · {policy.period}</p>
    <p className="mt-2">{policy.reason} 추천해요.</p>
    <p className="mt-2"><strong>대상 조건</strong> · {policy.target}</p>
    {policy.eligibilityNote && <p className="mt-2 text-[#8B4513]">{policy.eligibilityNote}</p>}
    {policy.checkedAt && <p className="mt-2 text-xs text-[#7F8C8D]">공식 안내 확인 · {policy.checkedAt}</p>}
    <p className="mt-2 text-xs text-[#7F8C8D]">거주지·소득 등 세부 조건은 공식 공고에서 확인해 주세요.</p>
  </div>;
}
