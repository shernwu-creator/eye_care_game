import { useEffect, useRef } from "react";
import { BrandMark, CloseIcon } from "./Icons";

export default function GuideDialog({ open, rounds, onClose }) {
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousFocus = document.activeElement;
    closeButtonRef.current?.focus({ preventScroll: true });
    document.body.classList.add("is-guide-open");

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
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
      document.body.classList.remove("is-guide-open");
      if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="guide-backdrop" onPointerDown={onClose}>
      <div
        className="guide-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        ref={dialogRef}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header className="guide-header">
          <div className="guide-brand">
            <BrandMark size={34} />
            <span>森息 · 使用指南</span>
          </div>
          <button
            type="button"
            className="guide-close"
            onClick={onClose}
            aria-label="關閉使用指南"
            ref={closeButtonRef}
          >
            <CloseIcon size={18} />
          </button>
        </header>

        <div className="guide-body">
          <p className="guide-eyebrow">THE 20 · 20 · 20 RULE</p>
          <h2 id="guide-title">
            給眼睛的
            <br />
            一段遠方。
          </h2>
          <p className="guide-intro">
            長時間近距離用眼，會讓睫狀肌持續緊繃。用三個「20」，讓緊繃有機會慢慢鬆開。
          </p>

          <div className="rule-grid">
            <div className="rule-card">
              <span className="rule-card__number">20</span>
              <span className="rule-card__unit">分鐘</span>
              <p>專注之後，離開螢幕。</p>
            </div>
            <div className="rule-card">
              <span className="rule-card__number">20</span>
              <span className="rule-card__unit">呎</span>
              <p>望向約 6 公尺外的遠方。</p>
            </div>
            <div className="rule-card">
              <span className="rule-card__number">20</span>
              <span className="rule-card__unit">秒</span>
              <p>停留、眨眼，讓視線休息。</p>
            </div>
          </div>

          <div className="guide-divider" />

          <div className="guide-how">
            <span className="guide-section-label">怎麼練習</span>
            <ol>
              <li>
                <span>01</span>
                按下「開始練習」，讓目光輕柔地跟著光點移動。
              </li>
              <li>
                <span>02</span>
                20 分鐘後，畫面會暫停並引導你遠眺 20 秒。
              </li>
              <li>
                <span>03</span>
                自然呼吸、自然眨眼，不需要用力盯著光點。
              </li>
            </ol>
          </div>

          <div className="guide-footer">
            <p>
              今日已完成 <strong>{rounds}</strong> 輪遠眺
              <span> · 紀錄只儲存在這台裝置</span>
            </p>
            <button type="button" className="guide-done" onClick={onClose}>
              回到森息
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
