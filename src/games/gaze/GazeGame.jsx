import { useCallback, useEffect, useRef, useState } from "react";
import AmbientScene from "../../components/AmbientScene";
import GameHeader from "../../components/GameHeader";
import BreakOverlay from "./BreakOverlay";
import EyeOrb from "./EyeOrb";
import GuideDialog from "./GuideDialog";
import SessionDock from "./SessionDock";
import { BREAK_SECONDS, DEFAULT_DURATION, formatTime } from "../../lib/time";

const ROUNDS_STORAGE_PREFIX = "mori-eye-completed-rounds";

const STATUS_LABELS = {
  idle: "準備開始",
  running: "練習進行中",
  paused: "練習已暫停",
  break: "遠眺休息中",
  complete: "遠眺完成",
};

const STATUS_COPY = {
  idle: "準備好，就按下開始。",
  running: "跟隨光點，保持柔和視線。",
  paused: "已暫停，準備好再繼續。",
  break: "正看向遠方，讓眼睛休息。",
  complete: "遠眺完成，眼睛回來了。",
};

function getRoundsStorageKey() {
  const today = new Date();
  const dateKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  return `${ROUNDS_STORAGE_PREFIX}-${dateKey}`;
}

function readCompletedRounds() {
  if (typeof window === "undefined") return 0;
  try {
    const stored = Number.parseInt(window.localStorage.getItem(getRoundsStorageKey()) ?? "0", 10);
    return Number.isFinite(stored) && stored >= 0 ? stored : 0;
  } catch {
    return 0;
  }
}

export default function GazeGame() {
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [remaining, setRemaining] = useState(DEFAULT_DURATION * 60);
  const [status, setStatus] = useState("idle");
  const [breakRemaining, setBreakRemaining] = useState(BREAK_SECONDS);
  const [completedRounds, setCompletedRounds] = useState(readCompletedRounds);
  const [guideOpen, setGuideOpen] = useState(false);
  const focusDeadlineRef = useRef(null);

  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isBreak = status === "break" || status === "complete";

  useEffect(() => {
    if (status !== "running") return undefined;

    const timer = window.setInterval(() => {
      if (focusDeadlineRef.current === null) return;

      const millisecondsLeft = focusDeadlineRef.current - Date.now();
      if (millisecondsLeft <= 0) {
        focusDeadlineRef.current = null;
        setRemaining(0);
        setBreakRemaining(BREAK_SECONDS);
        setStatus("break");
        return;
      }

      setRemaining(Math.ceil(millisecondsLeft / 1000));
    }, 200);

    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status !== "break") return undefined;

    setBreakRemaining(BREAK_SECONDS);
    const breakDeadline = Date.now() + BREAK_SECONDS * 1000;
    let finished = false;

    const tick = () => {
      const secondsLeft = Math.max(0, Math.ceil((breakDeadline - Date.now()) / 1000));
      setBreakRemaining(secondsLeft);

      if (secondsLeft === 0 && !finished) {
        finished = true;
        setStatus("complete");
        setCompletedRounds((previous) => {
          const next = previous + 1;
          try {
            window.localStorage.setItem(getRoundsStorageKey(), String(next));
          } catch {
            // A private browsing context may reject storage; the session still works.
          }
          return next;
        });
      }
    };

    tick();
    const timer = window.setInterval(tick, 200);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (isBreak) setGuideOpen(false);
  }, [isBreak]);

  useEffect(() => {
    const baseTitle = "追視漫步 · 森息";
    document.title =
      status === "running" ? `${formatTime(remaining)} · 追視漫步` : baseTitle;
  }, [status, remaining]);

  const beginSession = useCallback(() => {
    const seconds = remaining > 0 ? remaining : duration * 60;
    setRemaining(seconds);
    focusDeadlineRef.current = Date.now() + seconds * 1000;
    setStatus("running");
  }, [duration, remaining]);

  const pauseSession = useCallback(() => {
    if (focusDeadlineRef.current !== null) {
      const seconds = Math.max(1, Math.ceil((focusDeadlineRef.current - Date.now()) / 1000));
      setRemaining(seconds);
      focusDeadlineRef.current = null;
    }
    setStatus("paused");
  }, []);

  const handlePrimary = useCallback(() => {
    if (status === "running") {
      pauseSession();
    } else if (status === "idle" || status === "paused") {
      beginSession();
    }
  }, [beginSession, pauseSession, status]);

  const handleReset = useCallback(() => {
    focusDeadlineRef.current = null;
    setStatus("idle");
    setRemaining(duration * 60);
  }, [duration]);

  const handleDurationChange = useCallback((minutes) => {
    focusDeadlineRef.current = null;
    setDuration(minutes);
    setRemaining(minutes * 60);
    setStatus("idle");
  }, []);

  const handleNextRound = useCallback(() => {
    focusDeadlineRef.current = Date.now() + duration * 60 * 1000;
    setRemaining(duration * 60);
    setBreakRemaining(BREAK_SECONDS);
    setStatus("running");
  }, [duration]);

  const handleRest = useCallback(() => {
    focusDeadlineRef.current = null;
    setRemaining(duration * 60);
    setStatus("idle");
  }, [duration]);

  const openGuide = useCallback(() => setGuideOpen(true), []);
  const closeGuide = useCallback(() => setGuideOpen(false), []);

  return (
    <div className="app gaze-game" data-status={status}>
      <AmbientScene />

      <div className="orb-field" aria-hidden="true">
        <span className="orb-field__orbit orb-field__orbit--outer" />
        <span className="orb-field__orbit orb-field__orbit--inner" />
        <span className="orb-field__glow" />
        <EyeOrb active={isRunning} idle={status === "idle"} dimmed={isBreak} />
      </div>

      <GameHeader
        title="追視漫步"
        english="GAZE WALK"
        statusLabel={STATUS_LABELS[status]}
        statusTone={status}
        meta={`今日已完成 ${completedRounds} 輪`}
        actionLabel="20·20·20 法則"
        onAction={openGuide}
      />

      <main className="hero">
        <p className="hero-eyebrow">
          <span className="hero-eyebrow__line" />
          A QUIET MOMENT FOR YOUR EYES
          <span className="hero-eyebrow__line" />
        </p>
        <h1 className="hero-title">
          讓視線，<em>慢慢旅行</em>。
        </h1>
        <p className="hero-subtitle">跟著柔光移動，讓眼睛在綠意裡舒展。</p>
        <p className={`hero-status hero-status--${status}`} role="status" aria-live="polite">
          <span className="hero-status__dot" />
          {STATUS_COPY[status] ?? STATUS_COPY.idle}
        </p>
      </main>

      <aside className="edge-caption" aria-hidden="true">
        <span>LOOK</span>
        <i />
        <span>BLINK</span>
        <i />
        <span>BREATHE</span>
      </aside>

      <p className="corner-note corner-note--left" aria-hidden="true">
        每 20 分鐘 · 遠眺 20 秒
      </p>
      <p className="corner-note corner-note--right" aria-hidden="true">
        MORI EYE / 20 · 20 · 20
      </p>

      <SessionDock
        status={status}
        remaining={remaining}
        duration={duration}
        onPrimary={handlePrimary}
        onReset={handleReset}
        onSelectDuration={handleDurationChange}
      />

      {isBreak && (
        <BreakOverlay
          status={status}
          seconds={breakRemaining}
          rounds={completedRounds}
          onContinue={handleNextRound}
          onRest={handleRest}
        />
      )}

      <GuideDialog open={guideOpen} rounds={completedRounds} onClose={closeGuide} />
    </div>
  );
}
