// special-viewer.js

// 効果音 Sound
const soundKirakira = document.getElementById("soundKirakira");

// =====================================
// Special Viewer（写真ビューアー）
// =====================================

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


// ★★★スペシャルビューアページ写真追加の際に編集↓↓↓
function getStarNameFromIndex(i) {
  const season = detectSeasonByIndex(i);

  if (season === "spring") return "Spring-Triangle";

  if (season === "summer") {
    if (i === 27 || i === 36) return "Sagittarius";
    if (i === 35) return "Summer-Triangle";
  }

if (season === "autumn") {
  if (i === 53 || i === 66) return "Pegasus";
  if (i === 54 || i === 67) return "Pisces";
    if (i === 57 || i === 70) return "Cassiopeia";
}

  if (season === "winter") return "Winter-Triangle";

  return null;
}

function getSpecialFolder(starName) {
  if (starName === "Spring-Triangle") return "image/spring/Special/";
  if (starName === "Sagittarius") return "image/summer/Special/";
  if (starName === "Summer-Triangle") return "image/summer/Special/";
  if (starName === "Pegasus") return "image/autumn/Special/";
  if (starName === "Pisces") return "image/autumn/Special/";
    if (starName === "Cassiopeia") return "image/autumn/Special/";
  if (starName === "Winter-Triangle") return "image/winter/Special/";
  return null;
}
// ★★★スペシャルビューアページ写真追加の際に編集↑↑↑

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

specialBtn.onclick = () => {
  if (!hasPhotoFor(index)) return;

  savedIndex = index;
  savedIsBack = isBack;
  specialIndex = 0;
  specialMode  = "normal";

  const starName = getStarNameFromIndex(index);
  if (!starName || !specialPhotos[starName]) return;

  const folder = getSpecialFolder(starName);
  specialImg.src = folder + specialPhotos[starName].normal[0];
  specialCaption.innerHTML = specialPhotos[starName].caption[0].replace(/　/g, "<br>");
  specialViewer.style.display = "flex";

  // ★★★ キラキラ音を再生（音声ONのときだけ）
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

// ★★★ 星が散らばって瞬くエフェクト
playStarTwinkle();

};

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

function applySpecialAnimation() {
  specialImg.classList.remove("sp-slide-next", "sp-slide-prev", "sp-fade");
  void specialImg.offsetWidth;
  if (spAnimationClass) {
    specialImg.classList.add(spAnimationClass);
    spAnimationClass = null;
  }
}

specialLines.onclick = () => {
  specialMode = "normal";
  const starName = getStarNameFromIndex(savedIndex);
  if (!starName || !specialPhotos[starName]) return;
  const folder = getSpecialFolder(starName);

  specialImg.src = folder + specialPhotos[starName].normal[specialIndex];
  specialCaption.innerHTML = specialPhotos[starName].caption[specialIndex].replace(/　/g, "<br>");
  updateSpecialButtons();
};

specialClear.onclick = () => {
  specialMode = "lines";
  const starName = getStarNameFromIndex(savedIndex);
  if (!starName || !specialPhotos[starName]) return;
  const folder = getSpecialFolder(starName);

  specialImg.src = folder + specialPhotos[starName].lines[specialIndex];
  specialCaption.innerHTML = specialPhotos[starName].caption[specialIndex].replace(/　/g, "<br>");
  updateSpecialButtons();
};

specialNext.onclick = () => {
  const starName = getStarNameFromIndex(savedIndex);
  if (!starName || !specialPhotos[starName]) return;
  const folder = getSpecialFolder(starName);

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

specialPrev.onclick = () => {
  const starName = getStarNameFromIndex(savedIndex);
  if (!starName || !specialPhotos[starName]) return;
  const folder = getSpecialFolder(starName);

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

// 表示した瞬間の、星の瞬き効果
function playStarTwinkle() {
  const overlay = document.getElementById("stars-overlay");

  // 既存の星を消す
  overlay.innerHTML = "";

  // 星を 20 個生成（必要なら増減可能）
  for (let i = 0; i < 20; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    // ランダム位置
    const x = Math.random() * 100;
    const y = Math.random() * 100;

    star.style.left = x + "vw";
    star.style.top  = y + "vh";

    // ランダムな開始ディレイ
    star.style.animationDelay = (Math.random() * 1.5) + "s";

    overlay.appendChild(star);
  }

  // 2秒後に星を消す（次回のため）
  setTimeout(() => {
    overlay.innerHTML = "";
  }, 2000);
}
