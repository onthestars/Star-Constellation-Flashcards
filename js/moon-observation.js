
(function () {
  "use strict";

  const SYNODIC_MONTH = 29.530588853;

  // 月相画像16枚（満月から始まる順番）
  const MOON_IMAGES = [
    "moon-phase-01.png", // 満月
    "moon-phase-02.png", // 欠け始め
    "moon-phase-03.png", // 欠けていく月
    "moon-phase-04.png", // 下弦に近づく
    "moon-phase-05.png", // 下弦の半月
    "moon-phase-06.png", // 欠けていく三日月
    "moon-phase-07.png", // 細い三日月
    "moon-phase-08.png", // 新月に近づく
    "moon-phase-09.png", // 新月
    "moon-phase-10.png", // 満ち始め
    "moon-phase-11.png", // 満ちていく月
    "moon-phase-12.png", // 上弦に近づく
    "moon-phase-13.png", // 上弦の半月
    "moon-phase-14.png", // 満ちていく凸月
    "moon-phase-15.png", // 満月に近づく
    "moon-phase-16.png"  // 満月直前
  ];

            // 現在表示している観察対象日
  let selectedDate = null;

  
  // 月の日付移動時の効果音
  const moonSelectSound = new Audio(
    "sound/sound-select2.mp3"
  );

  moonSelectSound.volume = 0.3; // 月の上下ボタンボリューム

function playMoonSelectSound() {

  // ▼ サウンドOFFなら再生しない
  if (!window.soundEnabled) {
    return;
  }

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

  // 月相角から16種類の月画像を判定（満月始まり）
  function getMoonPhaseIndex(date) {
    const time = Astronomy.MakeTime(getReferenceDate(date));
    const phaseAngle = Astronomy.MoonPhase(time);

    return Math.round((phaseAngle + 180) / 22.5) % 16;
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
  function getObservationRating(date) {
    const time = Astronomy.MakeTime(getReferenceDate(date));
    const phaseAngle = Astronomy.MoonPhase(time);

    let stars;

    if (phaseAngle < 22.5 || phaseAngle >= 337.5) {
      stars = 5;
    } else if (phaseAngle < 45 || phaseAngle >= 315) {
      stars = 4;
    } else if (phaseAngle < 67.5 || phaseAngle >= 292.5) {
      stars = 3;
    } else if (phaseAngle < 90 || phaseAngle >= 270) {
      stars = 2;
    } else if (phaseAngle < 135 || phaseAngle >= 225) {
      stars = 1;
    } else {
      stars = 0;
    }

    return {
      stars: "★".repeat(stars) + "☆".repeat(5 - stars)
    };
  }

  // 観測地点：大阪府大阪市
  const MOON_OBSERVER = new Astronomy.Observer(
    34.6937,
    135.5023,
    0
  );

  // 指定日の月の入り・月の出を取得
  function getMoonRiseSet(date, direction) {
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0, 0, 0, 0
    );

    const nextDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
      0, 0, 0, 0
    );

    const event = Astronomy.SearchRiseSet(
      Astronomy.Body.Moon,
      MOON_OBSERVER,
      direction,
      Astronomy.MakeTime(startOfDay),
      2
    );

    if (!event) {
      return null;
    }

    const eventDate = event.date;

    // 指定日から翌日までのイベントだけを採用
    if (
      eventDate.getTime() < startOfDay.getTime() ||
      eventDate.getTime() >= new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 2
      ).getTime()
    ) {
      return null;
    }

    return {
      date: eventDate,
      isNextDay: eventDate.getTime() >= nextDay.getTime()
    };
  }

  // 月の出・月の入り時刻を日本語で表示
  function formatMoonEvent(event) {
    if (!event) {
      return null;
    }

    const d = event.date;
    const hour = d.getHours();
    const minute = d.getMinutes();

    const timeText = minute < 5
      ? `${hour}時ごろ`
      : minute < 15
        ? `${hour}時10分ごろ`
        : minute < 25
          ? `${hour}時20分ごろ`
          : minute < 35
            ? `${hour}時30分ごろ`
            : minute < 45
              ? `${hour}時40分ごろ`
              : minute < 55
                ? `${hour}時50分ごろ`
                : `${(hour + 1) % 24}時ごろ`;

    return (event.isNextDay ? "翌日" : "") + timeText;
  }

// 今夜の観察対象日を取得（午前5時までは前日扱い）
  function getObservationDate() {
    const now = new Date();

    if (now.getHours() < 5) {
      now.setDate(now.getDate() - 1);
    }

    return now;
  }

  // 実際の月の出・月の入りに応じた観察アドバイス
  function getObservationMessage(phaseName, date) {
    // 新月：月明かりが少ない
    if (phaseName === "新月") {
      return "月明かりが少なく、星空観察に絶好のチャンス！";
    }

    // 満月：月明かりが強い
    if (phaseName === "満月") {
      return "月明かりが強く、星空よりも月の観察に向いています。";
    }

    const time = Astronomy.MakeTime(getReferenceDate(date));
    const phaseAngle = Astronomy.MoonPhase(time);

    // 満ちていく月：月の入り時刻を基準にする
    if (phaseAngle < 180) {
      const moonset = getMoonRiseSet(date, -1);
      const moonsetText = formatMoonEvent(moonset);

      if (!moonsetText) {
        return "月の入り時刻を確認できませんでした。月の位置を確かめながら観察しましょう。";
      }

      const hour = moonset.date.getHours();

      if (moonset.isNextDay || hour < 5 || hour >= 23) {
        return `月は${moonsetText}に沈みます。夜遅くまで月明かりがあるため、月が沈んだ後の観察がおすすめです。`;
      }

      if (hour < 18) {
        return `月は${moonsetText}に沈みます。夜は月明かりの影響が少なく、星空観察のチャンスです。`;
      }

      if (hour < 21) {
        return `月は${moonsetText}に沈みます。月が沈んだ後は、星空観察のチャンスです。`;
      }

      return `月は${moonsetText}に沈みます。沈むまでは月明かりがありますが、その後は星空観察のチャンスです。`;
    }

    // 欠けていく月：月の出時刻を基準にする
    const moonrise = getMoonRiseSet(date, 1);
    const moonriseText = formatMoonEvent(moonrise);

    if (!moonriseText) {
      return "月の出時刻を確認できませんでした。月の位置を確かめながら観察しましょう。";
    }

    const hour = moonrise.date.getHours();

    if (moonrise.isNextDay || hour < 5 || hour >= 23) {
      return `月は${moonriseText}に昇ります。月が昇るまでは、星空観察のチャンスです。`;
    }

    if (hour >= 21) {
      return `月は${moonriseText}に昇ります。月が昇る前の夜は、星空観察のチャンスです。`;
    }

    if (hour >= 18) {
      return `月は${moonriseText}に昇ります。月が昇るまでは、星空観察を楽しめます。`;
    }

    return `月は${moonriseText}に昇ります。夜は月明かりの影響があるため、月の観察もおすすめです。`;
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
      const rating = getObservationRating(today);

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
              ${observationMessage}<span style="font-size:0.8em;"> ※天候や月の位置などによって変わります</span>
            </div>
          </div>
        </div>
        
      `;

      // ▲ 前日へ移動
      const previousButton = content.querySelector("#moon-date-previous");

      if (previousButton) {
        previousButton.addEventListener("click", function () {
          playMoonSelectSound();
          selectedDate.setDate(selectedDate.getDate() - 1);
          renderMoonObservation();
        });
      }

      // ▼ 翌日へ移動
      const nextButton = content.querySelector("#moon-date-next");

      if (nextButton) {
        nextButton.addEventListener("click", function () {
          playMoonSelectSound();
          selectedDate.setDate(selectedDate.getDate() + 1);
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
  const showButton = document.getElementById("moonObservationShowBtn");

  // 再表示ボタンの状態を更新
  function updateShowButtonState() {
    if (!panel || !showButton) {
      return;
    }

    const isVisible = getComputedStyle(panel).display !== "none";

    showButton.disabled = isVisible;
    showButton.style.opacity = showButton.disabled ? 0.4 : 1;
  }

  // 初回表示時にフェードイン
  if (panel) {
    panel.classList.add("moon-panel-fade-in");
  }

  // 閉じるボタンの初期化
  if (closeButton && panel && !closeButton.dataset.initialized) {
    closeButton.addEventListener("click", function () {
      panel.style.display = "none";
      updateShowButtonState();
    });

    closeButton.dataset.initialized = "true";
  }

  // 月の満ち欠けパネル再表示ボタンの初期化
  if (showButton && panel && !showButton.dataset.initialized) {
    showButton.addEventListener("click", function () {
      panel.style.display = "block";
      updateShowButtonState();
    });

    showButton.dataset.initialized = "true";
  }

  // 初期状態を反映
  updateShowButtonState();
}

  // 既存の main.js から呼び出せるようにする
  window.updateMoonObservation = renderMoonObservation;
  window.initMoonObservationPanel = initMoonObservationPanel;

  document.addEventListener("DOMContentLoaded", function () {
    renderMoonObservation();
    initMoonObservationPanel();
  });
})();