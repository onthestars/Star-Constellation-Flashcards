// meteor.js

// 放射点座標
const radiantX = 100;
const radiantY = 150;

function spawnMeteorCore() {

  const meteorColors = [

    {
      core: "#ffffff",
      tail: "255,255,255"
    },

    {
      core: "#fff4b0",
      tail: "255,244,176"
    },

    {
      core: "#ffe070",
      tail: "255,224,112"
    },

    {
      core: "#c8ff90",
      tail: "200,255,144"
    },

    {
      core: "#b5dfff",
      tail: "181,223,255"
    }

  ];

  const meteorColor =
    meteorColors[
      Math.floor(
        Math.random() *
        meteorColors.length
      )
    ];

  const core = document.createElement("div");
  core.className = "meteor-core";

  const tail = document.createElement("div");
  tail.className = "meteor-tail";

  const startX =
    Math.random() * window.innerWidth;

  const startY =
    Math.random() * window.innerHeight;

  document.body.appendChild(tail);
  document.body.appendChild(core);

  const dx = startX - radiantX;
  const dy = startY - radiantY;

  const distanceFromRadiant =
    Math.sqrt(dx * dx + dy * dy);

  const angle =
    Math.atan2(dy, dx);

    // 尾の長さ
const moveDistance =
  Math.min(
    500,
    60 + distanceFromRadiant * 0.7
  );

// 流星速度
const duration =
  Math.max(
    600,
    1200 - distanceFromRadiant * 0.4
  );

  const endX =
    startX + Math.cos(angle) * moveDistance;

  const endY =
    startY + Math.sin(angle) * moveDistance;

  const startTime =
    performance.now();

  function animate(now) {

    const progress =
      Math.min(
        1,
        (now - startTime) /
        duration
      );

    const currentX =
      startX +
      (endX - startX) *
      progress;

    const currentY =
      startY +
      (endY - startY) *
      progress;

      // 核の大きさ
const coreSize =
  3 + Math.sin(progress * Math.PI) * 6;

    core.style.left =
      currentX + "px";

    core.style.top =
      currentY + "px";

    core.style.width =
      coreSize + "px";

    core.style.height =
      coreSize + "px";

    core.style.background =
      meteorColor.core;

    const glow =
      6 + progress * 16;

    core.style.boxShadow = `
      0 0 ${glow}px ${meteorColor.core},
      0 0 ${glow * 1.5}px ${meteorColor.core},
      0 0 ${glow * 2.5}px ${meteorColor.core}
    `;

    let coreOpacity = 1;

    if (progress > 0.9) {

      coreOpacity =
        1 -
        (
          (progress - 0.9) /
          0.1
        );

    }

    core.style.opacity =
      coreOpacity;

    const distance =
      Math.sqrt(
        (currentX - startX) ** 2 +
        (currentY - startY) ** 2
      );

    const trailLength =
      Math.max(
        0,
        distance
      );

      // 尾の太さ
    const trailHeight =
      Math.max(
        1.5,
        5 -
        distanceFromRadiant /
        180
      );

    tail.style.left =
      startX + "px";

    tail.style.top =
      startY + "px";

    tail.style.width =
      trailLength + "px";

    tail.style.height =
      trailHeight + "px";

    tail.style.transform =
      `translateY(-50%) rotate(${angle}rad)`;

    tail.style.background =
      `linear-gradient(
        to right,
        rgba(${meteorColor.tail},0.00) 0%,
        rgba(${meteorColor.tail},0.02) 15%,
        rgba(${meteorColor.tail},0.08) 35%,
        rgba(${meteorColor.tail},0.18) 55%,
        rgba(${meteorColor.tail},0.28) 75%,
        rgba(${meteorColor.tail},0.42) 90%,
        rgba(${meteorColor.tail},0.55) 100%
      )`;

    if (progress < 1) {

      requestAnimationFrame(
        animate
      );

        } else {

      core.remove();

      tail.animate(
        [
          {
            opacity: 1
          },
          {
            opacity: 0
          }
        ],
        {

          // 数が多いとゆっくりと透明に（少ないと唐突に消える）
          duration: 2000,
          fill: "forwards"
        }
      );

      // 尾が消えるまでの秒数
      setTimeout(() => {
        tail.remove();
      }, 3200);

    }

    

  }

  requestAnimationFrame(
    animate
  );

}

// ===============================
// 流星群モード（極大期っぽい）
// ===============================

setInterval(() => {

  // 毎秒判定（数値を増やせば一度に複数流れる）
  if (Math.random() < 0.24) {

    spawnMeteorCore();

    // 連続出現確率
    if (Math.random() < 0.1) {

      setTimeout(() => {

        spawnMeteorCore();

      }, 500 + Math.random() * 1500);

    }

  }

}, 1000);