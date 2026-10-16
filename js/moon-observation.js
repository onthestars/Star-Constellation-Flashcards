// moon-observation.js
(function () {
  "use strict";

  const SYNODIC_MONTH = 29.530588853;

    // 月の出・月の入りデータ
  const MOON_DATA_PATH =
    "js/data/moon-rise-set-osaka-2026-2036.json";

  const MOON_DATA_START = "2026-10-01";
  const MOON_DATA_END = "2036-09-30";

  let moonRiseSetData = null;
  let moonRiseSetDataError = false;

  // JSONを一度だけ読み込む
  const moonRiseSetDataReady = fetch(MOON_DATA_PATH)
    .then(function (response) {
      if (!response.ok) {
        throw new Error(
          "月の出・月の入りデータを読み込めませんでした: " +
          response.status
        );
      }

      return response.json();
    })
    .then(function (json) {
      moonRiseSetData = json;
    })
    .catch(function (error) {
      moonRiseSetDataError = true;
      console.error(error);
    });

  // 日付を YYYY-MM-DD 形式にする
  function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // JSON内の日付データを取得
  function getMoonDataForDate(date) {
    if (!moonRiseSetData) {
      return null;
    }

    const key = getDateKey(date);

    // 日付データが直下にある形式と days 内にある形式の両方に対応
    const days =
      moonRiseSetData.days ||
      moonRiseSetData.data ||
      moonRiseSetData;

    return days[key] || null;
  }

  // データの対象期間外かどうか
  function isMoonDataOutOfRange(date) {
    const key = getDateKey(date);

    return key < MOON_DATA_START || key > MOON_DATA_END;
  }

  // 対象期間外に表示するメッセージ
  function getMoonDataRangeMessage(date) {
    const key = getDateKey(date);

    if (key < MOON_DATA_START) {
      return "2026年9月30日以前の月の出・月の入りの時刻データはありません";
    }

    return "2036年10月1日以降の月の出・月の入りの時刻データはありません";
  }

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

  // JSONから月の出・月の入りを取得
  // direction: 1 = 月の出、-1 = 月の入り
  function getMoonRiseSet(date, direction) {
    if (isMoonDataOutOfRange(date)) {
      return null;
    }

    const dayData = getMoonDataForDate(date);

    if (!dayData) {
      return null;
    }

    const timeText = direction === 1
      ? dayData.moonrise
      : dayData.moonset;

    // null は、その日のデータに時刻が記録されていないことを表す
    if (typeof timeText !== "string" || !/^\d{2}:\d{2}$/.test(timeText)) {
      return null;
    }

    const parts = timeText.split(":").map(Number);
    const hour = parts[0];
    const minute = parts[1];

    // データは対象日の正午から翌日正午までの時間帯。
    // 正午より前の時刻は翌日のイベントとして扱う。
    const isNextDay = hour < 12;

    const eventDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + (isNextDay ? 1 : 0),
      hour,
      minute,
      0,
      0
    );

    return {
      date: eventDate,
      hour: hour,
      minute: minute,
      isNextDay: isNextDay,
      timeText: timeText
    };
  }

  // 10分単位に丸め済みの時刻を日本語表示に変換
  function formatMoonEvent(event) {
    if (!event) {
      return null;
    }

    const hour = event.hour;
    const minute = event.minute;

    const timeText = minute === 0
      ? `${hour}時ごろ`
      : `${hour}時${minute}分ごろ`;

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

      // 月の出・月の入りの時刻表示
      let moonTimeMessage;

      if (isMoonDataOutOfRange(today)) {
        moonTimeMessage = getMoonDataRangeMessage(today);
      } else if (moonRiseSetDataError) {
        moonTimeMessage =
          "月の出・月の入りの時刻データを読み込めませんでした。";
      } else if (!moonRiseSetData) {
        moonTimeMessage =
          "月の出・月の入りの時刻データを読み込み中です。";
      } else {
        const rise = getMoonRiseSet(today, 1);
        const set = getMoonRiseSet(today, -1);

        const riseText = formatMoonEvent(rise);
        const setText = formatMoonEvent(set);

        moonTimeMessage =
          `月の出：${riseText || "時刻データなし"}　` +
          `月の入り：${setText || "時刻データなし"}`;
      }

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

<!-- 月の出・月の入りの時刻 -->
<div style="margin: 0 0 4px 0; text-align: left; font-size: 0.9em;">
  ${moonTimeMessage}
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
    initMoonObservationPanel();

    moonRiseSetDataReady.then(function () {
      renderMoonObservation();
    });
  });
  })();