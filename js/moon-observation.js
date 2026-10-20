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
  `${hour}:${String(minute).padStart(2, "0")}頃`;

    return (event.isNextDay ? "翌" : "") + timeText;
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
  `${startHour}:${startMinute}<span style="font-size:0.8em; font-weight:normal;">頃</span>`;

const endText =
  `${endHour}:${endMinute}<span style="font-size:0.8em; font-weight:normal;">頃</span>`;

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


  // ▼ 月相・月齢・月の出入り・空が暗くなる時刻を考慮した観察コメント
function getObservationMessage(phaseName, date) {
  const age = getMoonAge(date);
  const time = Astronomy.MakeTime(getReferenceDate(date));
  const phaseAngle = Astronomy.MoonPhase(time);

  // ▼ 空が十分暗くなる時刻（天文薄明の終わり）
  const twilight = getAstronomicalTwilight(date);
  const dusk = twilight ? twilight.dusk : null;

  // ▼ 本当の新月
  if (phaseName === "新月") {
    return "今日は新月です。月明かりの影響が少ないため、星々が最も輝く夜です。星座や淡い星、天の川を見つけやすいでしょう。";
  }

  // ▼ 本当の満月
  if (phaseName === "満月") {
    return "今日は満月です。夜空が大変明るいので、星空よりも月の観察にむくと言えます。";
  }

  // ▼ 新月に近い時期
  if (age <= 1.5 || age >= SYNODIC_MONTH - 1.5) {
    if (dusk && dusk.getHours() >= 21) {
      return "月明かりが少ない時期です。空が十分暗くなってから星空を眺めるのもよさそうです。";
    }

    return "月明かりが少なく、一晩中星空を楽しみやすいでしょう。";
  }

  // ▼ 満月に近い時期
  if (age >= 13.5 && age <= 16) {
    return "月明かりが強く、星空の観察には余り向きません。月の模様やクレーターを観察するのが良さそうです。";
  }

  // ▼ 天文薄明の時刻を取得できない場合
  if (!dusk) {
    return "空の明るさや月の位置を確かめながら、月や星の様子を観察するのもよさそうです。";
  }

  // ▼ 月が満ちていく時期：月の入りを基準にする
  if (phaseAngle < 180) {
    const moonset = getMoonRiseSet(date, -1);

    if (!moonset) {
      return "月の入り時刻を確認できません。月の形や空の様子を観察するのもよさそうです。";
    }

    // ▼ 月が空の暗くなる時刻より前に沈む
    if (moonset.date.getTime() <= dusk.getTime()) {
      if (dusk.getHours() >= 21) {
        return "月は先に沈みそうですが、空が十分暗くなるのは遅めです。暗くなってから星空を眺めるのもよさそうです。";
      }

      if (age < 6) {
        return "細い月が沈んだ後に、星空が広がるでしょう。";
      }

      if (phaseName === "上弦の月") {
        return "上弦の月は半月です。月が沈んだ後の星空も楽しめそうです。";
      }

      if (age < 9) {
        return "半月に近い形の月が沈んだ後は、星空を観察するのもよさそうです。";
      }

      return "月が沈んだ後は、星空を楽しみやすくなりそうです。";
    }

    // ▼ 月が空の暗くなる時刻より後に沈む
    if (age < 6) {
      return "夕方の細い月を楽しめそうです。月が沈んだ後に星空が広がるでしょう。";
    }

    if (phaseName === "上弦の月") {
      return "上弦の月は、満月に近づく半月を言います。月の模様やクレーターを観察するのに適しています。星空は夜遅くから広がるでしょう。";
    }

    if (age < 9) {
      return "月の形は半月に近づいてゆきます。月のクレーターを観察するのに適しています。";
    }

    return "空が暗くなってからもしばらく月明かりがありそうです。星空の観察は、月が沈んだ後がより良いでしょう。";
  }

  // ▼ 月が欠けていく時期：月の出を基準にする
  const moonrise = getMoonRiseSet(date, 1);

  if (!moonrise) {
    return "月の出時刻を確認できません。月の形や空の様子を観察するのもよさそうです。";
  }

  // ▼ 月が空の暗くなる時刻より後に昇る
  if (moonrise.date.getTime() > dusk.getTime()) {
    if (phaseName === "下弦の月") {
      return "上弦の月は、新月に近づく半月を言います。月の模様やクレーターを観察するのに適しています。月が昇るまでの時間は、星空を楽しめそうです。";
    }

    if (age >= 21 && age < 24) {
      return "月が昇るまでの時間は星空を楽しめそうです。半月に近く、クレーターの観察にもむきます。";
    }

    if (age >= 24) {
      return "月が昇るまで星空を楽しめそうです。昇ってからの細い月にも注目するとよさそうです。";
    }

    return "空が暗くなってから月が昇るまでは星空を楽しめそうです。";
  }

  // ▼ 空が暗くなるころには月が昇っている
  if (phaseName === "下弦の月") {
    return "下弦の月は半月です。月の模様を観察するのもよさそうです。";
  }

  if (age >= 21 && age < 24) {
    return "半月に近い形の月が見えそうです。月の模様を観察するのもよさそうです。";
  }

  if (age >= 24) {
    return "細い月が見えるかもしれません。月の形や位置に注目するのもよさそうです。";
  }

  return "空が暗くなるころにはもう、月が昇っているでしょう。夜空が明るいので、星より月の観察にむくでしょう。";
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

      if (isMoonDataOutOfRange(today)) {
        moonTimeMessage = getMoonDataRangeMessage(today);
      } else {
        const riseText = formatMoonEvent(getMoonRiseSet(today, 1));
        const setText = formatMoonEvent(getMoonRiseSet(today, -1));

if (riseText && setText) {
  moonTimeMessage =
    `<img
      src="image/common/ico-moonrise.png"
      alt="月の出"
      style="
        width:16px;
        height:16px;
        vertical-align:-3px;
        margin-right:3px;
      "
    >${riseText}
    　<img
      src="image/common/ico-moonset.png"
      alt="月の入り"
      style="
        width:16px;
        height:16px;
        vertical-align:-3px;
        margin-right:3px;
      "
    >${setText} ※大阪市`;
} else if (riseText) {
  moonTimeMessage =
    `<img
      src="image/common/ico-moonrise.png"
      alt="月の出"
      style="
        width:16px;
        height:16px;
        vertical-align:-3px;
        margin-right:3px;
      "
    >${riseText} ※大阪市`;
} else if (setText) {
  moonTimeMessage =
    `<img
      src="image/common/ico-moonset.png"
      alt="月の入り"
      style="
        width:16px;
        height:16px;
        vertical-align:-3px;
        margin-right:3px;
      "
    >${setText} ※大阪市`;
} else {
  moonTimeMessage =
    "月の出入り時刻データなし";
}
      }

      // 月相に応じた観察アドバイス
      const observationMessage = getObservationMessage(
        phaseName,
        today
      );

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
    font-size:0.7em;
    margin-top:4px;
    line-height:1.2;
  ">
    ※天候等を考慮しない参考値
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
              margin: 2px 0 5px 0;
              text-align: left;
              font-size: 0.85em;
            ">
              ${moonTimeMessage}
            </div>

<div style="margin: 0; text-align: left;">
  ${observationMessage}

  ${
    meteorMessage
      ? `<br><br><span style="
          color: #ffd700;
          font-weight: 600;
        ">${meteorMessage}</span>`
      : ""
  }
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

  button.addEventListener("click", function () {

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