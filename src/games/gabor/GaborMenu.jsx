import GaborPatch from "../../components/GaborPatch";
import { ArrowUpRightIcon, EyeIcon, PlayIcon } from "../../components/Icons";

const MODES = [
  {
    id: "tap",
    code: "A",
    english: "TAP TO MATCH",
    title: "圖樣配對消除",
    description: "在 4×4 的圖樣中，找出角度與粗細都與目標相同的一張。答對得分，答錯會扣一點時間。",
    patch: { angle: 25, frequency: 4.6 },
  },
  {
    id: "pairs",
    code: "B",
    english: "FIND PAIRS",
    title: "雙胞胎連連看",
    description: "翻開 16 張卡片，記住 8 對卡伯爾圖樣，把角度與頻率相同的雙胞胎配成對。",
    patch: { angle: 120, frequency: 5.2 },
  },
  {
    id: "relax",
    code: "C",
    english: "STARING RELAXATION",
    title: "靜態注視放鬆",
    description: "讓視線停在中央，隨著緩慢旋轉、呼吸的條紋放空。這是一場不用作答的視覺休息。",
    patch: { angle: 70, frequency: 3.6 },
  },
  {
    id: "tips",
    code: "D",
    english: "TIPS & INFO",
    title: "視覺訓練小知識",
    description: "卡伯爾圖形如何透過條紋頻率刺激視覺皮層？用一分鐘了解這套訓練背後的原理。",
    patch: { angle: 155, frequency: 4.8 },
    isInfo: true,
  },
];

export default function GaborMenu({ durationMinutes, onDurationChange, onLaunch, onOpenTips }) {
  return (
    <section className="gabor-menu-panel" aria-labelledby="gabor-menu-title">
      <span className="gabor-menu-panel__orb gabor-menu-panel__orb--one" aria-hidden="true" />
      <span className="gabor-menu-panel__orb gabor-menu-panel__orb--two" aria-hidden="true" />

      <header className="gabor-menu-head">
        <p className="gabor-eyebrow">
          <span className="gabor-eyebrow__line" />
          GABOR PATCH TRAINING
          <span className="gabor-eyebrow__line" />
        </p>
        <h1 id="gabor-menu-title">卡伯爾視覺訓練</h1>
        <p>
          用條紋頻率與柔和對比，陪視覺皮層做一場輕量而專注的訓練。
        </p>
      </header>

      <div className="gabor-duration">
        <div className="gabor-duration__copy">
          <span>訓練時間</span>
          <small>選擇一段不被打擾的時間</small>
        </div>

        <div className="gabor-duration__options" role="radiogroup" aria-label="選擇訓練時間">
          {[1, 2, 3].map((minutes) => {
            const selected = durationMinutes === minutes;
            return (
              <button
                key={minutes}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`gabor-duration-button ${
                  selected ? "is-selected bg-teal-300" : "bg-teal-50/80"
                }`}
                onClick={() => onDurationChange(minutes)}
              >
                <strong>{minutes}</strong>
                <span>分鐘</span>
              </button>
            );
          })}
        </div>

        <span className="gabor-duration__hint">A / B / C 三個訓練會依此時間倒數</span>
      </div>

      <div className="gabor-mode-grid">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className="gabor-mode-card bg-linear-to-br from-teal-100 to-teal-200 rounded-xl"
            onClick={() => (mode.isInfo ? onOpenTips() : onLaunch(mode.id))}
            aria-label={
              mode.isInfo
                ? "查看視覺訓練小知識"
                : `開始${mode.title}，訓練時間 ${durationMinutes} 分鐘`
            }
          >
            <span className="gabor-mode-card__top">
              <span className="gabor-mode-card__code">{mode.code}</span>
              <span className="gabor-mode-card__meta">
                {mode.isInfo ? "知識補給" : `${durationMinutes} 分鐘`}
              </span>
            </span>

            <span className="gabor-mode-card__art" aria-hidden="true">
              <GaborPatch
                angle={mode.patch.angle}
                frequency={mode.patch.frequency}
                size={84}
                contrast={0.9}
              />
            </span>

            <span className="gabor-mode-card__body">
              <span className="gabor-mode-card__english">{mode.english}</span>
              <span className="gabor-mode-card__title">{mode.title}</span>
              <span className="gabor-mode-card__description">{mode.description}</span>
            </span>

            <span className="gabor-mode-card__action" aria-hidden="true">
              {mode.isInfo ? <EyeIcon size={16} /> : <PlayIcon size={14} />}
            </span>
          </button>
        ))}
      </div>

      <footer className="gabor-menu-footer">
        <span>
          <i />
          建議在光線柔和的環境進行，每次訓練之間讓眼睛充分休息。
        </span>
        <span>
          GABOR PATCH · 05
          <ArrowUpRightIcon size={12} />
        </span>
      </footer>
    </section>
  );
}
