// moon-special-viewer.js

// ================================
// 月スペシャルビューア：状態
// ================================

// ▼ 月写真データ（昇順管理）
const moonData = [
  {
    image: "image/moon/Special/Moon-pic001.jpg",
    caption: "撮影／筏 正明さん"
  },
  {
    image: "image/moon/Special/Moon-pic002.jpg",
    caption: "撮影／筏 正明さん"
  },
  {
    image: "image/moon/Special/Moon-pic003.jpg",
    caption: "撮影／筏 正明さん"
  },
  {
    image: "image/moon/Special/Moon-pic004.jpg",
    caption: "撮影／筏 正明さん"
  },
  {
    image: "image/moon/Special/Moon-pic005.jpg",
    caption: "撮影／筏 正明さん"
  },
  {
    image: "image/moon/Special/Moon-pic006.jpg",
    caption: "撮影／筏 正明さん"
  },
  {
    image: "image/moon/Special/Moon-pic007.jpg",
    caption: "撮影／筏 正明さん"
  },
  {
    image: "image/moon/Special/Moon-pic008.jpg",
    caption: "撮影／筏 正明さん"
  },
  {
    image: "image/moon/Special/Moon-pic009.jpg",
    caption: "撮影／筏 正明さん"
  },
  {
    image: "image/moon/Special/Moon-pic010.jpg",
    caption: "撮影／筏 正明さん"
  },
  {
    image: "image/moon/Special/Moon-pic011.jpg",
    caption: "撮影／筏 正明さん"
  },
  {
    image: "image/moon/Special/Moon-pic012.jpg",
    caption: "撮影／筏 正明さん"
  },
  {
    image: "image/moon/Special/Moon-pic013.jpg",
    caption: "撮影／筏 正明さん"
  },
  {
    image: "image/moon/Special/Moon-pic014.jpg",
    caption: "撮影／筏 正明さん"
  },
  {
    image: "image/moon/Special/Moon-pic015.jpg",
    caption: "撮影／筏 正明さん"
  }
];

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
// 画像切替
// ================================
function fadeChangeMoonImage(newIndex) {

  const direction =
    (newIndex > moonSpecialIndex) ? "right" : "left";

  moonSpecialImg.classList.remove(
    "moon-slide-in-right",
    "moon-slide-in-left"
  );

  moonSpecialImg.style.opacity = 0;

  setTimeout(() => {

    moonSpecialIndex = newIndex;

    const currentData =
      displayMoonData[moonSpecialIndex];

    moonSpecialImg.src = currentData.image;

    moonSpecialCaption.innerText =
      `${buildMoonCaption(currentData)}（${moonSpecialIndex + 1}/${displayMoonData.length}）`;

    void moonSpecialImg.offsetWidth;

    if (direction === "right") {
      moonSpecialImg.classList.add("moon-slide-in-right");
    } else {
      moonSpecialImg.classList.add("moon-slide-in-left");
    }

    moonSpecialImg.style.opacity = 1;

    updateMoonButtons();

  }, 200);
}

// ================================
// 月ビューア起動
// ================================
function openMoonSpecialViewer() {

  moonSpecialViewer.style.display = "flex";

  moonSpecialIndex = 0;

  const currentData = displayMoonData[0];

  moonSpecialImg.src = currentData.image;

  moonSpecialCaption.innerText =
    `${buildMoonCaption(currentData)}（1/${displayMoonData.length}）`;

  updateMoonButtons();

  if (soundEnabled) {
    soundKirakira.currentTime = 0;
    soundKirakira.volume = 0.2;
    soundKirakira.play();
  }

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