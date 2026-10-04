// viewer.js
// カード表示ロジック（画像切替・裏返し・specialボタン・星図リンク・prev/next状態制御）

// ▼ special viewer 判定
function hasPhotoFor(i) {
  return (
    images[i].includes("Ursa-Minor") ||
    images[i].includes("Leo") ||
    images[i].includes("Spring-Triangle") ||
    images[i].includes("Sagittarius") ||
    images[i].includes("Ophiuchus") ||
    images[i].includes("Summer-Triangle") ||
    images[i].includes("Pegasus") ||
    images[i].includes("Aquarius") ||
    images[i].includes("Pisces") ||
    images[i].includes("Capricornus") ||
    images[i].includes("Equuleus") ||
    images[i].includes("Cassiopeia") ||
    images[i].includes("Gemini") ||
    images[i].includes("Orion") ||
    images[i].includes("Winter-Triangle")
  );
}

// ▼ special viewer ボタンの表示制御
function updateSpecialButton(index, specialBtn) {
  if (hasPhotoFor(index)) {
    specialBtn.disabled = false;
    specialBtn.style.opacity = 1;
  } else {
    specialBtn.disabled = true;
    specialBtn.style.opacity = 0.2;
  }
}

// ▼ prev/next ボタンの状態制御
function updatePrevNextButtons(index, prevBtn, nextBtn) {

  // prev
  if (index === 0) {
    prevBtn.disabled = true;
    prevBtn.style.opacity = 0.4;
  } else {
    prevBtn.disabled = false;
    prevBtn.style.opacity = 1;
  }

  // next（次が存在しない or nullカードなら無効）
  if (index >= images.length - 1 || images[index + 1] === null) {
    nextBtn.disabled = true;
    nextBtn.style.opacity = 0.4;
  } else {
    nextBtn.disabled = false;
    nextBtn.style.opacity = 1;
  }
}

// ▼ カード表示更新（★完全版：最終ページ対応）
function updateViewer(index, isBack, viewer, specialBtn, prevBtn, nextBtn) {

  applyViewerAnimation(viewer);

  // ★ 最終ページ（nullカード）
  if (isFinalNull) {
    viewer.src = "image/common/card-null.png";

    // next は無効
    nextBtn.disabled = true;
    nextBtn.style.opacity = 0.4;

    // prev は有効
    prevBtn.disabled = false;
    prevBtn.style.opacity = 1;

    // special viewer は非表示
    specialBtn.style.display = "none";

    return;
  }

  // ★ 季節ジャンプ時の nullカード
  if (images[index] === null) {
    viewer.src = "image/common/null-card.png";
    specialBtn.style.display = "none";

    updatePrevNextButtons(index, prevBtn, nextBtn);
    return;
  }

  // ★ 通常カード（表／裏）
  viewer.src = isBack ? backs[index] : images[index];

  updateSpecialButton(index, specialBtn);
  updatePrevNextButtons(index, prevBtn, nextBtn);
}

// ▼ カードクリック → 星図リンクを開く
function setupViewerClick(viewer, indexGetter) {
  viewer.addEventListener("click", () => {
    const i = indexGetter();
    const url = links[i];
    if (url) {
      window.open(url, "_blank");
    }
  });
}

// ▼ 裏返しボタン（★完全版：nullページでは裏返し禁止）
function setupFlipButton(
  flipBtn,
  viewer,
  indexGetter,
  isBackGetter,
  isBackSetter,
  specialBtn,
  prevBtn,
  nextBtn
) {

  flipBtn.addEventListener("click", () => {

    if (soundEnabled) {
      soundFlip.currentTime = 0;
      soundFlip.play();
    }

    // ★ nullページでは裏返し禁止
    if (isFinalNull) return;

    flipBtn.disabled = true;

    viewer.classList.remove("flip-rotate");
    void viewer.offsetWidth;
    viewer.classList.add("flip-rotate");

    setTimeout(() => {
      const current = isBackGetter();
      isBackSetter(!current);

      updateViewer(
        indexGetter(),
        !current,
        viewer,
        specialBtn,
        prevBtn,
        nextBtn
      );
    }, 400);

    setTimeout(() => {
      viewer.classList.remove("flip-rotate");
      flipBtn.disabled = false;
    }, 800);
  });
}
