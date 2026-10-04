// main.js

// サウンドON/OFFボタンの初期化（sound-controls.js）
soundControlsInit();

// カードアニメーション初期化
animationControlsInit();

// 状態
let currentSeason = null;
let index = 0;
let isBack = false;
let isFinalNull = false;
let animationClass = null;

// DOM
const viewer = document.getElementById("card-img");
const prevBtn = document.getElementById("prevBtn");
const flipBtn = document.getElementById("flipBtn");
const nextBtn = document.getElementById("nextBtn");

const springBtn = document.getElementById("springBtn");
const summerBtn = document.getElementById("summerBtn");
const autumnBtn = document.getElementById("autumnBtn");
const winterBtn = document.getElementById("winterBtn");
const southBtn  = document.getElementById("southBtn");

const specialBtn = document.getElementById("specialBtn");

// 効果音
const soundFlip   = document.getElementById("soundFlip");
const soundPage   = document.getElementById("soundPage");
const soundSeason = document.getElementById("soundSeason");

// 季節ジャンプ（フェードアウト → フェードイン）
function jumpToSeason(season) {

  viewer.classList.remove("flip-rotate");
  viewer.classList.remove("fade-out", "fade-in", "slide-out-left", "slide-out-right");
  void viewer.offsetWidth;
  viewer.classList.add("fade-out");

  setTimeout(() => {

    currentSeason = season;
    updateSeasonButtons(currentSeason, seasonImages);

    index = seasonStart[season];
    isBack = false;
    isFinalNull = false;

    viewer.classList.remove("fade-out");
    void viewer.offsetWidth;
    viewer.classList.add("fade-in");

    updateViewer(index, isBack, viewer, specialBtn, prevBtn, nextBtn);

  }, 300);
}

// ▼ viewer.js のセットアップ
setupViewerClick(viewer, () => index);

setupFlipButton(
  flipBtn,
  viewer,
  () => index,
  () => isBack,
  (v) => { isBack = v; },
  specialBtn,
  prevBtn,
  nextBtn
);

// ▼ navigation.js のセットアップ
setupNavigation(
  nextBtn,
  prevBtn,
  viewer,
  () => index,
  (v) => { index = v; },
  () => isBack,
  (v) => { isBack = v; },
  () => isFinalNull,
  (v) => { isFinalNull = v; },
  () => currentSeason,
  (v) => { currentSeason = v; },
  () => animationClass,
  (v) => { animationClass = v; },
  (idx, back) => updateViewer(idx, back, viewer, specialBtn, prevBtn, nextBtn),
  () => updateSeasonButtons(currentSeason, seasonImages)
);

// ▼ 季節ボタン
springBtn.onclick = () => {
  if (soundEnabled) {
    soundSeason.currentTime = 0;
    soundSeason.play();
  }
  animationClass = "fade-in";
  jumpToSeason("spring");
};

summerBtn.onclick = () => {
  if (soundEnabled) {
    soundSeason.currentTime = 0;
    soundSeason.play();
  }
  animationClass = "fade-in";
  jumpToSeason("summer");
};

autumnBtn.onclick = () => {
  if (soundEnabled) {
    soundSeason.currentTime = 0;
    soundSeason.play();
  }
  animationClass = "fade-in";
  jumpToSeason("autumn");
};

winterBtn.onclick = () => {
  if (soundEnabled) {
    soundSeason.currentTime = 0;
    soundSeason.play();
  }
  animationClass = "fade-in";
  jumpToSeason("winter");
};

southBtn.onclick = () => {
  if (soundEnabled) {
    soundSeason.currentTime = 0;
    soundSeason.play();
  }
  animationClass = "fade-in";
  jumpToSeason("south");
};

// 初期表示
updateViewer(index, isBack, viewer, specialBtn, prevBtn, nextBtn);

// 外部リンクから戻った場合の復帰処理
window.addEventListener("load", () => {

  if (sessionStorage.getItem("fromExternal") === "true") {

    const saved = sessionStorage.getItem("lastCardIndex");
    index = (saved !== null) ? Number(saved) : 0;

    sessionStorage.removeItem("fromExternal");

  } else {
    index = 0;
  }

  isBack = false;
  isFinalNull = false;

  updateViewer(index, isBack, viewer, specialBtn, prevBtn, nextBtn);
});

// Special Thanks
document.getElementById("specialThanksBtn").addEventListener("click", () => {
  window.open("https://peteworden.github.io/Soleil/chart.html", "_blank");
});

// スマホ横画面警告表示
function isSmartphone() {
  return /iPhone|Android.+Mobile/.test(navigator.userAgent);
}

function updateOrientationWarning() {
  const warn = document.getElementById("rotate-warning");

  // PC・タブレットは常に非表示
  if (!isSmartphone()) {
    warn.style.display = "none";
    return;
  }

  // スマホだけ横画面判定
  if (window.innerWidth > window.innerHeight) {
    warn.style.display = "flex";
  } else {
    warn.style.display = "none";
  }
}

window.addEventListener("resize", updateOrientationWarning);
window.addEventListener("orientationchange", updateOrientationWarning);

// 初期実行
updateOrientationWarning();
