// star-chart/js/star-warp.js

// ワープ演出専用Canvas
(function () {

  const warpCanvas = document.getElementById("star-chart-warp-layer");
  const container = document.getElementById("chart-container");

  if (!warpCanvas || !container) {
    console.error("ワープ演出用のCanvasが見つかりません。");
    return;
  }

  const ctx = warpCanvas.getContext("2d");

  // ワープ演出専用サウンド
  let warpSound = null;

  let animationId = null;
  let stars = [];
  let startTime = 0;

  let fadeStarted = false;

  // 演出時間（ミリ秒）
  const MOVEMENT_TIME = 2800;
  const FADE_TIME = 1800;

  // 移動の最後の時間でクロスフェード
  const FADE_START_TIME = MOVEMENT_TIME - FADE_TIME;
  const TOTAL_TIME = MOVEMENT_TIME;

  // 星の数
  const STAR_COUNT = 1200;

  // 画面サイズに合わせてCanvasを調整
  function resizeWarpCanvas() {

    const rect = container.getBoundingClientRect();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    warpCanvas.width = Math.round(rect.width * dpr);
    warpCanvas.height = Math.round(rect.height * dpr);

    warpCanvas.style.width = rect.width + "px";
    warpCanvas.style.height = rect.height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // 星を初期配置
  function createStars(width, height) {

    const result = [];

    for (let i = 0; i < STAR_COUNT; i++) {

      const angle = Math.random() * Math.PI * 2;

      // 中央付近から画面外まで広く配置
      const distance = Math.random() * Math.max(width, height) * 0.75;

      result.push({
        angle: angle,
        distance: distance,
        speed: 0.7 + Math.random() * 1.3,
        size: 0.5 + Math.random() * 1.3,
        brightness: 0.45 + Math.random() * 0.55
      });
    }

    return result;
  }

  // ワープ演出を描画
  function drawWarp(progress, width, height) {

    ctx.clearRect(0, 0, width, height);

    // 宇宙空間の背景
    ctx.fillStyle = "#080D1A";
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // 移動を終了するタイミング
    const movementEnd = 0.92;

    // 移動進行度（0～1）
    const moveProgress = Math.min(
      1,
      progress / movementEnd
    );

    // 最初は非常にゆっくり、徐々に加速し、最後はゆっくり停止
    const easedProgress =
      moveProgress * moveProgress * moveProgress *
      (moveProgress * (6 * moveProgress - 15) + 10);

    // 現在の速度（開始時と終了時は0）
    const velocity =
      6 * moveProgress * (1 - moveProgress);

    // フェードアウトはCanvas全体のCSSトランジションで行う
    const alpha = 1;

    for (const star of stars) {

      // 星の移動距離
      const distance =
        star.distance +
        easedProgress *
        Math.max(width, height) *
        1.8 *
        star.speed;

      const x =
        centerX + Math.cos(star.angle) * distance;

      const y =
        centerY + Math.sin(star.angle) * distance;

      // 速度に合わせて光跡を伸縮
      const trailLength =
        2 + velocity * 45 * star.speed;

      const previousDistance = Math.max(
        0,
        distance - trailLength
      );

      const previousX =
        centerX + Math.cos(star.angle) * previousDistance;

      const previousY =
        centerY + Math.sin(star.angle) * previousDistance;

      ctx.beginPath();
      ctx.moveTo(previousX, previousY);
      ctx.lineTo(x, y);

      ctx.strokeStyle =
        `rgba(210, 225, 255, ${alpha * star.brightness})`;

      ctx.lineWidth =
        star.size * (1 + velocity * 0.5);

      ctx.lineCap = "round";
      ctx.stroke();
    }
  }

  // アニメーション本体
  function animate(timestamp) {

    if (!startTime) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime;

    // 移動時間だけで進行度を計算
    const progress = Math.min(
      elapsed / MOVEMENT_TIME,
      1
    );

    const rect = container.getBoundingClientRect();

    drawWarp(progress, rect.width, rect.height);

    // 星の移動が終わったらクロスフェード開始
    if (elapsed >= FADE_START_TIME && !fadeStarted) {

      fadeStarted = true;

      // ワープCanvasをフェードアウト
      warpCanvas.style.transition = "opacity 1200ms ease";
      warpCanvas.style.opacity = "0";

      // 星図と流星をフェードイン
      container.classList.remove("is-warping");
    }

    if (elapsed < TOTAL_TIME) {

      animationId = requestAnimationFrame(animate);

    } else {

      // ワープCanvasを非表示
      warpCanvas.style.display = "none";

      // 次回の演出に備えて透明度を戻す
      warpCanvas.style.opacity = "1";

      ctx.clearRect(0, 0, rect.width, rect.height);

      animationId = null;
      stars = [];
      startTime = 0;
      fadeStarted = false;

      // 星座線のフェードインを開始
      window.startConstellationFadeIn?.();

    }
  }

  // 外部から呼び出すワープ開始関数
  window.startStarWarp = function () {

    if (animationId !== null) {
      return;
    }

    const rect = container.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
      console.error("ワープ演出の表示領域がありません。");
      return;
    }

    // 星図と既存流星を先に隠す
    container.classList.add("is-warping");

    // ワープ開始時にサウンドを生成・再生
    if (window.parent.soundEnabled !== false) {
      warpSound = new Audio(
        "../sound/the-spaceship-flew-by.m4a"
      );

      warpSound.play().catch(error => {
        console.warn("ワープ音を再生できませんでした。", error);
      });
    }

    // Canvasを透明な状態で表示
    warpCanvas.style.transition = "opacity 1500ms ease";
    warpCanvas.style.opacity = "0";
    warpCanvas.style.display = "block";

    resizeWarpCanvas();

    // 星を生成
    stars = createStars(rect.width, rect.height);

    // 星図と既存流星を隠す
    container.classList.add("is-warping");

    // 背景を描画
    ctx.fillStyle = "#080D1A";
    ctx.fillRect(0, 0, rect.width, rect.height);

    startTime = 0;

    fadeStarted = false;

    // 星をゆっくりフェードイン
    requestAnimationFrame(() => {
      warpCanvas.style.opacity = "1";
    });

    animationId = requestAnimationFrame(animate);

    console.log("ハイパースペース演出を開始しました。");
  };

})();