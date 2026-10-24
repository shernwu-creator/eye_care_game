import { ChevronLeftIcon } from "../../components/Icons";
import { formatTime } from "../../lib/time";

export default function SessionBar({
  title,
  english,
  secondsLeft,
  totalSeconds,
  onExit,
}) {
  const progress = Math.min(1, Math.max(0, 1 - secondsLeft / totalSeconds));

  return (
    <div className="gabor-session-top">
      <div className="gabor-session-top__row">
        <button type="button" className="gabor-exit" onClick={onExit}>
          <ChevronLeftIcon size={14} />
          訓練選單
        </button>

        <div className="gabor-session-title">
          <span>{english}</span>
          <h1>{title}</h1>
        </div>

        <div className="gabor-clock" role="timer" aria-label={`剩餘時間 ${formatTime(secondsLeft)}`}>
          <span>剩餘時間</span>
          <strong>{formatTime(secondsLeft)}</strong>
        </div>
      </div>

      <div className="gabor-progress" aria-hidden="true">
        <span style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}
