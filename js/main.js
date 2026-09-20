// ===============================
// 全カード（Q → other → A）
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
  "image/summer/other/card-Summer-Triangle.png",
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

  // 夏 other
  "image/summer/other/card-Summer-Triangle.png",

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
  "image/winter/other/card-Winter-Triangle.png",
  "image/winter/Q/card-Eridanus-Q.png",
  "image/winter/Q/card-Lepus-Q.png",

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
// 裏面（Q ↔ A、other ↔ null）
// ===============================
const backs = images.map((img, i) => {

  if (i === 0 || i === 1) return "image/common/card-null.png";

  const isQ = img.includes("/Q/");
  const isA = img.includes("/A/");
  const isOther = img.includes("/other/");

  if (isQ) {
    return img.replace("/Q/", "/A/").replace("-Q.png", "-A.png");
  }

  if (isA) {
    return img.replace("/A/", "/Q/").replace("-A.png", "-Q.png");
  }

  if (isOther) return "image/common/card-null.png";

  return "image/common/card-null.png";
});


// ===============================
// 季節の開始 index
// ===============================
const seasonStart = {
  spring: 2,
  summer: 22,
  autumn: 50,
  winter: 76,
  south: 93
};


// ===============================
// 状態
// ===============================
let index = 0;
let isBack = false;


// ===============================
// DOM
// ===============================
const viewer = document.querySelector("#card-area img");

const prevBtn = document.getElementById("prevBtn");
const flipBtn = document.getElementById("flipBtn");
const nextBtn = document.getElementById("nextBtn");

const springBtn = document.getElementById("springBtn");
const summerBtn = document.getElementById("summerBtn");
const autumnBtn = document.getElementById("autumnBtn");
const winterBtn = document.getElementById("winterBtn");
const southBtn  = document.getElementById("southBtn");


// ===============================
// 表示更新
// ===============================
function updateViewer() {
  viewer.src = isBack ? backs[index] : images[index];
}


// ===============================
// 季節ジャンプ
// ===============================
function jumpToSeason(season) {
  index = seasonStart[season];
  isBack = false;
  updateViewer();
}


// ===============================
// 次のカード
// ===============================
nextBtn.onclick = () => {

  // 表紙の裏 → 凡例へ
  if (index === 0 && isBack === true) {
    index = 1;
    isBack = false;
    updateViewer();
    return;
  }

  // 凡例の裏 → 春の1枚目へ
  if (index === 1 && isBack === true) {
    index = seasonStart.spring;  // 2
    isBack = false;
    updateViewer();
    return;
  }

  // Aカードの裏面（backs[index] が A）→ 次の星座のQへ
  if (isBack === true && backs[index].includes("/A/")) {
    if (index < images.length - 1) {
      index++;
    }
    isBack = false;
    updateViewer();
    return;
  }

  // other の裏面（null）は進めない
  if (isBack === true) return;

  // 通常の進む処理
  if (index < images.length - 1) {
    index++;
  }

  isBack = false;
  updateViewer();
};


// ===============================
// 前のカード
// ===============================
prevBtn.onclick = () => {

  if (index === 0 && isBack === true) return;

  if (index > 0) {
    index--;
  }

  isBack = false;
  updateViewer();
};


// ===============================
// 表裏めくる（Q ↔ A、other ↔ null）
// ===============================
flipBtn.onclick = () => {

  // null → other
  if (isBack && backs[index] === "image/common/card-null.png") {
    if (images[index].includes("/other/")) {
      isBack = false;
      updateViewer();
      return;
    }
  }

  isBack = !isBack;
  updateViewer();
};


// ===============================
// 季節ボタン
// ===============================
springBtn.onclick = () => jumpToSeason("spring");
summerBtn.onclick = () => jumpToSeason("summer");
autumnBtn.onclick = () => jumpToSeason("autumn");
winterBtn.onclick = () => jumpToSeason("winter");
southBtn.onclick  = () => jumpToSeason("south");
