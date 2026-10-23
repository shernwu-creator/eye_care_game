# 森息 · 20-20-20 護眼練習

一個以「眼球追視體操」與 20-20-20 法則為核心的 React + Vite 護眼小遊戲。

## 功能

- 柔和發光的光點以 `requestAnimationFrame` 在畫面四周與中央緩慢、隨機地移動。
- 預設 20 分鐘專注計時器，可切換 20 / 25 / 30 / 45 分鐘。
- 時間到時光點暫停，全螢幕顯示遠眺提示並倒數 20 秒。
- 完成遠眺後可接續下一輪，並在瀏覽器本機記錄當日完成輪數。
- 低對比森林綠、薄荷綠視覺，支援手機與桌面尺寸，並尊重 `prefers-reduced-motion`。

## 本機開發

```bash
pnpm install
pnpm run dev
```

開發伺服器會以 `/eye_care_game/` 作為路徑前綴。

```bash
pnpm run build
pnpm run preview
```

## GitHub Pages

`vite.config.js` 已設定：

```js
base: "/eye_care_game/";
```

推送到 `main` 分支時，`.github/workflows/deploy.yml` 會自動安裝依賴、建置，並透過 GitHub 官方 Pages Actions 發布 `dist/`。

請在 GitHub 儲存庫的 **Settings → Pages → Build and deployment** 中將 Source 設為 **GitHub Actions**。
