//moon-special-viewer.js

// ================================
// 月スペシャルビューア：状態
// カンマ（,）の位置に注意
// ================================

// ★ 月写真の配列（昇順で管理）
const moonImages = [
  "image/moon/Special/Moon-pic001.jpg",
  "image/moon/Special/Moon-pic002.jpg",
  "image/moon/Special/Moon-pic003.jpg",
  "image/moon/Special/Moon-pic004.jpg",
  "image/moon/Special/Moon-pic005.jpg",
  "image/moon/Special/Moon-pic006.jpg",
  "image/moon/Special/Moon-pic007.jpg",
  "image/moon/Special/Moon-pic008.jpg",
  "image/moon/Special/Moon-pic009.jpg",
  "image/moon/Special/Moon-pic010.jpg",
  "image/moon/Special/Moon-pic011.jpg",
  "image/moon/Special/Moon-pic012.jpg",
  "image/moon/Special/Moon-pic013.jpg",
  "image/moon/Special/Moon-pic014.jpg",
  "image/moon/Special/Moon-pic015.jpg"
];

// キャプション（昇順で管理）
const moonCaptions = [
  "撮影／筏 正明さん",
  "撮影／筏 正明さん",
  "撮影／筏 正明さん",
  "撮影／筏 正明さん",
  "撮影／筏 正明さん", // 005
  "撮影／筏 正明さん",
  "撮影／筏 正明さん",
  "撮影／筏 正明さん",
  "撮影／筏 正明さん",
  "撮影／筏 正明さん", // 010
  "撮影／筏 正明さん",
  "撮影／筏 正明さん",
  "撮影／筏 正明さん",
  "撮影／筏 正明さん",
  "撮影／筏 正明さん" // 015
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

// ▼ 画像とキャプションをペア化
const moonData = moonImages.map((image, index) => ({
  image,
  caption: moonCaptions[index]
}));

// ▼ 最新順へ
const moonDataReversed = [...moonData].reverse();

// ▼ 最新5枚
const latestMoonData = moonDataReversed.slice(0, 5);

// ▼ 残り
const oldMoonData = moonDataReversed.slice(5);

// ▼ 旧画像のみシャッフル
const shuffledOldMoonData = shuffleArray(oldMoonData);

// ▼ 最終表示順
const displayMoonData = [
  ...latestMoonData,
  ...shuffledOldMoonData
];

// ▼ 表示用配列
const moonImagesReversed =
  displayMoonData.map(item => item.image);

const moonCaptionsReversed =
  displayMoonData.map(item => item.caption);

let moonSpecialIndex = 0;

// ================================
// 月スペシャルビューア：DOM
// ================================
const moonSpecialViewer  = document.getElementById("moon-special-viewer");
const moonSpecialImg     = document.getElementById("moon-special-img");
const moonSpecialCaption = document.getElementById("moon-special-caption");
const moonSpecialPrev    = document.getElementById("moon-special-prev");
const moonSpecialNext    = document.getElementById("moon-special-next");
const moonSpecialClose   = document.getElementById("moon-special-close");

// ================================
// スワイプ操作（スマホ用） ← ★ここに置く
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
    if (moonSpecialIndex < moonImagesReversed.length - 1) {
      fadeChangeMoonImage(moonSpecialIndex + 1);
    }
  }
});

// ================================
// ボタン制御
// ================================
function updateMoonButtons() {
  moonSpecialPrev.disabled = (moonSpecialIndex === 0);
  moonSpecialPrev.style.opacity = moonSpecialPrev.disabled ? 0.4 : 1;

  moonSpecialNext.disabled = (moonSpecialIndex >= moonImagesReversed.length - 1);
  moonSpecialNext.style.opacity = moonSpecialNext.disabled ? 0.4 : 1;
}

function fadeChangeMoonImage(newIndex) {

  // どちら方向に動くか判定
  const direction = (newIndex > moonSpecialIndex) ? "right" : "left";

  // 既存アニメーションのリセット
  moonSpecialImg.classList.remove("moon-slide-in-right", "moon-slide-in-left");

  // フェードアウト開始
  moonSpecialImg.style.opacity = 0;

  setTimeout(() => {

    moonSpecialIndex = newIndex;

    moonSpecialImg.src = moonImagesReversed[moonSpecialIndex];
    moonSpecialCaption.innerText =
      `${moonCaptionsReversed[moonSpecialIndex]}（${moonSpecialIndex + 1}/${moonImagesReversed.length}）`;

    // アニメーション再適用のためのリセット
    void moonSpecialImg.offsetWidth;

    // 方向に応じてクラス付与
    if (direction === "right") {
      moonSpecialImg.classList.add("moon-slide-in-right");
    } else {
      moonSpecialImg.classList.add("moon-slide-in-left");
    }

    // フェードイン
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

  // 最初の画像と説明文
  moonSpecialImg.src = moonImagesReversed[0];
  moonSpecialCaption.innerText =
    `${moonCaptionsReversed[0]}（1/${moonImagesReversed.length}）`;

  updateMoonButtons();

if (soundEnabled) {
  soundKirakira.currentTime = 0;
  soundKirakira.volume = 0.2; //音量調整（最大1.0‐最小0.0）
  soundKirakira.play();
}

  // 星の瞬きエフェクト（星座ビューアと共通）
  playStarTwinkle();
}

// ================================
// 次へ
// ================================
moonSpecialNext.onclick = () => {
  if (moonSpecialIndex < moonImagesReversed.length - 1) {
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
