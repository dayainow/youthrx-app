/**
 * 결과 페이지 주소 (구현안내서 11절 — 개발자 결정 사항).
 *
 * 행사 전에 한 번 배포해두는 폰용 결과 페이지의 주소.
 * 태블릿은 오프라인이지만 이 주소 뒤에 결과값만 붙여 QR 그림을 그리므로
 * 네트워크가 필요 없다. 배포 주소가 정해지면 .env 의
 * VITE_RESULT_BASE 로 덮어쓸 수 있다.
 */
export const RESULT_BASE: string =
  import.meta.env?.VITE_RESULT_BASE ?? 'https://youthrx-result.netlify.app/r';
