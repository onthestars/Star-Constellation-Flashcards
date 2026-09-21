// =====================================
// Special Viewer（写真ビューアー）
// =====================================

// Special viewer の状態
let specialIndex = 0;          // 0 → 1枚目, 1 → 2枚目
let specialMode  = "normal";   // "normal" or "lines"
let savedIndex   = null;
let savedIsBack  = null;

// DOM
const specialViewer = document.getElementById("special-viewer");
const specialImg    = document.getElementById("special-img");
const specialClose  = document.getElementById("special-close");
const specialLines  = document.getElementById("special-lines");
const specialClear  = document.getElementById("special-clear");
const specialNext   = document.getElementById("special-next");
const specialPrev   = document.getElementById("special-prev");
// ★ specialBtn は main.js で取得済みなので、ここでは宣言しない
// const specialBtn = document.getElementById("specialBtn");


// =====================================
// 星座名を index から取得（今は固定）
// =====================================
function getStarNameFromIndex(i) {
  return "Spring-Triangle";   // ★後で拡張可能
}

// =====================================
// Special viewer のボタン状態更新
// =====================================
function updateSpecialButtons() {
  const starName = getStarNameFromIndex(savedIndex);
  const total = specialPhotos[starName].normal.length;

  // ★ 前へボタン
  if (specialIndex === 0) {
    specialPrev.disabled = true;
    specialPrev.style.opacity = 0.4;
  } else {
    specialPrev.disabled = false;
    specialPrev.style.opacity = 1;
  }

  // ★ 次へボタン
  if (specialIndex >= total - 1) {
    specialNext.disabled = true;
    specialNext.style.opacity = 0.4;
  } else {
    specialNext.disabled = false;
    specialNext.style.opacity = 1;
  }
}

// =====================================
// ★ Special viewer を開く
// =====================================
specialBtn.onclick = () => {
  if (!hasPhotoFor(index)) return;

  savedIndex = index;
  savedIsBack = isBack;

  specialIndex = 0;
  specialMode  = "normal";  // ★最初は必ず線なし

  const starName = getStarNameFromIndex(index);
  specialImg.src = "image/spring/Special/" + specialPhotos[starName].normal[0];

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
// ★ 星座線なし（specialIndex を維持）
// =====================================
specialLines.onclick = () => {
  specialMode = "normal";

  const starName = getStarNameFromIndex(savedIndex);
  specialImg.src = "image/spring/Special/" + specialPhotos[starName].normal[specialIndex];

  updateSpecialButtons();
};

// =====================================
// ★ 星座線あり（specialIndex を維持）
// =====================================
specialClear.onclick = () => {
  specialMode = "lines";

  const starName = getStarNameFromIndex(savedIndex);
  specialImg.src = "image/spring/Special/" + specialPhotos[starName].lines[specialIndex];

  updateSpecialButtons();
};

// =====================================
// ★ Special写真：「次へ」
// =====================================
specialNext.onclick = () => {
  const starName = getStarNameFromIndex(savedIndex);

  if (specialIndex < specialPhotos[starName].normal.length - 1) {
    specialIndex++;

    // ★別の写真に移るときは必ず線なしに戻す
    specialMode = "normal";

    specialImg.src = "image/spring/Special/" + specialPhotos[starName].normal[specialIndex];
  }

  updateSpecialButtons();
};

// =====================================
// ★ Special写真：「前へ」
// =====================================
specialPrev.onclick = () => {
  const starName = getStarNameFromIndex(savedIndex);

  if (specialIndex > 0) {
    specialIndex--;

    // ★別の写真に戻るときも必ず線なしに戻す
    specialMode = "normal";

    specialImg.src = "image/spring/Special/" + specialPhotos[starName].normal[specialIndex];
  }

  updateSpecialButtons();
};

/* ===============================
   ★ Special viewer のスワイプ操作
   =============================== */

    let spStartX=0;
    let spEndX=0;

    const spImg=document.getElementById("special-img");

    spImg.addEventListener("touchstart", (e)=> {
        spStartX=e.touches[0].clientX;
      });

    spImg.addEventListener("touchend", (e)=> {
        spEndX=e.changedTouches[0].clientX;
        const diff=spEndX - spStartX;

        if (Math.abs(diff) < 50) return;

        if (diff < 0) {
          // 左へスワイプ → 次へ
          document.getElementById("special-next").onclick();
        }

        else {
          // 右へスワイプ → 前へ
          document.getElementById("special-prev").onclick();
        }
      });