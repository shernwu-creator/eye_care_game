import { Link } from "react-router-dom";
import { ArrowUpRightIcon, BrandMark, ChevronLeftIcon } from "./Icons";

export default function GameHeader({
  title,
  english,
  statusLabel,
  statusTone = "idle",
  meta,
  actionLabel,
  onAction,
}) {
  return (
    <header className="site-header game-header">
      <div className="game-header__left">
        <Link className="game-back" to="/" aria-label="回到遊戲選集">
          <ChevronLeftIcon size={14} />
          <span>選集</span>
        </Link>
        <span className="game-header__rule" aria-hidden="true" />
        <div className="brand" aria-label={`森息 MORI EYE · ${title}`}>
          <span className="brand__mark">
            <BrandMark size={42} />
          </span>
          <span className="brand__copy">
            <span className="brand__name">
              森息
              <span className="brand__roman">MORI EYE</span>
            </span>
            <span className="brand__tagline">
              {title}
              {english ? ` · ${english}` : ""}
            </span>
          </span>
        </div>
      </div>

      <div className="header-actions">
        {meta && <span className="today-count">{meta}</span>}
        {statusLabel && (
          <span className={`practice-status practice-status--${statusTone}`}>
            <i className="practice-status__dot" />
            {statusLabel}
          </span>
        )}
        {actionLabel && onAction && (
          <button className="law-button" type="button" onClick={onAction}>
            <span>{actionLabel}</span>
            <ArrowUpRightIcon size={13} />
          </button>
        )}
      </div>
    </header>
  );
}
