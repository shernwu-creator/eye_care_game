import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AmbientScene from "../../components/AmbientScene";
import FlowerHead from "../../components/FlowerHead";
import GameHeader from "../../components/GameHeader";
import { ArrowUpRightIcon, EyeIcon, PauseIcon, PlayIcon } from "../../components/Icons";
import { formatTime } from "../../lib/time";

const SESSION_SECONDS = 60;

const STATUS_LABELS = {
  idle: "準備開始",
  running: "花園生長中",
  paused: "練習已暫停",
  complete: "花園盛開",
};

const FLOWER_SPOTS = [
  { x: 50, y: 79, scale: 1.08, rotate: -2, tone: 1 },
  { x: 40, y: 81, scale: 0.9, rotate: -7, tone: 0 },
  { x: 60, y: 80, scale: 0.95, rotate: 6, tone: 2 },
  { x: 32, y: 75, scale: 0.8, rotate: -10, tone: 2 },
  { x: 69, y: 74, scale: 1, rotate: 9, tone: 0 },
  { x: 46, y: 70, scale: 1.04, rotate: -4, tone: 2 },
  { x: 55, y: 67, scale: 0.85, rotate: 3, tone: 0 },
  { x: 25, y: 68, scale: 0.75, rotate: -14, tone: 1 },
  { x: 76, y: 66, scale: 0.8, rotate: 13, tone: 1 },
  { x: 36, y: 62, scale: 0.9, rotate: -8, tone: 0 },
  { x: 64, y: 59, scale: 0.85, rotate: 7, tone: 1 },
  { x: 50, y: 56, scale: 1, rotate: 0, tone: 2 },
  { x: 20, y: 61, scale: 0.7, rotate: -16, tone: 0 },
  { x: 81, y: 58, scale: 0.7, rotate: 15, tone: 2 },
  { x: 43, y: 54, scale: 0.78, rotate: -5, tone: 1 },
  { x: 57, y: 50, scale: 0.8, rotate: 4, tone: 0 },
  { x: 31, y: 50, scale: 0.68, rotate: -12, tone: 2 },
  { x: 70, y: 46, scale: 0.72, rotate: 10, tone: 1 },
  { x: 49, y: 44, scale: 0.9, rotate: 0, tone: 0 },
  { x: 25, y: 42, scale: 0.62, rotate: -15, tone: 2 },
  { x: 76, y: 39, scale: 0.65, rotate: 14, tone: 0 },
  { x: 39, y: 40, scale: 0.7, rotate: -7, tone: 1 },
  { x: 61, y: 36, scale: 0.68, rotate: 6, tone: 2 },
  { x: 16, y: 48, scale: 0.6, rotate: -18, tone: 1 },
  { x: 85, y: 49, scale: 0.6, rotate: 18, tone: 1 },
  { x: 50, y: 33, scale: 0.75, rotate: 0, tone: 1 },
  { x: 31, y: 33, scale: 0.6, rotate: -10, tone: 0 },
  { x: 69, y: 30, scale: 0.6, rotate: 10, tone: 2 },
  { x: 43, y: 27, scale: 0.58, rotate: -4, tone: 2 },
  { x: 57, y: 24, scale: 0.55, rotate: 4, tone: 1 },
];

const BLINK_MESSAGES = [
  "第一朵花，醒了。",
  "很好，輕輕眨眼，讓視線保持濕潤。",
  "再慢慢眨一下，不必用力。",
  "花園正在慢慢長大。",
  "眼睛喜歡這種輕柔的節奏。",
  "讓肩膀放鬆，繼續慢慢呼吸。",
];

function getBlinkMessage(count) {
  return BLINK_MESSAGES[(count - 1) % BLINK_MESSAGES.length];
}

export default function BlinkGame() {
  const [status, setStatus] = useState("idle");
  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);
  const [blinks, setBlinks] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  const [feedback, setFeedback] = useState("");
  const deadlineRef = useRef(null);
  const statusRef = useRef(status);
  const blinksRef = useRef(0);

  const isRunning = status === "running";
  const isComplete = status === "complete";
  const visibleFlowers = FLOWER_SPOTS.slice(0, Math.min(blinks, FLOWER_SPOTS.length));
  const progress = Math.min(1, Math.max(0, (SESSION_SECONDS - secondsLeft) / SESSION_SECONDS));

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    document.title = "眨眼花園 · 森息";
  }, []);

  useEffect(() => {
    if (!isRunning) return undefined;

    const tick = () => {
      if (deadlineRef.current === null) return;
      const millisecondsLeft = deadlineRef.current - Date.now();

      if (millisecondsLeft <= 0) {
        deadlineRef.current = null;
        setSecondsLeft(0);
        setFeedback("");
        setStatus("complete");
        return;
      }

      setSecondsLeft(Math.ceil(millisecondsLeft / 1000));
    };

    tick();
    const timer = window.setInterval(tick, 200);
    return () => window.clearInterval(timer);
  }, [isRunning]);

  const registerBlink = useCallback(() => {
    if (statusRef.current !== "running") return;

    const next = blinksRef.current + 1;
    blinksRef.current = next;
    setBlinks(next);
    setPulseKey((key) => key + 1);
    setFeedback(getBlinkMessage(next));
  }, []);

  useEffect(() => {
    if (!isRunning) return undefined;

    const handleKeyDown = (event) => {
      if (event.repeat || (event.code !== "Space" && event.key !== " ")) return;

      const target = event.target;
      if (target instanceof HTMLElement && target.closest("button, a, input, textarea, select")) {
        return;
      }

      event.preventDefault();
      registerBlink();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning, registerBlink]);

  const startSession = () => {
    blinksRef.current = 0;
    setBlinks(0);
    setPulseKey(0);
    setFeedback("");
    setSecondsLeft(SESSION_SECONDS);
    deadlineRef.current = Date.now() + SESSION_SECONDS * 1000;
    setStatus("running");
  };

  const pauseSession = () => {
    if (deadlineRef.current !== null) {
      setSecondsLeft(Math.max(1, Math.ceil((deadlineRef.current - Date.now()) / 1000)));
      deadlineRef.current = null;
    }
    setStatus("paused");
  };

  const resumeSession = () => {
    deadlineRef.current = Date.now() + Math.max(1, secondsLeft) * 1000;
    setStatus("running");
  };

  const resetSession = () => {
    deadlineRef.current = null;
    blinksRef.current = 0;
    setBlinks(0);
    setFeedback("");
    setPulseKey(0);
    setSecondsLeft(SESSION_SECONDS);
    setStatus("idle");
  };

  return (
    <div className="game-page blink-page" data-status={status}>
      <AmbientScene />
      <div className="game-page__veil" aria-hidden="true" />

      <GameHeader
        title="眨眼花園"
        english="BLINK BLOOM"
        statusLabel={STATUS_LABELS[status]}
        statusTone={status}
        meta="60 秒 · 30 朵花"
      />

      <main className="blink-main">
        <section className="blink-copy" aria-labelledby="blink-title">
          <p className="game-kicker">
            <span className="game-kicker__line" />
            BLINK BLOOM · 03
          </p>

          {isComplete ? (
            <>
              <h1 className="game-title" id="blink-title">
                花園，<em>盛開了</em>。
              </h1>
              <p className="game-description">
                一分鐘的輕柔眨眼，讓淚膜重新均勻覆蓋眼睛。現在，慢慢看看這座為你盛開的小花園。
              </p>

              <div className="blink-summary">
                <span>
                  <small>眨眼次數</small>
                  <strong>{blinks}</strong>
                </span>
                <span>
                  <small>盛開花朵</small>
                  <strong>{visibleFlowers.length}</strong>
                </span>
                <span>
                  <small>練習時間</small>
                  <strong>60<em>s</em></strong>
                </span>
              </div>

              <div className="game-actions">
                <button type="button" className="game-primary" onClick={startSession}>
                  <span className="game-primary__icon">
                    <PlayIcon size={16} />
                  </span>
                  再玩一次
                </button>
                <Link className="game-text-button" to="/">
                  回到遊戲選集
                  <ArrowUpRightIcon size={14} />
                </Link>
              </div>
              <p className="game-hint">眨眼，是眼睛最溫柔的自我照顧。</p>
            </>
          ) : (
            <>
              <h1 className="game-title" id="blink-title">
                一分鐘，讓<em>花園醒來</em>。
              </h1>
              <p className="game-description">
                每一次輕柔眨眼，都會在森林裡種下一朵花。慢慢來，不必急。
              </p>

              <div className="blink-timer">
                <div className="blink-timer__head">
                  <span>剩餘時間</span>
                  <strong>{formatTime(secondsLeft)}</strong>
                </div>
                <div className="blink-timer__bar">
                  <span style={{ width: `${progress * 100}%` }} />
                </div>
              </div>

              <div className="blink-counter" aria-live="polite">
                <strong>{blinks}</strong>
                <span>朵花 · {blinks} 次眨眼</span>
              </div>

              <div className="game-actions blink-actions">
                {status === "idle" && (
                  <button type="button" className="game-primary" onClick={startSession}>
                    <span className="game-primary__icon">
                      <PlayIcon size={16} />
                    </span>
                    開始眨眼練習
                  </button>
                )}

                {isRunning && (
                  <button type="button" className="blink-trigger" onClick={registerBlink}>
                    <span className="blink-trigger__eye">
                      <EyeIcon size={25} />
                    </span>
                    <span className="blink-trigger__copy">
                      <strong>眨一下眼</strong>
                      <small>輕輕閉上，再張開</small>
                    </span>
                  </button>
                )}

                {status === "paused" && (
                  <button type="button" className="game-primary" onClick={resumeSession}>
                    <span className="game-primary__icon">
                      <PlayIcon size={16} />
                    </span>
                    繼續練習
                  </button>
                )}

                {(isRunning || status === "paused") && (
                  <button
                    type="button"
                    className="game-text-button"
                    onClick={isRunning ? pauseSession : resetSession}
                  >
                    {isRunning ? (
                      <>
                        <PauseIcon size={14} /> 暫停
                      </>
                    ) : (
                      "重新開始"
                    )}
                  </button>
                )}
              </div>

              <p className="game-hint">
                {isRunning ? (
                  <>
                    也可以按 <kbd className="key-hint">Space</kbd> 記錄一次眨眼。
                  </>
                ) : (
                  "眨眼時，讓眼皮輕輕碰在一起就好。"
                )}
              </p>
              <p className="blink-feedback" aria-live="polite">
                {feedback || "準備好，讓花園從第一朵花開始。"}
              </p>
            </>
          )}
        </section>

        <section
          className={`blink-garden ${isComplete ? "is-complete" : ""}`}
          aria-label={isComplete ? `花園完成，共 ${blinks} 次眨眼` : "眨眼花園"}
        >
          <span className="blink-garden__sky" aria-hidden="true" />
          <span className="blink-garden__moon" aria-hidden="true" />
          <span className="blink-garden__ridge blink-garden__ridge--back" aria-hidden="true" />
          <span className="blink-garden__ridge blink-garden__ridge--front" aria-hidden="true" />
          <span className="blink-garden__mist" aria-hidden="true" />

          <span className="blink-garden__flowers" aria-hidden="true">
            {visibleFlowers.map((flower, index) => (
              <span
                key={index}
                className={`garden-flower garden-flower--tone-${flower.tone}`}
                style={{
                  left: `${flower.x}%`,
                  top: `${flower.y}%`,
                  "--flower-scale": flower.scale,
                  "--flower-rotate": `${flower.rotate}deg`,
                }}
              >
                <span className="garden-flower__plant">
                  <FlowerHead className="garden-flower__head" />
                  <span className="garden-flower__stem" />
                </span>
              </span>
            ))}
          </span>

          {pulseKey > 0 && <span key={pulseKey} className="blink-garden__pulse" aria-hidden="true" />}

          {blinks === 0 && !isComplete && (
            <span className="blink-garden__empty" aria-hidden="true">
              <span className="blink-garden__seed" />
              <span>第一朵花，等你眨眼</span>
            </span>
          )}

          <span className="blink-garden__readout" aria-hidden="true">
            <strong>{String(blinks).padStart(2, "0")}</strong>
            <small>BLINKS</small>
          </span>

          <span className="blink-garden__caption" aria-hidden="true">
            BLINK BLOOM · A QUIET GARDEN
          </span>
        </section>
      </main>

      <footer className="game-footer">
        <span>BLINK SOFTLY</span>
        <i />
        <span>BREATHE SLOWLY</span>
        <i />
        <span>LET IT BLOOM</span>
      </footer>
    </div>
  );
}
