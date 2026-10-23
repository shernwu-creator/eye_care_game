import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AmbientScene from "../../components/AmbientScene";
import GameHeader from "../../components/GameHeader";
import { ArrowUpRightIcon, CheckIcon, PauseIcon, PlayIcon, ResetIcon } from "../../components/Icons";
import { formatTime } from "../../lib/time";

const SESSION_SECONDS = 80;
const PHASE_SECONDS = 10;
const PHASE_COUNT = SESSION_SECONDS / PHASE_SECONDS;
const STATUS_LABELS = {
  idle: "準備開始",
  running: "對焦練習中",
  paused: "練習已暫停",
  complete: "對焦完成",
};

const INSTRUCTIONS = {
  near: {
    tag: "近 · 20 CM",
    title: "看向指尖",
    copy: "將食指舉在眼前約 20 公分，輕輕注視指尖，不必用力。",
  },
  far: {
    tag: "遠 · 6 M",
    title: "看向遠方",
    copy: "抬起視線，望向約 6 公尺外的窗景或物體，讓眼睛鬆開。",
  },
};

export default function FocusGame() {
  const [status, setStatus] = useState("idle");
  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const deadlineRef = useRef(null);

  const isRunning = status === "running";
  const isComplete = status === "complete";
  const phase = phaseIndex % 2 === 0 ? "near" : "far";
  const instruction = INSTRUCTIONS[phase];
  const phaseProgress = Math.min(1, Math.max(0, (SESSION_SECONDS - secondsLeft) / SESSION_SECONDS));

  useEffect(() => {
    document.title = "遠近對焦 · 森息";
  }, []);

  useEffect(() => {
    if (!isRunning) return undefined;

    const tick = () => {
      if (deadlineRef.current === null) return;
      const millisecondsLeft = deadlineRef.current - Date.now();

      if (millisecondsLeft <= 0) {
        deadlineRef.current = null;
        setSecondsLeft(0);
        setPhaseIndex(PHASE_COUNT - 1);
        setStatus("complete");
        return;
      }

      const nextSeconds = Math.ceil(millisecondsLeft / 1000);
      const elapsed = SESSION_SECONDS - nextSeconds;
      setSecondsLeft(nextSeconds);
      setPhaseIndex(Math.min(PHASE_COUNT - 1, Math.floor(elapsed / PHASE_SECONDS)));
    };

    const timer = window.setInterval(tick, 200);
    return () => window.clearInterval(timer);
  }, [isRunning]);

  const startSession = useCallback(() => {
    deadlineRef.current = Date.now() + SESSION_SECONDS * 1000;
    setSecondsLeft(SESSION_SECONDS);
    setPhaseIndex(0);
    setStatus("running");
  }, []);

  const pauseSession = useCallback(() => {
    if (deadlineRef.current !== null) {
      setSecondsLeft(Math.max(1, Math.ceil((deadlineRef.current - Date.now()) / 1000)));
      deadlineRef.current = null;
    }
    setStatus("paused");
  }, []);

  const resumeSession = useCallback(() => {
    deadlineRef.current = Date.now() + Math.max(1, secondsLeft) * 1000;
    setStatus("running");
  }, [secondsLeft]);

  const handlePrimary = () => {
    if (isRunning) {
      pauseSession();
    } else if (status === "paused") {
      resumeSession();
    } else {
      startSession();
    }
  };

  const handleReset = () => {
    deadlineRef.current = null;
    setSecondsLeft(SESSION_SECONDS);
    setPhaseIndex(0);
    setStatus("idle");
  };

  return (
    <div className="game-page focus-page" data-status={status}>
      <AmbientScene />
      <div className="game-page__veil" aria-hidden="true" />

      <GameHeader
        title="遠近對焦"
        english="FOCUS SHIFT"
        statusLabel={STATUS_LABELS[status]}
        statusTone={status}
        meta="80 秒 · 8 趟"
      />

      <main className="focus-main">
        <section className="focus-copy" aria-labelledby="focus-title">
          <p className="game-kicker">
            <span className="game-kicker__line" />
            FOCUS SHIFT · 02
          </p>

          {isComplete ? (
            <>
              <h1 className="game-title" id="focus-title">
                視線，<em>鬆開了</em>。
              </h1>
              <p className="game-description">
                你完成了 8 趟遠近對焦。眼睛在近處與遠方之間來回旅行，現在可以慢慢眨眨眼，回到當下。
              </p>
              <div className="focus-summary">
                <span>
                  <small>對焦趟數</small>
                  <strong>08</strong>
                </span>
                <span>
                  <small>練習時間</small>
                  <strong>80<em>s</em></strong>
                </span>
              </div>
            </>
          ) : (
            <>
              <h1 className="game-title" id="focus-title">
                在遠近之間，<em>慢慢對焦</em>。
              </h1>
              <p className="game-description">
                每一次切換，都是給睫狀肌的一次溫柔伸展。跟著節奏，不需要瞇眼。
              </p>

              <div className="phase-card" aria-live="polite">
                <span className="phase-card__tag">{instruction.tag}</span>
                <div>
                  <strong>{instruction.title}</strong>
                  <p>{instruction.copy}</p>
                </div>
              </div>
            </>
          )}

          <div className="game-progress">
            <div className="game-progress__head">
              <span>{String(phaseIndex + 1).padStart(2, "0")} / 08</span>
              <span>{formatTime(secondsLeft)}</span>
            </div>
            <div className="game-progress__track">
              <span style={{ width: `${phaseProgress * 100}%` }} />
            </div>
            <div className="phase-dots" aria-hidden="true">
              {Array.from({ length: PHASE_COUNT }).map((_, index) => (
                <i
                  key={index}
                  className={`${index <= phaseIndex && (isRunning || status === "paused" || isComplete) ? "is-done" : ""} ${
                    index === phaseIndex && !isComplete ? "is-current" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="game-actions">
            <button type="button" className="game-primary" onClick={handlePrimary}>
              <span className="game-primary__icon">
                {isRunning ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
              </span>
              {isRunning ? "暫停一下" : status === "paused" ? "繼續練習" : isComplete ? "再練習一次" : "開始對焦練習"}
            </button>

            {status !== "idle" && status !== "complete" && (
              <button type="button" className="game-text-button" onClick={handleReset}>
                <ResetIcon size={15} />
                重新開始
              </button>
            )}
          </div>

          <p className="game-hint">
            {isComplete ? (
              <Link className="inline-home-link" to="/">
                回到遊戲選集 <ArrowUpRightIcon size={13} />
              </Link>
            ) : (
              "建議坐在光線柔和的地方，肩膀自然放下。"
            )}
          </p>
        </section>

        <section
          className={`focus-stage focus-stage--${phase} ${isComplete ? "is-complete" : ""}`}
          aria-label={isComplete ? "遠近對焦練習完成" : instruction.title}
        >
          <span className="focus-stage__sky" aria-hidden="true" />
          <span className="focus-stage__moon" aria-hidden="true" />
          <span className="focus-stage__ridge focus-stage__ridge--back" aria-hidden="true" />
          <span className="focus-stage__ridge focus-stage__ridge--mid" aria-hidden="true" />
          <span className="focus-stage__ridge focus-stage__ridge--front" aria-hidden="true" />
          <span className="focus-stage__route" aria-hidden="true" />

          <span className={`focus-anchor focus-anchor--near ${!isComplete && phase === "near" ? "is-active" : ""}`} aria-hidden="true">
            <i className="focus-anchor__halo" />
            <i className="focus-anchor__dot" />
            <small>近 · 指尖</small>
          </span>

          <span className={`focus-anchor focus-anchor--far ${!isComplete && phase === "far" ? "is-active" : ""}`} aria-hidden="true">
            <i className="focus-anchor__halo" />
            <i className="focus-anchor__dot" />
            <small>遠 · 6 M</small>
          </span>

          <span className="focus-stage__caption" aria-hidden="true">
            {isComplete ? "A SOFT RETURN" : phase === "near" ? "NEAR · EYES SOFT" : "FAR · LET GO"}
          </span>

          {isComplete && (
            <span className="focus-stage__complete-mark" aria-hidden="true">
              <CheckIcon size={22} />
            </span>
          )}
        </section>
      </main>

      <footer className="game-footer">
        <span>20 CM</span>
        <i />
        <span>6 METERS</span>
        <i />
        <span>SOFT FOCUS</span>
      </footer>
    </div>
  );
}
