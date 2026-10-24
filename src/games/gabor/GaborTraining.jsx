import { useCallback, useEffect, useState } from "react";
import AmbientScene from "../../components/AmbientScene";
import GameHeader from "../../components/GameHeader";
import GaborMenu from "./GaborMenu";
import TapToMatch from "./TapToMatch";
import FindPairs from "./FindPairs";
import StaringRelaxation from "./StaringRelaxation";
import TipsModal from "./TipsModal";
import "./gabor.css";

const VIEW_META = {
  menu: { label: "訓練選單", tone: "idle" },
  tap: { label: "圖樣配對中", tone: "running" },
  pairs: { label: "記憶配對中", tone: "running" },
  relax: { label: "靜態注視中", tone: "running" },
};

export default function GaborTraining() {
  const [durationMinutes, setDurationMinutes] = useState(1);
  const [view, setView] = useState("menu");
  const [tipsOpen, setTipsOpen] = useState(false);

  useEffect(() => {
    document.title = "卡伯爾視覺訓練 · 森息";
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [view]);

  const handleExitModule = useCallback(() => setView("menu"), []);
  const closeTips = useCallback(() => setTipsOpen(false), []);

  const meta = VIEW_META[view] ?? VIEW_META.menu;

  return (
    <div className={`game-page gabor-page gabor-page--${view}`}>
      <AmbientScene />
      <div className="game-page__veil" aria-hidden="true" />

      <GameHeader
        title="卡伯爾視覺訓練"
        english="GABOR TRAINING"
        statusLabel={meta.label}
        statusTone={meta.tone}
        meta={`${durationMinutes} 分鐘 · 視覺皮層訓練`}
      />

      <main className="gabor-main">
        {view === "menu" && (
          <GaborMenu
            durationMinutes={durationMinutes}
            onDurationChange={setDurationMinutes}
            onLaunch={setView}
            onOpenTips={() => setTipsOpen(true)}
          />
        )}

        {view === "tap" && (
          <TapToMatch durationMinutes={durationMinutes} onExit={handleExitModule} />
        )}

        {view === "pairs" && (
          <FindPairs durationMinutes={durationMinutes} onExit={handleExitModule} />
        )}

        {view === "relax" && (
          <StaringRelaxation durationMinutes={durationMinutes} onExit={handleExitModule} />
        )}
      </main>

      <footer className="game-footer">
        <span>GABOR PATCH</span>
        <i />
        <span>VISUAL CORTEX</span>
        <i />
        <span>SOFT FOCUS</span>
      </footer>

      {tipsOpen && <TipsModal onClose={closeTips} />}
    </div>
  );
}
