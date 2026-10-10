// star-special-viewer.js

// 効果音
const soundKirakira = document.getElementById("soundKirakira");
soundKirakira.volume = 0.3;   // ★ 音量調節

// Special Viewer（写真ビューアー）
let specialIndex = 0;
let specialMode  = "normal";
let savedIndex   = null;
let savedIsBack  = null;

let spAnimationClass = null;

const specialViewer = document.getElementById("special-viewer");
const specialImg    = document.getElementById("special-img");
const specialCaption = document.getElementById("special-caption");
const specialClose  = document.getElementById("special-close");
const specialLines  = document.getElementById("special-lines");
const specialClear  = document.getElementById("special-clear");
const specialNext   = document.getElementById("special-next");
const specialPrev   = document.getElementById("special-prev");

// ▼ indexからSpecial対象名を取得
function getStarNameFromIndex(i) {

  const cardName = getCardName(i);

  if (!cardName) {
    return null;
  }

  // Special画像未登録のカードは除外
  if (!specialPhotos[cardName]) {
    return null;
  }

  return cardName;
}

// ▼ Special画像フォルダを取得
function getSpecialFolder(index) {

  const season = detectSeasonByIndex(index);

  if (!season) {
    return null;
  }

  return `image/${season}/Special/`;
}

// ボタンの有効／無効
function updateSpecialButtons() {
  const starName = getStarNameFromIndex(savedIndex);
  if (!starName || !specialPhotos[starName]) {
    specialPrev.disabled = true;
    specialNext.disabled = true;
    specialPrev.style.opacity = 0.4;
    specialNext.style.opacity = 0.4;
    return;
  }

  const total = specialPhotos[starName].normal.length;
  specialPrev.disabled = (specialIndex === 0);
  specialPrev.style.opacity = (specialIndex === 0 ? 0.4 : 1);
  specialNext.disabled = (specialIndex >= total - 1);
  specialNext.style.opacity = (specialIndex >= total - 1 ? 0.4 : 1);
}

// Special Viewer 起動
specialBtn.onclick = () => {
  if (!hasPhotoFor(index)) return;

  savedIndex = index;
  savedIsBack = isBack;
  specialIndex = 0;
  specialMode  = "normal";

  const starName = getStarNameFromIndex(index);
  if (!starName || !specialPhotos[starName]) return;

const folder = getSpecialFolder(savedIndex);
  specialImg.src = folder + specialPhotos[starName].normal[0];
  specialCaption.innerHTML = specialPhotos[starName].caption[0].replace(/　/g, "<br>");
  specialViewer.style.display = "flex";

//   // 月専用のSpecialビューワー
//   document.getElementById("moon").onclick = () => {
//     savedIndex = "moon";
//     specialIndex = 0;
//     specialMode = "normal";

//     const starName = "Moon";
//     specialImg.src = "image/special/moon/" + specialPhotos[starName].normal[0];

//     specialViewer.style.display = "flex";
//     updateSpecialButtons();
// };

  // キラキラ音（音声ON時のみ）
  if (soundEnabled) {
    soundKirakira.currentTime = 0;
    soundKirakira.play();
  }

  nextBtn.disabled = true;
  prevBtn.disabled = true;
  flipBtn.disabled = true;
  nextBtn.style.opacity = 0.4;
  prevBtn.style.opacity = 0.4;
  flipBtn.style.opacity = 0.4;

  updateSpecialButtons();

  // 星の瞬きエフェクト
  playStarTwinkle();
};

// Special Viewer 閉じる
specialClose.onclick = () => {
  specialViewer.style.display = "none";
  index = savedIndex;
  isBack = savedIsBack;

  nextBtn.disabled = false;
  prevBtn.disabled = (index === 0);
  flipBtn.disabled = false;
  nextBtn.style.opacity = 1;
  prevBtn.style.opacity = (index === 0 ? 0.4 : 1);
  flipBtn.style.opacity = 1;

  updateViewer();
};

// アニメーション適用
function applySpecialAnimation() {
  specialImg.classList.remove("sp-slide-next", "sp-slide-prev", "sp-fade");
  void specialImg.offsetWidth;
  if (spAnimationClass) {
    specialImg.classList.add(spAnimationClass);
    spAnimationClass = null;
  }
}

// 星座線あり
specialLines.onclick = () => {
  specialMode = "lines";
  const starName = getStarNameFromIndex(savedIndex);
  if (!starName || !specialPhotos[starName]) return;
const folder = getSpecialFolder(savedIndex);

  specialImg.src = folder + specialPhotos[starName].normal[specialIndex];
  specialCaption.innerHTML = specialPhotos[starName].caption[specialIndex].replace(/　/g, "<br>");
  updateSpecialButtons();
};

// 星座線なし
specialClear.onclick = () => {
  specialMode = "normal";
  const starName = getStarNameFromIndex(savedIndex);
  if (!starName || !specialPhotos[starName]) return;
const folder = getSpecialFolder(savedIndex);

  specialImg.src = folder + specialPhotos[starName].lines[specialIndex];
  specialCaption.innerHTML = specialPhotos[starName].caption[specialIndex].replace(/　/g, "<br>");
  updateSpecialButtons();
};

// 次へ
specialNext.onclick = () => {
  const starName = getStarNameFromIndex(savedIndex);
  if (!starName || !specialPhotos[starName]) return;
const folder = getSpecialFolder(savedIndex);

  if (specialIndex < specialPhotos[starName].normal.length - 1) {
    specialIndex++;
    specialMode = "normal";
    spAnimationClass = "sp-slide-next";
    applySpecialAnimation();

    specialImg.src = folder + specialPhotos[starName].normal[specialIndex];
    specialCaption.innerHTML = specialPhotos[starName].caption[specialIndex].replace(/　/g, "<br>");
  }

  updateSpecialButtons();
};

// 前へ
specialPrev.onclick = () => {
  const starName = getStarNameFromIndex(savedIndex);
  if (!starName || !specialPhotos[starName]) return;
const folder = getSpecialFolder(savedIndex);

  if (specialIndex > 0) {
    specialIndex--;
    specialMode = "normal";
    spAnimationClass = "sp-slide-prev";
    applySpecialAnimation();

    specialImg.src = folder + specialPhotos[starName].normal[specialIndex];
    specialCaption.innerHTML = specialPhotos[starName].caption[specialIndex].replace(/　/g, "<br>");
  }

  updateSpecialButtons();
};

// スワイプ操作
let spStartX = 0;
let spEndX = 0;

specialImg.addEventListener("touchstart", (e) => {
  spStartX = e.touches[0].clientX;
});

specialImg.addEventListener("touchend", (e) => {
  spEndX = e.changedTouches[0].clientX;
  const diff = spEndX - spStartX;
  if (Math.abs(diff) < 50) return;

  if (diff < 0) {
    spAnimationClass = "sp-slide-next";
    specialNext.onclick();
  } else {
    spAnimationClass = "sp-slide-prev";
    specialPrev.onclick();
  }
});

// 星の瞬きエフェクト
function playStarTwinkle() {
  const overlay = document.getElementById("stars-overlay");

  overlay.innerHTML = "";

  for (let i = 0; i < 20; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    const x = Math.random() * 100;
    const y = Math.random() * 100;

    star.style.left = x + "vw";
    star.style.top  = y + "vh";

    star.style.animationDelay = (Math.random() * 1.5) + "s";

    overlay.appendChild(star);
  }

  setTimeout(() => {
    overlay.innerHTML = "";
  }, 2000);
}