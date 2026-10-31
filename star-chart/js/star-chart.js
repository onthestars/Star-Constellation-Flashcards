/* star-chart/js/star-chart.js */
"use strict";

(() => {
  const canvas = document.getElementById("star-chart-canvas");
  const container = document.getElementById("chart-container");
  const status = document.getElementById("chart-status");
  const ctx = canvas.getContext("2d");

// 独立星図専用の流星レイヤー
const meteorLayer = document.getElementById("star-chart-meteor-layer");

// 流星専用Canvasの描画コンテキスト
const meteorCtx = meteorLayer
  ? meteorLayer.getContext("2d")
  : null;

// 流星Canvasの内部解像度を表示サイズに合わせる
function resizeChartMeteorCanvas() {
  if (!meteorLayer || !meteorCtx) return;

  const rect = meteorLayer.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  meteorLayer.width = Math.round(rect.width * dpr);
  meteorLayer.height = Math.round(rect.height * dpr);

  meteorCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// 画面サイズの変更に対応
window.addEventListener("resize", resizeChartMeteorCanvas);

resizeChartMeteorCanvas();

// 現在の放射点の画面座標
let meteorRadiantScreen = null;

// 流星アニメーションの管理
let activeChartMeteors = [];
let meteorAnimationFrame = null;

// 流星発生タイマー
let meteorSpawnInterval = null;

// 流星アニメーションを開始する
function startChartMeteorAnimation() {
  if (!meteorLayer || !meteorCtx) return;

  // アニメーションの二重起動を防止
  if (meteorAnimationFrame !== null) return;

  // 流星アニメーション開始
  meteorAnimationFrame =
    requestAnimationFrame(animateChartMeteors);

  // 流星発生タイマーの二重起動を防止
  if (meteorSpawnInterval !== null) return;

  // 一定間隔で流星を発生させる
meteorSpawnInterval = window.setInterval(() => {
  if (!meteorRadiantScreen) return;

  // 1回の発生で1〜3個の流星をランダムに発生させる
  const count = Math.random() < 0.25
    ? 3
    : Math.random() < 0.5
      ? 2
      : 1;

  for (let i = 0; i < count; i++) {
    // 複数の場合も、少しずつ時間差をつける
    window.setTimeout(() => {
      if (meteorRadiantScreen) {
        spawnChartMeteor();
      }
    }, i * (100 + Math.random() * 250));
  }
}, 1200 + Math.random() * 800);

}

// 放射点の画面座標を更新する
function updateMeteorRadiantPosition(x, y) {
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y)
  ) {
    meteorRadiantScreen = null;
    return;
  }

  const newPosition = { x, y };

  // 初回は位置を記録する
  if (!meteorRadiantScreen) {
    meteorRadiantScreen = newPosition;
    return;
  }

  // 放射点の移動量
  const deltaX = newPosition.x - meteorRadiantScreen.x;
  const deltaY = newPosition.y - meteorRadiantScreen.y;

  // 飛行中の流星も放射点の移動に追従させる
  activeChartMeteors.forEach((meteor) => {
    meteor.startX += deltaX;
    meteor.startY += deltaY;
  });

  // 新しい放射点の位置を保存
  meteorRadiantScreen = newPosition;
}

// 流星を生成する
function spawnChartMeteor() {
  if (!meteorLayer || !meteorCtx || !meteorRadiantScreen) {
    return;
  }

  const width = meteorLayer.clientWidth;
  const height = meteorLayer.clientHeight;

  if (width <= 0 || height <= 0) {
    return;
  }

  // 星図画面全体からランダムに出現
  const startX = Math.random() * width;
  const startY = Math.random() * height;

  // 放射点から出現位置へ向かう方向
const dx = startX - meteorRadiantScreen.x;
const dy = startY - meteorRadiantScreen.y;

  const distanceFromRadiant = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);

  // 移動距離と飛行時間
  const distance = Math.min(
    500,
    60 + distanceFromRadiant * 0.7
  );

  const duration = Math.max(
    600,
    1200 - distanceFromRadiant * 0.4
  );

  // 5色からランダムに選ぶ
  const colors = [
    { core: "#ffffff", tail: "255,255,255" },
    { core: "#fff4b0", tail: "255,244,176" },
    { core: "#ffe070", tail: "255,224,112" },
    { core: "#c8ff90", tail: "200,255,144" },
    { core: "#b5dfff", tail: "181,223,255" }
  ];

  const color = colors[
    Math.floor(Math.random() * colors.length)
  ];

  // Canvas方式ではDOM要素を作らず、描画用の情報だけ保存する
  activeChartMeteors.push({
    startX,
    startY,
    angle,
    distance,
    duration,
    distanceFromRadiant,
    color,
    startTime: performance.now(),
    fadeStartTime: null
  });
}

// Canvasで流星を描画する
function animateChartMeteors(now) {
  if (!meteorLayer || !meteorCtx) {
    meteorAnimationFrame = null;
    return;
  }

  const width = meteorLayer.clientWidth;
  const height = meteorLayer.clientHeight;

  // 毎フレーム、流星Canvasだけを消去する
  meteorCtx.clearRect(0, 0, width, height);

  const remainingMeteors = [];

  for (const meteor of activeChartMeteors) {
    const elapsed = now - meteor.startTime;
    const progress = Math.min(elapsed / meteor.duration, 1);

    const currentDistance = meteor.distance * progress;

    const currentX =
      meteor.startX +
      Math.cos(meteor.angle) * currentDistance;

    const currentY =
      meteor.startY +
      Math.sin(meteor.angle) * currentDistance;

    // 飛行終了後は尾の残光だけを描く
    if (progress >= 1) {
      if (meteor.fadeStartTime === null) {
        meteor.fadeStartTime = now;
      }

      const fadeProgress =
        (now - meteor.fadeStartTime) / 2000;

      if (fadeProgress >= 1) continue;

      drawMeteorTail(
        meteor,
        meteor.distance,
        0.7 * (1 - fadeProgress),
        width,
        height
      );

      remainingMeteors.push(meteor);
      continue;
    }

    const coreOpacity =
      progress > 0.9
        ? 1 - (progress - 0.9) / 0.1
        : 1;

    // 尾を描画してから核を重ねる
    drawMeteorTail(
      meteor,
      currentDistance,
      0.7,
      width,
      height
    );

    drawMeteorCore(
      currentX,
      currentY,
      progress,
      meteor.color.core,
      coreOpacity
    );

    remainingMeteors.push(meteor);
  }

  activeChartMeteors = remainingMeteors;

  meteorAnimationFrame =
    requestAnimationFrame(animateChartMeteors);
}

// 流星の尾を描画する
function drawMeteorTail(
  meteor,
  tailLength,
  opacity,
  width,
  height
) {
  if (tailLength <= 0 || opacity <= 0) return;

// 放射点からの距離に応じて尾の太さを調整
const tailHeight = Math.max(
  1.2,
  (5 - meteor.distanceFromRadiant / 180) * 0.8
);

  const halfHeight = tailHeight / 2;
  const length = tailLength;

  const ctx = meteorCtx;

  ctx.save();

  ctx.globalAlpha = opacity;
  ctx.translate(meteor.startX, meteor.startY);
  ctx.rotate(meteor.angle);

  // 尾の根元は透明、核側ほど明るくする
  const gradient = ctx.createLinearGradient(
    0, 0, length, 0
  );

  const rgb = meteor.color.tail;

  gradient.addColorStop(0.00, `rgba(${rgb}, 0)`);
  gradient.addColorStop(0.15, `rgba(${rgb}, 0.02)`);
  gradient.addColorStop(0.35, `rgba(${rgb}, 0.08)`);
  gradient.addColorStop(0.55, `rgba(${rgb}, 0.18)`);
  gradient.addColorStop(0.75, `rgba(${rgb}, 0.28)`);
  gradient.addColorStop(0.90, `rgba(${rgb}, 0.42)`);
  gradient.addColorStop(1.00, `rgba(${rgb}, 0.55)`);

  ctx.fillStyle = gradient;

// 滑らかな笹の葉型の尾
ctx.beginPath();
ctx.moveTo(0, 0);

ctx.bezierCurveTo(
  length * 0.15, -halfHeight * 0.35,
  length * 0.30, -halfHeight * 1.00,
  length * 0.48, -halfHeight * 0.90
);

ctx.bezierCurveTo(
  length * 0.70, -halfHeight * 0.75,
  length * 0.90, -halfHeight * 0.25,
  length, 0
);

ctx.bezierCurveTo(
  length * 0.90, halfHeight * 0.25,
  length * 0.70, halfHeight * 0.75,
  length * 0.48, halfHeight * 0.90
);

ctx.bezierCurveTo(
  length * 0.30, halfHeight * 1.00,
  length * 0.15, halfHeight * 0.35,
  0, 0
);

ctx.closePath();

// 流星の尾のボケ
  ctx.filter = "blur(1px)";
  ctx.fill();

  ctx.restore();
}

// 流星の核を描画する
function drawMeteorCore(
  x,
  y,
  progress,
  coreColor,
  opacity
) {
  const ctx = meteorCtx;

// 核の大きさ調整
const radius = (2 + Math.sin(progress * Math.PI) * 2) / 3;
const glowRadius = (6 + progress * 10) / 3;

  ctx.save();

  ctx.globalAlpha = opacity;

  // 外側の光から中心の明るい核へ
  const glow = ctx.createRadialGradient(
    x, y, 0,
    x, y, glowRadius
  );

  glow.addColorStop(0.00, "rgba(255,255,255,0.95)");
  glow.addColorStop(0.25, coreColor);
  glow.addColorStop(0.65, `${coreColor}59`);
  glow.addColorStop(1.00, `${coreColor}00`);

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  // 核の中心に白い輝きを加える
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

  const DATA_PATH = "data/stars-hyg-v42.json";

  // 星座線データ
  const LINE_DATA_PATH = "data/constellation-lines.json";

  // 現在の視野角（度）
  let fieldOfViewDeg = 90;

  // 拡大・縮小できる視野角の範囲
  const MIN_FIELD_OF_VIEW_DEG = 20;
  const MAX_FIELD_OF_VIEW_DEG = 120;

  // 観測地点：大阪付近
  const latitudeDeg = 34.81;
  const longitudeDeg = 135.53;

  // 初期表示方向：北、高度45°
  let centerAzDeg = 0;
  let centerAltDeg = 45;

  const RAD = Math.PI / 180;

  let stars = [];
  let dataLoaded = false;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let constellations = [];

    // 放射点の赤経・赤緯（未受信時は非表示）
  let meteorRadiant = null;

  // ドラッグ・ピンチ操作用
  let isDragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;

  // 2本指によるピンチ操作用
  const activePointers = new Map();
  let lastPinchDistance = 0;

  // ドラッグ・ピンチ操作の設定
  canvas.style.touchAction = "none";

  // マウスホイールによる拡大・縮小
  canvas.addEventListener("wheel", event => {
    // 星図上でのブラウザ標準スクロールを防止
    event.preventDefault();

    // ホイール上：拡大
    // ホイール下：縮小
    const zoomFactor = event.deltaY < 0 ? 0.9 : 1.1;

    // 視野角を変更
    fieldOfViewDeg = Math.max(
      MIN_FIELD_OF_VIEW_DEG,
      Math.min(
        MAX_FIELD_OF_VIEW_DEG,
        fieldOfViewDeg * zoomFactor
      )
    );

    // 星図を再描画
    drawChart();

  }, { passive: false });

  // 2本の指の間隔を計算
  function getPinchDistance() {
    const pointers = Array.from(activePointers.values());

    if (pointers.length < 2) return 0;

    const dx = pointers[0].x - pointers[1].x;
    const dy = pointers[0].y - pointers[1].y;

    return Math.hypot(dx, dy);
  }

  // 角度を0～360°に収める
  function normalizeDeg(deg) {
    return ((deg % 360) + 360) % 360;
  }

  // 現在の地方恒星時を計算する
  function getLocalSiderealTimeDeg(date = new Date()) {
    const jd = date.getTime() / 86400000 + 2440587.5;
    const t = (jd - 2451545.0) / 36525;

    const gmst =
      280.46061837 +
      360.98564736629 * (jd - 2451545.0) +
      0.000387933 * t * t -
      (t * t * t) / 38710000;

    return normalizeDeg(gmst + longitudeDeg);
  }

  // 赤経・赤緯を水平座標系の方向ベクトルに変換する
  // x：東、y：北、z：天頂方向
  function equatorialToHorizontalVector(raDeg, decDeg, lstDeg) {
    const hourAngle = (lstDeg - raDeg) * RAD;
    const dec = decDeg * RAD;
    const lat = latitudeDeg * RAD;

    return {
      x: -Math.cos(dec) * Math.sin(hourAngle),
      y:
        Math.cos(lat) * Math.sin(dec) -
        Math.sin(lat) * Math.cos(dec) * Math.cos(hourAngle),
      z:
        Math.sin(lat) * Math.sin(dec) +
        Math.cos(lat) * Math.cos(dec) * Math.cos(hourAngle)
    };
  }

  // 高度・方位から方向ベクトルを作る
  function horizontalToVector(azDeg, altDeg) {
    const az = azDeg * RAD;
    const alt = altDeg * RAD;

    return {
      x: Math.cos(alt) * Math.sin(az),
      y: Math.cos(alt) * Math.cos(az),
      z: Math.sin(alt)
    };
  }

  function dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

// 縦長・横長の画面に合わせ、四隅まで描画できる角度を求める
function getMaxVisibleAngleDeg() {
  const halfWidth = canvasWidth / 2;
  const halfHeight = canvasHeight / 2;

  const scale =
    (Math.min(canvasWidth, canvasHeight) / 2) /
    Math.tan(fieldOfViewDeg * RAD / 2);

  const cornerRadius = Math.hypot(halfWidth, halfHeight);

  return 2 * Math.atan(cornerRadius / scale) / RAD;
}

  // 現在の表示方向に合わせて投影用の座標軸を作る
  function getProjectionBasis() {
    const az = centerAzDeg * RAD;
    const alt = centerAltDeg * RAD;

    return {
      center: horizontalToVector(centerAzDeg, centerAltDeg),

      // 画面右方向
      right: {
        x: Math.cos(az),
        y: -Math.sin(az),
        z: 0
      },

      // 画面上方向
      up: {
        x: -Math.sin(alt) * Math.sin(az),
        y: -Math.sin(alt) * Math.cos(az),
        z: Math.cos(alt)
      }
    };
  }

  // 星の方向をステレオ投影座標に変換する
  function projectStar(star, lstDeg, basis) {
    const v = equatorialToHorizontalVector(
      star.ra,
      star.dec,
      lstDeg
    );

    const centerDot = dot(v, basis.center);
const minDot = Math.cos(getMaxVisibleAngleDeg() * RAD);

    // 表示範囲外の星は描画しない
    if (centerDot < minDot) {
      return null;
    }

    const denominator = 1 + centerDot;

    if (denominator <= 1e-12) {
      return null;
    }

    return {
      x: dot(v, basis.right) / denominator,
      y: -dot(v, basis.up) / denominator,
      mag: star.mag,
      id: star.id,
      label: star.label || ""
    };
  }

  // 方角の位置を星図上の座標に変換する
  function projectDirection(azDeg, altDeg, basis) {
    const v = horizontalToVector(azDeg, altDeg);
    const centerDot = dot(v, basis.center);
const minDot = Math.cos(getMaxVisibleAngleDeg() * RAD);

    if (centerDot < minDot - 1e-9) {
      return null;
    }

    const denominator = 1 + centerDot;

    if (denominator <= 1e-12) {
      return null;
    }

    return {
      x: dot(v, basis.right) / denominator,
      y: -dot(v, basis.up) / denominator
    };
  }
  
  // star-chart/js/star-chart.js

// star-chart/js/star-chart.js

// 1等星の光芒を描画
function drawStarDiffraction(x, y, radius, color) {
  const spikeLength = 12;

  // 星に近い部分は太く、先端に向かって細くする
  const nearWidth = 1.4;
  const farWidth = 0.15;

  ctx.save();

// 光芒全体の基本透明度
  ctx.globalAlpha = 0.45;

  // 光芒1本を描画
  function drawRay(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;

    const length = Math.hypot(dx, dy);

    if (length === 0) return;

    // 光芒に対して垂直な方向
    const px = -dy / length;
    const py = dx / length;

    const nearHalf = nearWidth / 2;
    const farHalf = farWidth / 2;

    ctx.beginPath();

    // 星側の太い部分
    ctx.moveTo(
      x1 + px * nearHalf,
      y1 + py * nearHalf
    );

    // 光芒の先端側
    ctx.lineTo(
      x2 + px * farHalf,
      y2 + py * farHalf
    );

    ctx.lineTo(
      x2 - px * farHalf,
      y2 - py * farHalf
    );

    // 星側に戻る
    ctx.lineTo(
      x1 - px * nearHalf,
      y1 - py * nearHalf
    );

    ctx.closePath();

// 星の近くは明るく、先端に向かって透明にする
const gradient = ctx.createLinearGradient(
  x1, y1,
  x2, y2
);

gradient.addColorStop(0, color);
gradient.addColorStop(1, "rgba(255,255,255,0)");

ctx.fillStyle = gradient;
ctx.fill();
  }

  // 左右の光芒
  drawRay(
    x - radius,
    y,
    x - radius - spikeLength,
    y
  );

  drawRay(
    x + radius,
    y,
    x + radius + spikeLength,
    y
  );

  // 上下の光芒
  drawRay(
    x,
    y - radius,
    x,
    y - radius - spikeLength
  );

  drawRay(
    x,
    y + radius,
    x,
    y + radius + spikeLength
  );

  ctx.restore();
}

// 星図全体を再描画
function drawChart() {
  if (canvasWidth <= 0 || canvasHeight <= 0) return;

  // 円形の星図を維持する共通倍率
  const scale = (Math.min(canvasWidth, canvasHeight) / 2) /
    Math.tan(fieldOfViewDeg * RAD / 2);

  const scaleX = scale;
  const scaleY = scale;

  const lstDeg = getLocalSiderealTimeDeg();
  const basis = getProjectionBasis();
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  // 天頂の投影座標を計算
  const zenithVector = horizontalToVector(0, 90);
  const zenithDot = dot(zenithVector, basis.center);
  const zenithDenominator = 1 + zenithDot;

  let gradientCenterX = centerX;
  let gradientCenterY = centerY;

if (zenithDenominator > 1e-12) {
  gradientCenterX =
    centerX + (dot(zenithVector, basis.right) / zenithDenominator) * scaleX;

  gradientCenterY =
    centerY - (dot(zenithVector, basis.up) / zenithDenominator) * scaleY;
}

  // 星図背景（天頂を中心とした同心円状の夜空）
const gradientRadius = scale;

const backgroundGradient = ctx.createRadialGradient(
  gradientCenterX,
  gradientCenterY,
  0,
  gradientCenterX,
  gradientCenterY,
  gradientRadius
);

// 星図背景の色（天頂から外側へ緩やかに変化）
backgroundGradient.addColorStop(0.00, "#000008");
backgroundGradient.addColorStop(0.25, "#00000F");
backgroundGradient.addColorStop(0.42, "#010116");
backgroundGradient.addColorStop(0.62, "#02021D");
backgroundGradient.addColorStop(0.85, "#040626");
backgroundGradient.addColorStop(1.00, "#080D32");

ctx.fillStyle = backgroundGradient;
ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  if (dataLoaded) {

  // こぐま座などの星座線を描画

      // こぐま座などの星座線を描画
      const starById = new Map(
        stars.map(star => [star.id, star])
      );

      for (const constellation of constellations) {
        ctx.beginPath();
        // 星座線の色と太さ
        ctx.strokeStyle = constellation.lineColor || "#FF3CC8";
        ctx.lineWidth = 0.75;

        for (const segment of constellation.segments) {
          const starA = starById.get(segment[0]);
          const starB = starById.get(segment[1]);

          if (!starA || !starB) continue;

          const pointA = projectStar(starA, lstDeg, basis);
          const pointB = projectStar(starB, lstDeg, basis);

          if (!pointA || !pointB) continue;

ctx.moveTo(
  centerX + pointA.x * scaleX,
  centerY + pointA.y * scaleY
);

ctx.lineTo(
  centerX + pointB.x * scaleX,
  centerY + pointB.y * scaleY
);
        }

        ctx.stroke();
      }

      // 恒星を描画
      for (const star of stars) {
        const projected = projectStar(star, lstDeg, basis);

        if (!projected) continue;

const x = centerX + projected.x * scaleX;
const y = centerY + projected.y * scaleY;

        // キャンバスの外にある星は描かない
        if (
          x < 0 || x > canvasWidth ||
          y < 0 || y > canvasHeight
        ) {
          continue;
        }

                // 星の等級・スペクトル型に応じて色と大きさを決める
        const isPolaris = projected.id === "hip-11767";
        const mag = projected.mag;

        // 四捨五入で1等星を判定
// 1.5等未満を1等星として判定
const isFirstMagnitude = mag < 1.5;

        // スペクトル型から恒星の色を取得
        const spect = String(star.spect || "").trim().toUpperCase();
        const spectralClass = spect.match(/^[OBAFGKM]/)?.[0] || "";

        const style = window.STAR_STYLE_CONFIG || {};
        const color =
          style.spectralColors?.[spectralClass] || "#FFFFFF";

        // 実視等級に応じて星の半径を決める
        let radius;

        if (mag < 1) {
          radius = 4.5;
        } else if (mag < 2) {
          radius = 3.3;
        } else if (mag < 3) {
          radius = 2.5;
        } else if (mag < 4) {
          radius = 1.8;
        } else {
          radius = 1.0;
        }

        // グローの設定
        const glow = style.glow || {};
        const glowEnabled = glow.enabled !== false;

        // 等級に応じて光の強さを調整
        let glowFactor;

        if (mag < 1) {
          glowFactor = 1.5;
        } else if (mag < 2) {
          glowFactor = 1.3;
        } else if (mag < 3) {
          glowFactor = 0.9;
        } else if (mag < 4) {
          glowFactor = 0.75;
        } else {
          glowFactor = 0.6;
        }

// 星の周囲に控えめな光を描く
if (glowEnabled) {
  ctx.save();

// 光の広がりを少し大きくする
const glowRadius =
  (glow.radius ?? 12) * 0.5 * glowFactor;

// 光の強さ
const glowStrength = 0.8;

  // 星の中心から外側へ自然に透明になるグラデーション
  const glowGradient = ctx.createRadialGradient(
    x, y, 0,
    x, y, glowRadius
  );

glowGradient.addColorStop(0.00, `${color}CC`);
glowGradient.addColorStop(0.30, `${color}80`);
glowGradient.addColorStop(0.65, `${color}35`);
glowGradient.addColorStop(1.00, `${color}00`);

  ctx.globalAlpha = glowStrength;
  ctx.fillStyle = glowGradient;

  ctx.beginPath();
  ctx.arc(
    x,
    y,
    glowRadius,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.restore();
}

// 1等星に光芒を追加
if (isFirstMagnitude) {
  drawStarDiffraction(x, y, radius, color);
}

// 星の中心はシャープに描く
ctx.fillStyle = color;

ctx.beginPath();
ctx.arc(
  x,
  y,
  radius,
  0,
  Math.PI * 2
);

ctx.fill();

        // 1等星・2等星の名前を表示（星名の表示）
        if (false) {
          // if ((mag < 2 || isPolaris) && projected.label) {
          ctx.font = '12px "Meiryo", sans-serif';
          ctx.fillStyle = color;
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";

          ctx.fillText(
            isPolaris ? "北極星" : projected.label,
            x + 9,
            y - 8
          );
        }
      }

      // 星の描画範囲の制限を解除する
      ctx.restore();
    }

        // 地平線（高度0°）を描画
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "rgba(180, 200, 220, 0.65)";
    ctx.lineWidth = 1;

    let horizonDrawing = false;

    for (let az = 0; az <= 360; az += 1) {
      const point = projectDirection(az, 0, basis);

      if (!point) {
        horizonDrawing = false;
        continue;
      }

const x = centerX + point.x * scaleX;
const y = centerY + point.y * scaleY;

if (
  !Number.isFinite(x) ||
  !Number.isFinite(y)
) {
  horizonDrawing = false;
  continue;
}

      if (!horizonDrawing) {
        ctx.moveTo(x, y);
        horizonDrawing = true;
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
    ctx.restore();

    
    // 地平座標の目盛り線
    ctx.save();

    ctx.strokeStyle = "rgba(160, 180, 200, 0.25)";
    ctx.lineWidth = 0.7;

    // 高度線：10°刻み（地平線の0°は既存の線を使用）
    for (let alt = 10; alt <= 80; alt += 10) {
      let drawing = false;

      ctx.beginPath();

      for (let az = 0; az <= 360; az += 1) {
        const point = projectDirection(az, alt, basis);

        if (!point) {
          drawing = false;
          continue;
        }

const x = centerX + point.x * scaleX;
const y = centerY + point.y * scaleY;

        if (!Number.isFinite(x) || !Number.isFinite(y)) {
          drawing = false;
          continue;
        }

        if (!drawing) {
          ctx.moveTo(x, y);
          drawing = true;
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    }

    // 方位角線：30°刻み
    // 北・東・南・西の線は既存の方位表示を活用する
    for (let az = 0; az < 360; az += 30) {
      let drawing = false;

      ctx.beginPath();

      for (let alt = 0; alt <= 90; alt += 1) {
        const point = projectDirection(az, alt, basis);

        if (!point) {
          drawing = false;
          continue;
        }

const x = centerX + point.x * scaleX;
const y = centerY + point.y * scaleY;

        if (!Number.isFinite(x) || !Number.isFinite(y)) {
          drawing = false;
          continue;
        }

        if (!drawing) {
          ctx.moveTo(x, y);
          drawing = true;
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    }

    ctx.restore();

    // 黄道を描画
    // 黄道傾斜角：約23.4393°
    ctx.save();

    ctx.strokeStyle = "rgba(210, 185, 100, 0.55)";
ctx.lineWidth = 0.8;
ctx.setLineDash([4, 5]);
    ctx.beginPath();

    const eclipticObliquity = 23.4393 * Math.PI / 180;
    let eclipticDrawing = false;

    // 黄経0°～360°を1°刻みで計算
    for (let lambdaDeg = 0; lambdaDeg <= 360; lambdaDeg += 1) {
      const lambda = lambdaDeg * Math.PI / 180;

      // 黄道座標から赤道座標（赤経・赤緯）へ変換
      const ra = Math.atan2(
        Math.sin(lambda) * Math.cos(eclipticObliquity),
        Math.cos(lambda)
      );

      const dec = Math.asin(
        Math.sin(lambda) * Math.sin(eclipticObliquity)
      );

      const raDeg = (ra * 180 / Math.PI + 360) % 360;
      const decDeg = dec * 180 / Math.PI;

      // 赤道座標から地平座標へ変換
      const horizontal = equatorialToHorizontalVector(
        raDeg,
        decDeg,
        lstDeg
      );

      const azDeg = (
        Math.atan2(horizontal.x, horizontal.y) * 180 / Math.PI + 360
      ) % 360;

      const altDeg = Math.asin(
        Math.max(-1, Math.min(1, horizontal.z))
      ) * 180 / Math.PI;

      // 現在の星図と同じ投影方式で描画位置を求める
      const point = projectDirection(azDeg, altDeg, basis);

      if (!point) {
        eclipticDrawing = false;
        continue;
      }

const x = centerX + point.x * scaleX;
const y = centerY + point.y * scaleY;

      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        eclipticDrawing = false;
        continue;
      }

      if (!eclipticDrawing) {
        ctx.moveTo(x, y);
        eclipticDrawing = true;
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

// 流星群の放射点を赤い十字＋円で表示
if (meteorRadiant) {
  const radiantPoint = projectStar(
    {
      ra: meteorRadiant.ra,
      dec: meteorRadiant.dec,
      mag: 0,
      id: "meteor-radiant",
      label: ""
    },
    lstDeg,
    basis
  );

  if (radiantPoint) {
    const x = centerX + radiantPoint.x * scaleX;
    const y = centerY + radiantPoint.y * scaleY;

    // 放射点の座標が有効な場合だけ表示
    if (
      Number.isFinite(x) &&
      Number.isFinite(y)
    ) {
      // 流星アニメーションへ放射点の画面座標を渡す
      updateMeteorRadiantPosition(x, y);

      ctx.save();

      // 赤い円
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffd700";
      ctx.lineWidth = 2;
      ctx.stroke();

      // 十字
      ctx.beginPath();
      ctx.moveTo(x - 15, y);
      ctx.lineTo(x + 15, y);

      ctx.moveTo(x, y - 15);
      ctx.lineTo(x, y + 15);

      // 放射点の色
      ctx.strokeStyle = "#ffd700";
      // 放射点十字部分の太さ
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

    } else {
      updateMeteorRadiantPosition(null, null);
    }

  } else {
    updateMeteorRadiantPosition(null, null);
  }

} else {
  updateMeteorRadiantPosition(null, null);
}

    // 地平線上の東西南北を表示
    const directions = [
      { az: 0, label: "北" },
      { az: 90, label: "東" },
      { az: 180, label: "南" },
      { az: 270, label: "西" }
    ];

    ctx.font = 'bold 16px "Meiryo", sans-serif';
    ctx.fillStyle = "#FFD700";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (const direction of directions) {
      const point = projectDirection(
        direction.az,
        0,
        basis
      );

      if (!point) continue;

const x = centerX + point.x * scaleX;
const y = centerY + point.y * scaleY;

// 方位表示の位置
const labelX = x;
const labelY = y;

        // 方位表示：半透明の白い丸＋濃紺の文字
        ctx.save();

        // 背景の白い丸
        ctx.beginPath();
        ctx.arc(labelX, labelY, 18, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.fill();

        // 方位の文字（従来の16pxから24pxへ約1.5倍）
        ctx.font = 'bold 24px "Meiryo", sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgb(6, 7, 64)";
        ctx.fillText(direction.label, labelX, labelY);

        ctx.restore();

    }

    // 天頂の表示
    const zenithPoint = projectDirection(0, 90, basis);

    if (zenithPoint) {
const zenithX = centerX + zenithPoint.x * scaleX;
const zenithY = centerY + zenithPoint.y * scaleY;

      ctx.save();

      // 半透明の白い丸
      ctx.beginPath();
      ctx.arc(zenithX, zenithY, 28, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.fill();

      // 「天頂」の文字
      ctx.font = 'bold 18px "Meiryo", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgb(6, 7, 64)";
      ctx.fillText("天頂", zenithX, zenithY);

      ctx.restore();
    }

  }

  // キャンバスの大きさを更新
  function resizeCanvas() {
    const rect = container.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) return;

    const dpr = window.devicePixelRatio || 1;

    canvasWidth = rect.width;
    canvasHeight = rect.height;

    canvas.width = Math.round(canvasWidth * dpr);
    canvas.height = Math.round(canvasHeight * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawChart();
  }

  // 指の操作開始
  canvas.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    activePointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });

    canvas.setPointerCapture(event.pointerId);

    if (activePointers.size === 1) {
      // 1本指：ドラッグ開始
      isDragging = true;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
    } else if (activePointers.size === 2) {
      // 2本指：ピンチ開始
      isDragging = false;
      lastPinchDistance = getPinchDistance();
    }
  });

  // 指の移動
  canvas.addEventListener("pointermove", event => {
    if (!activePointers.has(event.pointerId)) return;

    activePointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });

    if (activePointers.size >= 2) {
      // 2本指：間隔の変化で拡大・縮小
      const currentDistance = getPinchDistance();

      if (lastPinchDistance > 0 && currentDistance > 0) {
        const zoomFactor = lastPinchDistance / currentDistance;

        fieldOfViewDeg = Math.max(
          MIN_FIELD_OF_VIEW_DEG,
          Math.min(
            MAX_FIELD_OF_VIEW_DEG,
            fieldOfViewDeg * zoomFactor
          )
        );

        drawChart();
      }

      lastPinchDistance = currentDistance;
      return;
    }

    if (!isDragging) return;

    // 1本指：従来どおり表示方向を変更
    const deltaX = event.clientX - lastPointerX;
    const deltaY = event.clientY - lastPointerY;

    lastPointerX = event.clientX;
    lastPointerY = event.clientY;

    const minSize = Math.min(canvasWidth, canvasHeight);
    if (minSize <= 0) return;

    const degreesPerPixel = 180 / minSize;

    const cosAlt = Math.max(
      0.05,
      Math.abs(Math.cos(centerAltDeg * RAD))
    );

    centerAzDeg = normalizeDeg(
      centerAzDeg - deltaX * degreesPerPixel / cosAlt
    );

    centerAltDeg = Math.max(
      -89.5,
      Math.min(
        89.5,
        centerAltDeg + deltaY * degreesPerPixel
      )
    );

    drawChart();
  });

  // 指の操作終了
  function stopDragging(event) {
    activePointers.delete(event.pointerId);

    isDragging = false;
    lastPinchDistance = 0;

    // 2本指の片方を離した後、残った指でドラッグを再開
    if (activePointers.size === 1) {
      const remainingPointer =
        Array.from(activePointers.values())[0];

      lastPointerX = remainingPointer.x;
      lastPointerY = remainingPointer.y;
      isDragging = true;
    }
  }

  canvas.addEventListener("pointerup", stopDragging);
  canvas.addEventListener("pointercancel", stopDragging);
  canvas.addEventListener("lostpointercapture", stopDragging);

  // 星データを読み込む
  async function loadStarData() {
    try {
      const response = await fetch(DATA_PATH);

      if (!response.ok) {
        throw new Error(`HTTPエラー: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("星データが配列形式ではありません。");
      }

      stars = data.filter(star =>
        star.id !== "hyg-0" &&
        Number.isFinite(star.ra) &&
        Number.isFinite(star.dec) &&
        Number.isFinite(star.mag) &&
        star.ra >= 0 &&
        star.ra < 360 &&
        star.dec >= -90 &&
        star.dec <= 90
      );

      dataLoaded = true;
      drawChart();

      status.textContent =
        `星図表示中：${stars.length}個の恒星データを読み込みました。`;

      console.log("全星データ件数:", data.length);
      console.log("有効な恒星データ件数:", stars.length);
      console.log("現在の地方恒星時:", getLocalSiderealTimeDeg());

    } catch (error) {
      console.error("星データの読み込みに失敗しました:", error);
      status.textContent = "星データを読み込めませんでした。";
    }
  }

  // 星座線データを読み込む
  async function loadConstellationLines() {
    try {
      const response = await fetch(LINE_DATA_PATH);

      if (!response.ok) {
        throw new Error(`HTTPエラー: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data.constellations)) {
        throw new Error("星座線データの形式が正しくありません。");
      }

      constellations = data.constellations;
      drawChart();

      console.log("星座線データを読み込みました:", constellations);

    } catch (error) {
      console.error("星座線データの読み込みに失敗しました:", error);
    }
  }

  // 親ページから流星群の放射点を受信する
  window.addEventListener("message", function (event) {

    // iframeの親ページからのメッセージだけを受け取る
    if (event.source !== window.parent) return;

    // 同じオリジンからのメッセージだけを受け取る
    if (event.origin !== window.location.origin) return;

    const data = event.data;

    if (!data || data.type !== "set-meteor-radiant") {
      return;
    }

    // 赤経・赤緯の値を確認
    if (
      !Number.isFinite(data.ra) ||
      !Number.isFinite(data.dec) ||
      data.ra < 0 ||
      data.ra >= 360 ||
      data.dec < -90 ||
      data.dec > 90
    ) {
      console.error("流星群の放射点データが不正です。", data);
      return;
    }

        // 受信した放射点の赤経・赤緯を保存
    meteorRadiant = {
      ra: data.ra,
      dec: data.dec
    };

    // 現在の地方恒星時を取得
    const lstDeg = getLocalSiderealTimeDeg();

    // 赤経・赤緯から水平座標の方向ベクトルを求める
    const radiantVector = equatorialToHorizontalVector(
      data.ra,
      data.dec,
      lstDeg
    );

    // 方位角を計算（北0°、東90°）
    const radiantAzDeg = normalizeDeg(
      Math.atan2(
        radiantVector.x,
        radiantVector.y
      ) / RAD
    );

    // 高度を計算
    const radiantAltDeg = Math.asin(
      Math.max(
        -1,
        Math.min(1, radiantVector.z)
      )
    ) / RAD;

    // 星図の中心を放射点に合わせる
    centerAzDeg = radiantAzDeg;
    centerAltDeg = radiantAltDeg;

    // 星図を再描画
    drawChart();

    // 状態を確認
    status.textContent =
      `流星群の放射点を表示中：方位 ${radiantAzDeg.toFixed(1)}° ` +
      `高度 ${radiantAltDeg.toFixed(1)}°`;

    console.log("流星群の放射点を受信しました:", {
      name: data.name,
      ra: data.ra,
      dec: data.dec,
      az: radiantAzDeg,
      alt: radiantAltDeg
    });

  });

  // 初回表示
  resizeCanvas();

  // 画面サイズ変更に対応
  window.addEventListener("resize", resizeCanvas);

  // コンテナのサイズ変化に対応
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);
  }

  // 1分ごとに星図を再描画
  window.setInterval(drawChart, 60_000);

  loadStarData();
  loadConstellationLines();

    // 独立星図の流星アニメーションを開始
startChartMeteorAnimation();
})();