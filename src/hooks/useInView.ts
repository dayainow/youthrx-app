import { useEffect, useRef, useState } from 'react';

/**
 * 요소가 화면에 들어오면 true 로 바뀐다. 한 번 보이면 계속 true 를 유지한다.
 * 성분 분석표 막대가 스크롤을 내려 실제로 보이는 순간 차오르게 하려고 쓴다.
 */
export function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 옵저버가 없는 환경에서는 애니메이션을 건너뛰고 바로 보여준다.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
