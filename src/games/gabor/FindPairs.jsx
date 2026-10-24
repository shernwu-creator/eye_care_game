import { useEffect, useMemo, useRef, useState } from "react";
import GaborPatch from "../../components/GaborPatch";
import { CheckIcon, EyeIcon } from "../../components/Icons";
import SessionBar from "./SessionBar";
import SessionResult from "./SessionResult";
import { createPairsDeck } from "./gaborUtils";
import useTrainingTimer from "./useTrainingTimer";

const FLIP_BACK_DELAY = 760;
const MATCH_DELAY = 480;

export default function FindPairs({ durationMinutes, onExit }) {
  const [status, setStatus] = useState("playing");
  const [sessionKey, setSessionKey] = useState(0);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [busy, setBusy] = useState(false);
  const [moves, setMoves] = useState(0);
  const [feedback, setFeedback] = useState("");

  const comparisonTimerRef = useRef(0);
  const totalSeconds = durationMinutes * 60;
  const deck = useMemo(() => createPairsDeck(), [sessionKey]);

  const { secondsLeft } = useTrainingTimer({
    durationSeconds: totalSeconds,
    active: status === "playing",
    sessionKey,
    onComplete: () => setStatus("finished"),
  });

  useEffect(() => {
    return () => window.clearTimeout(comparisonTimerRef.current);
  }, []);

  useEffect(() => {
    if (status === "playing") return;
    window.clearTimeout(comparisonTimerRef.current);
    setBusy(false);
  }, [status]);

  const handleCardClick = (cardIndex) => {
    if (status !== "playing" || busy || matched.includes(deck[cardIndex].pairId)) return;
    if (flipped.includes(cardIndex)) return;

    if (flipped.length === 0) {
      setFlipped([cardIndex]);
      setFeedback("再翻開另一張，找出相同的卡伯爾圖樣。");
      return;
    }

    const firstIndex = flipped[0];
    const firstCard = deck[firstIndex];
    const secondCard = deck[cardIndex];
    const nextFlipped = [firstIndex, cardIndex];

    setFlipped(nextFlipped);
    setBusy(true);
    setMoves((value) => value + 1);

    if (firstCard.pairId === secondCard.pairId) {
      comparisonTimerRef.current = window.setTimeout(() => {
        const nextMatched = [...matched, firstCard.pairId];
        setMatched(nextMatched);
        setFlipped([]);
        setBusy(false);
        setFeedback("配成一對，繼續找下一組。");

        if (nextMatched.length === 8) {
          setStatus("won");
        }
      }, MATCH_DELAY);
      return;
    }

    setFeedback("還不是雙胞胎，記住它們的位置。");
    comparisonTimerRef.current = window.setTimeout(() => {
      setFlipped([]);
      setBusy(false);
    }, FLIP_BACK_DELAY);
  };

  const handleRestart = () => {
    window.clearTimeout(comparisonTimerRef.current);
    setStatus("playing");
    setFlipped([]);
    setMatched([]);
    setBusy(false);
    setMoves(0);
    setFeedback("");
    setSessionKey((value) => value + 1);
  };

  return (
    <section className="gabor-session" aria-labelledby="pairs-title">
      <SessionBar
        title="雙胞胎連連看"
        english="FIND PAIRS"
        secondsLeft={secondsLeft}
        totalSeconds={totalSeconds}
        onExit={onExit}
      />

      <div className="gabor-stage pairs-stage">
        <div className="pairs-head">
          <div>
            <p className="gabor-eyebrow">REMEMBER THE TEXTURE</p>
            <h2 id="pairs-title">翻開卡片，找出 8 對相同圖樣</h2>
            <p>角度與條紋頻率相同，才是一對雙胞胎。</p>
          </div>

          <div className="gabor-scoreboard">
            <span>
              <small>找到配對</small>
              <strong>
                {matched.length}
                <em>/8</em>
              </strong>
            </span>
            <span>
              <small>翻牌次數</small>
              <strong>{String(moves).padStart(2, "0")}</strong>
            </span>
          </div>
        </div>

        <div className="pair-grid" role="group" aria-label="卡伯爾圖樣記憶配對">
          {deck.map((card, index) => {
            const isMatched = matched.includes(card.pairId);
            const isFlipped = flipped.includes(index) || isMatched;

            if (isMatched) {
              return (
                <span className="memory-card memory-card--cleared" key={card.cardId} aria-hidden="true">
                  <CheckIcon size={18} />
                </span>
              );
            }

            return (
              <button
                key={card.cardId}
                type="button"
                className={`memory-card ${isFlipped ? "is-flipped" : ""}`}
                onClick={() => handleCardClick(index)}
                disabled={status !== "playing" || busy || isFlipped}
                data-pair={card.pairId}
                aria-label={
                  isFlipped
                    ? `已翻開的卡伯爾圖樣，第 ${index + 1} 張`
                    : `翻開第 ${index + 1} 張卡片`
                }
                aria-pressed={isFlipped}
              >
                <span className="memory-card__inner">
                  <span className="memory-card__face memory-card__back" aria-hidden="true">
                    <span className="memory-card__back-ring">
                      <EyeIcon size={20} />
                    </span>
                    <small>LOOK</small>
                  </span>
                  <span className="memory-card__face memory-card__front" aria-hidden="true">
                    <GaborPatch angle={card.angle} frequency={card.frequency} size={64} />
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="gabor-inline-feedback" aria-live="polite">
          {feedback || "每次翻開兩張；配對成功後，卡片會化為一枚小小的記號。"}
        </p>
      </div>

      {status !== "playing" && (
        <SessionResult
          success={status === "won"}
          title={status === "won" ? "八對雙胞胎，全部找到。" : "時間到，讓眼睛休息一下。"}
          description={
            status === "won"
              ? "你在時間內完成了所有配對。短暫休息後，可以再挑戰更少的翻牌次數。"
              : `這一局找到了 ${matched.length} 對圖樣。記憶需要一點時間，下一次會更順手。`
          }
          stats={[
            { label: "找到配對", value: `${matched.length} / 8` },
            { label: "翻牌次數", value: moves },
            { label: "訓練時間", value: `${durationMinutes} 分` },
          ]}
          onRetry={handleRestart}
          onExit={onExit}
        />
      )}
    </section>
  );
}
