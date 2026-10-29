// soleil-meteor-overlay.js
// Soleil星図オーバーレイ・放射点連携・流星アニメーション
(function () {
  "use strict";

  const SOLEIL_URL = "http://localhost:3000/chart.html";
  const SOLEIL_ORIGIN = new URL(SOLEIL_URL).origin;

  const overlay = document.getElementById("chart-overlay");
  const closeButton = document.getElementById("chart-close");
  const title = document.getElementById("chart-title");
  const stage = document.getElementById("chart-stage");
  const frame = document.getElementById("chart-frame");
  const meteorLayer = document.getElementById("meteor-layer");
  const radiantMarker = document.getElementById("meteor-radiant");

  if (
    !overlay || !closeButton || !title || !stage ||
    !frame || !meteorLayer || !radiantMarker
  ) {
    console.error("SoleilオーバーレイのHTML要素が見つかりません。");
    return;
  }

  let selectedMeteor = null;
  let frameReady = false;
  let radiantReady = false;
  let isOpen = false;
  let spawnTimerId = null;

  // 流星の発生基準点。meteor-layer内の座標を使用する。
  let radiantPosition = { x: 0, y: 0 };

  // 表示中の流星と、停止・削除に必要な情報を保持する。
  const activeMeteors = new Set();

  function sendRadiantCoordinates() {
    if (!isOpen || !frameReady || !selectedMeteor) return;

    frame.contentWindow.postMessage(
      {
        type: "set-meteor-radiant",
        ra: selectedMeteor.radiantRa,
        dec: selectedMeteor.radiantDec
      },
      SOLEIL_ORIGIN
    );
  }

  // Soleilから放射点の画面座標を受信する。
  window.addEventListener("message", function (event) {
    if (event.origin !== SOLEIL_ORIGIN) return;
    if (event.source !== frame.contentWindow) return;

    const data = event.data;
    if (!data || data.type !== "soleil-radiant-position") return;

    if (
      !Number.isFinite(data.x) ||
      !Number.isFinite(data.y) ||
      !Number.isFinite(data.canvasWidth) ||
      !Number.isFinite(data.canvasHeight) ||
      data.canvasWidth <= 0 ||
      data.canvasHeight <= 0
    ) {
      return;
    }

    if (data.visible === false) {
      radiantReady = false;
      radiantMarker.style.display = "none";
      stopMeteorAnimation();
      return;
    }

    const stageWidth = stage.clientWidth;
    const stageHeight = stage.clientHeight;
    const layerWidth = meteorLayer.clientWidth;
    const layerHeight = meteorLayer.clientHeight;

    if (
      stageWidth <= 0 || stageHeight <= 0 ||
      layerWidth <= 0 || layerHeight <= 0
    ) {
      return;
    }

    // 星図の座標をstage上の座標に変換する。
    const x = data.x * stageWidth / data.canvasWidth;
    const y = data.y * stageHeight / data.canvasHeight;

    if (!Number.isFinite(x) || !Number.isFinite(y)) return;

    // 放射点マーカーは従来どおりstage上に表示する。
    radiantMarker.style.left = `${x}px`;
    radiantMarker.style.top = `${y}px`;
    radiantMarker.style.display = "block";

    // 流星用の座標はmeteor-layerの座標に変換する。
    radiantPosition = {
      x: x * layerWidth / stageWidth,
      y: y * layerHeight / stageHeight
    };

    radiantReady = true;

    // 放射点の座標を受信してからアニメーションを開始する。
    if (isOpen && frameReady && spawnTimerId === null) {
      startMeteorAnimation();
    }
  });

  frame.addEventListener("load", function () {
    if (!isOpen || frame.src !== SOLEIL_URL) return;

    frameReady = true;
    sendRadiantCoordinates();
  });

  function spawnMeteorCore() {
    if (!isOpen || !frameReady || !radiantReady) return;

    const width = meteorLayer.clientWidth;
    const height = meteorLayer.clientHeight;

    if (width <= 0 || height <= 0) return;

    const meteorColors = [
      { core: "#ffffff", tail: "255,255,255" },
      { core: "#fff4b0", tail: "255,244,176" },
      { core: "#ffe070", tail: "255,224,112" },
      { core: "#c8ff90", tail: "200,255,144" },
      { core: "#b5dfff", tail: "181,223,255" }
    ];

    const meteorColor =
      meteorColors[Math.floor(Math.random() * meteorColors.length)];

// 放射点の近くから流星を発生させる。
const maxSpawnDistance = Math.min(width, height) * 0.25;

const spawnAngle = Math.random() * Math.PI * 2;
const spawnDistance = Math.random() * maxSpawnDistance;

const startX =
  radiantPosition.x +
  Math.cos(spawnAngle) * spawnDistance;

const startY =
  radiantPosition.y +
  Math.sin(spawnAngle) * spawnDistance;

    const dx = startX - radiantPosition.x;
    const dy = startY - radiantPosition.y;

    const distanceFromRadiant = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const moveDistance = Math.min(
      500,
      60 + distanceFromRadiant * 0.7
    );

    const duration = Math.max(
      600,
      1200 - distanceFromRadiant * 0.4
    );

    const endX = startX + Math.cos(angle) * moveDistance;
    const endY = startY + Math.sin(angle) * moveDistance;
    const startTime = performance.now();

    const core = document.createElement("div");
    core.className = "meteor-core";

    const tail = document.createElement("div");
    tail.className = "meteor-tail";

    meteorLayer.appendChild(tail);
    meteorLayer.appendChild(core);

    const meteor = {
      core,
      tail,
      rafId: null,
      timeoutId: null
    };

    activeMeteors.add(meteor);

    function animate(now) {
      if (!activeMeteors.has(meteor) || !isOpen || !radiantReady) {
        removeMeteor(meteor);
        return;
      }

      const progress = Math.min(1, (now - startTime) / duration);

      const currentX = startX + (endX - startX) * progress;
      const currentY = startY + (endY - startY) * progress;

      const coreSize = 2 + Math.sin(progress * Math.PI) * 4;

      core.style.left = `${currentX}px`;
      core.style.top = `${currentY}px`;
      core.style.width = `${coreSize}px`;
      core.style.height = `${coreSize}px`;
      core.style.background = meteorColor.core;

      const glow = 6 + progress * 16;

      core.style.boxShadow = `
        0 0 ${glow}px ${meteorColor.core},
        0 0 ${glow * 1.5}px ${meteorColor.core},
        0 0 ${glow * 2.5}px ${meteorColor.core}
      `;

      let coreOpacity = 1;

      if (progress > 0.9) {
        coreOpacity = 1 - ((progress - 0.9) / 0.1);
      }

      core.style.opacity = String(coreOpacity);

      const distance = Math.sqrt(
        (currentX - startX) ** 2 +
        (currentY - startY) ** 2
      );

      const trailHeight = Math.max(
        1.5,
        5 - distanceFromRadiant / 180
      );

      tail.style.left = `${startX}px`;
      tail.style.top = `${startY}px`;
      tail.style.width = `${distance}px`;
      tail.style.height = `${trailHeight}px`;
      tail.style.transform =
        `translateY(-50%) rotate(${angle}rad)`;

      tail.style.background = `
        linear-gradient(
          to right,
          rgba(${meteorColor.tail},0.00) 0%,
          rgba(${meteorColor.tail},0.02) 15%,
          rgba(${meteorColor.tail},0.08) 35%,
          rgba(${meteorColor.tail},0.18) 55%,
          rgba(${meteorColor.tail},0.28) 75%,
          rgba(${meteorColor.tail},0.42) 90%,
          rgba(${meteorColor.tail},0.55) 100%
        )
      `;

      if (progress < 1) {
        meteor.rafId = requestAnimationFrame(animate);
      } else {
        meteor.rafId = null;
        core.remove();

        // 核が消えたあと、尾の残光をゆっくり消す。
        const fadeAnimation = tail.animate(
          [{ opacity: 0.7 }, { opacity: 0 }],
          { duration: 2000, fill: "forwards" }
        );

        // アニメーション完了後に尾を削除する。
        fadeAnimation.onfinish = function () {
          removeMeteor(meteor);
        };

        // 念のため、完了通知がない場合にも削除する。
        meteor.timeoutId = window.setTimeout(function () {
          removeMeteor(meteor);
        }, 3200);
      }
    }

    meteor.rafId = requestAnimationFrame(animate);
  }

  function removeMeteor(meteor) {
    if (!activeMeteors.has(meteor)) return;

    if (meteor.rafId !== null) {
      cancelAnimationFrame(meteor.rafId);
      meteor.rafId = null;
    }

    if (meteor.timeoutId !== null) {
      clearTimeout(meteor.timeoutId);
      meteor.timeoutId = null;
    }

    // 残光のアニメーションも停止する。
    if (typeof meteor.tail.getAnimations === "function") {
      meteor.tail.getAnimations().forEach(function (animation) {
        animation.cancel();
      });
    }

    meteor.core.remove();
    meteor.tail.remove();
    activeMeteors.delete(meteor);
  }

  function startMeteorAnimation() {
    if (!isOpen || !frameReady || !radiantReady) return;
    if (spawnTimerId !== null) return;

    // 既存の出現頻度を維持し、1秒ごとに出現判定を行う。
    spawnTimerId = window.setInterval(function () {
      if (Math.random() < 0.5) {
        spawnMeteorCore();
      }
    }, 1000);
  }

  function stopMeteorAnimation() {
    if (spawnTimerId !== null) {
      clearInterval(spawnTimerId);
      spawnTimerId = null;
    }

    // 移動中の流星と、尾の残光をすべて停止・削除する。
    for (const meteor of Array.from(activeMeteors)) {
      removeMeteor(meteor);
    }
  }

  function openSoleilOverlay(meteor) {
    if (
      !meteor ||
      typeof meteor.name !== "string" ||
      !Number.isFinite(meteor.radiantRa) ||
      !Number.isFinite(meteor.radiantDec) ||
      meteor.radiantRa < 0 ||
      meteor.radiantRa >= 360 ||
      meteor.radiantDec < -90 ||
      meteor.radiantDec > 90
    ) {
      console.error("流星群の放射点データが不正です。", meteor);
      return;
    }

    // 前の流星群のアニメーションを停止してから切り替える。
    stopMeteorAnimation();

    selectedMeteor = meteor;
    frameReady = false;
    radiantReady = false;

title.innerHTML = `
  ${meteor.name}
  <span class="chart-subtitle">｜ぴーとの星図</span>
`;
    overlay.style.display = "block";
    isOpen = true;

    radiantMarker.style.display = "none";

    if (frame.src !== SOLEIL_URL) {
      frame.src = SOLEIL_URL;
    } else {
      // 同じ星図を再利用する場合も、現在の放射点を再送する。
      frameReady = true;
      sendRadiantCoordinates();
    }
  }

  function closeSoleilOverlay() {
    isOpen = false;
    frameReady = false;
    radiantReady = false;
    selectedMeteor = null;

    stopMeteorAnimation();

    radiantMarker.style.display = "none";
    overlay.style.display = "none";
    frame.src = "about:blank";
  }

  closeButton.addEventListener("click", closeSoleilOverlay);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen) {
      closeSoleilOverlay();
    }
  });

  window.addEventListener("resize", function () {
    if (!isOpen) return;

    radiantReady = false;
    radiantMarker.style.display = "none";
    stopMeteorAnimation();

    // サイズ変更後の座標をSoleilに再通知する。
    sendRadiantCoordinates();
  });

  window.openSoleilOverlay = openSoleilOverlay;
})();

/* js/soleil-meteor-overlay.js */

// 活動中の流星群名をクリックしたら星図カードを開く
document.addEventListener("click", function (event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const link = target.closest(".meteor-shower-link");
  if (!link) return;

  event.preventDefault();

  if (typeof window.openIndependentChartForMeteorName !== "function") {
    console.error("星図カードの連携処理が初期化されていません。");
    return;
  }

  window.openIndependentChartForMeteorName(link.dataset.meteorName);
});
