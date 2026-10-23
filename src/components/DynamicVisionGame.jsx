import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AmbientScene from "./AmbientScene";
import GameHeader from "./GameHeader";
import { ArrowUpRightIcon, CheckIcon, CloseIcon, PlayIcon } from "./Icons";
import "../vision.css";

const MEMORIZE_MS = 3000;
const ROUND_CLEAR_MS = 1500;
const MIN_CIRCLES = 3;
const MAX_CIRCLES = 7;
const CIRCLE_RADIUS = 28;
const CIRCLE_SIZE = CIRCLE_RADIUS * 2;

const PHASE_LABELS = {
  idle: "準備開始",
  memorize: "記憶階段",
  recall: "回憶階段",
  roundClear: "關卡通過",
  gameOver: "挑戰結束",
};

const PHASE_STATUS = {
  idle: "等待開始",
  memorize: "記住號碼",
  recall: "依序點擊",
  roundClear: "漂亮過關",
  gameOver: "這次結束",
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function getCircleCount(level) {
  return Math.min(MIN_CIRCLES + level - 1, MAX_CIRCLES);
}

function getSpeed(level) {
  return Math.min(150, 85 + (level - 1) * 9);
}

function createSimulation(level, width, height) {
  const count = getCircleCount(level);
  const radius = CIRCLE_RADIUS;
  const inset = 12;
  const safeWidth = Math.max(width, radius * 2 + inset * 2 + 90);
  const safeHeight = Math.max(height, radius * 2 + inset * 2 + 90);
  const minX = radius + inset;
  const maxX = safeWidth - radius - inset;
  const minY = radius + inset;
  const maxY = safeHeight - radius - inset;
  const positions = [];
  let attempts = 0;

  while (positions.length < count && attempts < 500) {
    attempts += 1;
    const point = {
      x: minX + Math.random() * Math.max(1, maxX - minX),
      y: minY + Math.random() * Math.max(1, maxY - minY),
    };
    const overlaps = positions.some(
      (existing) => Math.hypot(existing.x - point.x, existing.y - point.y) < CIRCLE_SIZE + 11,
    );
    if (!overlaps) positions.push(point);
  }

  if (positions.length < count) {
    const columns = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / columns);
    const cellWidth = (maxX - minX) / Math.max(1, columns - 1 || 1);
    const cellHeight = (maxY - minY) / Math.max(1, rows - 1 || 1);

    for (let index = positions.length; index < count; index += 1) {
      const column = index % columns;
      const row = Math.floor(index / columns);
      positions.push({
        x: columns === 1 ? (minX + maxX) / 2 : minX + column * cellWidth,
        y: rows === 1 ? (minY + maxY) / 2 : minY + row * cellHeight,
      });
    }
  }

  const speed = getSpeed(level);
  return positions.slice(0, count).map((point, index) => {
    const angle = Math.random() * Math.PI * 2;
    return {
      id: index + 1,
      x: point.x,
      y: point.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
    };
  });
}

function placeCircle(element, x, y) {
  if (!element) return;
  element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
}

export default function DynamicVisionGame() {
  const [phase, setPhase] = useState("idle");
  const [level, setLevel] = useState(1);
  const [cleared, setCleared] = useState(0);
  const [circles, setCircles] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [wrongId, setWrongId] = useState(null);
  const [memorizeLeft, setMemorizeLeft] = useState(3);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });

  const boardRef = useRef(null);
  const boardSizeRef = useRef({ width: 0, height: 0 });
  const circleRefs = useRef({});
  const simulationRef = useRef([]);
  const completedRef = useRef([]);

  const circleCount = getCircleCount(level);
  const isAnimating = phase === "memorize" || phase === "recall";
  const nextTarget = Math.min(completed.length + 1, circleCount);
  const nextCount = getCircleCount(level + 1);

  useEffect(() => {
    document.title = "動態視力訓練 · 森息";
  }, []);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return undefined;

    const updateSize = () => {
      const nextSize = { width: board.clientWidth, height: board.clientHeight };
      boardSizeRef.current = nextSize;
      setBoardSize(nextSize);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(board);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== "memorize") return undefined;

    setMemorizeLeft(3);
    const endAt = Date.now() + MEMORIZE_MS;
    const timer = window.setInterval(() => {
      const millisecondsLeft = endAt - Date.now();

      if (millisecondsLeft <= 0) {
        window.clearInterval(timer);
        setMemorizeLeft(0);
        setPhase("recall");
        return;
      }

      setMemorizeLeft(Math.ceil(millisecondsLeft / 1000));
    }, 80);

    return () => window.clearInterval(timer);
  }, [phase, level]);

  useEffect(() => {
    if (!isAnimating) return undefined;

    let frameId = 0;
    let lastTime = performance.now();

    const animate = (now) => {
      const deltaSeconds = Math.min(0.04, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;
      const { width, height } = boardSizeRef.current;

      if (width > 0 && height > 0) {
        const circles = simulationRef.current;

        circles.forEach((circle) => {
          circle.x += circle.vx * deltaSeconds;
          circle.y += circle.vy * deltaSeconds;
        });

        // Keep every circle inside the board with a small position correction
        // so a bounce never leaves it visibly stuck against an edge.
        const containCircle = (circle) => {
          if (circle.x - CIRCLE_RADIUS <= 0) {
            circle.x = CIRCLE_RADIUS;
            circle.vx = Math.abs(circle.vx);
          } else if (circle.x + CIRCLE_RADIUS >= width) {
            circle.x = width - CIRCLE_RADIUS;
            circle.vx = -Math.abs(circle.vx);
          }

          if (circle.y - CIRCLE_RADIUS <= 0) {
            circle.y = CIRCLE_RADIUS;
            circle.vy = Math.abs(circle.vy);
          } else if (circle.y + CIRCLE_RADIUS >= height) {
            circle.y = height - CIRCLE_RADIUS;
            circle.vy = -Math.abs(circle.vy);
          }
        };

        circles.forEach(containCircle);

        // Soft circle-to-circle bounce keeps the numbered targets readable
        // even when several of them share the same path.
        for (let index = 0; index < circles.length; index += 1) {
          for (let nextIndex = index + 1; nextIndex < circles.length; nextIndex += 1) {
            const first = circles[index];
            const second = circles[nextIndex];
            let deltaX = second.x - first.x;
            let deltaY = second.y - first.y;
            let distance = Math.hypot(deltaX, deltaY);
            const minimumDistance = CIRCLE_RADIUS * 2;

            if (distance >= minimumDistance) continue;

            if (distance < 0.001) {
              deltaX = 1;
              deltaY = 0;
              distance = 1;
            }

            const normalX = deltaX / distance;
            const normalY = deltaY / distance;
            const overlap = (minimumDistance - distance) / 2;

            first.x -= normalX * overlap;
            first.y -= normalY * overlap;
            second.x += normalX * overlap;
            second.y += normalY * overlap;

            const relativeVelocity =
              (second.vx - first.vx) * normalX + (second.vy - first.vy) * normalY;

            if (relativeVelocity < 0) {
              const impulse = -relativeVelocity;
              first.vx -= impulse * normalX;
              first.vy -= impulse * normalY;
              second.vx += impulse * normalX;
              second.vy += impulse * normalY;
            }
          }
        }

        circles.forEach((circle) => {
          containCircle(circle);
          placeCircle(circleRefs.current[circle.id], circle.x, circle.y);
        });
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isAnimating]);

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board || simulationRef.current.length === 0) return;

    const width = board.clientWidth;
    const height = board.clientHeight;
    if (width <= 0 || height <= 0) return;

    simulationRef.current.forEach((circle) => {
      circle.x = clamp(circle.x, CIRCLE_RADIUS, Math.max(CIRCLE_RADIUS, width - CIRCLE_RADIUS));
      circle.y = clamp(circle.y, CIRCLE_RADIUS, Math.max(CIRCLE_RADIUS, height - CIRCLE_RADIUS));
      placeCircle(circleRefs.current[circle.id], circle.x, circle.y);
    });
  }, [circles, boardSize]);

  const startLevel = useCallback((nextLevel) => {
    const board = boardRef.current;
    const width = board?.clientWidth || boardSizeRef.current.width || 900;
    const height = board?.clientHeight || boardSizeRef.current.height || 430;
    const simulation = createSimulation(nextLevel, width, height);

    simulationRef.current = simulation;
    completedRef.current = [];
    setCircles(simulation.map(({ id }) => ({ id })));
    setCompleted([]);
    setWrongId(null);
    setMemorizeLeft(3);
    setLevel(nextLevel);
    setPhase("memorize");
  }, []);

  useEffect(() => {
    if (phase !== "roundClear") return undefined;

    const timer = window.setTimeout(() => {
      startLevel(level + 1);
    }, ROUND_CLEAR_MS);

    return () => window.clearTimeout(timer);
  }, [phase, level, startLevel]);

  const startGame = useCallback(() => {
    setCleared(0);
    startLevel(1);
  }, [startLevel]);

  const handleCircleClick = (id) => {
    if (phase !== "recall" || completedRef.current.includes(id)) return;

    const expected = completedRef.current.length + 1;
    if (id !== expected) {
      setWrongId(id);
      setPhase("gameOver");
      return;
    }

    const nextCompleted = [...completedRef.current, id];
    completedRef.current = nextCompleted;
    setCompleted(nextCompleted);

    if (nextCompleted.length === getCircleCount(level)) {
      setCleared((value) => value + 1);
      setPhase("roundClear");
    }
  };

  const handleReset = () => {
    setCleared(0);
    startLevel(1);
  };

  return (
    <div className="game-page vision-page" data-phase={phase}>
      <AmbientScene />
      <div className="game-page__veil" aria-hidden="true" />

      <GameHeader
        title="動態視力訓練"
        english="DYNAMIC VISION"
        statusLabel={PHASE_LABELS[phase]}
        statusTone={
          phase === "gameOver"
            ? "paused"
            : phase === "roundClear"
              ? "complete"
              : phase === "idle"
                ? "idle"
                : "running"
        }
        meta={`第 ${level} 關 · 過關 ${cleared}`}
      />

      <main className="vision-main">
        <p className="sr-only" aria-live="polite">
          {phase === "memorize" && "記憶階段開始，三秒後號碼會隱藏。"}
          {phase === "recall" && "號碼已隱藏，請依照一二三的順序點擊移動中的圓圈。"}
          {phase === "roundClear" && `第 ${level} 關通過，下一關即將開始。`}
          {phase === "gameOver" && `挑戰結束，本次通過 ${cleared} 關。`}
        </p>

        <div className="vision-heading">
          <div>
            <p className="game-kicker">
              <span className="game-kicker__line" />
              DYNAMIC VISION · 04
            </p>
            <h1 className="vision-title">
              用眼睛，<em>記住移動的軌跡</em>。
            </h1>
          </div>
          <p className="vision-intro">3 秒記憶，接著在移動中依序找回 1、2、3。</p>
        </div>

        <section className="vision-panel">
          <div className="vision-topbar flex items-center justify-between gap-4">
            <div className="vision-phase" aria-live="polite">
              <span className={`vision-phase__dot vision-phase__dot--${phase}`} />
              <span className="vision-phase__label">{PHASE_STATUS[phase]}</span>
              {phase === "memorize" && (
                <span className="vision-countdown" key={memorizeLeft}>
                  {memorizeLeft}
                  <small>秒</small>
                </span>
              )}
            </div>

            <div className="vision-sequence">
              <span className="vision-sequence__label">依序</span>
              <div className="vision-sequence__steps">
                {Array.from({ length: circleCount }).map((_, index) => {
                  const value = index + 1;
                  const isDone = completed.includes(value);
                  const isNext = phase === "recall" && !isDone && value === nextTarget;

                  return (
                    <span
                      key={value}
                      className={`vision-step ${isDone ? "is-done" : ""} ${isNext ? "is-next" : ""}`}
                    >
                      {isDone ? <CheckIcon size={10} /> : value}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="vision-levels">
              <span>
                <small>LEVEL</small>
                <strong>{String(level).padStart(2, "0")}</strong>
              </span>
              <span>
                <small>CLEARED</small>
                <strong>{String(cleared).padStart(2, "0")}</strong>
              </span>
            </div>
          </div>

          <div
            ref={boardRef}
            className="vision-board relative w-full overflow-hidden rounded-[26px] border border-solid border-emerald-200/70 bg-emerald-50"
            data-phase={phase}
            aria-label="動態視力遊戲區"
          >
            <div className="vision-board__texture" aria-hidden="true" />
            <div className="vision-board__orbit vision-board__orbit--one" aria-hidden="true" />
            <div className="vision-board__orbit vision-board__orbit--two" aria-hidden="true" />

            {phase === "idle" && (
              <div className="vision-overlay vision-overlay--idle">
                <span className="vision-demo" aria-hidden="true">
                  <span className="vision-demo__circle vision-demo__circle--one">1</span>
                  <span className="vision-demo__circle vision-demo__circle--two">2</span>
                  <span className="vision-demo__circle vision-demo__circle--three">3</span>
                </span>

                <div className="vision-card">
                  <p className="vision-card__eyebrow">LOOK · REMEMBER · FOLLOW</p>
                  <h2 className="vision-card__title">
                    先記住數字，
                    <br />
                    再相信你的動態記憶。
                  </h2>
                  <p className="vision-card__copy">
                    圓圈會持續移動。3 秒後號碼會隱藏，請依照 1、2、3 的順序點擊它們。
                  </p>
                  <button type="button" className="vision-button vision-button--primary" onClick={startGame}>
                    <PlayIcon size={16} />
                    開始訓練
                  </button>
                </div>
              </div>
            )}

            {circles.map((circle) => {
              const isDone = completed.includes(circle.id);
              const isWrong = wrongId === circle.id;
              const hideNumber = phase !== "memorize" && !isDone && !isWrong;

              return (
                <button
                  key={circle.id}
                  type="button"
                  ref={(element) => {
                    if (element) circleRefs.current[circle.id] = element;
                    else delete circleRefs.current[circle.id];
                  }}
                  data-circle={circle.id}
                  className={`vision-circle rounded-full border border-solid border-emerald-100 bg-white/95 shadow-sm ${
                    isDone ? "is-correct" : ""
                  } ${isWrong ? "is-wrong" : ""}`}
                  onClick={() => handleCircleClick(circle.id)}
                  disabled={phase !== "recall" || isDone}
                  aria-label={
                    isDone
                      ? `圓圈 ${circle.id}，已點擊`
                      : isWrong
                        ? `圓圈 ${circle.id}，順序錯誤`
                        : `圓圈 ${circle.id}`
                  }
                >
                  <span
                    className={`vision-circle__number text-emerald-700 ${hideNumber ? "is-hidden" : ""}`}
                  >
                    {circle.id}
                  </span>
                  {isDone && (
                    <span className="vision-circle__mark">
                      <CheckIcon size={22} />
                    </span>
                  )}
                  {isWrong && (
                    <span className="vision-circle__mark vision-circle__mark--wrong">
                      <CloseIcon size={20} />
                    </span>
                  )}
                </button>
              );
            })}

            {phase === "recall" && completed.length === 0 && (
              <div className="vision-recall-cue" aria-hidden="true">
                <span />
                數字已隱藏 · 依序點擊
              </div>
            )}

            {phase === "roundClear" && (
              <div className="vision-overlay vision-overlay--clear">
                <div className="vision-clear-card">
                  <span className="vision-clear-card__mark">
                    <CheckIcon size={20} />
                  </span>
                  <p>LEVEL {level} CLEAR</p>
                  <h2>第 {level} 關通過</h2>
                  <span>
                    下一關 · {nextCount} 顆圓圈
                    <i>速度微升</i>
                  </span>
                  <small>即將自動開始…</small>
                </div>
              </div>
            )}

            {phase === "gameOver" && (
              <div
                className="vision-overlay vision-overlay--result"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="vision-result-title"
              >
                <div className="vision-card vision-card--result">
                  <span className="vision-result-mark">
                    <CloseIcon size={20} />
                  </span>
                  <p className="vision-card__eyebrow">ROUND ENDED</p>
                  <h2 className="vision-card__title" id="vision-result-title">
                    這次，停在這裡。
                  </h2>
                  <p className="vision-card__copy">點錯順序了。讓視線休息一下，再重新跟上圓圈的移動。</p>
                  <div className="vision-final">
                    <span>最終過關數</span>
                    <strong>{cleared}</strong>
                    <span>關</span>
                  </div>
                  <div className="vision-result-actions">
                    <button
                      type="button"
                      className="vision-button vision-button--primary"
                      onClick={startGame}
                      autoFocus
                    >
                      再試一次
                    </button>
                    <Link className="vision-text-link" to="/">
                      回到遊戲選集
                      <ArrowUpRightIcon size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="vision-bottom">
            <p>
              {phase === "idle" && "每一次移動，都是給眼睛與記憶的小小練習。"}
              {phase === "memorize" && "記住每顆圓圈上的號碼，它們正在移動。"}
              {phase === "recall" && "依照數字順序點擊，點錯一次就會結束。"}
              {phase === "roundClear" && "下一關的圓圈會更多，速度也會微幅提升。"}
              {phase === "gameOver" && "準備好時，再讓視線跟著圓圈走一次。"}
            </p>
            {(phase === "memorize" || phase === "recall") && (
              <button type="button" className="vision-reset" onClick={handleReset}>
                重新開始
              </button>
            )}
          </div>
        </section>
      </main>

      <footer className="game-footer">
        <span>MEMORIZE</span>
        <i />
        <span>RECALL</span>
        <i />
        <span>REACT</span>
      </footer>
    </div>
  );
}
