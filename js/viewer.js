// viewer.js
// カード表示ロジック（画像切替・裏返し・specialボタン・星図リンク・prev/next状態制御）

// ▼ special viewer 判定（main.js の完全版ロジックを移植）
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

// ▼ カード表示更新（完全版）
function updateViewer(index, isBack, viewer, specialBtn, prevBtn, nextBtn) {

  // nullカード（季節ジャンプ時の空白）
  if (images[index] === null) {
    viewer.src = "image/common/null-card.png";
    viewer.style.transform = "none";
    specialBtn.style.display = "none";

    // prev/next 状態更新
    updatePrevNextButtons(index, prevBtn, nextBtn);

    return;
  }

  // 裏面表示
  if (isBack) {
    viewer.src = backs[index];
  } else {
    viewer.src = images[index];
  }

  // special viewer ボタン更新
  updateSpecialButton(index, specialBtn);

  // prev/next 状態更新
  updatePrevNextButtons(index, prevBtn, nextBtn);

  // カードアニメーション適用
  applyViewerAnimation(viewer);
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

// ▼ 裏返しボタン（完全版）
function setupFlipButton(flipBtn, viewer, indexGetter, isBackGetter, isBackSetter, specialBtn, prevBtn, nextBtn) {

  flipBtn.addEventListener("click", () => {

    // サウンド
    if (soundEnabled) {
      soundFlip.currentTime = 0;
      soundFlip.play();
    }

    flipBtn.disabled = true;

    // アニメ前半
    viewer.classList.remove("flip-rotate");
    void viewer.offsetWidth;
    viewer.classList.add("flip-rotate");

    // 裏表切替
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

    // アニメ後半
    setTimeout(() => {
      viewer.classList.remove("flip-rotate");
      flipBtn.disabled = false;
    }, 800);
  });
}
