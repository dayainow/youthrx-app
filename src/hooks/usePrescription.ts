import { useState } from 'react';
import policiesData from '../data/policies.json';

export type UserEmotion = '완벽해' | '그저 그래' | '지쳤어' | '우울해';
export type UserState = '대학생' | '취업준비생' | '직장인' | '프리랜서' | '휴식';
export type UserConcern = '취업' | '주거' | '금융' | '마음';

export interface Policy {
  id: string;
  pill_name: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  url: string;
}

export const usePrescription = () => {
  const [step, setStep] = useState<number>(1);
  const [userEmotion, setUserEmotion] = useState<UserEmotion | null>(null);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [userConcern, setUserConcern] = useState<UserConcern | null>(null);
  const [prescribedPolicies, setPrescribedPolicies] = useState<Policy[]>([]);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(1, s - 1));
  const reset = () => {
    setStep(1);
    setUserEmotion(null);
    setUserState(null);
    setUserConcern(null);
    setPrescribedPolicies([]);
  };

  const getPrescription = (concern: UserConcern, state: UserState, _emotion: UserEmotion) => {
    let matched = policiesData.filter(p => p.tags.includes(concern));
    
    if (matched.length === 0) {
      matched = policiesData;
    }

    matched.sort((a, b) => {
      const aMatch = a.tags.includes(state) ? 1 : 0;
      const bMatch = b.tags.includes(state) ? 1 : 0;
      return bMatch - aMatch;
    });

    setPrescribedPolicies(matched.slice(0, 2));
    nextStep();
  };

  return {
    step,
    nextStep,
    prevStep,
    reset,
    userEmotion,
    setUserEmotion,
    userState,
    setUserState,
    userConcern,
    setUserConcern,
    getPrescription,
    prescribedPolicies,
    setStep
  };
};
