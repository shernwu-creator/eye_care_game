import { useEffect, useLayoutEffect, useRef } from "react";

const ORB_POINTS = [
  { x: 0.5, y: 0.46 },
  { x: 0.18, y: 0.18 },
  { x: 0.5, y: 0.07 },
  { x: 0.83, y: 0.2 },
  { x: 0.94, y: 0.5 },
  { x: 0.8, y: 0.84 },
  { x: 0.5, y: 0.94 },
  { x: 0.17, y: 0.81 },
  { x: 0.06, y: 0.49 },
  { x: 0.3, y: 0.32 },
  { x: 0.7, y: 0.68 },
  { x: 0.68, y: 0.33 },
  { x: 0.33, y: 0.66 },
];

const HOME = { x: 0.5, y: 0.47 };
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function createSegment(from) {
  const options = ORB_POINTS.filter((point) => distance(point, from) > 0.26);
  const pool = options.length > 0 ? options : ORB_POINTS;
  const target = pool[Math.floor(Math.random() * pool.length)];
  const dx = target.x - from.x;
  const dy = target.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const bend = (Math.random() * 2 - 1) * Math.min(0.15, length * 0.2);
  const normal = { x: -dy / length, y: dx / length };

  return {
    target,
    control: {
      x: clamp((from.x + target.x) / 2 + normal.x * bend, 0.04, 0.96),
      y: clamp((from.y + target.y) / 2 + normal.y * bend, 0.04, 0.96),
    },
    duration: 7100 + Math.random() * 2300 + length * 500,
    hold: 650 + Math.random() * 800,
  };
}

function pointOnCurve(from, control, target, progress) {
  const inverse = 1 - progress;
  return {
    x: inverse * inverse * from.x + 2 * inverse * progress * control.x + progress * progress * target.x,
    y: inverse * inverse * from.y + 2 * inverse * progress * control.y + progress * progress * target.y,
  };
}

export default function EyeOrb({ active, idle, dimmed }) {
  const fieldRef = useRef(null);
  const orbRef = useRef(null);
  const ghostRefs = useRef([]);
  const positionRef = useRef({ ...HOME });
  const historyRef = useRef([]);

  const paintPosition = (position, remember = true) => {
    const field = fieldRef.current;
    if (!field) return;
    const width = field.clientWidth;
    const height = field.clientHeight;

    const orb = orbRef.current;
    if (orb) {
      orb.style.transform = `translate3d(${position.x * width}px, ${position.y * height}px, 0) translate(-50%, -50%)`;
    }

    if (!remember) return;

    const history = historyRef.current;
    history.unshift(position);
    if (history.length > 30) history.length = 30;

    ghostRefs.current.forEach((ghost, index) => {
      if (!ghost) return;
      const sample = history[Math.min(history.length - 1, (index + 1) * 5)];
      if (!sample) return;
      ghost.style.transform = `translate3d(${sample.x * width}px, ${sample.y * height}px, 0) translate(-50%, -50%)`;
    });
  };

  useLayoutEffect(() => {
    paintPosition(HOME);
    // The first paint only positions the orb at its resting point.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return undefined;

    const handleResize = () => {
      paintPosition(idle ? HOME : positionRef.current);
      if (idle) positionRef.current = { ...HOME };
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(field);
    return () => observer.disconnect();
  }, [idle]);

  useEffect(() => {
    if (!active) return undefined;

    const orb = orbRef.current;
    if (orb) orb.style.transition = "none";

    let cancelled = false;
    let frameId = 0;
    let holdId = 0;
    let current = { ...positionRef.current };
    historyRef.current = [];

    const wander = () => {
      const segment = createSegment(current);
      const startedAt = performance.now();

      const step = (now) => {
        if (cancelled) return;

        const rawProgress = clamp((now - startedAt) / segment.duration, 0, 1);
        const eased = easeInOutSine(rawProgress);
        const next = pointOnCurve(current, segment.control, segment.target, eased);

        positionRef.current = next;
        paintPosition(next);

        if (rawProgress < 1) {
          frameId = requestAnimationFrame(step);
          return;
        }

        current = { ...segment.target };
        positionRef.current = current;
        holdId = window.setTimeout(() => {
          if (!cancelled) wander();
        }, segment.hold);
      };

      frameId = requestAnimationFrame(step);
    };

    wander();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      window.clearTimeout(holdId);
    };
  }, [active]);

  useEffect(() => {
    if (!idle) return undefined;

    const orb = orbRef.current;
    const ghosts = ghostRefs.current.filter(Boolean);
    if (!orb) return undefined;

    orb.style.transition = "transform 1500ms cubic-bezier(0.22, 1, 0.36, 1)";
    paintPosition(HOME);
    positionRef.current = { ...HOME };
    historyRef.current = [];

    const field = fieldRef.current;
    if (field) {
      ghosts.forEach((ghost) => {
        ghost.style.transform = `translate3d(${HOME.x * field.clientWidth}px, ${HOME.y * field.clientHeight}px, 0) translate(-50%, -50%)`;
      });
    }

    const timeout = window.setTimeout(() => {
      orb.style.transition = "none";
    }, 1600);

    return () => window.clearTimeout(timeout);
  }, [idle]);

  return (
    <div ref={fieldRef} className="orb-ensemble" data-active={active ? "true" : "false"} data-dimmed={dimmed ? "true" : "false"} aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          ref={(node) => {
            ghostRefs.current[index] = node;
          }}
          className={`orb-ghost orb-ghost--${index + 1}`}
        />
      ))}

      <div ref={orbRef} className="orb">
        <span className="orb__halo" />
        <span className="orb__orbit orb__orbit--outer">
          <i />
        </span>
        <span className="orb__orbit orb__orbit--inner">
          <i />
        </span>
        <span className="orb__ring" />
        <span className="orb__core">
          <span className="orb__glint" />
        </span>
      </div>
    </div>
  );
}
