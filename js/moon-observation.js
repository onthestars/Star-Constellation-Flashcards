(function () {
  "use strict";

  const SYNODIC_MONTH = 29.530588853;

  // 大阪の座標
  const LATITUDE = 34.6937;
  const LONGITUDE = 135.5023;

  const MOON_IMAGES = [
    "moon-phase-01.png", // 新月
    "moon-phase-02.png", // 満ちていく月
    "moon-phase-03.png", // 上弦の月
    "moon-phase-04.png", // 満ちていく月
    "moon-phase-05.png", // 満月
    "moon-phase-06.png", // 欠けていく月
    "moon-phase-07.png", // 下弦の月
    "moon-phase-08.png"  // 欠けていく月
  ];

  function getReferenceDate(date) {
    // 月齢を毎日、日本標準時の正午で計算する
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12, 0, 0, 0
    );
  }

  function getPreviousNewMoon(date) {
    const referenceDate = getReferenceDate(date);
    const searchStart = Astronomy.MakeTime(referenceDate);

    const newMoon = Astronomy.SearchMoonPhase(
      0,
      searchStart,
      -SYNODIC_MONTH - 2
    );

    return newMoon.date;
  }

  function getMoonAge(date) {
    const referenceDate = getReferenceDate(date);
    const newMoonDate = getPreviousNewMoon(referenceDate);

    return (
      (referenceDate.getTime() - newMoonDate.getTime()) /
      (1000 * 60 * 60 * 24)
    );
  }


  // 月相角から8種類の月画像を判定
  function getMoonPhaseIndex(date) {
    const referenceDate = getReferenceDate(date);
    const time = Astronomy.MakeTime(referenceDate);
    const phaseAngle = Astronomy.MoonPhase(time);

    return Math.round(phaseAngle / 45) % 8;
  }


  // 指定日の間に起きた主要な月相を調べる
  function getExactPhaseName(date) {
    const phaseEvents = [
      { angle: 0, name: "新月" },
      { angle: 90, name: "上弦の月" },
      { angle: 180, name: "満月" },
      { angle: 270, name: "下弦の月" }
    ];

    const nextMidnight = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
      0, 0, 0, 0
    );

    const searchStart = Astronomy.MakeTime(nextMidnight);

    for (const event of phaseEvents) {
      // 翌日0時から2日前までさかのぼってイベントを検索
      const phaseTime = Astronomy.SearchMoonPhase(
        event.angle,
        searchStart,
        -2
      );

      if (!phaseTime) {
        continue;
      }

      const eventDate = phaseTime.date;

      // 天文現象が発生した日だけ、主要な月相名を返す
      if (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      ) {
        return event.name;
      }
    }

    return null;
  }

  // 主要な月相の日以外は、満ち欠けの方向で名称を決める
  function getPhaseName(date) {
    const exactName = getExactPhaseName(date);

    if (exactName) {
      return exactName;
    }

    const time = Astronomy.MakeTime(getReferenceDate(date));
    const phaseAngle = Astronomy.MoonPhase(time);

    return phaseAngle < 180
      ? "満ちていく月"
      : "欠けていく月";
  }


  function getObservationRating(age) {
    // 月齢を基準にした星空観測度
    const ageInCycle = ((age % SYNODIC_MONTH) + SYNODIC_MONTH)
      % SYNODIC_MONTH;

    let stars;
    let message;

    if (ageInCycle < 3 || ageInCycle >= 22.5) {
      stars = 5;
      message = "星空観測にとても適しています";
    } else if (ageInCycle < 6) {
      stars = 4;
      message = "星空観測に適しています";
    } else if (ageInCycle < 8) {
      stars = 3;
      message = "星空観測に比較的適しています";
    } else if (ageInCycle < 11) {
      stars = 2;
      message = "月明かりの影響が出始めます";
    } else if (ageInCycle < 14) {
      stars = 1;
      message = "月明かりの影響が大きくなります";
    } else if (ageInCycle < 17) {
      stars = 0;
      message = "月明かりの影響が最も大きい時期です";
    } else if (ageInCycle < 20) {
      stars = 1;
      message = "月明かりの影響が大きくなります";
    } else if (ageInCycle < 22.5) {
      stars = 2;
      message = "月明かりの影響が少しずつ小さくなります";
    }

    return {
      stars: "★".repeat(stars) + "☆".repeat(5 - stars),
      message: message
    };
  }

  function renderMoonObservation() {
    const content = document.getElementById("moon-observation-content");

    if (!content) {
      return;
    }

    if (typeof Astronomy === "undefined") {
      content.textContent = "月の情報を読み込めませんでした。";
      return;
    }

    try {
      // const today = new Date(); // 本日の年月日を取得
      const today = new Date(2026, 9, 12); // テスト用年月日 ※月は、1月が0,2月が1,3月が2…である

      const age = getMoonAge(today);

// 月相角を使って画像と月の名称を判定
const phaseIndex = getMoonPhaseIndex(today);

// 実際の月相イベントの日付から表示名を決める
const phaseName = getPhaseName(today);

const rating = getObservationRating(age);

// 新月・満月専用のコメント
let observationMessage = rating.message;

if (phaseName === "新月") {
  observationMessage =
    "月明かりが少なく、星空観測に絶好のタイミングです";
} else if (phaseName === "満月") {
  observationMessage =
    "月が明るく輝く夜。月そのものの観察がおすすめです";
}

const imagePath = "image/common/" + MOON_IMAGES[phaseIndex];



const dateText =
  `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

content.innerHTML = `
  <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        line-height: 1.3;
        font-size: 14px;
      ">
    <img
      src="${imagePath}"
      alt="${phaseName}"
      style="
        display: block;
        flex: 0 0 64px; /* 横並びレイアウトで画像が占める幅 */
        width: 48px; /* 月の幅 */
        height: 48px; /* 月の高さ */
        object-fit: contain;
        margin: 0;
        padding: 0;
      "
    >

    <div style="min-width: 0; margin: 0; padding: 0;">
      <div style="font-size:0.9em;margin: 0 0 3px 0;text-align: left;">
        ${dateText}
      </div>

      <div style="font-size:0.9em;margin: 0 0 3px 0;text-align: left;">
        ${phaseName}（月齢 ${age.toFixed(1)}）
      </div>

      <div style="font-size:1.2em;margin: 8px 0 3px 0;text-align: left;">
        星空観測度 ${rating.stars}
      </div>

      <div style="font-size:0.9em;margin: 0;text-align: left;">
        ${observationMessage}
      </div>
    </div>
  </div>
`;


    } catch (error) {
      console.error("月の情報の取得に失敗しました:", error);
      content.textContent = "月の情報を取得できませんでした。";
    }
  }

  function initMoonObservationPanel() {
    const panel = document.getElementById("moon-observation-panel");
    const closeButton = document.getElementById("moon-panel-close");

    if (closeButton && panel && !closeButton.dataset.initialized) {
      closeButton.addEventListener("click", function () {
        panel.style.display = "none";
      });

      closeButton.dataset.initialized = "true";
    }
  }

  // 既存の main.js から呼び出せるようにする
  window.updateMoonObservation = renderMoonObservation;
  window.initMoonObservationPanel = initMoonObservationPanel;

  document.addEventListener("DOMContentLoaded", function () {
    renderMoonObservation();
    initMoonObservationPanel();
  });
})();