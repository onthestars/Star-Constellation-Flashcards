// js/main.js

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
const southBtn = document.getElementById("southBtn");

const specialBtn = document.getElementById("specialBtn");
const peteChartBtn = document.getElementById("peteChartBtn");

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

    updateViewer(
      index,
      isBack,
      viewer,
      specialBtn,
      prevBtn,
      nextBtn,
      peteChartBtn
    );

  }, 300);
}

// ▼ viewer.js のセットアップ
setupViewerClick(viewer, () => index);
setupPeteChartButton(peteChartBtn);

setupFlipButton(
  flipBtn,
  viewer,
  () => index,
  () => isBack,
  (v) => { isBack = v; },
  specialBtn,
  prevBtn,
  nextBtn,
  peteChartBtn
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
  (idx, back) => updateViewer(
    idx,
    back,
    viewer,
    specialBtn,
    prevBtn,
    nextBtn,
    peteChartBtn
  ),
  () => updateSeasonButtons(currentSeason, seasonImages)
);

// ▼ 季節ボタン
springBtn.onclick = () => {
  animationClass = "fade-in";
  jumpToSeason("spring");
};

summerBtn.onclick = () => {
  animationClass = "fade-in";
  jumpToSeason("summer");
};

autumnBtn.onclick = () => {
  animationClass = "fade-in";
  jumpToSeason("autumn");
};

winterBtn.onclick = () => {
  animationClass = "fade-in";
  jumpToSeason("winter");
};

southBtn.onclick = () => {
  animationClass = "fade-in";
  jumpToSeason("south");
};

// 初期表示
updateViewer(
  index,
  isBack,
  viewer,
  specialBtn,
  prevBtn,
  nextBtn,
  peteChartBtn
);

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

  updateViewer(
    index,
    isBack,
    viewer,
    specialBtn,
    prevBtn,
    nextBtn,
    peteChartBtn
  );
});

// ▼ 今夜の月ガイド
updateMoonObservation();
initMoonObservationPanel();

// =================================
// 星座カードパネルの開閉
// =================================

// =================================
// パネルを最前面に表示
// =================================

let highestPanelZIndex = 10000;

window.bringPanelToFront = function (panel) {

  if (!panel) return;

  highestPanelZIndex++;

  panel.style.zIndex = highestPanelZIndex;

};

function initConstellationCardPanel() {

  const panel = document.querySelector(
    ".constellation-card-panel"
  );

  const closeButton = document.getElementById(
    "cardPanelCloseBtn"
  );

  const showButton = document.getElementById(
    "showCardBtn"
  );

  // 再表示ボタンの状態を更新
  function updateShowButtonState() {

    if (!panel || !showButton) {
      return;
    }

    const isVisible =
      getComputedStyle(panel).display !== "none";

    showButton.style.opacity =
      isVisible ? 0.4 : 1;
  }

  // 閉じるボタン
  if (
    closeButton &&
    panel &&
    !closeButton.dataset.initialized
  ) {

    closeButton.addEventListener("click", function () {

      panel.style.display = "none";

      updateShowButtonState();

    });

    closeButton.dataset.initialized = "true";
  }

  // 再表示ボタン
  if (
    showButton &&
    panel &&
    !showButton.dataset.initialized
  ) {

    showButton.addEventListener("click", function () {
      panel.style.display = "flex";

      window.bringPanelToFront(panel);

      panel.classList.remove("card-panel-fade-in");
      void panel.offsetWidth;
      panel.classList.add("card-panel-fade-in");
      updateShowButtonState();
    });

    showButton.dataset.initialized = "true";
  }

  // 初期状態を反映
  updateShowButtonState();
}

// 星座カードパネルの初期化
initConstellationCardPanel();

// =================================
// プラネタリウムパネルの表示
// =================================

const showPlanetariumBtn = document.getElementById(
  "showPlanetariumBtn"
);

if (showPlanetariumBtn) {

  showPlanetariumBtn.addEventListener("click", function () {

    if (typeof window.openPlanetarium === "function") {
      window.openPlanetarium();
    }

  });

}

// ▼ 凡例へ移動
function jumpToExplanatoryNote() {

  viewer.classList.remove(
    "fade-out",
    "fade-in",
    "slide-out-left",
    "slide-out-right"
  );

  void viewer.offsetWidth;

  viewer.classList.add("fade-out");

  setTimeout(() => {

    index = 1;
    isBack = false;
    isFinalNull = false;

    viewer.classList.remove("fade-out");

    void viewer.offsetWidth;

    viewer.classList.add("fade-in");

    updateViewer(
      index,
      isBack,
      viewer,
      specialBtn,
      prevBtn,
      nextBtn,
      peteChartBtn
    );

  }, 300);
}