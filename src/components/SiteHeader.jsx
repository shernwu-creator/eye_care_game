import { ArrowUpRightIcon, BrandMark } from "./Icons";

const STATUS_LABELS = {
  idle: "準備開始",
  running: "練習進行中",
  paused: "練習已暫停",
  break: "遠眺休息中",
  complete: "遠眺完成",
};

export default function SiteHeader({ status, rounds, onOpenGuide }) {
  return (
    <header className="site-header">
      <div className="brand" aria-label="森息 MORI EYE 護眼練習">
        <span className="brand__mark">
          <BrandMark size={44} />
        </span>
        <span className="brand__copy">
          <span className="brand__name">
            森息
            <span className="brand__roman">MORI EYE</span>
          </span>
          <span className="brand__tagline">護眼練習 · EYE CARE</span>
        </span>
      </div>

      <div className="header-actions">
        <span className="today-count">
          今日已完成 <b>{rounds}</b> 輪
        </span>
        <span className={`practice-status practice-status--${status}`}>
          <i className="practice-status__dot" />
          {STATUS_LABELS[status] ?? STATUS_LABELS.idle}
        </span>
        <button className="law-button" type="button" onClick={onOpenGuide}>
          <span>20·20·20 法則</span>
          <ArrowUpRightIcon size={13} />
        </button>
      </div>
    </header>
  );
}
