import { useEffect, useRef, useState, type RefObject } from 'react';

export function useResultImage(ref: RefObject<HTMLDivElement | null>, fileName: string) {
  const [image, setImage] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [message, setMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const sharing = useRef(false);
  const [isSharing, setIsSharing] = useState(false);
  useEffect(() => {
    let disposed = false;
    let objectUrl: string | undefined;
    async function prepare() {
      try {
        await document.fonts.ready;
        const node = ref.current;
        if (!node) return;
        await Promise.all(Array.from(node.querySelectorAll('img')).map((img) => img.decode()));
        const { toBlob } = await import('html-to-image');
        const blob = await toBlob(node, { pixelRatio: 2, backgroundColor: '#FAF8F2', filter: (element) => !(element instanceof HTMLElement && element.hasAttribute('data-no-export')) });
        if (!blob) throw new Error('No image');
        if (disposed) return;
        objectUrl = URL.createObjectURL(blob);
        setImage({ blob, url: objectUrl });
      } catch { if (!disposed) setError(true); }
    }
    void prepare();
    return () => { disposed = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [ref, fileName, attempt]);
  function download() {
    if (!image) return;
    const link = document.createElement('a');
    link.download = fileName; link.href = image.url;
    document.body.appendChild(link); link.click(); link.remove();
    setShowPreview(true);
    setMessage('이미지 저장을 요청했어요. 다운로드·파일 앱을 확인해 주세요. 저장되지 않으면 아래 이미지를 길게 눌러주세요.');
  }
  async function copyLink() {
    try { await navigator.clipboard.writeText(window.location.href); setMessage('결과 링크를 복사했어요.'); }
    catch { setShowLink(true); setMessage('아래 주소를 길게 누르거나 선택해서 복사해 주세요.'); }
  }
  async function share() {
    if (sharing.current) return;
    if (!navigator.share) { await copyLink(); return; }
    sharing.current = true; setIsSharing(true);
    try {
      const file = image ? new File([image.blob], fileName, { type: 'image/png' }) : null;
      if (file && navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: '나의 마음약국 처방전' });
      else await navigator.share({ title: '나의 마음약국 처방전', url: window.location.href });
    } catch (err) {
      if (!(err instanceof Error && err.name === 'AbortError')) setMessage('공유창을 열지 못했어요. 이미지 저장이나 링크 복사를 이용해 주세요.');
    } finally { sharing.current = false; setIsSharing(false); }
  }
  return { image, error, retry: () => { setError(false); setImage(null); setAttempt((a) => a + 1); }, message, showPreview, showLink, isSharing, download, copyLink, share };
}
