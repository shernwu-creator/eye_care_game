import { useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  PauseIcon,
  PlayIcon,
  ResetIcon,
} from "./Icons";
import { DURATION_OPTIONS, formatTime } from "../lib/time";

function TimerRing({ remaining, total, status }) {
  const viewSize = 78;
  const radius = 33;
  const circumference = 2 * Math.PI * radius;
  const fraction = total > 0 ? Math.min(1, Math.max(0, remaining / total)) : 0;
  const minutesLeft = Math.ceil(remaining / 60);

  return (
    <div className={`timer-ring timer-ring--${status}`}>
      <svg viewBox={`0 0 ${viewSize} ${viewSize}`} role="presentation">
        <defs>
          <linearGradient id="timer-progress" x1="14" y1="10" x2="65" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d9ead0" />
            <stop offset=".55" stopColor="#b4d6b4" />
            <stop offset="1" stopColor="#7fae91" />
          </linearGradient>
        </defs>
        <circle cx="39" cy="39" r={radius} className="timer-ring__track" />
        <circle
          cx="39"
          cy="39"
          r={radius}
          className="timer-ring__progress"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
        />
      </svg>
      <span className="timer-ring__label">
        <strong>{minutesLeft}</strong>
        <small>MIN</small>
      </span>
    </div>
  );
}

export default function SessionDock({
  status,
  remaining,
  duration,
  onPrimary,
  onReset,
  onSelectDuration,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isBreak = status === "break" || status === "complete";

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const chooseDuration = (minutes) => {
    onSelectDuration(minutes);
    setMenuOpen(false);
  };

  const statusCopy = isRunning
    ? "跟隨柔光，自然眨眼。"
    : isPaused
      ? "練習已暫停，隨時可以繼續。"
      : isBreak
        ? "讓視線停留在遠方。"
        : "準備好，讓視線慢慢散步。";

  return (
    <section className="session-dock" aria-label="護眼練習計時器">
      <div className="timer-summary">
        <TimerRing remaining={remaining} total={duration * 60} status={status} />
        <div className="timer-copy">
          <span className="mini-label">本次專注</span>
          <div className="clock-line">
            <span className="clock-value" role="timer" aria-label={`剩餘時間 ${formatTime(remaining)}`}>
              {formatTime(remaining)}
            </span>
            <span className="clock-tag">{duration} MIN</span>
          </div>
          <p className="dock-caption">{statusCopy}</p>
        </div>
      </div>

      <span className="dock-divider" aria-hidden="true" />

      <div className="dock-controls">
        <button
          type="button"
          className="primary-button"
          onClick={onPrimary}
          disabled={isBreak}
        >
          <span className="primary-button__icon">
            {isRunning ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
          </span>
          {isRunning ? "暫停練習" : isPaused ? "繼續練習" : "開始練習"}
          <span className="primary-button__glow" aria-hidden="true" />
        </button>

        <div className="duration-wrap" ref={menuRef}>
          <button
            type="button"
            className={`duration-button ${menuOpen ? "is-open" : ""}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            disabled={isBreak}
          >
            <ClockIcon size={15} />
            <span>{duration} 分鐘</span>
            <ChevronDownIcon size={13} />
          </button>

          {menuOpen && (
            <div className="duration-menu" role="menu" aria-label="選擇專注時長">
              <div className="duration-menu__header">
                <span>專注時長</span>
                <small>FOCUS</small>
              </div>
              <div className="duration-menu__options">
                {DURATION_OPTIONS.map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    role="menuitemradio"
                    aria-checked={duration === minutes}
                    className={`duration-option ${duration === minutes ? "is-selected" : ""}`}
                    onClick={() => chooseDuration(minutes)}
                  >
                    <span>{minutes} 分鐘</span>
                    {minutes === 20 && <em>建議</em>}
                    {duration === minutes && <CheckIcon size={15} />}
                  </button>
                ))}
              </div>
              <p className="duration-menu__note">每 20 分鐘，讓眼睛遠眺 20 秒。</p>
              <p className="duration-menu__reset-note">變更時長會重新開始計時。</p>
            </div>
          )}
        </div>

        <button
          type="button"
          className="reset-button"
          onClick={onReset}
          aria-label="重新開始本輪計時"
          title="重新開始"
        >
          <ResetIcon size={18} />
        </button>
      </div>
    </section>
  );
}
