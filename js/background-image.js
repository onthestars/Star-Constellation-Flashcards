// 背景画像ランダム読み込み
const portraitImages = [
  "./image/common/background-image-vertical1.jpg",
  "./image/common/background-image-vertical2.jpg",
  "./image/common/background-image-vertical3.jpg"
];

const landscapeImages = [
  "./image/common/background-image-horizontal1.jpg",
  "./image/common/background-image-horizontal2.jpg",
  "./image/common/background-image-horizontal3.jpg"
];

function setRandomBackground() {
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const images = isPortrait ? portraitImages : landscapeImages;
  const randomImage = images[Math.floor(Math.random() * images.length)];

  // ★ Safari対応：CSS変数に渡す
  document.body.style.setProperty("--bg-image", `url(${randomImage})`);
}

setRandomBackground();
