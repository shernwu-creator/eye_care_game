import { useEffect, useRef } from "react";
import GaborPatch from "../../components/GaborPatch";
import { CloseIcon, EyeIcon } from "../../components/Icons";

export default function TipsModal({ onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  return (
    <div className="gabor-tips-backdrop" onMouseDown={onClose}>
      <div
        className="gabor-tips"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gabor-tips-title"
        ref={dialogRef}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="gabor-tips__close"
          onClick={onClose}
          aria-label="關閉視覺訓練小知識"
          ref={closeRef}
        >
          <CloseIcon size={18} />
        </button>

        <div className="gabor-tips__art" aria-hidden="true">
          <GaborPatch angle={30} frequency={4.4} size={104} />
          <GaborPatch angle={120} frequency={5.4} size={64} />
        </div>

        <p className="gabor-eyebrow">TIPS &amp; INFO</p>
        <h2 id="gabor-tips-title">關於卡伯爾圖形</h2>
        <p className="gabor-tips__lead">
          卡伯爾圖形是透過特定的條紋頻率刺激大腦視覺皮層，藉由腦部訓練來改善視力模糊。
        </p>

        <div className="gabor-tips__facts">
          <span>
            <EyeIcon size={17} />
            條紋頻率
            <small>不同密度會刺激不同的視覺敏感度。</small>
          </span>
          <span>
            <i>◌</i>
            對比敏感度
            <small>柔和的黑白漸層讓眼睛練習辨識細節。</small>
          </span>
          <span>
            <i>↗</i>
            腦部訓練
            <small>持續、短時間的練習，比一次做很久更合適。</small>
          </span>
        </div>

        <p className="gabor-tips__note">
          訓練時請保持自然呼吸。如果出現頭暈、眼睛不適或頭痛，請立刻停止並諮詢專業醫療人員。
        </p>

        <button type="button" className="gabor-primary-button" onClick={onClose}>
          知道了
        </button>
      </div>
    </div>
  );
}
