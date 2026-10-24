// moon-observation.js
(function () {
  "use strict";

  const SYNODIC_MONTH = 29.530588853;

  // 月の出・月の入りの表示対象期間
  // この期間外では時刻を表示せず、月齢・月相画像などは通常どおり表示する。
  const MOON_DATA_START = "2026-10-01";
  const MOON_DATA_END = "2036-09-30";

  function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function isMoonDataOutOfRange(date) {
    const key = getDateKey(date);
    return key < MOON_DATA_START || key > MOON_DATA_END;
  }

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
    // サウンドOFFなら再生しない
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

  // 観測地点：大阪府大阪市（緯度34.6937、経度135.5023、標高0m）
  const MOON_OBSERVER = new Astronomy.Observer(34.6937, 135.5023, 0);

    // direction: 1 = 月の出、-1 = 月の入り
  // 観察対象日の正午から翌日の正午直前までを検索対象にする。
  function getMoonRiseSet(date, direction) {
    if (isMoonDataOutOfRange(date)) {
      return null;
    }

    const startOfObservation = new Date(
      date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0
    );

    const endOfObservation = new Date(
      date.getFullYear(), date.getMonth(), date.getDate() + 1, 12, 0, 0, 0
    );

    const event = Astronomy.SearchRiseSet(
      Astronomy.Body.Moon,
      MOON_OBSERVER,
      direction,
      Astronomy.MakeTime(startOfObservation),
      2
    );

    if (!event || !event.date) {
      return null;
    }

    // 隣り合う観察日の表示範囲が重ならないようにする。
    const actualDate = event.date;

    if (
      actualDate.getTime() < startOfObservation.getTime() ||
      actualDate.getTime() >= endOfObservation.getTime()
    ) {
      return null;
    }

    // 秒以下を最も近い1分に丸める（10分単位には丸めない）。
    const eventDate = new Date(
      Math.round(actualDate.getTime() / 60000) * 60000
    );

    return {
      date: eventDate,
      isNextDay:
        eventDate.getDate() !== startOfObservation.getDate() ||
        eventDate.getMonth() !== startOfObservation.getMonth() ||
        eventDate.getFullYear() !== startOfObservation.getFullYear()
    };
  }

  // 計算した月の出・月の入りを分単位で表示
  function formatMoonEvent(event) {
    if (!event) {
      return null;
    }

    const d = event.date;
    const hour = d.getHours();
    const minute = d.getMinutes();

const timeText =
  `${hour}:${String(minute).padStart(2, "0")}`;

    return (event.isNextDay ? "翌" : "") + timeText;
  }

  // ▼ 日の出・日の入り取得
function getSunRiseSet(date, direction) {

  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0, 0, 0, 0
  );

  const event = Astronomy.SearchRiseSet(
    Astronomy.Body.Sun,
    MOON_OBSERVER,
    direction,
    Astronomy.MakeTime(startOfDay),
    1
  );

  if (!event || !event.date) {
    return null;
  }

  return {
    date: new Date(
      Math.round(event.date.getTime() / 60000) * 60000
    )
  };
}

// ▼ 日の出・日の入り表示整形
function formatSunEvent(event) {

  if (!event) {
    return null;
  }

  const d = event.date;

  return `${d.getHours()}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

// ▼ おすすめ時間帯を取得
function getObservationWindow(date) {

  const phaseAngle = Astronomy.MoonPhase(
    Astronomy.MakeTime(getReferenceDate(date))
  );

  const moonrise = getMoonRiseSet(date, 1);
  const moonset = getMoonRiseSet(date, -1);

  const twilight =
    getAstronomicalTwilight(date);

  // ▼ 新月～満月（満ちていく月）
  if (
    phaseAngle < 180 &&
    moonset &&
    twilight &&
    twilight.dusk &&
    twilight.dawn
  ) {

    const startTime =
      moonset.date.getTime() > twilight.dusk.getTime()
        ? moonset.date
        : twilight.dusk;

    const endTime = twilight.dawn;

    if (
      startTime.getTime() >=
      endTime.getTime()
    ) {
      return null;
    }

    return {
      start: startTime,
      end: endTime
    };
  }

  // ▼ 満月～新月（欠けていく月）
  if (
    phaseAngle >= 180 &&
    moonrise &&
    twilight &&
    twilight.dusk &&
    twilight.dawn
  ) {

    const startTime = twilight.dusk;

    const endTime =
      moonrise.date.getTime() < twilight.dawn.getTime()
        ? moonrise.date
        : twilight.dawn;

    if (
      endTime.getTime() <=
      startTime.getTime()
    ) {
      return null;
    }

    return {
      start: startTime,
      end: endTime
    };
  }

  return null;
}

// ▼ 星空期待値を算出
function getSkyExpectation(window) {

  if (!window) {
    return {
      stars: "☆☆☆☆☆"
    };
  }

  const hours =
    (window.end.getTime() - window.start.getTime())
    / (1000 * 60 * 60);

  let stars;

  if (hours >= 8) {
    stars = 5;
  } else if (hours >= 6) {
    stars = 4;
  } else if (hours >= 4) {
    stars = 3;
  } else if (hours >= 2) {
    stars = 2;
  } else if (hours >= 1) {
    stars = 1;
  } else {
    stars = 0;
  }

  return {
    stars: "★".repeat(stars) +
           "☆".repeat(5 - stars)
  };
}

// ▼ 時刻を10分単位で切り捨て
function floorTo10Minutes(date) {
  const rounded = new Date(date);

  rounded.setMinutes(
    Math.floor(rounded.getMinutes() / 10) * 10,
    0,
    0
  );

  return rounded;
}

// ▼ おすすめ時間帯を表示用に整形
function formatObservationWindow(window) {

  if (!window) {
    return "ありません";
  }

const startDate =
  floorTo10Minutes(window.start);

const endDate =
  floorTo10Minutes(window.end);

const startHour =
  startDate.getHours();

const startMinute =
  String(startDate.getMinutes()).padStart(2, "0");

const endHour =
  endDate.getHours();

const endMinute =
  String(endDate.getMinutes()).padStart(2, "0");

const startText =
  `${startHour}:${startMinute}<span style="font-size:0.8em; font-weight:normal;"></span>`;

const endText =
  `${endHour}:${endMinute}<span style="font-size:0.8em; font-weight:normal;"></span>`;

  // ▼ 終了時刻が翌日か判定
const isNextDay =
  endDate.getFullYear() !== startDate.getFullYear() ||
  endDate.getMonth() !== startDate.getMonth() ||
  endDate.getDate() !== startDate.getDate();

  return isNextDay
    ? `${startText}～<span style="font-size:0.8em;">翌</span>${endText}`
    : `${startText}～${endText}`;
}

// ▼ 天文薄明時刻取得
function getAstronomicalTwilight(date) {

  const startTime = Astronomy.MakeTime(
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12, 0, 0, 0
    )
  );

  try {

    // 太陽が -18°まで下がる
    const dusk = Astronomy.SearchAltitude(
      Astronomy.Body.Sun,
      MOON_OBSERVER,
      -1,
      startTime,
      1,
      -18
    );

    // 翌朝、太陽が -18°まで上がる
    const dawn = Astronomy.SearchAltitude(
      Astronomy.Body.Sun,
      MOON_OBSERVER,
      1,
      Astronomy.MakeTime(
        new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + 1,
          0, 0, 0, 0
        )
      ),
      1,
      -18
    );

    return {
      dusk: dusk ? dusk.date : null,
      dawn: dawn ? dawn.date : null
    };

  } catch (error) {

    console.error(
      "天文薄明時刻取得エラー:",
      error
    );

    return null;
  }
}

// ▼ 曜日を取得
function getWeekdayText(date) {
  const weekdays = [
    "日", "月", "火", "水", "木", "金", "土"
  ];

  return weekdays[date.getDay()];
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
      // const today = new Date(2027, 7, 22);

      const age = getMoonAge(today);
      const phaseIndex = getMoonPhaseIndex(today);
      const phaseName = getPhaseName(today);

      const observationWindow =
        getObservationWindow(today);

      const rating =
        getSkyExpectation(observationWindow);

      const observationWindowText =
        formatObservationWindow(observationWindow);

// 月の出・月の入りの時刻表示（Astronomy Engineで直接計算）
let moonTimeMessage;
let sunTimeMessage = "";

const sunriseText =
  formatSunEvent(
    getSunRiseSet(today, 1)
  );

const sunsetText =
  formatSunEvent(
    getSunRiseSet(today, -1)
  );

      if (isMoonDataOutOfRange(today)) {
        moonTimeMessage = getMoonDataRangeMessage(today);
      } else {
        const riseText = formatMoonEvent(getMoonRiseSet(today, 1));
        const setText = formatMoonEvent(getMoonRiseSet(today, -1));

if (riseText && setText) {
  moonTimeMessage =
  `<img
      src="image/common/ico-moon.png"
      alt="月"
      style="
        width:16px;
        height:16px;
        vertical-align:-3px;
        margin:3px 1px 0 0;
      "
    >
    <img
      src="image/common/ico-moonrise.png"
      alt="月の出"
      style="
        width:16px;
        height:16px;
        vertical-align:-3px;
                margin:3px 2px 0 0;
      "
    >${riseText}<img
      src="image/common/ico-moonset.png"
      alt="月の入り"
      style="
        width:16px;
        height:16px;
        vertical-align:-3px;
                margin:3px 2px 0 6px;
      "
    >${setText}`;

} else if (riseText) {
  moonTimeMessage =
  `<img
      src="image/common/ico-moon.png"
      alt="月"
      style="
        width:16px;
        height:16px;
        vertical-align:-3px;
        margin:3px 1px 0 0;
      "
    >
    <img
      src="image/common/ico-moonrise.png"
      alt="月の出"
      style="
        width:16px;
        height:16px;
        vertical-align:-3px;
                margin:3px 0 0 0;
      "
    >${riseText}`;

} else if (setText) {
  moonTimeMessage =
    `<img
      src="image/common/ico-moon.png"
      alt="月"
      style="
        width:16px;
        height:16px;
        vertical-align:-3px;
        margin:3px 1px 0 0;
      "
    >
    <img
      src="image/common/ico-moonset.png"
      alt="月の入り"
      style="
        width:16px;
        height:16px;
        vertical-align:-3px;
                margin:3px 0 0 0;
      "
    >${setText}`;
} else {
  moonTimeMessage =
    "月の出入り時刻データなし";
}

if (sunriseText && sunsetText) {

  sunTimeMessage =
  `<img
    src="image/common/ico-sun.png"
    alt="太陽"
    style="
      width:16px;
      height:16px;
      vertical-align:-3px;
        margin:3px 1px 0 0;
    "
  >
  <img
    src="image/common/ico-sunrise.png"
    alt="日の出"
    style="
      width:16px;
      height:16px;
      vertical-align:-3px;
                margin:3px 2px 0 0;
    "
  >${sunriseText}<img
    src="image/common/ico-sunset.png"
    alt="日の入り"
    style="
      width:16px;
      height:16px;
      vertical-align:-3px;      
          margin-left:6px;
                margin:3px 2px 0 6px;
    "
  >${sunsetText}`;
}
      }

      // ▼ 流星群メッセージ取得
const meteorMessage = getMeteorMessage(today);

      const imagePath =
        "image/common/" + MOON_IMAGES[phaseIndex];

// ▼ 年月日＋曜日表示
const weekday =
  getWeekdayText(today);

const dateText =
  `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日(${weekday})`;

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

          <div style="min-width: 0; margin: 0; padding: 0;">
            <div style="
              font-size: 0.9em;
              margin: 0 0 2px 0;
              text-align: left;
            ">
              ${dateText}
            </div>

            <div style="
              display: inline-block;
              margin: 2px 0 8px 0;
              padding: 3px 12px;
              border: 1px solid currentColor;
              box-sizing: border-box;
              width: 100%;
            ">
<div style="
  text-align:center;
  margin:8px 0 6px 0;
">
  <div style="
    font-size:0.8rem;
    margin-bottom:2px;
  ">
    今夜の星空期待値
  </div>

  <div style="
    font-size:1.5rem;
    color:rgb(255,215,0);
    text-shadow:0 0 2px rgba(0,0,0,0.5);
    line-height:1;
  ">
    ${rating.stars}
  </div>

  <div style="
    font-size:0.65em;
    margin-top:4px;
    line-height:1.2;
  ">
    ※天候等は考慮していません
  </div>
</div>
            </div>

            <div style="
              display: inline-block;
              margin: 2px 0 8px 0;
              padding: 3px 12px;
              border: 1px solid currentColor;
              box-sizing: border-box;
              width: 100%;
            ">
              <div style="
                font-size: 0.8rem;
                margin: 4px 0;
                text-align: center;
              ">
                星空おすすめ時間帯
              </div>

              <div style="
                font-size: 1.2em;
                font-weight: 600;
                text-align: center;
              ">
                ${observationWindowText}
              </div>
            </div>

<div style="
  margin: 2px 0 2px 0;
  text-align: left;
  font-size: 0.85em;
">
  ${sunTimeMessage}
</div>

<div style="
  margin: 0 0 0.25em 0;
  text-align: left;
  font-size: 0.85em;
">
  ${moonTimeMessage}
</div>
<div style="
  margin: 0 0 0.75em 0;
  text-align: left;
  font-size: 0.85em;
">
  ※大阪市を基準に算出
</div>

            ${
  meteorMessage
    ? `
      <div style="
        margin:0;
        text-align:left;
      ">
        <span style="
          color:#ffd700;
          font-weight:600;
        ">
          ${meteorMessage}
        </span>
      </div>
    `
    : ""
}

</div>

<div style="
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  flex:0 0 56px;
  gap:4px;
">

<button
  type="button"
  id="moon-date-back-7"
  class="moon-date-button"
  aria-label="7日前"
  title="7日前"
>
  <img
    src="image/common/btn-moon-back-7days.png"
    alt=""
  >
</button>

<button
  type="button"
  id="moon-date-back-1"
  class="moon-date-button"
  aria-label="1日前"
  title="1日前"
>
  <img
    src="image/common/btn-moon-back-1day.png"
    alt=""
  >
</button>

  <img
    src="${imagePath}"
    alt="${phaseName}"
    style="
      display:block;
      width:40px;
      height:40px;
      object-fit:contain;
      margin:4px 0;
    "
  >

  <div style="
    font-size:0.75em;
    text-align:center;
    line-height:1.2;
    margin:2px 0;
  ">
    月齢${age.toFixed(1)}
    <br>
    ${
      phaseName === "新月"
        ? "新　月"
        : phaseName === "満月"
          ? "満　月"
          : phaseName === "満ちていく月"
            ? "満ちる月"
            : phaseName === "欠けていく月"
              ? "欠ける月"
              : phaseName
    }
  </div>

<button
  type="button"
  id="moon-date-next-1"
  class="moon-date-button"
  aria-label="1日後"
  title="1日後"
>
  <img
    src="image/common/btn-moon-next-1day.png"
    alt=""
  >
</button>

<button
  type="button"
  id="moon-date-next-7"
  class="moon-date-button"
  aria-label="7日後"
  title="7日後"
>
  <img
    src="image/common/btn-moon-next-7days.png"
    alt=""
  >
</button>

</div>

</div>

      `;

      // ▲ 前日へ移動
      [
  ["#moon-date-back-1", -1],
  ["#moon-date-back-7", -7],
  ["#moon-date-next-1", 1],
  ["#moon-date-next-7", 7]
].forEach(function ([selector, days]) {

const button = content.querySelector(selector);

if (!button) {
  return;
}

// ▼ ボタン押下後の日付を計算　データ期間外は月送りボタンを押せなくする
const targetDate = new Date(today);

targetDate.setDate(
  targetDate.getDate() + days
);

const targetKey =
  getDateKey(targetDate);

// ▼ データ期間外なら無効化
if (
  targetKey < MOON_DATA_START ||
  targetKey > MOON_DATA_END
) {
  button.disabled = true;
  button.style.opacity = "0.3";
  button.style.cursor = "default";
}

button.addEventListener("click", function () {

  if (button.disabled) {
    return;
  }

  playMoonSelectSound();

  selectedDate.setDate(
    selectedDate.getDate() + days
  );

  renderMoonObservation();
});

});

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