import { useEffect, useRef, type ReactNode } from 'react';

/** 네이티브 dialog의 포커스 제한/복귀와 Escape 처리를 활용한다. */
export function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return <dialog ref={ref} className="enhance-dialog" aria-label={title} onCancel={(event) => { event.preventDefault(); onClose(); }}>
    {children}
  </dialog>;
}
