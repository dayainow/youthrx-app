import { useCallback, useMemo, useReducer } from 'react';
import { prescribe } from '../engine/prescribe';
import { QUESTION_ORDER } from '../engine/chatScript';
import { koreanDate } from '../engine/dates';
import type { Answers, Prescription } from '../engine/types';
export type { Policy, Series, Situation, AgeBand, Direction, Answers, Prescription } from '../engine/types';

export const STEP_INTRO = 1;
export const STEP_FIRST_QUESTION = 2;
export const STEP_LAST_QUESTION = STEP_FIRST_QUESTION + QUESTION_ORDER.length - 1;
export const STEP_LOADING = STEP_LAST_QUESTION + 1;
export const STEP_RESULT = STEP_LOADING + 1;
export interface FlowState { step: number; answers: Partial<Answers>; issuedOn: string }
export type FlowAction = { type: 'next'; today: string } | { type: 'previous' } | { type: 'reset' } | { type: 'answer'; key: string; value: string };
export const initialFlow: FlowState = { step: STEP_INTRO, answers: {}, issuedOn: '' };
export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'reset': return initialFlow;
    case 'next':
      if (state.step === STEP_INTRO) return { step: STEP_FIRST_QUESTION, answers: {}, issuedOn: action.today };
      if (state.step === STEP_LOADING) return { ...state, step: STEP_RESULT };
      return state;
    case 'previous': return state.step >= STEP_FIRST_QUESTION && state.step <= STEP_LAST_QUESTION ? { ...state, step: state.step - 1 } : state;
    case 'answer': {
      const question = QUESTION_ORDER[state.step - STEP_FIRST_QUESTION];
      if (!question || question.key !== action.key || !question.choices.some((choice) => choice.value === action.value)) return state;
      return { ...state, answers: { ...state.answers, [action.key]: action.value }, step: state.step + 1 };
    }
  }
}
export function usePrescription() {
  const [state, dispatch] = useReducer(flowReducer, initialFlow);
  const nextStep = useCallback(() => dispatch({ type: 'next', today: koreanDate() }), []);
  const prevStep = useCallback(() => dispatch({ type: 'previous' }), []);
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);
  const answer = useCallback((key: string, value: string) => dispatch({ type: 'answer', key, value }), []);
  const isComplete = QUESTION_ORDER.every((q) => state.answers[q.key as keyof Answers]);
  const prescription: Prescription | null = useMemo(() => isComplete ? prescribe(state.answers as Answers, undefined, state.issuedOn) : null, [state.answers, state.issuedOn, isComplete]);
  return { ...state, nextStep, prevStep, reset, answer, isComplete, prescription };
}
