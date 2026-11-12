// js/navigation.js
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

  // ▼ カード画像を事前に読み込む
  function preloadCardImage(src) {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);

      img.src = src;

      // キャッシュ済み画像への対応
      if (img.complete) {
        resolve(img.naturalWidth > 0);
      }
    });
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

  // ▼ 次へ（JavaScriptアニメーション）
  nextBtn.onclick = async () => {

    if (getIsFinalNull()) return;

    nextBtn.disabled = true;

    // 次のカードを決定
    const next = findNextIndex(getIndex());
    const isLast = next >= images.length;

    // 次に表示する画像のパス
    let nextSrc;

    if (isLast) {
      nextSrc = "image/common/card-null.png";
    } else if (images[next] === null) {
      nextSrc = "image/common/null-card.png";
    } else {
      nextSrc = images[next];
    }

    // 画像を先に読み込む
    const loaded = await preloadCardImage(nextSrc);

    if (!loaded) {
      console.error("次のカード画像を読み込めませんでした:", nextSrc);
      nextBtn.disabled = false;
      return;
    }

    // CSSアニメーションとの重複を防ぐ
    viewer.classList.remove(
      "slide-out-left",
      "slide-out-right",
      "fade-in"
    );

    // 現在のカードを左へ退場
    const exitAnimation = viewer.animate(
      [
        {
          transform: "translateX(0)",
          opacity: 1
        },
        {
          transform: "translateX(-40px)",
          opacity: 0
        }
      ],
      {
        duration: 400,
        easing: "ease",
        fill: "forwards"
      }
    );

    await exitAnimation.finished;

    exitAnimation.cancel();

    // 次のカードへ切り替える
    if (isLast) {

      setIsFinalNull(true);
      setIsBack(true);

    } else {

      setIndex(next);
      setIsBack(false);

    }

    // 画像とボタンを更新
    updateViewer(getIndex(), getIsBack());

    // 季節表示を更新
    autoSeasonUpdate(getIndex());

    // 新しいカードを右から表示
    const enterAnimation = viewer.animate(
      [
        {
          transform: "translateX(30px) scale(0.98)",
          opacity: 0
        },
        {
          transform: "translateX(0) scale(1)",
          opacity: 1
        }
      ],
      {
        duration: 400,
        easing: "ease",
        fill: "forwards"
      }
    );

    await enterAnimation.finished;

    enterAnimation.cancel();
  };

  // ▼ 前へ（JavaScriptアニメーション）
  prevBtn.onclick = async () => {

    if (getIndex() === 0) return;

    prevBtn.disabled = true;

    // 戻る先の index を決定
    let prev;

    if (getIsFinalNull()) {
      prev = ARGO_Q_INDEX;
    } else {
      prev = findPrevIndex(getIndex());
    }

    if (prev < 0) {
      prevBtn.disabled = false;
      return;
    }

    // 戻る先の画像を決定
    const prevSrc = images[prev] === null
      ? "image/common/null-card.png"
      : images[prev];

    // 画像を先に読み込む
    const loaded = await preloadCardImage(prevSrc);

    if (!loaded) {
      console.error("前のカード画像を読み込めませんでした:", prevSrc);
      prevBtn.disabled = false;
      return;
    }

    viewer.classList.remove(
      "slide-out-left",
      "slide-out-right",
      "fade-in"
    );

    // 現在のカードを右へ退場
    const exitAnimation = viewer.animate(
      [
        {
          transform: "translateX(0)",
          opacity: 1
        },
        {
          transform: "translateX(40px)",
          opacity: 0
        }
      ],
      {
        duration: 400,
        easing: "ease",
        fill: "forwards"
      }
    );

    await exitAnimation.finished;
    exitAnimation.cancel();

    // カードを切り替える
    setIsFinalNull(false);
    setIndex(prev);
    setIsBack(false);

    updateViewer(getIndex(), getIsBack());

    autoSeasonUpdate(getIndex());

    // 新しいカードを左から表示
    const enterAnimation = viewer.animate(
      [
        {
          transform: "translateX(-30px) scale(0.98)",
          opacity: 0
        },
        {
          transform: "translateX(0) scale(1)",
          opacity: 1
        }
      ],
      {
        duration: 400,
        easing: "ease",
        fill: "forwards"
      }
    );

    await enterAnimation.finished;
    enterAnimation.cancel();

    prevBtn.disabled = false;
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

  // 入力欄などを操作しているときは無視
  if (
    e.target instanceof HTMLElement &&
    (
      e.target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
    )
  ) {
    return;
  }

  // ▼ 月スペシャルビューア
  if (moonSpecialViewer.style.display === "flex") {

    if (e.key === "4") {
      moonSpecialPrev.click();
    }

    if (e.key === "6") {
      moonSpecialNext.click();
    }

    if (e.key === "Escape") {
      moonSpecialClose.click();
    }

    return;
  }

  // ▼ 星座スペシャルビューア
  if (specialViewer.style.display === "flex") {

    if (e.key === "4") {
      specialPrev.click();
    }

    if (e.key === "6") {
      specialNext.click();
    }

    if (e.key === "8") {
      specialLines.click();
    }

    if (e.key === "2") {
      specialClear.click();
    }

    if (e.key === "Escape") {
      specialClose.click();
    }

    return;
  }

  // ▼ 通常の星座カード

  // 凡例カード：Z
  if (e.key.toLowerCase() === "q") {
    jumpToExplanatoryNote();
    return;
  }

  // 春：X
  if (e.key.toLowerCase() === "a") {
    springBtn.click();
  }

  // 夏：C
  if (e.key.toLowerCase() === "s") {
    summerBtn.click();
  }

  // 秋：V
  if (e.key.toLowerCase() === "d") {
    autumnBtn.click();
  }

  // 冬：B
  if (e.key.toLowerCase() === "f") {
    winterBtn.click();
  }

  // 南：N
  if (e.key.toLowerCase() === "g") {
    southBtn.click();
  }

  // 星図ボタン：8
  if (e.key === "8") {
    if (!peteChartBtn.disabled) {
      peteChartBtn.click();
    }
  }

  // カード前へ：4
  if (e.key === "4") {
    prevBtn.click();
  }

  // カードをめくる：5
  if (e.key === "5") {
    flipBtn.click();
  }

  // カード次へ：6
  if (e.key === "6") {
    nextBtn.click();
  }

  // 星座スペシャルビューア：7
  if (e.key === "2") {
    if (!specialBtn.disabled) {
      specialBtn.click();
    }
  }

});