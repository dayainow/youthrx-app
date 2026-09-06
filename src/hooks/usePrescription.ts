import { useCallback, useMemo, useState } from 'react';
import { prescribe } from '../engine/prescribe';
import { QUESTION_ORDER } from '../engine/chatScript';
import type { Answers, Prescription } from '../engine/types';

export type { Policy, Series, Situation, AgeBand, Direction, Answers, Prescription } from '../engine/types';

/** 인트로(1) → 문항 6개(2~7) → 조제 중(8) → 결과(9) */
export const STEP_INTRO = 1;
export const STEP_FIRST_QUESTION = 2;
export const STEP_LAST_QUESTION = STEP_FIRST_QUESTION + QUESTION_ORDER.length - 1;
export const STEP_LOADING = STEP_LAST_QUESTION + 1;
export const STEP_RESULT = STEP_LOADING + 1;

/**
 * 부스 태블릿 진행 상태.
 * 개인정보를 받지 않으므로 이름·연락처 관련 상태가 없다.
 * 모든 답은 정해진 선택지 값이고 어디에도 저장하지 않는다.
 */
export const usePrescription = () => {
  const [step, setStep] = useState<number>(STEP_INTRO);
  const [answers, setAnswers] = useState<Partial<Answers>>({});

  const nextStep = useCallback(() => setStep((s) => s + 1), []);
  const prevStep = useCallback(
    () => setStep((s) => Math.max(STEP_INTRO, s - 1)),
    [],
  );

  const reset = useCallback(() => {
    setStep(STEP_INTRO);
    setAnswers({});
  }, []);

  /** 문항 하나에 답하고 다음 화면으로 넘어간다 */
  const answer = useCallback((key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((s) => s + 1);
  }, []);

  const isComplete = QUESTION_ORDER.every((q) => answers[q.key as keyof Answers]);

  /** 답이 다 모였을 때만 처방전을 짓는다. 순수 계산이라 네트워크가 필요 없다. */
  const prescription: Prescription | null = useMemo(
    () => (isComplete ? prescribe(answers as Answers) : null),
    [answers, isComplete],
  );

  return {
    step,
    setStep,
    nextStep,
    prevStep,
    reset,
    answers,
    answer,
    isComplete,
    prescription,
  };
};
