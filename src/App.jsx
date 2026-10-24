import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import BlinkGame from "./games/blink/BlinkGame";
import FocusGame from "./games/focus/FocusGame";
import DynamicVisionGame from "./components/DynamicVisionGame";
import GaborTraining from "./games/gabor/GaborTraining";
import GazeGame from "./games/gaze/GazeGame";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gaze" element={<GazeGame />} />
        <Route path="/focus" element={<FocusGame />} />
        <Route path="/blink" element={<BlinkGame />} />
        <Route path="/vision" element={<DynamicVisionGame />} />
        <Route path="/gabor" element={<GaborTraining />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
