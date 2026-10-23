const MOTES = [
  { left: "8%", top: "36%", size: 2.5, duration: 17, delay: -8 },
  { left: "17%", top: "68%", size: 1.8, duration: 14, delay: -3 },
  { left: "26%", top: "24%", size: 1.5, duration: 19, delay: -12 },
  { left: "38%", top: "78%", size: 2.2, duration: 16, delay: -6 },
  { left: "48%", top: "18%", size: 1.4, duration: 21, delay: -10 },
  { left: "55%", top: "62%", size: 2.7, duration: 18, delay: -2 },
  { left: "66%", top: "32%", size: 1.6, duration: 15, delay: -13 },
  { left: "74%", top: "73%", size: 2, duration: 20, delay: -5 },
  { left: "83%", top: "21%", size: 2.3, duration: 17, delay: -9 },
  { left: "91%", top: "54%", size: 1.5, duration: 22, delay: -15 },
  { left: "31%", top: "49%", size: 1.2, duration: 24, delay: -17 },
  { left: "62%", top: "84%", size: 1.4, duration: 19, delay: -7 },
];

export default function AmbientScene() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient__wash ambient__wash--top" />
      <div className="ambient__wash ambient__wash--left" />
      <div className="ambient__moon" />

      <svg
        className="ambient__contours"
        viewBox="0 0 900 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="currentColor" strokeWidth="1">
          <ellipse cx="672" cy="238" rx="392" ry="272" transform="rotate(-18 672 238)" opacity=".32" />
          <ellipse cx="672" cy="238" rx="332" ry="225" transform="rotate(-18 672 238)" opacity=".3" />
          <ellipse cx="672" cy="238" rx="270" ry="181" transform="rotate(-18 672 238)" opacity=".28" />
          <ellipse cx="672" cy="238" rx="208" ry="137" transform="rotate(-18 672 238)" opacity=".24" />
          <ellipse cx="672" cy="238" rx="148" ry="95" transform="rotate(-18 672 238)" opacity=".2" />
          <ellipse cx="672" cy="238" rx="89" ry="55" transform="rotate(-18 672 238)" opacity=".18" />
        </g>
      </svg>

      <svg
        className="ambient__landscape"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
      >
        <defs>
          <linearGradient id="ridgeBack" x1="720" y1="470" x2="720" y2="900" gradientUnits="userSpaceOnUse">
            <stop stopColor="#315846" stopOpacity=".14" />
            <stop offset="1" stopColor="#0b2119" stopOpacity=".06" />
          </linearGradient>
          <linearGradient id="ridgeMid" x1="720" y1="590" x2="720" y2="900" gradientUnits="userSpaceOnUse">
            <stop stopColor="#264c3b" stopOpacity=".38" />
            <stop offset="1" stopColor="#0a1e17" stopOpacity=".32" />
          </linearGradient>
          <linearGradient id="ridgeFront" x1="720" y1="690" x2="720" y2="900" gradientUnits="userSpaceOnUse">
            <stop stopColor="#193b2d" stopOpacity=".64" />
            <stop offset="1" stopColor="#081b14" stopOpacity=".8" />
          </linearGradient>
          <linearGradient id="mistLine" x1="0" y1="640" x2="1440" y2="640" gradientUnits="userSpaceOnUse">
            <stop stopColor="#b9d7bc" stopOpacity="0" />
            <stop offset=".45" stopColor="#b9d7bc" stopOpacity=".12" />
            <stop offset=".75" stopColor="#b9d7bc" stopOpacity=".07" />
            <stop offset="1" stopColor="#b9d7bc" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M-80 698C120 650 251 621 398 636c178 18 278 70 429 52 158-19 327-111 571-173v385H-80V698Z"
          fill="url(#ridgeBack)"
        />
        <path
          d="M-80 764c190-84 336-142 500-117 189 29 282 99 454 81 188-20 353-94 566-136v308H-80V764Z"
          fill="url(#ridgeMid)"
        />
        <path
          d="M-80 837c224-88 359-107 547-61 196 48 326 61 513 20 190-41 315-89 460-88v192H-80V837Z"
          fill="url(#ridgeFront)"
        />
        <path d="M-60 681c298-49 419-9 668 16 224 22 451-79 839-139" stroke="url(#mistLine)" strokeWidth="1.2" />
        <path d="M-60 724c320-45 446 29 770 6 235-17 395-83 781-113" stroke="url(#mistLine)" strokeWidth=".9" opacity=".7" />
      </svg>

      <div className="ambient__haze" />

      <div className="ambient__motes">
        {MOTES.map((mote, index) => (
          <span
            key={index}
            className="mote"
            style={{
              "--mote-left": mote.left,
              "--mote-top": mote.top,
              "--mote-size": `${mote.size}px`,
              "--mote-duration": `${mote.duration}s`,
              "--mote-delay": `${mote.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="ambient__vignette" />
      <div className="ambient__grain" />
    </div>
  );
}
