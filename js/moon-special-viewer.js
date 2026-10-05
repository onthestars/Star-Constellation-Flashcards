//moon-special-viewer.js

// ================================
// 月スペシャルビューア：状態
// ================================

// 月写真の配列（正しいパス）
const moonImagesReversed = [
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
  "image/moon/Special/Moon-pic011.jpg"
];

// キャプション（必要なら）
const moonCaptionsReversed = [
  "撮影/ 筏 正明さん",
  "撮影/ 筏 正明さん",
  "撮影/ 筏 正明さん",
  "撮影/ 筏 正明さん",
  "撮影/ 筏 正明さん",
  "撮影/ 筏 正明さん",
  "撮影/ 筏 正明さん",
  "撮影/ 筏 正明さん",
  "撮影/ 筏 正明さん",
  "撮影/ 筏 正明さん",
  "撮影/ 筏 正明さん"
];

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

  // フェードアウト開始
  moonSpecialImg.style.opacity = 0;

  // 画像切り替えは少し遅らせる（重要）
  setTimeout(() => {

    moonSpecialIndex = newIndex;

    moonSpecialImg.src = moonImagesReversed[moonSpecialIndex];
    moonSpecialCaption.innerText =
      `${moonCaptionsReversed[moonSpecialIndex]}（${moonSpecialIndex + 1}/${moonImagesReversed.length}）`;

    // フェードイン
    moonSpecialImg.style.opacity = 1;

    updateMoonButtons();

  }, 200); // ← この遅延がないとアニメしない
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

  // 効果音
  if (soundEnabled) {
    soundKirakira.currentTime = 0;
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
