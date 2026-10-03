// main.js

// サウンド設定（localStorage）
let soundEnabled = localStorage.getItem("soundEnabled") === "false" ? false : true;

// 音声ON/OFFボタン
const soundOnBtn  = document.getElementById("soundOnBtn");
const soundOffBtn = document.getElementById("soundOffBtn");

// 初期表示
if (soundEnabled) {
  soundOnBtn.style.display  = "inline";
  soundOffBtn.style.display = "none";
} else {
  soundOnBtn.style.display  = "none";
  soundOffBtn.style.display = "inline";
}

// 音声ON/OFF切替（保存）
soundOnBtn.onclick = () => {
  soundEnabled = false;
  localStorage.setItem("soundEnabled", "false");
  soundOnBtn.style.display  = "none";
  soundOffBtn.style.display = "inline";
};

soundOffBtn.onclick = () => {
  soundEnabled = true;
  localStorage.setItem("soundEnabled", "true");
  soundOnBtn.style.display  = "inline";
  soundOffBtn.style.display = "none";
};

// カード画像パス（遅延読み込み）
const images = [
  "image/other/card-top.png",
  "image/other/card-explanatory-note.png",

  // 春 Q
  "image/spring/Q/card-Ursa-Minor-Q.png",
  "image/spring/Q/card-Crater-Q.png",
  "image/spring/Q/card-Corvus-Q.png",
  "image/spring/Q/card-Hydra-Q.png",
  "image/spring/Q/card-Cancer-Q.png",
  "image/spring/Q/card-Ursa-Major-Q.png",
  "image/spring/Q/card-Bootes-Q.png",
  "image/spring/Q/card-Virgo-Q.png",
  "image/spring/Q/card-Leo-Q.png",

  // 春 other
  "image/spring/other/card-The-Big-Curve-of-Spring.png",
  "image/spring/other/card-Spring-Triangle.png",

  // 春 A
  "image/spring/A/card-Ursa-Minor-A.png",
  "image/spring/A/card-Crater-A.png",
  "image/spring/A/card-Corvus-A.png",
  "image/spring/A/card-Hydra-A.png",
  "image/spring/A/card-Cancer-A.png",
  "image/spring/A/card-Ursa-Major-A.png",
  "image/spring/A/card-Bootes-A.png",
  "image/spring/A/card-Virgo-A.png",
  "image/spring/A/card-Leo-A.png",

  // 夏 Q
  "image/summer/Q/card-Lyra-Q.png",
  "image/summer/Q/card-Aquila-Q.png",
  "image/summer/Q/card-Cygnus-Q.png",
  "image/summer/Q/card-Delphinus-Q.png",
  "image/summer/Q/card-Sagitta-Q.png",
  "image/summer/Q/card-Sagittarius-Q.png",
  "image/summer/Q/card-Scorpius-Q.png",
  "image/summer/Q/card-Libra-Q.png",
  "image/summer/Q/card-Draco-Q.png",
  "image/summer/Q/card-Hercules-Q.png",
  "image/summer/Q/card-Ophiuchus-Q.png",
  "image/summer/Q/card-Corona-Borealis-Q.png",
  "image/summer/Q/card-Corona-Australis-Q.png",

  // 夏 other
  "image/summer/other/card-Summer-Triangle.png",

  // 夏 A
  "image/summer/A/card-Lyra-A.png",
  "image/summer/A/card-Aquila-A.png",
  "image/summer/A/card-Cygnus-A.png",
  "image/summer/A/card-Delphinus-A.png",
  "image/summer/A/card-Sagitta-A.png",
  "image/summer/A/card-Sagittarius-A.png",
  "image/summer/A/card-Scorpius-A.png",
  "image/summer/A/card-Libra-A.png",
  "image/summer/A/card-Draco-A.png",
  "image/summer/A/card-Hercules-A.png",
  "image/summer/A/card-Ophiuchus-A.png",
  "image/summer/A/card-Corona-Borealis-A.png",
  "image/summer/A/card-Corona-Australis-A.png",

  // 秋 Q
  "image/autumn/Q/card-Aquarius-Q.png",
  "image/autumn/Q/card-Piscis-Austrinus-Q.png",
  "image/autumn/Q/card-Capricornus-Q.png",
  "image/autumn/Q/card-Equuleus-Q.png",
  "image/autumn/Q/card-Pegasus-Q.png",
  "image/autumn/Q/card-Pisces-Q.png",
  "image/autumn/Q/card-Andromeda-Q.png",
  "image/autumn/Q/card-Cepheus-Q.png",
  "image/autumn/Q/card-Cassiopeia-Q.png",
  "image/autumn/Q/card-Cetus-Q.png",
  "image/autumn/Q/card-Perseus-Q.png",
  "image/autumn/Q/card-Aries-Q.png",
  "image/autumn/Q/card-Triangulum-Q.png",

  // 秋 A
  "image/autumn/A/card-Aquarius-A.png",
  "image/autumn/A/card-Piscis-Austrinus-A.png",
  "image/autumn/A/card-Capricornus-A.png",
  "image/autumn/A/card-Equuleus-A.png",
  "image/autumn/A/card-Pegasus-A.png",
  "image/autumn/A/card-Pisces-A.png",
  "image/autumn/A/card-Andromeda-A.png",
  "image/autumn/A/card-Cepheus-A.png",
  "image/autumn/A/card-Cassiopeia-A.png",
  "image/autumn/A/card-Cetus-A.png",
  "image/autumn/A/card-Perseus-A.png",
  "image/autumn/A/card-Aries-A.png",
  "image/autumn/A/card-Triangulum-A.png",

  // 冬 Q
  "image/winter/Q/card-Gemini-Q.png",
  "image/winter/Q/card-Auriga-Q.png",
  "image/winter/Q/card-Taurus-Q.png",
  "image/winter/Q/card-Orion-Q.png",
  "image/winter/Q/card-Canis-Major-Q.png",
  "image/winter/Q/card-Canis-Minor-Q.png",
  "image/winter/Q/card-Eridanus-Q.png",
  "image/winter/Q/card-Lepus-Q.png",

  // 冬 other
  "image/winter/other/card-Winter-Triangle.png",

  // 冬 A
  "image/winter/A/card-Gemini-A.png",
  "image/winter/A/card-Auriga-A.png",
  "image/winter/A/card-Taurus-A.png",
  "image/winter/A/card-Orion-A.png",
  "image/winter/A/card-Canis-Major-A.png",
  "image/winter/A/card-Canis-Minor-A.png",
  "image/winter/A/card-Eridanus-A.png",
  "image/winter/A/card-Lepus-A.png",

  // 南 Q
  "image/south/Q/card-Lupus-Q.png",
  "image/south/Q/card-Centaurus-Q.png",
  "image/south/Q/card-Ara-Q.png",
  "image/south/Q/card-Argo-Puppis-Vela-Carina-Pyxis-Q.png",

  // 南 A
  "image/south/A/card-Lupus-A.png",
  "image/south/A/card-Centaurus-A.png",
  "image/south/A/card-Ara-A.png",
  "image/south/A/card-Argo-Puppis-Vela-Carina-Pyxis-A.png"
];

// 裏面パス生成
const backs = images.map((img, i) => {
  if (i === 0 || i === 1) return "image/common/card-null.png";
  if (img.includes("/Q/")) return img.replace("/Q/", "/A/").replace("-Q.png", "-A.png");
  if (img.includes("/A/")) return img.replace("/A/", "/Q/").replace("-A.png", "-Q.png");
  if (img.includes("/other/")) return "image/common/card-null.png";
  return "image/common/card-null.png";
});

// 季節開始 index
const seasonStart = {
  spring: 2,
  summer: 22,
  autumn: 49,
  winter: 75,
  south: 92
};

// index から季節を判定
function detectSeasonByIndex(i) {
  if (i >= seasonStart.spring && i < seasonStart.summer) return "spring";
  if (i >= seasonStart.summer && i < seasonStart.autumn) return "summer";
  if (i >= seasonStart.autumn && i < seasonStart.winter) return "autumn";
  if (i >= seasonStart.winter && i < seasonStart.south) return "winter";
  if (i >= seasonStart.south) return "south";
  return null;
}

const ARGO_Q_INDEX = 95;

let currentSeason = null;
let index = 0;
let isBack = false;
let isFinalNull = false;

// アニメーション用（旧方式は削除済み）
let animationClass = null;

// 現在時刻を生成
function getCurrentTimeString() {
  const now = new Date();
  const y  = now.getFullYear();
  const m  = String(now.getMonth() + 1).padStart(2, '0');
  const d  = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${y}${m}${d}-${hh}${mm}${ss}`;
}

// 星図 URL を生成
function makeLink(ra, dec, lat, lon, fov) {
  const time = getCurrentTimeString();
  return `https://peteworden.github.io/Soleil/chart.html?ra=${ra}&dec=${dec}&lat=${lat}&lon=${lon}&time=${time}&fov=${fov}`;
}

// カードごとのリンク配列
const links = new Array(images.length).fill(null);

/* ぴーとの星図へリンク（クリック時座標へ） */
/* 春の星座 */
links[2]  = makeLink(234.777, 77.916, 34.81, 135.53, 40.00);
links[3]  = makeLink(170.33, -15.144, 34.81, 135.53, 40.00);
links[4]  = makeLink(185.341, -18.145, 34.81, 135.53, 40.00);
links[5]  = makeLink(157.816, -20.135, 34.81, 135.53, 90.00);
links[6]  = makeLink(127.367, 14.912, 34.81, 135.53, 40.00);
links[7]  = makeLink(165.396, 57.859, 34.81, 135.53, 40.00);
links[8]  = makeLink(219.034, 29.886, 34.81, 135.53, 40.00);
links[9]  = makeLink(200.338, -2.137, 34.81, 135.53, 40.00);
links[10] = makeLink(157.851, 14.865, 34.81, 135.53, 40.00);
links[11] = makeLink(212.107, 27.583, 34.81, 135.53, 110.00); /* 春の大曲線 */
links[12] = makeLink(195.194, 8.909, 34.81, 135.53, 100.00); /* 春の大三角 */

/* 夏の星座 */
links[22] = makeLink(281.485, 36.029, 34.81, 135.53, 40.00);
links[23] = makeLink(292.835, 2.057, 34.81, 135.53, 40.00);
links[24] = makeLink(307.731, 43.09, 34.81, 135.53, 40.00);
links[25] = makeLink(310.316, 12.095, 34.81, 135.53, 40.00);
links[26] = makeLink(297.797, 18.068, 34.81, 135.53, 40.00);
links[27] = makeLink(285.406, -24.961, 34.81, 135.53, 40.00);
links[28] = makeLink(247.906, -26.056, 34.81, 135.53, 40.00);
links[29] = makeLink(227.867, -14.099, 34.81, 135.53, 40.00);
links[30] = makeLink(255.093, 59.962, 34.81, 135.53, 70.00);
links[31] = makeLink(257.766, 26.968, 34.81, 135.53, 40.00);
links[32] = makeLink(257.852, -5.031, 34.81, 135.53, 60.00);
links[33] = makeLink(235.27, 29.916, 34.81, 135.53, 40.00);
links[34] = makeLink(277.966, -40.98, 34.81, 135.53, 40.00);
links[35] = makeLink(294.678, 29.203, 34.81, 135.53, 100.00); /* 夏の大三角 */

/* 秋の星座 */
links[49] = makeLink(335.357, -12.865, 34.81, 135.53, 60.00);
links[50] = makeLink(332.885, -31.868, 34.81, 135.53, 40.00);
links[51] = makeLink(312.882, -19.899, 34.81, 135.53, 40.00);
links[52] = makeLink(317.832, 6.11, 34.81, 135.53, 40.00);
links[53] = makeLink(337.822, 20.137, 34.81, 135.53, 40.00);
links[54] = makeLink(5.345, 10.148, 34.81, 135.53, 60.00);
links[55] = makeLink(10.363, 38.146, 34.81, 135.53, 40.00);
links[56] = makeLink(330.138, 70.129, 34.81, 135.53, 40.00);
links[57] = makeLink(15.411, 60.143, 34.81, 135.53, 40.00);
links[58] = makeLink(26.579, -11.867, 34.81, 135.53, 60.00);
links[59] = makeLink(50.446, 42.095, 34.81, 135.53, 40.00);
links[60] = makeLink(37.876, 20.118, 34.81, 135.53, 40.00);
links[61] = makeLink(30.39, 32.128, 34.81, 135.53, 40.00);

/* 冬の星座 */
links[75] = makeLink(105.401, 21.961, 34.81, 135.53, 40.00);
links[76] = makeLink(90.477, 41.999, 34.81, 135.53, 40.00);
links[77] = makeLink(67.888, 18.056, 34.81, 135.53, 40.00);
links[78] = makeLink(80.351, 3.025, 34.81, 135.53, 40.00);
links[79] = makeLink(100.278, -24.026, 34.81, 135.53, 40.00);
links[80] = makeLink(112.857, 5.943, 34.81, 135.53, 40.00);
links[81] = makeLink(57.77, -29.92, 34.81, 135.53, 60.00);
links[82] = makeLink(81.539, -19.978, 34.81, 135.53, 40.00);
links[83] = makeLink(100.852, 0.575, 34.81, 135.53, 100.00); /* 冬の大三角とダイヤモンド */

/* 南の星座 */
links[92] = makeLink(225.425, -40.103, 34.81, 135.53, 40.00);
links[93] = makeLink(200.39, -47.137, 34.81, 135.53, 40.00);
links[94] = makeLink(258.045, -55.031, 34.81, 135.53, 40.00);
links[95] = makeLink(130.126, -62.094, 34.81, 135.53, 70.00);

// DOM
const viewer = document.getElementById("card-img");
const prevBtn = document.getElementById("prevBtn");
const flipBtn = document.getElementById("flipBtn");
const nextBtn = document.getElementById("nextBtn");

const springBtn = document.getElementById("springBtn");
const summerBtn = document.getElementById("summerBtn");
const autumnBtn = document.getElementById("autumnBtn");
const winterBtn = document.getElementById("winterBtn");
const southBtn  = document.getElementById("southBtn");

const specialBtn = document.getElementById("specialBtn");

// main.js

// 効果音
const soundFlip   = document.getElementById("soundFlip");
const soundPage   = document.getElementById("soundPage");
const soundSeason = document.getElementById("soundSeason");

// 季節ボタン画像
const seasonImages = {
  spring: { normal: "image/common/btn-spring.png",  active: "image/common/btn-spring-active.png" },
  summer: { normal: "image/common/btn-summer.png",  active: "image/common/btn-summer-active.png" },
  autumn: { normal: "image/common/btn-autumn.png",  active: "image/common/btn-autumn-active.png" },
  winter: { normal: "image/common/btn-winter.png",  active: "image/common/btn-winter-active.png" },
  south:  { normal: "image/common/btn-south.png",   active: "image/common/btn-south-active.png" }
};

// 季節ボタンの画像切替
function updateSeasonButtons() {
  document.querySelectorAll('.btn-season').forEach(btn => {
    const season = btn.dataset.season;
    btn.src = (season === currentSeason)
      ? seasonImages[season].active
      : seasonImages[season].normal;
  });
}

// 季節ジャンプ（フェードアウト → フェードイン）
function jumpToSeason(season) {

  viewer.classList.remove("flip-rotate");
  viewer.classList.remove("fade-out", "fade-in", "slide-out-left", "slide-out-right");
  void viewer.offsetWidth;
  viewer.classList.add("fade-out");

  setTimeout(() => {

    currentSeason = season;
    updateSeasonButtons();

    index = seasonStart[season];
    isBack = false;
    isFinalNull = false;

    viewer.src = images[index];

    viewer.classList.remove("fade-out");
    void viewer.offsetWidth;
    viewer.classList.add("fade-in");

    updateViewer();

  }, 300);
}

// ======== ======== ======== ======== ========
//▼▼▼Special画像追加時に編集//
// Special viewer 対応カードか判定
//カード画像の星座名と、大文字小文字まで厳密一致させること
// パイプ(||)の位置に注意。※最終行には付けないこと
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
    images[i].includes("Orion") ||
    images[i].includes("Winter-Triangle")
  );
}
// ======== ======== ======== ======== ========

function updateSpecialButton() {
  if (hasPhotoFor(index)) {
    specialBtn.disabled = false;
    specialBtn.style.opacity = 1;
  } else {
    specialBtn.disabled = true;
    specialBtn.style.opacity = 0.2;
  }
}

// Viewer 更新（新アニメ方式）
function updateViewer() {

  if (animationClass) {
    viewer.classList.remove("slide-out-left", "fade-in");
    void viewer.offsetWidth;
    viewer.classList.add(animationClass);
    animationClass = null;
  }

  if (isFinalNull) {
    viewer.src = "image/common/card-null.png";
    nextBtn.disabled = true;
    nextBtn.style.opacity = 0.4;

    currentSeason = null;
    updateSeasonButtons();
    return;
  }

  viewer.src = isBack ? backs[index] : images[index];
  nextBtn.disabled = false;
  nextBtn.style.opacity = 1;

  prevBtn.disabled = (index === 0);
  prevBtn.style.opacity = (index === 0 ? 0.4 : 1);

  updateSpecialButton();

  const autoSeason = detectSeasonByIndex(index);
  if (autoSeason !== currentSeason) {
    currentSeason = autoSeason;
    updateSeasonButtons();
  }
}

// 次の index を探す
function findNextIndex(i) {
  let n = i + 1;
  while (n < images.length && images[n].includes("/A/")) n++;
  return n;
}

// 前の index を探す
function findPrevIndex(i) {
  let p = i - 1;
  while (p >= 0 && images[p].includes("/A/")) p--;
  return p;
}

// 次へ（新アニメ方式）
nextBtn.onclick = () => {

  if (soundEnabled) {
    soundPage.currentTime = 0;
    soundPage.play();
  }

  if (isFinalNull) return;

  nextBtn.disabled = true;

  viewer.classList.remove("slide-out-left", "fade-in");
  void viewer.offsetWidth;
  viewer.classList.add("slide-out-left");

  setTimeout(() => {

    let next = findNextIndex(index);

    if (next >= images.length) {
      isFinalNull = true;
      isBack = true;
      viewer.src = "image/common/card-null.png";
    } else {
      index = next;
      isBack = false;
      viewer.src = images[index];
    }

    viewer.classList.remove("slide-out-left");
    void viewer.offsetWidth;
    viewer.classList.add("fade-in");

    updateViewer();

    nextBtn.disabled = false;

  }, 400);
};

// 前へ（新アニメ方式）
prevBtn.onclick = () => {

  if (soundEnabled) {
    soundPage.currentTime = 0;
    soundPage.play();
  }

  if (index === 0) return;
  
  prevBtn.disabled = true;

  viewer.classList.remove("slide-out-left", "slide-out-right", "fade-in");
  void viewer.offsetWidth;
  viewer.classList.add("slide-out-right");

  setTimeout(() => {

    if (isFinalNull) {
      isFinalNull = false;
      index = ARGO_Q_INDEX;
      isBack = false;
      viewer.src = images[index];
    } else {
      let prev = findPrevIndex(index);
      if (prev >= 0) {
        index = prev;
        isBack = false;
        viewer.src = images[index];
      }
    }

    viewer.classList.remove("slide-out-right");
    void viewer.offsetWidth;
    viewer.classList.add("fade-in");

    updateViewer();

    prevBtn.disabled = false;

  }, 400);
};

// 表／裏（Y軸回転）
flipBtn.onclick = () => {

  if (soundEnabled) {
    soundFlip.currentTime = 0;
    soundFlip.play();
  }

  if (isFinalNull) {
    isBack = true;
    updateViewer();
    return;
  }

  flipBtn.disabled = true;

  viewer.classList.remove("flip-rotate");
  void viewer.offsetWidth;
  viewer.classList.add("flip-rotate");

  setTimeout(() => {
    isBack = !isBack;
    viewer.src = isBack ? backs[index] : images[index];
  }, 400);

  setTimeout(() => {
    viewer.classList.remove("flip-rotate");
    flipBtn.disabled = false;
  }, 800);
};

// 季節ボタン（フェードイン）
springBtn.onclick = () => {
  if (soundEnabled) {
    soundSeason.currentTime = 0;
    soundSeason.play();
  }
  animationClass = "fade-in";
  jumpToSeason("spring");
};

summerBtn.onclick = () => {
  if (soundEnabled) {
    soundSeason.currentTime = 0;
    soundSeason.play();
  }
  animationClass = "fade-in";
  jumpToSeason("summer");
};

autumnBtn.onclick = () => {
  if (soundEnabled) {
    soundSeason.currentTime = 0;
    soundSeason.play();
  }
  animationClass = "fade-in";
  jumpToSeason("autumn");
};

winterBtn.onclick = () => {
  if (soundEnabled) {
    soundSeason.currentTime = 0;
    soundSeason.play();
  }
  animationClass = "fade-in";
  jumpToSeason("winter");
};

southBtn.onclick = () => {
  if (soundEnabled) {
    soundSeason.currentTime = 0;
    soundSeason.play();
  }
  animationClass = "fade-in";
  jumpToSeason("south");
};

// 初期表示
updateViewer();

// カードクリックで星図リンクを開く
viewer.addEventListener("click", () => {
  const url = links[index];
  if (!url) return;

  sessionStorage.setItem("fromExternal", "true");
  sessionStorage.setItem("lastCardIndex", index);

  location.href = url;
});

// スワイプ操作（左右で前後カード）
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

// 外部リンクから戻った場合の復帰処理
window.addEventListener("load", () => {

  if (sessionStorage.getItem("fromExternal") === "true") {

    const saved = sessionStorage.getItem("lastCardIndex");

    index = (saved !== null) ? Number(saved) : 0;

    sessionStorage.removeItem("fromExternal");

  } else {
    index = 0;
  }

  isBack = false;
  isFinalNull = false;

  viewer.src = images[index];
  updateViewer();
});

// Special Thanks
document.getElementById("specialThanksBtn").addEventListener("click", () => {
  window.open("https://peteworden.github.io/Soleil/chart.html", "_blank");
});

// 月のアニメーション

let animationId = null;   // ★ アニメのIDを保持
let resizeTimer = null;   // ★ resize連打対策

function startMoonOrbitSequence() {
    const moon = document.getElementById("moon");

    const w = window.innerWidth;
    const h = window.innerHeight;

    const cx = w / 2;
    const cy = h * 0.50; //月の高さ（画面サイズで変わる）
    const r = Math.min(w, h) * 0.80;

    const baseDeg = 10;

    const phases = [
        "moon5-crescent.png",
        "moon6-half.png",
        "moon1-full.png",
        "moon2-half.png",
        "moon3-crescent.png",
        "moon4-new.png"
    ];

    let currentPhase = 0;

    function runPhase(phaseIndex) {

        // ▼ フェードイン準備
        moon.style.transition = "opacity 1.5s ease";
        moon.style.opacity = 0;
        moon.src = "image/common/" + phases[phaseIndex];

        // ▼ フェードイン開始（軌道アニメと同時進行）
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                moon.style.opacity = 1;
            });
        });

        let theta = Math.PI;
        let fadeOutStarted = false; // ★ フェードアウト開始済み判定

        function animate() {
            const x = cx + r * Math.cos(theta);
            const y = cy - r * Math.sin(theta);

            moon.style.left = x + "px";
            moon.style.top  = y + "px";

            const orbitDeg = -(theta - Math.PI/2) * (180 / Math.PI) / 3;
            const rotateDeg = baseDeg + orbitDeg;
            moon.style.transform = `rotate(${rotateDeg}deg)`;

            // ▼ フェードアウト開始（軌道アニメ中）
            // theta が終盤に入ったらフェードアウト開始
            if (theta < 0.3 && !fadeOutStarted) {
                fadeOutStarted = true;
                moon.style.opacity = 0;  // ← 動きながらフェードアウト
            }

            theta -= 0.002;

            // ▼ 軌道終了 → 次フェーズへ
            if (theta <= 0) {

                currentPhase++;
                if (currentPhase >= phases.length) {
                    currentPhase = 0;
                }

                // フェードアウト完了後に次フェーズ開始
                setTimeout(() => {
                    runPhase(currentPhase);
                }, 1500);

                return;
            }

            animationId = requestAnimationFrame(animate);
        }

        animate();
    }

    runPhase(currentPhase);
}

window.onload = startMoonOrbitSequence;

// ★ resize時の安全な再起動
window.onresize = () => {

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {

        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        startMoonOrbitSequence();

    }, 200);
};
