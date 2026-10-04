// special-viewer.js

// 効果音
const soundKirakira = document.getElementById("soundKirakira");
soundKirakira.volume = 0.4;

// ================================
// 星座モード用 Special Viewer
// ================================
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

// ================================
// 月モード専用 Special Viewer
// ================================
let moonSpecialIndex = 0;

const moonSpecialViewer = document.getElementById("moon-special-viewer");
const moonSpecialImg    = document.getElementById("moon-special-img");
const moonSpecialCaption = document.getElementById("moon-special-caption");
const moonSpecialPrev   = document.getElementById("moon-special-prev");
const moonSpecialNext   = document.getElementById("moon-special-next");
const moonSpecialClose  = document.getElementById("moon-special-close");

// ================================
// 星座モード：星座名取得
// ================================
function getStarNameFromIndex(i) {
  const season = detectSeasonByIndex(i);

  if (season === "spring") {
    if (i === 10 || i === 21) return "Leo";
    if (i === 2 || i === 13) return "Ursa-Minor";
    if (i === 12) return "Spring-Triangle";
  }
  if (season === "summer") {
    if (i === 27 || i === 41) return "Sagittarius";
    if (i === 32 || i === 46) return "Ophiuchus";
    if (i === 35) return "Summer-Triangle";
  }
  if (season === "autumn") {
    if (i === 53 || i === 66) return "Pegasus";
    if (i === 49 || i === 62) return "Aquarius";
    if (i === 54 || i === 67) return "Pisces";
    if (i === 51 || i === 64) return "Capricornus";
    if (i === 52 || i === 65) return "Equuleus";
    if (i === 57 || i === 70) return "Cassiopeia";
  }
  if (season === "winter") {
    if (i === 75 || i === 84) return "Gemini";
    if (i === 78 || i === 87) return "Orion";
    if (i === 83) return "Winter-Triangle";
  }

  return null;
}

// 星座モード：フォルダ
function getSpecialFolder(starName) {
  if (starName === "Ursa-Minor") return "image/spring/Special/";
  if (starName === "Leo") return "image/spring/Special/";
  if (starName === "Spring-Triangle") return "image/spring/Special/";
  if (starName === "Sagittarius") return "image/summer/Special/";
  if (starName === "Ophiuchus") return "image/summer/Special/";
  if (starName === "Summer-Triangle") return "image/summer/Special/";
  if (starName === "Pegasus") return "image/autumn/Special/";
  if (starName === "Aquarius") return "image/autumn/Special/";
  if (starName === "Pisces") return "image/autumn/Special/";
  if (starName === "Capricornus") return "image/autumn/Special/";
  if (starName === "Equuleus") return "image/autumn/Special/";
  if (starName === "Cassiopeia") return "image/autumn/Special/";
  if (starName === "Gemini") return "image/winter/Special/";
  if (starName === "Orion") return "image/winter/Special/";
  if (starName === "Winter-Triangle") return "image/winter/Special/";
  return null;
}

// 星座モード：ボタン制御
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

// ================================
// 星座モード：Special Viewer 起動
// ================================
function openSpecialViewer(target) {

  // ★ 月モードは別ビューアへ
  if (target === "moon") {
    openMoonSpecialViewer();
    return;
  }

  specialViewer.style.display = "flex";
  specialIndex = 0;
  specialMode  = "normal";

  savedIndex = index;
  savedIsBack = isBack;

  const starName = getStarNameFromIndex(index);
  if (!starName || !specialPhotos[starName]) return;

  const folder = getSpecialFolder(starName);

  specialImg.src = folder + specialPhotos[starName].normal[0];
  specialCaption.innerHTML = specialPhotos[starName].caption[0].replace(/　/g, "<br>");

  nextBtn.disabled = true;
  prevBtn.disabled = true;
  flipBtn.disabled = true;
  nextBtn.style.opacity = 0.4;
  prevBtn.style.opacity = 0.4;
  flipBtn.style.opacity = 0.4;

  updateSpecialButtons();
  playStarTwinkle();
}

// ================================
// 星座モード：閉じる
// ================================
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

// ================================
// 星座モード：次へ／前へ
// ================================
specialNext.onclick = () => {
  const starName = getStarNameFromIndex(savedIndex);
  if (!starName || !specialPhotos[starName]) return;

  const folder = getSpecialFolder(starName);

  if (specialIndex < specialPhotos[starName].normal.length - 1) {
    specialIndex++;
    spAnimationClass = "sp-slide-next";
    applySpecialAnimation();

    specialImg.src = folder + specialPhotos[starName].normal[specialIndex];
    specialCaption.innerHTML = specialPhotos[starName].caption[specialIndex].replace(/　/g, "<br>");
  }

  updateSpecialButtons();
};

specialPrev.onclick = () => {
  const starName = getStarNameFromIndex(savedIndex);
  if (!starName || !specialPhotos[starName]) return;

  const folder = getSpecialFolder(starName);

  if (specialIndex > 0) {
    specialIndex--;
    spAnimationClass = "sp-slide-prev";
    applySpecialAnimation();

    specialImg.src = folder + specialPhotos[starName].normal[specialIndex];
    specialCaption.innerHTML = specialPhotos[starName].caption[specialIndex].replace(/　/g, "<br>");
  }

  updateSpecialButtons();
};

// ================================
// 月モード：ボタン制御（逆順対応）
// ================================
function updateMoonButtons() {
  moonSpecialPrev.disabled = (moonSpecialIndex === 0);
  moonSpecialPrev.style.opacity = (moonSpecialIndex === 0 ? 0.4 : 1);

  moonSpecialNext.disabled = (moonSpecialIndex >= moonImagesReversed.length - 1);
  moonSpecialNext.style.opacity = (moonSpecialIndex >= moonImagesReversed.length - 1 ? 0.4 : 1);
}

// ================================
// 月モード：Special Viewer 起動（逆順対応）
// ================================
function openMoonSpecialViewer() {

  moonSpecialViewer.style.display = "flex";
  moonSpecialIndex = 0;

  moonSpecialImg.src = moonImagesReversed[0];
  moonSpecialCaption.innerText =
    `${moonCaptionsReversed[0]}（1/${moonImagesReversed.length}）`;

  updateMoonButtons();

  nextBtn.disabled = true;
  prevBtn.disabled = true;
  flipBtn.disabled = true;
  nextBtn.style.opacity = 0.4;
  prevBtn.style.opacity = 0.4;
  flipBtn.style.opacity = 0.4;

  if (soundEnabled) {
    soundKirakira.currentTime = 0;
    soundKirakira.play();
  }

  playStarTwinkle();
}

// ================================
// 月モード：次へ／前へ（逆順対応）
// ================================
moonSpecialNext.onclick = () => {
  if (moonSpecialIndex < moonImagesReversed.length - 1) {
    moonSpecialIndex++;

    moonSpecialImg.src = moonImagesReversed[moonSpecialIndex];
    moonSpecialCaption.innerText =
      `${moonCaptionsReversed[moonSpecialIndex]}（${moonSpecialIndex + 1}/${moonImagesReversed.length}）`;
  }

  updateMoonButtons();
};

moonSpecialPrev.onclick = () => {
  if (moonSpecialIndex > 0) {
    moonSpecialIndex--;

    moonSpecialImg.src = moonImagesReversed[moonSpecialIndex];
    moonSpecialCaption.innerText =
      `${moonCaptionsReversed[moonSpecialIndex]}（${moonSpecialIndex + 1}/${moonImagesReversed.length}）`;
  }

  updateMoonButtons();
};

// ================================
// 月モード：閉じる
// ================================
moonSpecialClose.onclick = () => {

  moonSpecialViewer.style.display = "none";

  nextBtn.disabled = false;
  prevBtn.disabled = false;
  flipBtn.disabled = false;

  nextBtn.style.opacity = 1;
  prevBtn.style.opacity = 1;
  flipBtn.style.opacity = 1;
};

// ================================
// スワイプ操作（星座モードのみ）
// ================================
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
    specialNext.onclick();
  } else {
    specialPrev.onclick();
  }
});

// ================================
// 星の瞬きエフェクト
// ================================
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
