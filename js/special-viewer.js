// =====================================
// Special Viewer（写真ビューアー）
// =====================================

// Special viewer の状態
let specialIndex = 0;          // 0 → 1枚目, 1 → 2枚目…
let specialMode  = "normal";   // "normal" or "lines"
let savedIndex   = null;
let savedIsBack  = null;

// ★ Special viewer 用アニメーション（写真切り替え専用）
let spAnimationClass = null;

// DOM
const specialViewer = document.getElementById("special-viewer");
const specialImg    = document.getElementById("special-img");
const specialClose  = document.getElementById("special-close");
const specialLines  = document.getElementById("special-lines");
const specialClear  = document.getElementById("special-clear");
const specialNext   = document.getElementById("special-next");
const specialPrev   = document.getElementById("special-prev");

// =====================================
// ★ 星座名を index から取得（季節判定ベース）
//   → images に依存しないようにする
// =====================================
function getStarNameFromIndex(i) {
  const season = detectSeasonByIndex(i);  // main.js に定義済み

  if (season === "spring") return "Spring-Triangle";
  if (season === "summer") return "Summer-Triangle";

  // それ以外は今は未対応
  return null;
}

// =====================================
// ★ Special フォルダを星座名から取得
// =====================================
function getSpecialFolder(starName) {
  if (starName === "Spring-Triangle") return "image/spring/Special/";
  if (starName === "Summer-Triangle") return "image/summer/Special/";
  return "image/other/Special/";
}

// =====================================
// Special viewer のボタン状態更新
// =====================================
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

  // ★ 前へボタン
  specialPrev.disabled = (specialIndex === 0);
  specialPrev.style.opacity = (specialIndex === 0 ? 0.4 : 1);

  // ★ 次へボタン
  specialNext.disabled = (specialIndex >= total - 1);
  specialNext.style.opacity = (specialIndex >= total - 1 ? 0.4 : 1);
}

// =====================================
// ★ Special viewer を開く
// =====================================
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
  specialViewer.style.display = "flex";

  // 通常 viewer のボタンを無効化
  nextBtn.disabled = true;
  prevBtn.disabled = true;
  flipBtn.disabled = true;

  nextBtn.style.opacity = 0.4;
  prevBtn.style.opacity = 0.4;
  flipBtn.style.opacity = 0.4;

  updateSpecialButtons();
};

// =====================================
// ★ Special viewer を閉じる
// =====================================
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

// =====================================
// ★ アニメ適用（写真切り替え専用）
// =====================================
function applySpecialAnimation() {
  specialImg.classList.remove("sp-slide-next", "sp-slide-prev", "sp-fade");
  void specialImg.offsetWidth; // 強制リフロー
  if (spAnimationClass) {
    specialImg.classList.add(spAnimationClass);
    spAnimationClass = null;
  }
}

// =====================================
// ★ 星座線なし（specialIndex を維持）
// =====================================
specialLines.onclick = () => {
  specialMode = "normal";

  const starName = getStarNameFromIndex(savedIndex);
  if (!starName || !specialPhotos[starName]) return;

  const folder = getSpecialFolder(starName);

  specialImg.src = folder + specialPhotos[starName].normal[specialIndex];
  updateSpecialButtons();
};

// =====================================
// ★ 星座線あり（specialIndex を維持）
// =====================================
specialClear.onclick = () => {
  specialMode = "lines";

  const starName = getStarNameFromIndex(savedIndex);
  if (!starName || !specialPhotos[starName]) return;

  const folder = getSpecialFolder(starName);

  specialImg.src = folder + specialPhotos[starName].lines[specialIndex];
  updateSpecialButtons();
};

// =====================================
// ★ Special写真：「次へ」
// =====================================
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
  }

  updateSpecialButtons();
};

// =====================================
// ★ Special写真：「前へ」
// =====================================
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
  }

  updateSpecialButtons();
};

// =====================================
// ★ Special viewer のスワイプ操作
// =====================================
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
