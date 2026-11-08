
// js/background-image.js

// 縦向き背景画像
const portraitImages = [
  "./image/common/background-image-vertical1.jpg",
  "./image/common/background-image-vertical2.jpg",
  "./image/common/background-image-vertical3.jpg"
];

// 横向き背景画像
const landscapeImages = [
  "./image/common/background-image-horizontal1.jpg",
  "./image/common/background-image-horizontal2.jpg",
  "./image/common/background-image-horizontal3.jpg"
];

// 背景画像とタイトル画像を設定
function setRandomBackground() {

  const isPortrait =
    window.matchMedia("(orientation: portrait)").matches;

  const images = isPortrait
    ? portraitImages
    : landscapeImages;

  const randomImage =
    images[Math.floor(Math.random() * images.length)];

  // 背景画像を設定
  document.body.style.backgroundImage =
    `url(${randomImage})`;

  // タイトル画像を切り替え
  const titleImage =
    randomImage.includes("vertical1") ||
    randomImage.includes("horizontal1")
      ? "./image/common/app-title-shadow.png"
      : "./image/common/app-title-highlight.png";

  const titleElement =
    document.getElementById("app-title-image");

  if (titleElement) {
    titleElement.src = titleImage;
  }
}

setRandomBackground();
