# 森息 · 眼部療癒遊戲選集

以森林綠與薄荷綠為基調的 React + Vite 護眼小遊戲合集。從主選單挑選一場溫柔的視覺練習，讓眼睛在低對比、低刺激的畫面裡慢慢放鬆。

## 遊戲

| 遊戲 | 路徑 | 內容 |
| --- | --- | --- |
| 追視漫步 | `#/gaze` | 讓目光跟著柔光移動，內建 20-20-20 番茄鐘與 20 秒遠眺休息。 |
| 遠近對焦 | `#/focus` | 80 秒、8 趟近處指尖與遠方窗景的對焦切換，舒展睫狀肌。 |
| 眨眼花園 | `#/blink` | 60 秒的眨眼練習，每一次輕柔眨眼都會種下一朵花。 |
| 動態視力訓練 | `#/vision` | 記住移動圓圈上的數字，在號碼隱藏後依序點擊；每過一關增加圓圈與速度。 |

## 專案架構

```text
src/
├── App.jsx                  # HashRouter 與遊戲路由
├── pages/
│   └── Home.jsx             # 主選單
├── games/
│   ├── gaze/GazeGame.jsx    # 追視漫步（獨立遊戲元件）
│   ├── gaze/…               # 光點、計時器、遠眺與指南元件
│   ├── focus/FocusGame.jsx  # 遠近對焦
│   └── blink/BlinkGame.jsx  # 眨眼花園
├── components/
│   ├── DynamicVisionGame.jsx # 動態視力訓練
│   ├── GameHeader.jsx        # 共用遊戲頂欄
│   ├── AmbientScene.jsx      # 森林背景
│   └── …                     # 共用品牌、圖示與花朵插畫
├── lib/time.js
├── tailwind.css             # Tailwind utilities（選擇性載入，不含 preflight）
├── styles.css               # 共用視覺與原追視遊戲樣式
├── collection.css           # 主選單與其他遊戲樣式
└── vision.css               # 動態視力遊戲樣式
```

`App.jsx` 使用 `HashRouter`，因此部署到 GitHub Pages 後仍可直接重新整理或分享 `#/gaze`、`#/focus`、`#/blink`、`#/vision` 等深層路徑。

動態視力以 `requestAnimationFrame` 直接在 DOM ref 上更新座標，避免每幀觸發 React re-render；邊界碰撞、計時器與動畫幀都會在 `useEffect` cleanup 中清除。主舞台使用 Tailwind utility（`bg-emerald-50`、`bg-white/95`、`text-emerald-700`、`shadow-sm`）搭配專屬 CSS 完成。

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

線網站點：<https://shernwu-creator.github.io/eye_care_game/>

若 Pages 尚未啟用，請在 GitHub 儲存庫的 **Settings → Pages → Build and deployment** 中將 Source 設為 **GitHub Actions**。
