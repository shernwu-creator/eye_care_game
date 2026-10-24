import { useEffect, useRef } from "react";
import { CheckIcon, ClockIcon } from "../../components/Icons";

export default function SessionResult({
  title,
  description,
  stats = [],
  onRetry,
  onExit,
  success = false,
}) {
  const dialogRef = useRef(null);
  const retryRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    retryRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event) => {
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
    <div
      className="gabor-result-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gabor-result-title"
      ref={dialogRef}
    >
      <div className="gabor-result-card">
        <span className={`gabor-result-mark ${success ? "is-success" : ""}`}>
          {success ? <CheckIcon size={23} /> : <ClockIcon size={23} />}
        </span>
        <p className="gabor-eyebrow">{success ? "BEAUTIFULLY DONE" : "TIME IS UP"}</p>
        <h2 id="gabor-result-title">{title}</h2>
        <p className="gabor-result-copy">{description}</p>

        {stats.length > 0 && (
          <div className="gabor-result-stats">
            {stats.map((stat) => (
              <span key={stat.label}>
                <small>{stat.label}</small>
                <strong>{stat.value}</strong>
              </span>
            ))}
          </div>
        )}

        <div className="gabor-result-actions">
          <button type="button" className="gabor-primary-button" onClick={onRetry} ref={retryRef}>
            再玩一次
          </button>
          <button type="button" className="gabor-text-button" onClick={onExit}>
            回到訓練選單
          </button>
        </div>
      </div>
    </div>
  );
}
