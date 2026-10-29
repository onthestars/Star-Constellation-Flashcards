// meteor-events.js

// ▼ 流星群活動中判定
function isMeteorActive(mmdd, meteor) {
  // ▼ 通常期間
  if (meteor.start <= meteor.end) {
    return (
      mmdd >= meteor.start &&
      mmdd <= meteor.end
    );
  }

  // ▼ 年またぎ期間
  return (
    mmdd >= meteor.start ||
    mmdd <= meteor.end
  );
}

// ▼ Soleil表示用の流星群リンク
function createMeteorShowerLink(meteor) {
  return `<a href="#" class="meteor-shower-link"
    data-meteor-name="${meteor.name}"
    style="color:#ffd700; text-decoration:underline;">${meteor.name}</a>`;
}

// ▼ 流星群レベル取得
function getMeteorActivityLevel(date = new Date()) {
  const mmdd =
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0");

  let active = false;

  for (const meteor of meteorEvents) {
    // ▼ 極大日
    if (meteor.peak === mmdd) {
      return "peak";
    }

    // ▼ 活動期間
    if (isMeteorActive(mmdd, meteor)) {
      active = true;
    }
  }

  return active ? "active" : "normal";
}

// ▼ 流星群メッセージ取得
function getMeteorMessage(date) {

  const mmdd =
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0");

const messages = [];
const activeMessages = [];

  for (const meteor of meteorEvents) {

    if (!isMeteorActive(mmdd, meteor)) {
      continue;
    }

    if (meteor.peak === mmdd) {

messages.push(
  `<div style="
    display:inline-block;
    padding:3px 6px 2px 6px;
    background:rgb(255,215,0);
    color:rgb(6,7,64);
    font-weight:bold;
    border-radius:4px;
    margin:8px 0;
  ">
    ☄ 本日
    <a
      href="#"
      class="meteor-shower-link"
      data-meteor-name="${meteor.name}"
      style="color:rgb(6,7,64);font-weight:bold;"
    >${meteor.name}</a>
    が極大
  </div>`
);

continue;
    }

    if (meteor.peak) {

  const [peakMonth, peakDay] =
    meteor.peak.split("-");

activeMessages.push(
  `${createMeteorShowerLink(meteor)}
  <span style="font-size:0.85em;">(${Number(peakMonth)}/${Number(peakDay)}頃極大)</span>`
);

  continue;
}

messages.push(
  `☄ ${createMeteorShowerLink(meteor)}活動中`
);
  }

  // ▼ 活動中流星群一覧
if (activeMessages.length > 0) {

messages.push(
  `<div style="font-weight:normal;line-height:1.5em;">
      ${activeMessages.join("<br>")}
    </div>`
);
}

  return messages.join("<br>");
}

// 流星群名からデータを検索し、Soleilを開く
window.openSoleilForMeteorName = function (meteorName) {
  const meteor = meteorEvents.find(function (item) {
    return item.name === meteorName;
  });

  if (!meteor) {
    console.error("流星群データが見つかりません。", meteorName);
    return;
  }

  if (typeof window.openSoleilOverlay !== "function") {
    console.error("Soleilオーバーレイが初期化されていません。");
    return;
  }

  window.openSoleilOverlay(meteor);
};

// 流星群名からデータを検索し、星図カードを開く
window.openIndependentChartForMeteorName = function (meteorName) {
  const meteor = meteorEvents.find(function (item) {
    return item.name === meteorName;
  });

  if (!meteor) {
    console.error("流星群データが見つかりません。", meteorName);
    return;
  }

  if (typeof window.openIndependentChart !== "function") {
    console.error("星図カードオーバーレイが初期化されていません。");
    return;
  }

  window.openIndependentChart(meteor);
};