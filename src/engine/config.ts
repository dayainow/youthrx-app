/** 공개 결과 페이지 또는 같은 와이파이에서 접근 가능한 행사 서버의 /r 주소. */
export function getResultBase(): string {
  const configured = import.meta.env.VITE_RESULT_BASE?.trim();
  if (configured) {
    try {
      const url = new URL(configured);
      if (url.protocol === 'https:' || url.protocol === 'http:') return url.toString();
    } catch { /* 잘못된 설정은 현재 서버로 복구한다. */ }
  }
  return new URL('/r', window.location.origin).toString();
}
export function isLoopbackUrl(value: string): boolean {
  const host = new URL(value).hostname;
  return host === 'localhost' || host.endsWith('.localhost') || host.startsWith('127.') || host === '[::1]';
}
