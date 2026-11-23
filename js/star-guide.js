// js/star-guide.js

(function () {
  "use strict";

  const SYNODIC_MONTH = 29.530588853;

  // 月の出・月の入りの表示対象期間
  // この期間外では時刻を表示せず、月齢・月相画像などは通常どおり表示する。
  const MOON_DATA_START = "1900-01-01";
  const MOON_DATA_END = "2100-12-31";

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
      return "1900年1月1日以前の月の出・月の入りの時刻データはありません";
    }
    return "2100年12月31日以降の月の出・月の入りの時刻データはありません";
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
    "moon-phase-16.png", // 満月直前
  ];

  // 現在表示している観察対象日
  let selectedDate = null;

  // =================================
  // 選択日の一時保存（同じタブ内）
  // =================================

  const STAR_GUIDE_DATE_SESSION_KEY = "starGuideSelectedDate";

  // 保存された選択日を復元
  function restoreSelectedDate() {
    if (selectedDate !== null) return;

    try {
      let savedDate = localStorage.getItem(STAR_GUIDE_DATE_SESSION_KEY);

      // 以前の保存データがsessionStorageに残っていれば引き継ぐ
      if (!savedDate) {
        savedDate = sessionStorage.getItem(STAR_GUIDE_DATE_SESSION_KEY);
      }

      if (savedDate && /^\d{4}-\d{2}-\d{2}$/.test(savedDate)) {
        const [year, month, day] = savedDate.split("-").map(Number);

        const targetDate = new Date(year, month - 1, day, 12, 0, 0, 0);

        if (
          targetDate.getFullYear() === year &&
          targetDate.getMonth() === month - 1 &&
          targetDate.getDate() === day &&
          !isMoonDataOutOfRange(targetDate)
        ) {
          selectedDate = targetDate;
        }
      }
    } catch (error) {
      console.warn("選択日の復元ができませんでした。", error);
    }

    // 保存日がなければ今夜の日付を使用
    if (selectedDate === null) {
      selectedDate = getObservationDate();
    }
  }

  // 現在の選択日を保存
  function saveSelectedDate() {
    if (selectedDate === null) return;

    // 共有URLによる一時的な日付は保存しない
    if (window.starGuideSharedState?.active) return;

    try {
      localStorage.setItem(
        STAR_GUIDE_DATE_SESSION_KEY,
        getDateKey(selectedDate),
      );
    } catch (error) {
      console.warn("選択日の保存ができませんでした。", error);
    }
  }

  // 星空ガイドで選択中の観測日時を取得する
  window.getStarGuideObservationTimestamp = function () {
    // 初回表示で日付が未設定の場合
    restoreSelectedDate();

    // 選択中の日付を複製
    const observationDate = new Date(selectedDate);

    // 観測時刻を20時に設定
    observationDate.setHours(20, 0, 0, 0);

    return observationDate.getTime();
  };

  // 月齢を計算する基準時刻（日本時間の正午）
  function getReferenceDate(date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12,
      0,
      0,
      0,
    );
  }

  // 直前の新月を取得
  function getPreviousNewMoon(date) {
    const referenceDate = getReferenceDate(date);
    const searchStart = Astronomy.MakeTime(referenceDate);

    const newMoon = Astronomy.SearchMoonPhase(
      0,
      searchStart,
      -SYNODIC_MONTH - 2,
    );

    return newMoon.date;
  }

  // 月齢を取得
  function getMoonAge(date) {
    const referenceDate = getReferenceDate(date);
    const newMoonDate = getPreviousNewMoon(referenceDate);

    return (
      (referenceDate.getTime() - newMoonDate.getTime()) / (1000 * 60 * 60 * 24)
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
      { angle: 270, name: "下弦の月" },
    ];

    const nextMidnight = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
      0,
      0,
      0,
      0,
    );

    const searchStart = Astronomy.MakeTime(nextMidnight);

    for (const event of phaseEvents) {
      const phaseTime = Astronomy.SearchMoonPhase(event.angle, searchStart, -2);

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

    return phaseAngle < 180 ? "満ちていく月" : "欠けていく月";
  }

  // 観測地点
  let MOON_OBSERVER = new Astronomy.Observer(34.6937, 135.5023, 0);

  // 観測地点の変更
  window.setStarGuideObserver = function (latitude, longitude) {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return;
    }

    MOON_OBSERVER = new Astronomy.Observer(latitude, longitude, 0);

    // 月の出入り・日の出入りなどを再計算
    renderMoonObservation();
  };

  // ▼ 指定した天体の地平線からの高度を取得
  function getBodyAltitude(body, date) {
    const time = Astronomy.MakeTime(date);

    const equ = Astronomy.Equator(body, time, MOON_OBSERVER, true, true);

    const horizontal = Astronomy.Horizon(
      time,
      MOON_OBSERVER,
      equ.ra,
      equ.dec,
      "normal",
    );

    return horizontal.altitude;
  }

  // direction: 1 = 月の出、-1 = 月の入り
  // 観察対象日の正午から翌日の正午直前までを検索対象にする。
  function getMoonRiseSet(date, direction) {
    if (isMoonDataOutOfRange(date)) {
      return null;
    }

    const startOfObservation = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12,
      0,
      0,
      0,
    );

    const endOfObservation = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
      12,
      0,
      0,
      0,
    );

    const event = Astronomy.SearchRiseSet(
      Astronomy.Body.Moon,
      MOON_OBSERVER,
      direction,
      Astronomy.MakeTime(startOfObservation),
      2,
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
      Math.round(actualDate.getTime() / 60000) * 60000,
    );

    return {
      date: eventDate,
      isNextDay:
        eventDate.getDate() !== startOfObservation.getDate() ||
        eventDate.getMonth() !== startOfObservation.getMonth() ||
        eventDate.getFullYear() !== startOfObservation.getFullYear(),
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

    const timeText = `${hour}:${String(minute).padStart(2, "0")}`;

    return (event.isNextDay ? "翌" : "") + timeText;
  }

  // ▼ 月の出入り表示生成
  function buildMoonTimeMessage(today) {
    if (isMoonDataOutOfRange(today)) {
      return getMoonDataRangeMessage(today);
    }

    const riseText = formatMoonEvent(getMoonRiseSet(today, 1));

    const setText = formatMoonEvent(getMoonRiseSet(today, -1));

    if (riseText && setText) {
      return `<img
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
    }

    if (riseText) {
      return `<img
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
    >${riseText}`;
    }

    if (setText) {
      return `<img
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
        margin:3px 2px 0 0;
      "
    >${setText}`;
    }

    return "月の出入り時刻データなし";
  }

  // ▼ 日の出・日の入り表示生成
  function buildSunTimeMessage(today) {
    const sunriseText = formatSunEvent(getSunRiseSet(today, 1));

    const sunsetText = formatSunEvent(getSunRiseSet(today, -1));

    // 日の出・日の入りが両方ない場合
    if (!sunriseText && !sunsetText) {
      const noon = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        12,
        0,
        0,
        0,
      );

      const altitude = getBodyAltitude(Astronomy.Body.Sun, noon);

      const sunIcon = `
        <img
          src="image/common/ico-sun.png"
          alt="太陽"
          style="width:16px;height:16px;vertical-align:-3px;margin-right:3px;"
        >
      `;

      if (altitude > 0) {
        return sunIcon + "白夜（太陽は一日中、地平線の上）";
      }

      if (altitude < 0) {
        return sunIcon + "極夜（太陽は一日中、地平線の下）";
      }

      return sunIcon + "日の出・日の入り時刻を取得できません";
    }

    // 片方だけ取得できた場合
    if (!sunriseText || !sunsetText) {
      const sunriseLabel = sunriseText ? `日の出 ${sunriseText}` : "日の出なし";

      const sunsetLabel = sunsetText
        ? `日の入り ${sunsetText}`
        : "日の入りなし";

      return `☀ ${sunriseLabel}　${sunsetLabel}`;
    }

    return `<img
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
      margin:3px 2px 0 6px;
    "
  >${sunsetText}`;
  }

  // ▼ 日の出・日の入り取得
  function getSunRiseSet(date, direction) {
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0,
    );

    const endOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
      0,
      0,
      0,
      0,
    );

    const event = Astronomy.SearchRiseSet(
      Astronomy.Body.Sun,
      MOON_OBSERVER,
      direction,
      Astronomy.MakeTime(startOfDay),
      1,
    );

    if (!event || !event.date) {
      return null;
    }

    // 当日以外の時刻は表示しない
    if (
      event.date.getTime() < startOfDay.getTime() ||
      event.date.getTime() >= endOfDay.getTime()
    ) {
      return null;
    }

    return {
      date: new Date(Math.round(event.date.getTime() / 60000) * 60000),
    };
  }

  // ▼ 日の出・日の入り表示整形
  function formatSunEvent(event) {
    if (!event) {
      return null;
    }

    const d = event.date;

    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  // ▼ おすすめ時間帯を取得
  function getObservationWindow(date) {
    const phaseAngle = Astronomy.MoonPhase(
      Astronomy.MakeTime(getReferenceDate(date)),
    );

    const moonrise = getMoonRiseSet(date, 1);
    const moonset = getMoonRiseSet(date, -1);

    const twilight = getAstronomicalTwilight(date);

    // 天文薄明の開始・終了が取得できなければ判定できない
    if (!twilight || !twilight.dusk || !twilight.dawn) {
      return null;
    }

    let startTime;
    let endTime;

    // ▼ 新月～満月（満ちていく月）
    if (phaseAngle < 180) {
      if (moonset) {
        // 通常：月の入りから夜明けまで
        startTime =
          moonset.date.getTime() > twilight.dusk.getTime()
            ? moonset.date
            : twilight.dusk;

        endTime = twilight.dawn;
      } else if (moonrise) {
        // 極地など：月の出しか取得できない場合
        startTime = twilight.dusk;

        endTime =
          moonrise.date.getTime() < twilight.dawn.getTime()
            ? moonrise.date
            : twilight.dawn;
      } else {
        // 月の出・月の入りが両方取得できない場合
        const middleDate = new Date(
          (twilight.dusk.getTime() + twilight.dawn.getTime()) / 2,
        );

        const moonAltitude = getBodyAltitude(Astronomy.Body.Moon, middleDate);

        // 夜間ずっと月が地平線の下にあると判断
        if (moonAltitude < 0) {
          startTime = twilight.dusk;
          endTime = twilight.dawn;
        } else {
          return null;
        }
      }

      // ▼ 満月～新月（欠けていく月）
    } else {
      if (moonrise) {
        // 通常：日暮れから月の出まで
        startTime = twilight.dusk;

        endTime =
          moonrise.date.getTime() < twilight.dawn.getTime()
            ? moonrise.date
            : twilight.dawn;
      } else if (moonset) {
        // 極地など：月の入りしか取得できない場合
        startTime =
          moonset.date.getTime() > twilight.dusk.getTime()
            ? moonset.date
            : twilight.dusk;

        endTime = twilight.dawn;
      } else {
        // 月の出・月の入りが両方取得できない場合
        const middleDate = new Date(
          (twilight.dusk.getTime() + twilight.dawn.getTime()) / 2,
        );

        const moonAltitude = getBodyAltitude(Astronomy.Body.Moon, middleDate);

        if (moonAltitude < 0) {
          startTime = twilight.dusk;
          endTime = twilight.dawn;
        } else {
          return null;
        }
      }
    }

    // 時間帯が成立しているか確認
    if (endTime.getTime() <= startTime.getTime()) {
      return null;
    }

    return {
      start: startTime,
      end: endTime,
    };
  }

  // ▼ 星空期待値を算出
  function getSkyExpectation(window) {
    if (!window) {
      return {
        stars: "☆☆☆☆☆",
      };
    }

    const hours =
      (window.end.getTime() - window.start.getTime()) / (1000 * 60 * 60);

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
      stars: "★".repeat(stars) + "☆".repeat(5 - stars),
    };
  }

  // ▼ 時刻を10分単位で切り捨て
  function floorTo10Minutes(date) {
    const rounded = new Date(date);

    rounded.setMinutes(Math.floor(rounded.getMinutes() / 10) * 10, 0, 0);

    return rounded;
  }

  // ▼ おすすめ時間帯を表示用に整形
  function formatObservationWindow(window) {
    if (!window) {
      return "ありません";
    }

    const startDate = floorTo10Minutes(window.start);

    const endDate = floorTo10Minutes(window.end);

    const startHour = startDate.getHours();

    const startMinute = String(startDate.getMinutes()).padStart(2, "0");

    const endHour = endDate.getHours();

    const endMinute = String(endDate.getMinutes()).padStart(2, "0");

    const startText = `${startHour}:${startMinute}`;

    const endText = `${endHour}:${endMinute}`;

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
    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12,
      0,
      0,
      0,
    );

    const endDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
      12,
      0,
      0,
      0,
    );

    const startTime = Astronomy.MakeTime(startDate);
    const endTime = Astronomy.MakeTime(endDate);

    try {
      // 太陽が -18°まで下がる時刻
      const dusk = Astronomy.SearchAltitude(
        Astronomy.Body.Sun,
        MOON_OBSERVER,
        -1,
        startTime,
        1,
        -18,
      );

      // 太陽が -18°まで上がる時刻
      const dawn = Astronomy.SearchAltitude(
        Astronomy.Body.Sun,
        MOON_OBSERVER,
        1,
        Astronomy.MakeTime(
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 1,
            0,
            0,
            0,
            0,
          ),
        ),
        1,
        -18,
      );

      // 観察対象日の範囲内にある時刻だけを採用
      const duskDate =
        dusk && dusk.date >= startDate && dusk.date < endDate
          ? dusk.date
          : null;

      const dawnDate =
        dawn && dawn.date >= startDate && dawn.date < endDate
          ? dawn.date
          : null;

      // 両方の時刻が取得できない場合は極地の可能性を確認
      if (!duskDate && !dawnDate) {
        const middleDate = new Date(
          (startDate.getTime() + endDate.getTime()) / 2,
        );

        const sunAltitude = getBodyAltitude(Astronomy.Body.Sun, middleDate);

        // 一日中、太陽が -18°より下なら終日天文的な夜
        if (sunAltitude < -18) {
          return {
            dusk: startDate,
            dawn: endDate,
          };
        }

        // 一日中、天文的な夜にならない
        return {
          dusk: null,
          dawn: null,
        };
      }

      return {
        dusk: duskDate,
        dawn: dawnDate,
      };
    } catch (error) {
      console.error("天文薄明時刻取得エラー:", error);
      return null;
    }
  }

  // ▼ 曜日を取得
  function getWeekdayText(date) {
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

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

  // =================================
  // 星空ガイドの日付取得・設定（共有機能用）
  // =================================

  // 現在選択中の日付を取得
  window.getStarGuideObservationDate = function () {
    restoreSelectedDate();

    return getDateKey(selectedDate);
  };

  // 指定された日付を設定
  window.setStarGuideObservationDate = function (dateString) {
    // YYYY-MM-DD 形式を確認
    if (
      typeof dateString !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
    ) {
      return false;
    }

    const [year, month, day] = dateString.split("-").map(Number);

    const targetDate = new Date(year, month - 1, day, 12, 0, 0, 0);

    // 実在する日付か確認
    if (
      targetDate.getFullYear() !== year ||
      targetDate.getMonth() !== month - 1 ||
      targetDate.getDate() !== day
    ) {
      return false;
    }

    // 月のデータ期間外は受け付けない
    const targetKey = getDateKey(targetDate);

    if (targetKey < MOON_DATA_START || targetKey > MOON_DATA_END) {
      return false;
    }

    selectedDate = targetDate;

    renderMoonObservation();

    return true;
  };

  // ▼ 星空ガイドHTML生成
  function buildStarGuideHtml(data) {
    const {
      today,
      age,
      phaseName,
      imagePath,
      glowBlur,
      glowOpacity,
      rating,
      observationWindowText,
      moonTimeMessage,
      sunTimeMessage,
      meteorMessage,
    } = data;

    return `
  
  <div class="star-guide-header">

  <button
    type="button"
    id="showSelectedDateBtn"
    class="datetime-now selected-date-button"
  >
    <span class="flip-text">🔭</span>${today.getFullYear()}<span style="font-size:0.8em;">年</span>${today.getMonth() + 1}<span style="font-size:0.8em;">月</span>${today.getDate()}<span style="font-size:0.8em;">日の</span>夜空<span style="font-size:0.8em;">を</span>見る🔭
  </button>

</div>

<!-- 星空ガイド共有ボタン -->
<div class="star-guide-share-row">
  <button
    type="button"
    id="star-guide-share-visible-button"
    class="star-guide-share-button"
    aria-label="星空ガイドを共有"
    title="星空ガイドを共有"
  >
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 10.5 15.4 6.5" />
      <path d="M8.6 13.5 15.4 17.5" />
    </svg>
  </button>

  <div class="star-guide-info guide-zoom-target" style="flex:1 1 auto; min-width:0; margin:0; padding:0;">

<!-- この夜の星空期待値 表示領域 -->
                        <div style="
              display: inline-block;
              background: transparent;
              margin: 2px 0 2px 0;
              padding: 8px 6px 4px 6px;
              border: none;
              box-sizing: border-box;
              width: 100%;
            ">
              <div style="
                text-align:center;
              ">
                <div style="
                  font-size:0.9em;
                  margin-bottom:2px;
                ">
                  星空期待値
                </div>

                <div style="
                  font-size:1.5em;
                  color:rgb(255,215,0);
                  text-shadow:0 0 2px rgba(0,0,0,0.8);
                  line-height:1;
                ">
                  ${rating.stars}
                </div>

                <div style="
                  font-size:0.65em;
                  margin-top:1px;
                  line-height:1.2;
                  opacity:0.7;
                ">
                  ※晴れていることが条件
                </div>
              </div>

              <div style="
                font-size:0.8em;
                margin:0.5em 0 -4px 0;
                text-align:center;
              ">
                星空おすすめ時間帯
              </div>

              <div style="
                font-size:1.2em;
                font-weight:600;
                text-align:center;
              ">
                ${observationWindowText}
              </div>
            </div>

            <!-- 区切り線 -->
            <div style="
  width:100%;
  height:1px;
  background:rgba(255,255,255,0.45);
  margin:1px 0 1px 0;
"></div>

${
  meteorMessage
    ? `
          <!-- 活動中の流星群 表示領域 -->
<div id="meteorMessagePanel"
  style="
    display:inline-block;
    background: transparent;
        margin:2px 0 4px 0;
        padding: 2px 6px 2px 6px;
        border: none;
        box-sizing:border-box;
        width:100%;
      ">
        <div style="
          font-size:1em;
          font-weight:600;
          text-align:center;
          color:#ffd700;
        ">
          ${meteorMessage}
        </div>
      </div>
                  <!-- 区切り線 -->
            <div style="
  width:100%;
  height:1px;
  background:rgba(255,255,255,0.45);
  margin:2px 0 4px 0;
"></div>
    `
    : ""
}

<div class="sun-moon-times">
  <div class="sun-time">
    ${sunTimeMessage}
  </div>

  <div class="moon-time">
    ${moonTimeMessage}
  </div>
</div>

</div>

    <button
    type="button"
    id="guide-text-size-button"
    data-text-size="medium"
    aria-label="文字サイズを変更"
    title="文字サイズを変更"
  >中</button>

</div>

<div style="
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  margin-top: 0;
  padding: 0;
  line-height: 1.3;
  font-size: 14px;
">

<div class="moon-control-group">

<button
  type="button"
  id="moon-date-back-7"
  class="moon-date-button"
  aria-label="7日前"
  title="7日前"
>
  <img
    src="image/common/btn-moon-back-7days.png"
    alt="7日前"
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
    alt="1日前"
  >
</button>

<!-- 月相画像（月の画像） -->
<img
  id="starGuideMoonImage"
  src="${imagePath}"
  alt="${phaseName}"
  style="
    display:block;
    width:40px;
    height:40px;
    object-fit:contain;
    margin:10px auto;
    cursor:pointer;

    filter:drop-shadow(
      0 0 ${glowBlur}px
      rgba(255, 255, 240, ${glowOpacity})
    );
  "
>

  <div class="guide-zoom-target" style="
    font-size:0.75em;
    text-align:center;
    line-height:1.2;
    margin:2px 0;
    text-shadow:
      -1px -1px 0 rgb(6, 7, 64),
       1px -1px 0 rgb(6, 7, 64),
      -1px  1px 0 rgb(6, 7, 64),
       1px  1px 0 rgb(6, 7, 64);
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
  id="moon-date-today"
  class="moon-date-button"
  aria-label="今日へ"
  title="今日へ"
  >
  今日<span style="font-size:0.8em;">へ</span>
  </button>

<button
  type="button"
  id="moon-date-next-1"
  class="moon-date-button"
  aria-label="1日後"
  title="1日後"
>
  <img
    src="image/common/btn-moon-next-1day.png"
    alt="1日後"
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
    alt="7日後"
  >
</button>

</div>

</div>
  `;
  }

  // ▼ 上部の日付ボタンをフラッシュ
  function flashSelectedDateButton() {
    const button = document.querySelector("#showSelectedDateBtn");

    if (!button) return;

    button.classList.remove("is-date-flash");

    // 連続操作でもアニメーションを最初から再生
    void button.offsetWidth;

    button.classList.add("is-date-flash");
  }

  // =================================
  // 月相の日付ボタン・長押し連続変更
  // =================================

  let moonDateRepeatTimer = null;
  let moonDateRepeatInterval = null;

  // 連続変更を停止
  function stopMoonDateRepeat() {
    if (moonDateRepeatTimer !== null) {
      clearTimeout(moonDateRepeatTimer);
      moonDateRepeatTimer = null;
    }

    if (moonDateRepeatInterval !== null) {
      clearInterval(moonDateRepeatInterval);
      moonDateRepeatInterval = null;
    }
  }

  // 日付を変更
  function changeMoonDate(days) {
    const targetDate = new Date(selectedDate);

    targetDate.setDate(targetDate.getDate() + days);

    const targetKey = getDateKey(targetDate);

    // データ期間外なら変更しない
    if (targetKey < MOON_DATA_START || targetKey > MOON_DATA_END) {
      return false;
    }

    selectedDate.setDate(selectedDate.getDate() + days);

    renderMoonObservation();

    flashSelectedDateButton();

    return true;
  }

  // 長押し開始
  function startMoonDateRepeat(days) {
    if (moonDateRepeatTimer !== null || moonDateRepeatInterval !== null) {
      return;
    }

    // 最初の1回はすぐに変更
    if (!changeMoonDate(days)) {
      return;
    }

    // 300ミリ秒後から連続変更
    moonDateRepeatTimer = setTimeout(() => {
      moonDateRepeatTimer = null;

      moonDateRepeatInterval = setInterval(() => {
        // データ期間の端に達したら停止
        if (!changeMoonDate(days)) {
          stopMoonDateRepeat();
        }
      }, 150);
    }, 300);
  }

  // 指やマウスを離したら停止
  window.addEventListener("pointerup", stopMoonDateRepeat);

  // 操作キャンセル時も停止
  window.addEventListener("pointercancel", stopMoonDateRepeat);

  // ウィンドウからフォーカスが外れたら停止
  window.addEventListener("blur", stopMoonDateRepeat);

  // =================================
  // 星空ガイド：共有URLコピー完了通知
  // =================================

  let starGuideCopyNoticeTimer = null;

  // 通知を閉じる
  function hideStarGuideCopyNotice() {
    const notice = document.getElementById("star-guide-copy-notice");

    if (notice) {
      notice.hidden = true;
    }

    if (starGuideCopyNoticeTimer !== null) {
      clearTimeout(starGuideCopyNoticeTimer);
      starGuideCopyNoticeTimer = null;
    }
  }

  // 通知を表示する
  function showStarGuideCopyNotice() {
    const notice = document.getElementById("star-guide-copy-notice");

    if (!notice) return;

    if (starGuideCopyNoticeTimer !== null) {
      clearTimeout(starGuideCopyNoticeTimer);
    }

    notice.hidden = false;

    starGuideCopyNoticeTimer = setTimeout(() => {
      hideStarGuideCopyNotice();
    }, 6000);
  }

  // ▼ 星空ガイドイベント初期化
  function initializeStarGuideEvents(content, today) {

        // ▼ 星空ガイド文字サイズ切り替え
    const GUIDE_TEXT_SIZE_KEY = "guideTextSize";

    const GUIDE_TEXT_SIZES = {
      small: 0.9,
      medium: 1.1,
      large: 1.2,
    };

    const guideTextSizeOrder = ["medium", "large", "small"];

    const guideTextSizeLabels = {
      small: "小",
      medium: "中",
      large: "大",
    };

    const guideTextSizeButton = content.querySelector(
      "#guide-text-size-button",
    );

    if (guideTextSizeButton) {
      // 前回の設定を復元（未設定・不正値なら中）
      let guideTextSize =
        localStorage.getItem(GUIDE_TEXT_SIZE_KEY) || "medium";

      if (!GUIDE_TEXT_SIZES.hasOwnProperty(guideTextSize)) {
        guideTextSize = "medium";
      }

      // 文字サイズを反映
      function applyGuideTextSize() {
        content.style.setProperty(
          "--guide-zoom",
          GUIDE_TEXT_SIZES[guideTextSize],
        );

        guideTextSizeButton.dataset.textSize = guideTextSize;
        guideTextSizeButton.textContent =
          guideTextSizeLabels[guideTextSize];
      }

      applyGuideTextSize();

      // 押すたびに 中 → 大 → 小 → 中
      guideTextSizeButton.addEventListener("click", function () {
        const currentIndex = guideTextSizeOrder.indexOf(guideTextSize);

        guideTextSize =
          guideTextSizeOrder[
            (currentIndex + 1) % guideTextSizeOrder.length
          ];

        localStorage.setItem(GUIDE_TEXT_SIZE_KEY, guideTextSize);

        applyGuideTextSize();
      });
    }

    // ▼ 星空ガイド共有ボタン
    const guideShareButton = content.querySelector(
      "#star-guide-share-visible-button",
    );

    if (guideShareButton) {
      // コピー完了通知の×ボタン
      const copyNoticeClose = document.getElementById(
        "star-guide-copy-notice-close",
      );

      if (copyNoticeClose && !copyNoticeClose.dataset.initialized) {
        copyNoticeClose.addEventListener("click", hideStarGuideCopyNotice);
        copyNoticeClose.dataset.initialized = "true";
      }

      guideShareButton.addEventListener("click", async function () {
        // 観測地点IDと選択日を取得
        const locationId = window.getSavedObservationLocationId();

        const observationDate = window.getStarGuideObservationDate();

        if (!locationId || !observationDate) {
          console.error("共有情報を取得できませんでした。");
          return;
        }

        // 星空ガイド専用の共有URLを作成
        const shareURL = new URL(
          "https://onthestars.github.io/Star-Constellation-Flashcards/",
        );

        shareURL.searchParams.set("guideLocation", locationId);
        shareURL.searchParams.set("guideDate", observationDate);

        // クリップボードにコピー
        try {
          await navigator.clipboard.writeText(shareURL.toString());

          console.log("星空ガイド共有URL:", shareURL.toString());

          // コピー完了通知を表示
          showStarGuideCopyNotice();
        } catch (error) {
          console.error("星空ガイド共有URLのコピーに失敗しました:", error);
        }
      });
    }

    // ▼ 今日に戻るボタン
    const todayButton = content.querySelector("#moon-date-today");

    if (todayButton) {
      todayButton.addEventListener("click", function () {
        selectedDate = getObservationDate();

        renderMoonObservation();

        flashSelectedDateButton();
      });
    }

    // ▼ 日付移動ボタン
    [
      ["#moon-date-back-1", -1],
      ["#moon-date-back-7", -7],
      ["#moon-date-next-1", 1],
      ["#moon-date-next-7", 7],
    ].forEach(function ([selector, days]) {
      const button = content.querySelector(selector);

      if (!button) {
        return;
      }

      // ▼ ボタン押下後の日付を計算
      const targetDate = new Date(today);

      targetDate.setDate(targetDate.getDate() + days);

      const targetKey = getDateKey(targetDate);

      // ▼ データ期間外なら無効化
      if (targetKey < MOON_DATA_START || targetKey > MOON_DATA_END) {
        button.disabled = true;
        button.style.opacity = "0.3";
        button.style.cursor = "default";
      }

      // 画像の長押しメニューを抑止
      button.addEventListener("contextmenu", function (event) {
        event.preventDefault();
      });

      // ▼ 長押し・連続変更
      button.addEventListener("pointerdown", function (event) {
        if (event.button !== 0 || button.disabled) {
          return;
        }

        event.preventDefault();

        startMoonDateRepeat(days);
      });
    });

    const showSelectedDateBtn = content.querySelector("#showSelectedDateBtn");

    if (showSelectedDateBtn) {
      showSelectedDateBtn.addEventListener("click", function () {
        // 選択中の日付を複製
        const observationDate = new Date(selectedDate);

        // 観測時刻を20:00に設定
        observationDate.setHours(20, 0, 0, 0);

        // 指定日時でプラネタリウムを開く
        if (typeof window.openPlanetariumAtDate === "function") {
          window.openPlanetariumAtDate(observationDate.getTime());
        }
      });
    }

    const meteorPeakCard = content.querySelector(".meteor-peak-card");

    if (meteorPeakCard) {
      meteorPeakCard.style.cursor = "pointer";

      meteorPeakCard.addEventListener("click", function (event) {
        // 流星群名のリンクを押した場合は既存の処理に任せる
        if (event.target.closest(".meteor-shower-link")) {
          return;
        }

        const meteorLink = meteorPeakCard.querySelector(".meteor-shower-link");

        if (!meteorLink) {
          return;
        }

        const meteorName = meteorLink.dataset.meteorName;

        if (
          meteorName &&
          typeof window.openIndependentChartForMeteorName === "function"
        ) {
          window.openIndependentChartForMeteorName(meteorName);
        }
      });
    }

// ▼ 月相画像の長押しで月相・日付操作ブロックを移動
const moonImage = content.querySelector("#starGuideMoonImage");
const moonControlGroup = content.querySelector(".moon-control-group");
const guidePanel = document.getElementById("star-guide-panel");

if (moonImage && moonControlGroup && guidePanel) {
  const dragPositionKey = "starGuideMoonControlDragPosition";

  let holdTimer = null;
  let isDragging = false;
  let suppressMoonClick = false;

  let startPointerX = 0;
  let startGroupLeft = 0;

  // パネル内で移動できる最大の横幅
  function getMaxMoonControlLeft() {
    return Math.max(
      0,
      guidePanel.clientWidth - moonControlGroup.offsetWidth
    );
  }

  // パネル左端からの位置を指定して反映
  function applyMoonControlLeft(left) {
    const panelRect = guidePanel.getBoundingClientRect();

    const offsetParent =
      moonControlGroup.offsetParent || guidePanel;

    const parentRect = offsetParent.getBoundingClientRect();

    const desiredViewportLeft =
      panelRect.left + guidePanel.clientLeft + left;

    const parentOrigin =
      parentRect.left + offsetParent.clientLeft;

    const cssLeft =
      desiredViewportLeft -
      parentOrigin +
      offsetParent.scrollLeft;

    moonControlGroup.style.left = `${cssLeft}px`;
    moonControlGroup.style.right = "auto";
  }

  // 保存位置を復元
  const savedDragPosition = localStorage.getItem(dragPositionKey);

  if (savedDragPosition !== null) {
    const savedRatio = Number(savedDragPosition);

    if (Number.isFinite(savedRatio)) {
      const ratio = Math.max(0, Math.min(1, savedRatio));

      applyMoonControlLeft(
        getMaxMoonControlLeft() * ratio
      );
    }
  }

  // ドラッグ終了時の位置を保存
  function saveMoonControlLeft() {
    const panelRect = guidePanel.getBoundingClientRect();
    const groupRect = moonControlGroup.getBoundingClientRect();

    const currentLeft =
      groupRect.left -
      panelRect.left -
      guidePanel.clientLeft;

    const maxLeft = getMaxMoonControlLeft();

    const ratio =
      maxLeft > 0
        ? Math.max(0, Math.min(1, currentLeft / maxLeft))
        : 0;

    localStorage.setItem(dragPositionKey, String(ratio));
  }

  // ドラッグ開始
  function startMoonControlDrag() {
    isDragging = true;
    suppressMoonClick = true;

    moonImage.style.cursor = "grabbing";
  }

  // ドラッグ中の移動
  moonImage.addEventListener("pointermove", function (event) {
    // 長押し判定前に大きく動いた場合はドラッグしない
    if (!isDragging) {
      if (
        Math.abs(event.clientX - startPointerX) > 8 &&
        holdTimer !== null
      ) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }

      return;
    }

    event.preventDefault();

    const deltaX = event.clientX - startPointerX;

    const newLeft = Math.max(
      0,
      Math.min(
        getMaxMoonControlLeft(),
        startGroupLeft + deltaX
      )
    );

    applyMoonControlLeft(newLeft);
  });

  // 押し始め
  moonImage.addEventListener("pointerdown", function (event) {
    if (!event.isPrimary || event.button !== 0) {
      return;
    }

    startPointerX = event.clientX;

    const panelRect = guidePanel.getBoundingClientRect();
    const groupRect = moonControlGroup.getBoundingClientRect();

    startGroupLeft =
      groupRect.left -
      panelRect.left -
      guidePanel.clientLeft;

    // ポインターを画像上に保持
    try {
      moonImage.setPointerCapture(event.pointerId);
    } catch (error) {}

    // 約200msの長押しでドラッグ開始
    holdTimer = setTimeout(function () {
      holdTimer = null;
      startMoonControlDrag();
    }, 200);
  });

  // 指・マウスを離したとき
  function finishMoonControlDrag() {
    if (holdTimer !== null) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }

if (isDragging) {
  // 自由配置として保存
  saveMoonControlLeft();

  localStorage.setItem(
    "starGuideMoonControlPosition",
    "free"
  );

  // 左右の配置クラスを解除
  guidePanel.classList.remove(
    "moon-controls-left",
    "moon-controls-right"
  );

  // 設定パネルの左右選択を両方OFF
  document.querySelectorAll(
    'input[name="moon-control-position"]'
  ).forEach(function (radio) {
    radio.checked = false;
  });
}

    isDragging = false;
    moonImage.style.cursor = "grab";

    // ドラッグ後のクリックを抑止
    if (suppressMoonClick) {
      setTimeout(function () {
        suppressMoonClick = false;
      }, 0);
    }
  }

  moonImage.addEventListener("pointerup", finishMoonControlDrag);

  moonImage.addEventListener("pointercancel", finishMoonControlDrag);

  // ドラッグ後に月Special Viewerが開くのを防ぐ
  moonImage.addEventListener(
    "click",
    function (event) {
      if (suppressMoonClick) {
        event.preventDefault();
        event.stopImmediatePropagation();
        suppressMoonClick = false;
      }
    },
    true
  );

  // 画像の長押しメニューを抑止
  moonImage.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });
}

// ▼ 月相画像クリックで月Special Viewer起動
if (moonImage && typeof openMoonSpecialViewer === "function") {
  moonImage.addEventListener("click", openMoonSpecialViewer);
}
    // ▼ 今の空を見るボタン
    const showPlanetariumBtn = document.getElementById(
      "showPlanetariumFromGuideBtn",
    );

    if (showPlanetariumBtn && !showPlanetariumBtn.dataset.initialized) {
      showPlanetariumBtn.addEventListener("click", function () {
        if (typeof window.openPlanetarium === "function") {
          window.openPlanetarium();
        }
      });

      showPlanetariumBtn.dataset.initialized = "true";
    }
  }

  function renderMoonObservation() {
    const content = document.getElementById("star-guide-content");

    if (!content) {
      return;
    }

    if (typeof Astronomy === "undefined") {
      content.textContent = "月の情報を読み込めませんでした。";
      return;
    }

    try {
      // 選択日を復元（初回は今夜の日付）
      restoreSelectedDate();

      // 選択日を保存
      saveSelectedDate();

      // 選択中の日付を使用
      const today = new Date(selectedDate);

      console.log("星空ガイドの選択日時:", today.toString());

      // テストする場合は上の行をコメントアウトし、次の行を有効にする
      // 例）2026年10月11日 → 2026,9,11 ※月は-1とする
      // const today = new Date(2027, 7, 22);

      const age = getMoonAge(today);
      const phaseIndex = getMoonPhaseIndex(today);
      const phaseName = getPhaseName(today);

      // 月の照明率（0～100%）
      const phaseAngle = Astronomy.MoonPhase(
        Astronomy.MakeTime(getReferenceDate(today)),
      );

      const illumination = (1 - Math.cos((phaseAngle * Math.PI) / 180)) / 2;

      // 照明率に応じたグローの強さ
      const glowOpacity = illumination * 0.8;
      const glowBlur = illumination * 8;

      const observationWindow = getObservationWindow(today);

      const rating = getSkyExpectation(observationWindow);

      const observationWindowText = formatObservationWindow(observationWindow);

      // 月の出・月の入りの時刻表示（Astronomy Engineで直接計算）
      const moonTimeMessage = buildMoonTimeMessage(today);

      const sunTimeMessage = buildSunTimeMessage(today);

      // ▼ 流星群メッセージ取得
      const meteorMessage = getMeteorMessage(today);

      const imagePath = "image/common/" + MOON_IMAGES[phaseIndex];

      content.innerHTML = buildStarGuideHtml({
        today,
        age,
        phaseName,
        imagePath,
        glowBlur,
        glowOpacity,
        rating,
        observationWindowText,
        moonTimeMessage,
        sunTimeMessage,
        meteorMessage,
      });

      initializeStarGuideEvents(content, today);
    } catch (error) {
      console.error("月の情報の取得に失敗しました:", error);
      content.textContent = "月の情報を取得できませんでした。";
    }
  }

  function initMoonObservationPanel() {
    const panel = document.getElementById("star-guide-panel");
    const closeButton = document.getElementById("starGuideCloseBtn");
    const showButton = document.getElementById("showStarGuideBtn");

    // 再表示ボタンの状態を更新
    function updateShowButtonState() {
      if (!panel || !showButton) {
        return;
      }

      const isVisible = getComputedStyle(panel).display !== "none";

      showButton.disabled = isVisible;
      showButton.style.opacity = showButton.disabled ? 0.4 : 1;
    }

    // 初回表示時に共通アニメーション
    if (panel) {
      panel.classList.add("panel-fade-in");
    }

    // 閉じるボタンの初期化
    if (closeButton && panel && !closeButton.dataset.initialized) {
      closeButton.addEventListener("click", function () {
        panel.style.display = "none";
        updateShowButtonState();

        // 星空ガイド共有状態の解除・復元を確認
        if (typeof window.restoreStarGuideSharedState === "function") {
          window.restoreStarGuideSharedState();
        }
      });

      closeButton.dataset.initialized = "true";
    }

    // Escapeキーでも閉じる
    if (!panel.dataset.escapeInitialized) {
      document.addEventListener("keydown", function (event) {
        if (
          event.key === "Escape" &&
          getComputedStyle(panel).display !== "none"
        ) {
          panel.style.display = "none";
          updateShowButtonState();

          if (typeof window.restoreStarGuideSharedState === "function") {
            window.restoreStarGuideSharedState();
          }
        }
      });

      panel.dataset.escapeInitialized = "true";
    }

    // 星空ガイドパネル再表示ボタンの初期化
    if (showButton && panel && !showButton.dataset.initialized) {
      showButton.addEventListener("click", function () {
        panel.style.display = "flex";
        window.bringPanelToFront(panel);
        updateShowButtonState();
      });

      showButton.dataset.initialized = "true";
    }

    // 初期状態を反映
    updateShowButtonState();

    // 外部から星空ガイドを開けるようにする
    window.openStarGuide = function () {
      if (!panel) return;

      panel.style.display = "flex";

      window.bringPanelToFront(panel);

      // 共通アニメーションを再実行
      panel.classList.remove("panel-fade-in");
      void panel.offsetWidth;
      panel.classList.add("panel-fade-in");

      updateShowButtonState();
    };
  }

  // 既存の main.js から呼び出せるようにする
  window.updateMoonObservation = renderMoonObservation;
  window.initMoonObservationPanel = initMoonObservationPanel;

  document.addEventListener("DOMContentLoaded", function () {
    renderMoonObservation();
    initMoonObservationPanel();
  });
})();
