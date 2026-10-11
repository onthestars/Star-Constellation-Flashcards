// navigation.js
// 前後移動・スワイプ・季節自動判定・nullカード処理

function setupNavigation(
  nextBtn,
  prevBtn,
  viewer,
  getIndex,
  setIndex,
  getIsBack,
  setIsBack,
  getIsFinalNull,
  setIsFinalNull,
  getCurrentSeason,
  setCurrentSeason,
  getAnimationClass,
  setAnimationClass,
  updateViewer,
  updateSeasonButtons
) {

  // ▼ 次の index を探す
  function findNextIndex(i) {
    let n = i + 1;
    while (n < images.length && images[n].includes("/A/")) n++;
    return n;
  }

  // ▼ 前の index を探す
  function findPrevIndex(i) {
    let p = i - 1;
    while (p >= 0 && images[p].includes("/A/")) p--;
    return p;
  }

  // ▼ 季節自動判定
  function autoSeasonUpdate(index) {
    const auto = detectSeasonByIndex(index);
    if (auto !== getCurrentSeason()) {
      setCurrentSeason(auto);
      updateSeasonButtons();
    }
  }

  // ▼ 次へ
  nextBtn.onclick = () => {

    if (soundEnabled) {
      soundPage.currentTime = 0;
      soundPage.play();
    }

    if (getIsFinalNull()) return;

    nextBtn.disabled = true;

    viewer.classList.remove("slide-out-left", "fade-in");
    void viewer.offsetWidth;
    viewer.classList.add("slide-out-left");

    setTimeout(() => {

      let next = findNextIndex(getIndex());

      if (next >= images.length) {
        // nullカードへ
        setIsFinalNull(true);
        setIsBack(true);
      } else {
        setIndex(next);
        setIsBack(false);
      }

      viewer.classList.remove("slide-out-left");
      void viewer.offsetWidth;
      viewer.classList.add("fade-in");

      updateViewer(
        getIndex(),
        getIsBack(),
        viewer,
        specialBtn,
        prevBtn,
        nextBtn
      );

      autoSeasonUpdate(getIndex());

      nextBtn.disabled = false;

    }, 400);
  };

  // ▼ 前へ
  prevBtn.onclick = () => {

    if (soundEnabled) {
      soundPage.currentTime = 0;
      soundPage.play();
    }

    if (getIndex() === 0) return;

    prevBtn.disabled = true;

    viewer.classList.remove("slide-out-left", "slide-out-right", "fade-in");
    void viewer.offsetWidth;
    viewer.classList.add("slide-out-right");

    setTimeout(() => {

      if (getIsFinalNull()) {
        // nullカードから戻る
        setIsFinalNull(false);
        setIndex(ARGO_Q_INDEX);
        setIsBack(false);
      } else {
        let prev = findPrevIndex(getIndex());
        if (prev >= 0) {
          setIndex(prev);
          setIsBack(false);
        }
      }

      viewer.classList.remove("slide-out-right");
      void viewer.offsetWidth;
      viewer.classList.add("fade-in");

      updateViewer(
        getIndex(),
        getIsBack(),
        viewer,
        specialBtn,
        prevBtn,
        nextBtn
      );

      autoSeasonUpdate(getIndex());

      prevBtn.disabled = false;

    }, 400);
  };

  // ▼ スワイプ操作
  let startX = 0;
  let endX = 0;

  viewer.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  viewer.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (Math.abs(diff) < 50) return;

    if (diff < 0) {
      nextBtn.onclick();
    } else {
      prevBtn.onclick();
    }
  });
}

// ▼ キーボード操作
document.addEventListener("keydown", (e) => {

  // ▼ 月スペシャルビューア
  if (moonSpecialViewer.style.display === "flex") {

    if (e.key === "ArrowLeft") {
      moonSpecialPrev.click();
    }

    if (e.key === "ArrowRight") {
      moonSpecialNext.click();
    }

    if (e.key === "Escape") {
      moonSpecialClose.click();
    }

    return;
  }

  // ▼ 星座スペシャルビューア
  if (specialViewer.style.display === "flex") {

    if (e.key === "ArrowLeft") {
      specialPrev.click();
    }

    if (e.key === "ArrowRight") {
      specialNext.click();
    }

    if (e.key === "ArrowUp") {
      specialLines.click();
    }

    if (e.key === "ArrowDown") {
      specialClear.click();
    }

    if (e.key === "Escape") {
      specialClose.click();
    }

    return;
  }

  // ▼ 通常の星座カード

// 春
if (e.key === "1") {
  springBtn.click();
}

// 夏
if (e.key === "2") {
  summerBtn.click();
}

// 秋
if (e.key === "3") {
  autumnBtn.click();
}

// 冬
if (e.key === "4") {
  winterBtn.click();
}

// 南
if (e.key === "5") {
  southBtn.click();
}

// 前
if (e.key === "ArrowLeft") {
  prevBtn.click();
}

// 次
if (e.key === "ArrowRight") {
  nextBtn.click();
}

// めくる
if (e.key === "ArrowUp") {
  flipBtn.click();
}

// スペシャルビューア
if (e.key === "ArrowDown") {

  if (!specialBtn.disabled) {
    specialBtn.click();
  }

}

// 凡例
if (e.key === "0") {
  jumpToExplanatoryNote();
  return;
}

});