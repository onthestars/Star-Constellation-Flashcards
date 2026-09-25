// main.js

// ===============================
// カード画像パス（遅延読み込み）
// ===============================
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

// ===============================
// 裏面パス生成
// ===============================
const backs = images.map((img, i) => {
  if (i === 0 || i === 1) return "image/common/card-null.png";
  if (img.includes("/Q/")) return img.replace("/Q/", "/A/").replace("-Q.png", "-A.png");
  if (img.includes("/A/")) return img.replace("/A/", "/Q/").replace("-A.png", "-Q.png");
  if (img.includes("/other/")) return "image/common/card-null.png";
  return "image/common/card-null.png";
});

// ===============================
// 季節開始 index
// ===============================
const seasonStart = {
  spring: 2,
  summer: 22,
  autumn: 49,
  winter: 75,
  south: 92
};

// ===============================
// index から季節を判定する
// ===============================
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

// ★ アニメーション用（旧方式は削除）
let animationClass = null;

// ===============================
// DOM
// ===============================
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

// ===============================
// ★ 効果音（Special viewer は削除済み）
// ===============================
const soundFlip = document.getElementById("soundFlip");
const soundPage = document.getElementById("soundPage");
const soundSeason = document.getElementById("soundSeason");

// ===============================
// カレント季節ボタン画像
// ===============================
const seasonImages = {
  spring: {
    normal: "image/common/btn-spring.png",
    active: "image/common/btn-spring-active.png"
  },
  summer: {
    normal: "image/common/btn-summer.png",
    active: "image/common/btn-summer-active.png"
  },
  autumn: {
    normal: "image/common/btn-autumn.png",
    active: "image/common/btn-autumn-active.png"
  },
  winter: {
    normal: "image/common/btn-winter.png",
    active: "image/common/btn-winter-active.png"
  },
  south: {
    normal: "image/common/btn-south.png",
    active: "image/common/btn-south-active.png"
  }
};

// ===============================
// カレント季節ボタンの画像を切り替える
// ===============================
function updateSeasonButtons() {
  document.querySelectorAll('.btn-season').forEach(btn => {
    const season = btn.dataset.season;
    btn.src = (season === currentSeason)
      ? seasonImages[season].active
      : seasonImages[season].normal;
  });
}

// ===============================
// 季節ジャンプ（新アニメ方式：フェードアウト → フェードイン）
// ===============================
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

// ===============================
// Special viewer が存在するカードか
// ===============================
function hasPhotoFor(i) {
  return (
    images[i].includes("Spring-Triangle") ||
    images[i].includes("Summer-Triangle") ||
    images[i].includes("Pegasus") ||
    images[i].includes("Pisces") ||
    images[i].includes("Cassiopeia") ||
    images[i].includes("Winter-Triangle")
  );
}

function updateSpecialButton() {
  if (hasPhotoFor(index)) {
    specialBtn.disabled = false;
    specialBtn.style.opacity = 1;
  } else {
    specialBtn.disabled = true;
    specialBtn.style.opacity = 0.2;
  }
}

// ===============================
// ★ updateViewer（新アニメ方式対応）
// ===============================
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

// ===============================
// 次の index を探す
// ===============================
function findNextIndex(i) {
  let n = i + 1;
  while (n < images.length && images[n].includes("/A/")) n++;
  return n;
}

// ===============================
// 前の index を探す
// ===============================
function findPrevIndex(i) {
  let p = i - 1;
  while (p >= 0 && images[p].includes("/A/")) p--;
  return p;
}

// ===============================
// ★ 次へ（新アニメ方式）
// ===============================
nextBtn.onclick = () => {

  soundPage.currentTime = 0;
  soundPage.play();

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

// ===============================
// ★ 前へ（新アニメ方式）
// ===============================
prevBtn.onclick = () => {

  soundPage.currentTime = 0;
  soundPage.play();

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

// ===============================
// 表／裏（Y軸回転アニメ）
// ===============================
flipBtn.onclick = () => {

  soundFlip.currentTime = 0;
  soundFlip.play();

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

// ===============================
// 季節ボタン（フェードイン）
// ===============================
springBtn.onclick = () => {
  soundSeason.currentTime = 0;
  soundSeason.play();
  animationClass = "fade-in";
  jumpToSeason("spring");
};

summerBtn.onclick = () => {
  soundSeason.currentTime = 0;
  soundSeason.play();
  animationClass = "fade-in";
  jumpToSeason("summer");
};

autumnBtn.onclick = () => {
  soundSeason.currentTime = 0;
  soundSeason.play();
  animationClass = "fade-in";
  jumpToSeason("autumn");
};

winterBtn.onclick = () => {
  soundSeason.currentTime = 0;
  soundSeason.play();
  animationClass = "fade-in";
  jumpToSeason("winter");
};

southBtn.onclick = () => {
  soundSeason.currentTime = 0;
  soundSeason.play();
  animationClass = "fade-in";
  jumpToSeason("south");
};

// ===============================
// ★ Special viewer ボタン（遷移のみ）
// ===============================
specialBtn.onclick = () => {
  window.location.href = "special-viewer.html?index=" + index;
};

// ===============================
updateViewer();

// ===============================
// ★ スワイプ操作（左右で前後カード）
// ===============================
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
