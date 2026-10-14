
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

            // 現在表示している観察対象日
  let selectedDate = null;

  
  // 月の日付移動時の効果音
  const moonSelectSound = new Audio(
    "sound/sound-select2.mp3"
  );

  moonSelectSound.volume = 0.3; // 月の上下ボタンボリューム

  function playMoonSelectSound() {
    moonSelectSound.currentTime = 0;
    moonSelectSound.play().catch(function (error) {
      console.warn("効果音を再生できませんでした:", error);
    });
  }

  // 月齢を計算する基準時刻（日本時間の正午）
  function getReferenceDate(date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12, 0, 0, 0
    );
  }

  // 直前の新月を取得
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

  // 月齢を取得
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
    const time = Astronomy.MakeTime(getReferenceDate(date));
    const phaseAngle = Astronomy.MoonPhase(time);

    return Math.round(phaseAngle / 45) % 8;
  }

  // 主要な月相イベントが発生した日かを判定
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
      const phaseTime = Astronomy.SearchMoonPhase(
        event.angle,
        searchStart,
        -2
      );

      if (!phaseTime) {
        continue;
      }

      const eventDate = phaseTime.date;

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

  // 月の名称を判定
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

// 月相に応じた星空レベル
function getObservationRating(age) {
  const ageInCycle =
    ((age % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;

  let stars;

  if (ageInCycle < 3 || ageInCycle >= 22.5) {
    stars = 5;
  } else if (ageInCycle < 6) {
    stars = 4;
  } else if (ageInCycle < 8) {
    stars = 3;
  } else if (ageInCycle < 11) {
    stars = 2;
  } else if (ageInCycle < 14) {
    stars = 1;
  } else if (ageInCycle < 17) {
    stars = 0;
  } else if (ageInCycle < 20) {
    stars = 1;
  } else {
    stars = 2;
  }

  return {
    stars: "★".repeat(stars) + "☆".repeat(5 - stars)
  };
}

// 今夜の観察対象日を取得（午前5時までは前日扱い）
  function getObservationDate() {
    const now = new Date();

    if (now.getHours() < 5) {
      now.setDate(now.getDate() - 1);
    }

    return now;
  }

  // 月相に応じた具体的な観察アドバイス
  function getObservationMessage(phaseName, date) {
    // 主要な月相の日には専用メッセージを表示
    switch (phaseName) {
      case "新月":
        return "日没後から明け方にかけ、満天の星空が広がるチャンス！";

      case "上弦の月":
        return "半月です。月が沈んでからの、夜の後半に望みがあります。";

      case "満月":
        return "星空よりも、明るく輝く月の観察にむきます。";

      case "下弦の月":
        return "半月です。月が昇る前の、夜の前半に望みがあります。";
    }

    // 主要な月相の日以外は、月相角から案内を決める
    const time = Astronomy.MakeTime(getReferenceDate(date));
    const phaseAngle = Astronomy.MoonPhase(time);

    if (phaseAngle < 45 || phaseAngle >= 315) {
      return "日没後から明け方にかけて、星空が広がります。";
    }

    if (phaseAngle < 135) {
      return "夜の後半に、月が沈んでから星空が広がります。";
    }

    if (phaseAngle < 225) {
      return "星空の観察は厳しいですが、月の観察が楽しめます。";
    }

      return "月が昇る前の、夜の前半に星空が広がります。";
  }

  function renderMoonObservation() {
    const content = document.getElementById(
      "moon-observation-content"
    );

    if (!content) {
      return;
    }

    if (typeof Astronomy === "undefined") {
      content.textContent = "月の情報を読み込めませんでした。";
      return;
    }

    try {
      // 初回表示では、今夜の観察対象日を設定
      if (selectedDate === null) {
        selectedDate = getObservationDate();
      }

      // 選択中の日付を使用
      const today = new Date(selectedDate);

      // テストする場合は上の行をコメントアウトし、次の行を有効にする
      // 例）2026年10月11日 → 2026,9,11 ※月は-1とする
      // const today = new Date(2026, 9, 5);

      const age = getMoonAge(today);
      const phaseIndex = getMoonPhaseIndex(today);
      const phaseName = getPhaseName(today);
      const rating = getObservationRating(age);

      // 月相に応じた観察アドバイス
      const observationMessage = getObservationMessage(
        phaseName,
        today
      );

      const imagePath =
        "image/common/" + MOON_IMAGES[phaseIndex];

const dateText =
  `${String(today.getFullYear())}年${today.getMonth() + 1}月${today.getDate()}日`;

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

                  <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex: 0 0 48px;
            gap: 0;
          ">
<!-- 上の▲：前の日へ -->
<button
  type="button"
  id="moon-date-previous"
  aria-label="前の日の月"
  title="前日"
              style="
                border: none;
                background: transparent;
                color: inherit;
                font-size: 14px;
                line-height: 18px;
                cursor: pointer;
              "
            >▲</button>

            <!-- 月の画像 -->
            <img
              src="${imagePath}"
              alt="${phaseName}"
              style="
                display: block;
                width: 40px;
                height: 40px;
                object-fit: contain;
                margin: 4px 0;
                padding: 0;
              "
            >

<!-- 下の▼：翌日へ -->
<button
  type="button"
  id="moon-date-next"
  aria-label="次の日の月"
  title="翌日"
              style="
                width: 32px;
                height: 18px;
                padding: 0;
                border: none;
                background: transparent;
                color: inherit;
                font-size: 14px;
                line-height: 18px;
                cursor: pointer;
              "
            >▼</button>
          </div>

<div style="min-width: 0; margin: 0; padding: 0;">
  <div style="font-size:0.9em;margin: 0 0 2px 0; text-align: left;">
    ${dateText}は、
      </div>
      <div style="font-size:1.0em;margin: 0 0 2px 0; text-align: left;">
    ${phaseName}(月齢${age.toFixed(1)})
  </div>

<div style="font-size:1.1rem;font-weight:500;margin: 8px 0 6px 0; text-align: left;">
  星空レベル
  <span style="
    color: rgb(255,215,0);
    text-shadow: 0 0 2px rgba(0,0,0,0.5);
  ">
    ${rating.stars}
  </span>
</div>

            <div style="margin: 0; text-align: left;">
              ${observationMessage}<span style="font-size:0.8em;"> ※天候などによる</span>
            </div>
          </div>
        </div>
        
      `;

            // ▲ 前日へ移動
      const nextButton = content.querySelector("#moon-date-next");

if (nextButton) {
  nextButton.addEventListener("click", function () {
    playMoonSelectSound();
    selectedDate.setDate(selectedDate.getDate() + 1);
    renderMoonObservation();
  });
}

      // ▼ 翌日へ移動
      const previousButton = content.querySelector("#moon-date-previous");

if (previousButton) {
  previousButton.addEventListener("click", function () {
    playMoonSelectSound();
    selectedDate.setDate(selectedDate.getDate() - 1);
    renderMoonObservation();
  });
}

    } catch (error) {
      console.error("月の情報の取得に失敗しました:", error);
      content.textContent = "月の情報を取得できませんでした。";
    }
  }

function initMoonObservationPanel() {
  const panel = document.getElementById("moon-observation-panel");
  const closeButton = document.getElementById("moon-panel-close");

  // 初回表示時にフェードイン
  if (panel) {
    panel.classList.add("moon-panel-fade-in");
  }

  // 閉じるボタンの初期化
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
