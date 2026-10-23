import { useEffect, useRef } from "react";
import { ArrowUpRightIcon, BrandMark, CheckIcon } from "./Icons";
import { BREAK_SECONDS } from "../lib/time";

function BreakDial({ seconds }) {
  const radius = 92;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.min(1, Math.max(0, seconds / BREAK_SECONDS));

  return (
    <div className="break-dial" aria-hidden="true">
      <span className="break-dial__pulse break-dial__pulse--one" />
      <span className="break-dial__pulse break-dial__pulse--two" />
      <span className="break-dial__halo" />
      <svg viewBox="0 0 220 220">
        <defs>
          <linearGradient id="break-progress" x1="38" y1="22" x2="186" y2="201" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d9ead2" />
            <stop offset=".52" stopColor="#afd4b4" />
            <stop offset="1" stopColor="#719d84" />
          </linearGradient>
        </defs>
        <circle cx="110" cy="110" r={radius} className="break-dial__track" />
        <circle
          cx="110"
          cy="110"
          r={radius}
          className="break-dial__progress"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
        />
      </svg>
      <span className="break-dial__value">
        <strong>{String(seconds).padStart(2, "0")}</strong>
        <small>SECONDS</small>
      </span>
    </div>
  );
}

export default function BreakOverlay({ status, seconds, rounds, onContinue, onRest }) {
  const overlayRef = useRef(null);
  const isComplete = status === "complete";

  useEffect(() => {
    const previousFocus = document.activeElement;
    overlayRef.current?.focus({ preventScroll: true });
    document.body.classList.add("is-break-open");

    return () => {
      document.body.classList.remove("is-break-open");
      if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Tab" || !overlayRef.current) return;

      const focusable = overlayRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (focusable.length === 0) {
        event.preventDefault();
        overlayRef.current.focus({ preventScroll: true });
        return;
      }

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
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isComplete]);

  return (
    <div
      className={`break-overlay ${isComplete ? "is-complete" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="break-title"
      aria-describedby="break-description"
      tabIndex={-1}
      ref={overlayRef}
    >
      <div className="break-overlay__wash" aria-hidden="true" />
      <div className="break-overlay__halo" aria-hidden="true" />
      <div className="break-overlay__grain" aria-hidden="true" />

      <header className="break-header">
        <span className="break-brand">
          <BrandMark size={32} />
          <span>森息</span>
        </span>
        <span className="break-header__mode">EYE BREAK · 20 SEC</span>
      </header>

      <span className="sr-only" aria-live="polite">
        {isComplete ? "遠眺休息完成" : "遠眺休息開始，倒數 20 秒"}
      </span>

      <main className="break-content">
        {!isComplete ? (
          <>
            <p className="break-kicker">
              <span className="break-kicker__line" />
              視線休息
              <span className="break-kicker__line" />
            </p>

            <h2 id="break-title" className="break-title">
              請看向 <em>20 呎</em>外的遠方
            </h2>
            <p className="break-description" id="break-description">
              把視線輕輕交給窗外最遠的地方，不必用力看清。
            </p>

            <BreakDial seconds={seconds} />

            <div className="breath-guide" aria-hidden="true">
              <span className="breath-guide__dot" />
              吸氣，慢慢吐氣
            </div>

            <p className="break-tip">肩膀放鬆，自然眨眼。倒數結束後，我們再一起出發。</p>
          </>
        ) : (
          <div className="break-complete">
            <span className="complete-mark">
              <span className="complete-mark__ring" />
              <CheckIcon size={26} />
            </span>
            <p className="break-kicker">
              <span className="break-kicker__line" />
              20 秒遠眺完成
              <span className="break-kicker__line" />
            </p>
            <h2 id="break-title" className="break-title break-title--complete">
              視線，回來了。
            </h2>
            <p className="break-description" id="break-description">
              眼睛已經準備好下一段旅程。準備好時，再跟著柔光慢慢走。
            </p>
            <div className="rounds-summary">
              <span>今日已完成</span>
              <strong>{rounds}</strong>
              <span>輪遠眺</span>
            </div>
            <div className="break-actions">
              <button type="button" className="break-primary" onClick={onContinue} autoFocus>
                開始下一輪
                <ArrowUpRightIcon size={15} />
              </button>
              <button type="button" className="break-secondary" onClick={onRest}>
                先休息一下
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="break-footer">
        <span>20 FT · 約 6 公尺</span>
        <span className="break-footer__rule" />
        <span>LOOK FAR · BLINK SOFTLY</span>
      </footer>
    </div>
  );
}
