export const BREAK_SECONDS = 20;
export const DEFAULT_DURATION = 20;
export const DURATION_OPTIONS = [20, 25, 30, 45];

export function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.ceil(Number(totalSeconds) || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
