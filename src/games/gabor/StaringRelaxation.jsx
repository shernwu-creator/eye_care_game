import { useState } from "react";
import GaborPatch from "../../components/GaborPatch";
import SessionBar from "./SessionBar";
import SessionResult from "./SessionResult";
import { formatTime } from "../../lib/time";
import useTrainingTimer from "./useTrainingTimer";

const RELAX_PATCHES = [
  { left: "5%", top: "8%", size: 118, angle: 20, frequency: 4.2, duration: 33, delay: -2 },
  { left: "27%", top: "3%", size: 86, angle: 75, frequency: 5.2, duration: 27, delay: -11 },
  { left: "49%", top: "7%", size: 104, angle: 135, frequency: 3.8, duration: 35, delay: -7 },
  { left: "72%", top: "4%", size: 88, angle: 50, frequency: 4.8, duration: 29, delay: -15 },
  { left: "87%", top: "16%", size: 122, angle: 105, frequency: 5.6, duration: 34, delay: -6 },
  { left: "2%", top: "39%", size: 92, angle: 160, frequency: 4.4, duration: 30, delay: -12 },
  { left: "88%", top: "43%", size: 104, angle: 10, frequency: 3.4, duration: 28, delay: -4 },
  { left: "9%", top: "69%", size: 126, angle: 115, frequency: 4.6, duration: 37, delay: -17 },
  { left: "32%", top: "81%", size: 94, angle: 40, frequency: 5.4, duration: 26, delay: -8 },
  { left: "56%", top: "78%", size: 118, angle: 85, frequency: 3.6, duration: 32, delay: -14 },
  { left: "78%", top: "72%", size: 82, angle: 140, frequency: 5.8, duration: 25, delay: -5 },
  { left: "92%", top: "82%", size: 96, angle: 30, frequency: 4.2, duration: 31, delay: -19 },
];

export default function StaringRelaxation({ durationMinutes, onExit }) {
  const [status, setStatus] = useState("playing");
  const [sessionKey, setSessionKey] = useState(0);
  const totalSeconds = durationMinutes * 60;

  const { secondsLeft } = useTrainingTimer({
    durationSeconds: totalSeconds,
    active: status === "playing",
    sessionKey,
    onComplete: () => setStatus("finished"),
  });

  const handleRestart = () => {
    setStatus("playing");
    setSessionKey((value) => value + 1);
  };

  return (
    <section className="gabor-session gabor-session--relax" aria-labelledby="relax-title">
      <SessionBar
        title="靜態注視放鬆"
        english="STARING RELAXATION"
        secondsLeft={secondsLeft}
        totalSeconds={totalSeconds}
        onExit={onExit}
      />

      <div className="relax-stage">
        <div className="relax-field" aria-hidden="true">
          {RELAX_PATCHES.map((patch, index) => (
            <span
              key={index}
              className="relax-patch"
              style={{
                left: patch.left,
                top: patch.top,
                "--relax-duration": `${patch.duration}s`,
                "--relax-delay": `${patch.delay}s`,
                "--relax-breathe": `${patch.duration * 0.46}s`,
              }}
            >
              <GaborPatch
                angle={patch.angle}
                frequency={patch.frequency}
                size={patch.size}
                contrast={0.85}
              />
            </span>
          ))}
          <span className="relax-field__grain" />
        </div>

        <div className="relax-center">
          <span className="relax-breath relax-breath--one" aria-hidden="true" />
          <span className="relax-breath relax-breath--two" aria-hidden="true" />
          <div className="relax-center__inner">
            <p className="gabor-eyebrow">STARE SOFTLY · BREATHE SLOWLY</p>
            <h2 id="relax-title">讓視線，停在這裡。</h2>
            <p>
              不用尋找，也不用判斷。把目光放在中央的柔光上，讓周圍的條紋慢慢流動。
            </p>
            <strong className="relax-countdown">{formatTime(secondsLeft)}</strong>
            <span className="relax-caption">自然眨眼 · 放鬆肩膀 · 輕輕呼吸</span>
          </div>
        </div>
      </div>

      {status === "finished" && (
        <SessionResult
          success
          title="注視完成，視線回來了。"
          description="你完成了一段靜態注視。慢慢眨眼，讓眼睛重新適應周圍的空間，再回到選單。"
          stats={[
            { label: "放鬆時間", value: `${durationMinutes} 分` },
            { label: "視線焦點", value: "中央" },
          ]}
          onRetry={handleRestart}
          onExit={onExit}
        />
      )}
    </section>
  );
}
