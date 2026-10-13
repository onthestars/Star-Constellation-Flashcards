// moon-observation.js

// ▼ 月情報マスター
const moonDefinitions = [

  {
    icon: "moon-phase-01.png",
    alt: "新月",
    name: "新月",
    ruby: "しんげつ",
    rank: "★★★★★",
    observeTime: "日没後～明け方"
  },

  {
    icon: "moon-phase-02.png",
    alt: "繊月",
    name: "繊月",
    ruby: "せんげつ",
    rank: "★★★★★",
    observeTime: "日没後～明け方"
  },

  {
    icon: "moon-phase-02.png",
    alt: "三日月",
    name: "三日月",
    ruby: "みかづき",
    rank: "★★★★★",
    observeTime: "日没後～明け方"
  },

  {
    icon: "moon-phase-03.png",
    alt: "上弦の月",
    name: "上弦の月",
    ruby: "じょうげんのつき",
    rank: "★★★☆☆",
    observeTime: "0時頃～明け方"
  },

  {
    icon: "moon-phase-04.png",
    alt: "十三夜",
    name: "十三夜",
    ruby: "じゅうさんや",
    rank: "★★☆☆☆",
    observeTime: "22時頃～明け方"
  },

  {
    icon: "moon-phase-05.png",
    alt: "満月",
    name: "満月",
    ruby: "まんげつ",
    rank: "★☆☆☆☆",
    observeTime: "月の観察がおすすめ"
  },

  {
    icon: "moon-phase-06.png",
    alt: "十六夜",
    name: "十六夜",
    ruby: "いざよい",
    rank: "★★☆☆☆",
    observeTime: "23時頃～明け方"
  },

  {
    icon: "moon-phase-06.png",
    alt: "立待月",
    name: "立待月",
    ruby: "たちまちづき",
    rank: "★★★☆☆",
    observeTime: "22時頃～明け方"
  },

  {
    icon: "moon-phase-06.png",
    alt: "居待月",
    name: "居待月",
    ruby: "いまちづき",
    rank: "★★★☆☆",
    observeTime: "21時頃～明け方"
  },

  {
    icon: "moon-phase-06.png",
    alt: "寝待月",
    name: "寝待月",
    ruby: "ねまちづき",
    rank: "★★★★☆",
    observeTime: "20時頃～2時頃"
  },

  {
    icon: "moon-phase-07.png",
    alt: "更待月",
    name: "更待月",
    ruby: "ふけまちづき",
    rank: "★★★★☆",
    observeTime: "19時頃～2時頃"
  },

  {
    icon: "moon-phase-07.png",
    alt: "下弦の月",
    name: "下弦の月",
    ruby: "かげんのつき",
    rank: "★★★★☆",
    observeTime: "18時頃～2時頃"
  },

  {
    icon: "moon-phase-08.png",
    alt: "有明の月",
    name: "有明の月",
    ruby: "ありあけのつき",
    rank: "★★★★★",
    observeTime: "18時頃～1時頃"
  },

  {
    icon: "moon-phase-08.png",
    alt: "晦日月",
    name: "晦日月",
    ruby: "みそかづき",
    rank: "★★★★★",
    observeTime: "日没後～明け方"
  }

];

// ▼ 仮の月齢判定
function getMoonInfoByAge(age) {

  if (age < 1) return moonDefinitions[0];
  if (age < 2.5) return moonDefinitions[1];
  if (age < 5) return moonDefinitions[2];
  if (age < 9) return moonDefinitions[3];
  if (age < 14) return moonDefinitions[4];
  if (age < 16) return moonDefinitions[5];
  if (age < 17) return moonDefinitions[6];
  if (age < 18) return moonDefinitions[7];
  if (age < 19) return moonDefinitions[8];
  if (age < 20) return moonDefinitions[9];
  if (age < 22) return moonDefinitions[10];
  if (age < 26) return moonDefinitions[11];
  if (age < 29) return moonDefinitions[12];

  return moonDefinitions[13];

}

// ▼ 月齢取得
function getMoonAge() {

  if (typeof Astronomy === "undefined") {
    console.error("Astronomy Engine が読み込まれていません。");
    return 0;
  }

  const date = new Date();

  // 月の位相角（度）
  const phase = Astronomy.MoonPhase(date);

  // 月齢（日数）の近似値
  return phase / 360 * 29.530588853;
}

// ▼ 月情報取得
function getMoonInfo() {

  const age = getMoonAge();

  return getMoonInfoByAge(age);

}

// ▼ 月情報表示
function updateMoonObservation() {

  const moonInfo = getMoonInfo();

  const html = `
    <div class="moon-line">

      <img
        src="image/common/${moonInfo.icon}"
        class="moon-phase-icon"
        alt="${moonInfo.alt}">

      今夜は${moonInfo.name}（${moonInfo.ruby}）

    </div>

    <br>

    星空観察ランク：${moonInfo.rank}<br>
    おすすめ時間帯：${moonInfo.observeTime}
  `;

  const target =
    document.getElementById("moon-observation-content");

  if (target) {
    target.innerHTML = html;
  }

}

// ▼ 閉じるボタン
function initMoonObservationPanel() {

  const closeBtn =
    document.getElementById("moon-panel-close");

  const panel =
    document.getElementById("moon-observation-panel");

  if (!closeBtn || !panel) {
    return;
  }

  closeBtn.addEventListener("click", () => {
    panel.style.display = "none";
  });

}