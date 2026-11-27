// js/moon-special-viewer.js

// ================================
// 月スペシャルビューア：状態
// ================================

// ▼ 配列シャッフル
function shuffleArray(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

// ▼ キャプション生成
function buildMoonCaption(data) {

  const parts = [];

  if (data.caption) {
    parts.push(data.caption);
  }

  if (data.date) {
    parts.push(data.date);
  }

  if (data.location) {
    parts.push(data.location);
  }

  if (data.photographer) {
    parts.push(`${data.photographer}撮影`);
  }

  return parts.join("／");
}

// ▼ 最新順
const moonDataReversed = [...moonData].reverse();

// ▼ 最新5枚固定
const latestMoonData = moonDataReversed.slice(0, 5);

// ▼ 残り
const oldMoonData = moonDataReversed.slice(5);

// ▼ 残りのみシャッフル
const shuffledOldMoonData = shuffleArray(oldMoonData);

// ▼ 最終表示順
const displayMoonData = [
  ...latestMoonData,
  ...shuffledOldMoonData
];

let moonSpecialIndex = 0;

// ================================
// 月スペシャルビューア：DOM
// ================================
const moonSpecialViewer = document.getElementById("moon-special-viewer");
const moonSpecialImg = document.getElementById("moon-special-img");
const moonSpecialCaption = document.getElementById("moon-special-caption");
const moonSpecialPrev = document.getElementById("moon-special-prev");
const moonSpecialNext = document.getElementById("moon-special-next");
const moonSpecialClose = document.getElementById("moon-special-close");

// ================================
// スワイプ操作
// ================================
let touchStartX = 0;
let touchEndX = 0;

moonSpecialViewer.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

moonSpecialViewer.addEventListener("touchend", (e) => {

  touchEndX = e.changedTouches[0].screenX;

  const diff = touchEndX - touchStartX;

  if (diff > 50) {

    if (moonSpecialIndex > 0) {
      fadeChangeMoonImage(moonSpecialIndex - 1);
    }

  } else if (diff < -50) {

    if (moonSpecialIndex < displayMoonData.length - 1) {
      fadeChangeMoonImage(moonSpecialIndex + 1);
    }

  }

});

// ================================
// ボタン制御
// ================================
function updateMoonButtons() {

  moonSpecialPrev.disabled = (moonSpecialIndex === 0);
  moonSpecialPrev.style.opacity =
    moonSpecialPrev.disabled ? 0.4 : 1;

  moonSpecialNext.disabled =
    (moonSpecialIndex >= displayMoonData.length - 1);

  moonSpecialNext.style.opacity =
    moonSpecialNext.disabled ? 0.4 : 1;
}


// ================================
// ボタン制御
// ================================
let isMoonTransitioning = false;

function updateMoonButtons() {

  moonSpecialPrev.disabled =
    isMoonTransitioning || moonSpecialIndex === 0;

  moonSpecialPrev.style.opacity =
    moonSpecialPrev.disabled ? 0.4 : 1;

  moonSpecialNext.disabled =
    isMoonTransitioning ||
    moonSpecialIndex >= displayMoonData.length - 1;

  moonSpecialNext.style.opacity =
    moonSpecialNext.disabled ? 0.4 : 1;
}

// ================================
// 画像切替
// ================================
async function fadeChangeMoonImage(newIndex) {

  if (isMoonTransitioning) return;

  if (
    newIndex < 0 ||
    newIndex >= displayMoonData.length ||
    newIndex === moonSpecialIndex
  ) {
    return;
  }

  const direction =
    newIndex > moonSpecialIndex ? "next" : "prev";

  const nextData = displayMoonData[newIndex];

  isMoonTransitioning = true;
  updateMoonButtons();

  try {
    await animateImageTransition(
      moonSpecialImg,
      nextData.image,
      direction,
      () => {
        moonSpecialIndex = newIndex;

        moonSpecialCaption.innerText =
          `${buildMoonCaption(nextData)}（${moonSpecialIndex + 1}/${displayMoonData.length}）`;
      },
    );

  } finally {
    isMoonTransitioning = false;
    updateMoonButtons();
  }
}

// ================================
// 月ビューア起動
// ================================
function openMoonSpecialViewer() {

  moonSpecialViewer.style.display = "flex";

  window.bringPanelToFront(moonSpecialViewer);

  moonSpecialIndex = 0;

  const currentData = displayMoonData[0];

  moonSpecialImg.src = currentData.image;

  moonSpecialCaption.innerText =
    `${buildMoonCaption(currentData)}（1/${displayMoonData.length}）`;

  updateMoonButtons();

  playStarTwinkle();
}

// ================================
// 次へ
// ================================
moonSpecialNext.onclick = () => {

  if (moonSpecialIndex < displayMoonData.length - 1) {
    fadeChangeMoonImage(moonSpecialIndex + 1);
  }

};

// ================================
// 前へ
// ================================
moonSpecialPrev.onclick = () => {

  if (moonSpecialIndex > 0) {
    fadeChangeMoonImage(moonSpecialIndex - 1);
  }

};

// ================================
// 閉じる
// ================================
moonSpecialClose.onclick = () => {
  moonSpecialViewer.style.display = "none";
};