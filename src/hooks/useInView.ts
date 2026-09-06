import { useEffect, useRef, useState } from 'react';

/**
 * 요소를 감싸는 가장 가까운 스크롤 컨테이너. 실제로 넘치는 것만 인정한다.
 * overflow-y-auto 라도 내용이 짧아 스크롤이 없으면 root 로 삼을 이유가 없다.
 */
function scrollParent(el: HTMLElement): HTMLElement | null {
  let node = el.parentElement;
  while (node) {
    const { overflowY } = getComputedStyle(node);
    const scrollable = overflowY === 'auto' || overflowY === 'scroll';
    if (scrollable && node.scrollHeight > node.clientHeight) return node;
    node = node.parentElement;
  }
  return null;
}

/**
 * 요소가 화면에 들어오면 true 로 바뀐다. 한 번 보이면 계속 true 를 유지한다.
 * 성분 분석표 막대가 스크롤을 내려 실제로 보이는 순간 차오르게 하려고 쓴다.
 *
 * 결과지는 뷰포트가 아니라 안쪽 div 가 스크롤되므로 그 컨테이너를 root 로 잡아야
 * 한다. 뷰포트 기준으로 보면 컨테이너가 처음부터 보이는 탓에 스크롤하기도 전에
 * 교차로 판정돼 애니메이션이 지나가 버린다.
 */
export function useInView<T extends HTMLElement>(threshold = 0.35) {
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

    // 0% 인 상태가 한 프레임은 그려져야 브라우저가 transition 을 잡는다.
    const start = () =>
      requestAnimationFrame(() => requestAnimationFrame(() => setInView(true)));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        start();
      },
      { root: scrollParent(el), threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
