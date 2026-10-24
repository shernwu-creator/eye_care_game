import { useEffect, useMemo, useRef, useState } from "react";
import GaborPatch from "../../components/GaborPatch";
import { CheckIcon } from "../../components/Icons";
import SessionBar from "./SessionBar";
import SessionResult from "./SessionResult";
import { createTapRound } from "./gaborUtils";
import useTrainingTimer from "./useTrainingTimer";

const PENALTY_SECONDS = 3;

export default function TapToMatch({ durationMinutes, onExit }) {
  const [status, setStatus] = useState("playing");
  const [sessionKey, setSessionKey] = useState(0);
  const [roundKey, setRoundKey] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [solvedIndex, setSolvedIndex] = useState(null);
  const [wrongIndex, setWrongIndex] = useState(null);
  const [hint, setHint] = useState("");

  const successTimeoutRef = useRef(0);
  const wrongTimeoutRef = useRef(0);

  const round = useMemo(() => createTapRound(), [roundKey, sessionKey]);
  const totalSeconds = durationMinutes * 60;

  const { secondsLeft, penalize } = useTrainingTimer({
    durationSeconds: totalSeconds,
    active: status === "playing",
    sessionKey,
    onComplete: () => setStatus("finished"),
  });

  useEffect(() => {
    return () => {
      window.clearTimeout(successTimeoutRef.current);
      window.clearTimeout(wrongTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (status === "playing") return;
    window.clearTimeout(successTimeoutRef.current);
    window.clearTimeout(wrongTimeoutRef.current);
    setLocked(false);
    setSolvedIndex(null);
    setWrongIndex(null);
  }, [status]);

  const handleSelect = (index) => {
    if (status !== "playing" || locked) return;

    const tile = round.tiles[index];
    setAttempts((value) => value + 1);

    if (tile.key === round.target.key) {
      setLocked(true);
      setSolvedIndex(index);
      setScore((value) => value + 1);
      setWrongIndex(null);
      setHint("找到了！下一組圖樣正在準備。");

      successTimeoutRef.current = window.setTimeout(() => {
        setLocked(false);
        setSolvedIndex(null);
        setHint("");
        setRoundKey((value) => value + 1);
      }, 650);
      return;
    }

    setWrongIndex(index);
    setHint(`再看看：角度或條紋粗細不同，扣除 ${PENALTY_SECONDS} 秒。`);
    penalize(PENALTY_SECONDS);

    window.clearTimeout(wrongTimeoutRef.current);
    wrongTimeoutRef.current = window.setTimeout(() => {
      setWrongIndex(null);
    }, 720);
  };

  const handleRestart = () => {
    window.clearTimeout(successTimeoutRef.current);
    window.clearTimeout(wrongTimeoutRef.current);
    setStatus("playing");
    setScore(0);
    setAttempts(0);
    setLocked(false);
    setSolvedIndex(null);
    setWrongIndex(null);
    setHint("");
    setRoundKey((value) => value + 1);
    setSessionKey((value) => value + 1);
  };

  return (
    <section className="gabor-session" aria-labelledby="tap-title">
      <SessionBar
        title="圖樣配對消除"
        english="TAP TO MATCH"
        secondsLeft={secondsLeft}
        totalSeconds={totalSeconds}
        onExit={onExit}
      />

      <div className="gabor-stage">
        <div className="tap-target">
          <div className="tap-target__patch">
            <span>目標圖樣</span>
            <div
              className="tap-target__patch-frame"
              data-target-pattern={round.target.key}
            >
              <GaborPatch
                angle={round.target.angle}
                frequency={round.target.frequency}
                size={108}
                label="卡伯爾目標圖樣"
              />
            </div>
          </div>

          <div className="tap-target__copy">
            <p className="gabor-eyebrow">FIND THE TWIN</p>
            <h2 id="tap-title">找出角度與粗細完全相同的一張</h2>
            <p>只有一個圖樣和目標完全一樣。每答對一次，整盤會換上新的圖樣。</p>
          </div>

          <div className="gabor-scoreboard">
            <span>
              <small>配對成功</small>
              <strong>{String(score).padStart(2, "0")}</strong>
            </span>
            <span>
              <small>點擊次數</small>
              <strong>{String(attempts).padStart(2, "0")}</strong>
            </span>
          </div>
        </div>

        <div className="tap-grid" role="group" aria-label="卡伯爾圖樣配對矩陣">
          {round.tiles.map((tile, index) => {
            const isSolved = solvedIndex === index;
            const isWrong = wrongIndex === index;

            return (
              <button
                key={`${roundKey}-${index}`}
                type="button"
                className={`tap-tile ${isSolved ? "is-solved" : ""} ${isWrong ? "is-wrong" : ""}`}
                onClick={() => handleSelect(index)}
                disabled={status !== "playing" || locked || isSolved}
                data-pattern={tile.key}
                aria-label={`圖樣 ${index + 1}`}
              >
                <GaborPatch angle={tile.angle} frequency={tile.frequency} size={72} />
                {isSolved && (
                  <span className="tap-tile__check">
                    <CheckIcon size={16} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="gabor-inline-feedback" aria-live="polite">
          {hint || "先看看目標，再從 16 個圖樣裡找出它的雙胞胎。"}
        </p>
      </div>

      {status === "finished" && (
        <SessionResult
          title="時間到，視線休息一下。"
          description={`這一局你找到了 ${score} 組相同的圖樣。短暫休息後，再回來挑戰更高的專注度。`}
          stats={[
            { label: "配對成功", value: score },
            { label: "點擊次數", value: attempts },
            { label: "訓練時間", value: `${durationMinutes} 分` },
          ]}
          onRetry={handleRestart}
          onExit={onExit}
        />
      )}
    </section>
  );
}
