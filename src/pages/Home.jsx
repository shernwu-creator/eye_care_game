import { useEffect } from "react";
import { Link } from "react-router-dom";
import AmbientScene from "../components/AmbientScene";
import { ArrowUpRightIcon, BrandMark } from "../components/Icons";
import FlowerHead from "../components/FlowerHead";

function GazeArt() {
  return (
    <span className="card-art card-art--gaze" aria-hidden="true">
      <span className="gaze-art__ring gaze-art__ring--outer" />
      <span className="gaze-art__ring gaze-art__ring--inner" />
      <span className="gaze-art__orb" />
      <span className="gaze-art__spark gaze-art__spark--one" />
      <span className="gaze-art__spark gaze-art__spark--two" />
      <span className="gaze-art__spark gaze-art__spark--three" />
    </span>
  );
}

function FocusArt() {
  return (
    <span className="card-art card-art--focus" aria-hidden="true">
      <span className="focus-art__glow" />
      <span className="focus-art__ridge focus-art__ridge--back" />
      <span className="focus-art__ridge focus-art__ridge--front" />
      <span className="focus-art__path" />
      <span className="focus-art__near">
        <i />
      </span>
      <span className="focus-art__far">
        <i />
      </span>
      <span className="focus-art__horizon" />
    </span>
  );
}

function BlinkArt() {
  return (
    <span className="card-art card-art--blink" aria-hidden="true">
      <span className="blink-art__glow" />
      {[
        { x: "32%", scale: 0.9, delay: "0s" },
        { x: "50%", scale: 1.15, delay: "-1.4s" },
        { x: "68%", scale: 0.8, delay: "-2.6s" },
      ].map((flower, index) => (
        <span
          key={index}
          className="blink-art__flower"
          style={{ "--flower-x": flower.x, "--flower-scale": flower.scale, "--flower-delay": flower.delay }}
        >
          <span className="blink-art__stem" />
          <FlowerHead className="blink-art__head" />
        </span>
      ))}
      <span className="blink-art__eye">
        <span className="blink-art__eye-line" />
        <i />
        <i />
        <i />
      </span>
    </span>
  );
}

const GAMES = [
  {
    number: "01",
    path: "/gaze",
    title: "追視漫步",
    english: "GAZE WALK",
    description: "跟著柔光在森林裡慢慢漫遊，二十分鐘後一起望向遠方。",
    duration: "20 分鐘",
    tags: ["眼球追視", "20-20-20"],
    tone: "mint",
    art: <GazeArt />,
  },
  {
    number: "02",
    path: "/focus",
    title: "遠近對焦",
    english: "FOCUS SHIFT",
    description: "在指尖與窗外之間來回對焦，讓緊繃的視線做一場伸展。",
    duration: "80 秒",
    tags: ["遠近切換", "睫狀肌"],
    tone: "sage",
    art: <FocusArt />,
  },
  {
    number: "03",
    path: "/blink",
    title: "眨眼花園",
    english: "BLINK BLOOM",
    description: "跟著呼吸輕輕眨眼，一分鐘的時間，讓花園慢慢盛開。",
    duration: "60 秒",
    tags: ["眨眼練習", "深呼吸"],
    tone: "cream",
    art: <BlinkArt />,
  },
];

export default function Home() {
  useEffect(() => {
    document.title = "森息 · 眼部療癒選集";
  }, []);

  return (
    <div className="home">
      <AmbientScene />
      <div className="home__veil" aria-hidden="true" />

      <header className="home-header">
        <Link className="brand home-brand" to="/" aria-label="森息首頁">
          <span className="brand__mark">
            <BrandMark size={44} />
          </span>
          <span className="brand__copy">
            <span className="brand__name">
              森息
              <span className="brand__roman">MORI EYE</span>
            </span>
            <span className="brand__tagline">眼部療癒選集 · EYE CARE COLLECTION</span>
          </span>
        </Link>

        <div className="home-header__meta">
          <span className="home-header__count">
            <b>03</b> 個練習
          </span>
          <span className="home-header__divider" />
          <span className="home-header__edition">VOL. 01</span>
        </div>
      </header>

      <main className="home-main">
        <section className="home-hero" aria-labelledby="home-title">
          <p className="hero-eyebrow home-eyebrow">
            <span className="hero-eyebrow__line" />
            A SMALL RITUAL FOR TIRED EYES
            <span className="hero-eyebrow__line" />
          </p>
          <h1 className="home-title" id="home-title">
            給眼睛的<span className="home-title__rest"><em>三種散步</em>。</span>
          </h1>
          <p className="home-intro">
            呼吸、眨眼，望向遠方。挑一個練習，讓視線在綠意裡慢慢鬆開。
          </p>
          <div className="home-rule" aria-hidden="true">
            <span className="home-rule__dot" />
            <span>每 20 分鐘</span>
            <i />
            <span>遠眺 20 呎</span>
            <i />
            <span>停留 20 秒</span>
          </div>
        </section>

        <section className="game-library" aria-labelledby="game-library-title">
          <div className="game-library__head">
            <h2 id="game-library-title">選擇今天的練習</h2>
            <span>03 EXPERIENCES</span>
          </div>

          <div className="game-grid">
            {GAMES.map((game, index) => (
              <Link
                key={game.path}
                className={`game-card game-card--${game.tone}`}
                to={game.path}
                style={{ "--card-index": index }}
                aria-label={`開始${game.title}，${game.description}`}
              >
                <span className="game-card__preview">
                  <span className="game-card__number">{game.number}</span>
                  <span className="game-card__duration">{game.duration}</span>
                  {game.art}
                </span>

                <div className="game-card__body">
                  <span className="game-card__english">{game.english}</span>
                  <div className="game-card__title-row">
                    <h3 className="game-card__title">{game.title}</h3>
                    <span className="game-card__arrow">
                      <ArrowUpRightIcon size={16} />
                    </span>
                  </div>
                  <p className="game-card__description">{game.description}</p>
                  <div className="game-card__footer">
                    <span className="game-card__tags">
                      {game.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </span>
                    <span className="game-card__enter">開始</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <span>MORI EYE · EYE CARE COLLECTION</span>
        <span className="home-footer__line" />
        <span>LOOK FAR · BLINK SOFTLY · BREATHE</span>
      </footer>
    </div>
  );
}
