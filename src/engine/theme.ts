import type { Series } from './types';

/**
 * 계열별 색 4가지 (구현안내서 10·11절).
 * 개발·디자인 공용 값이므로 여기서만 정의하고 화면들은 이 파일을 참조한다.
 * 디자인 확정 시 이 파일의 값만 바꾸면 태블릿·폰 결과지에 함께 반영된다.
 */
export interface SeriesTheme {
  label: string;
  emoji: string;
  /** 강조색 (제목·뱃지) */
  accent: string;
  /** 카드 배경 */
  bg: string;
  /** 테두리 */
  border: string;
}

export const SERIES_THEME: Record<Series, SeriesTheme> = {
  주거: {
    label: '주거',
    emoji: '🏠',
    accent: '#2F7D62',
    bg: '#EAF4EF',
    border: '#BFDDCE',
  },
  일자리: {
    label: '일자리',
    emoji: '💼',
    accent: '#2B5FA8',
    bg: '#EAF1FA',
    border: '#C2D6EE',
  },
  금융: {
    label: '금융',
    emoji: '💰',
    accent: '#B5731A',
    bg: '#FBF2E3',
    border: '#EBD6B0',
  },
  심리: {
    label: '심리',
    emoji: '💗',
    accent: '#A8456B',
    bg: '#FAECF1',
    border: '#EBC6D5',
  },
};
