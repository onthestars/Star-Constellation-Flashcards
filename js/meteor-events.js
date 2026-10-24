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
☄ 本日、
<a
  href="${meteor.url}"
  target="_blank"
  rel="noopener noreferrer"
  style="
    color:rgb(6,7,64);
    font-weight:bold;
  "
>
  ${meteor.name}
</a>
が極大です
  </div>`
);

      continue;
    }

    if (meteor.peak) {

  const [peakMonth, peakDay] =
    meteor.peak.split("-");

  activeMessages.push(
    `<a
      href="${meteor.url}"
      target="_blank"
      rel="noopener noreferrer"
      style="
        color:#ffd700;
        text-decoration:underline;
      "
    >
      ${meteor.name}
    </a>
    <span style="font-size:0.85em;">…${Number(peakMonth)}/${Number(peakDay)}頃極大</span>`
  );

  continue;
}

    messages.push(
      `☄ ${meteor.name}活動中`
    );
  }

  // ▼ 活動中流星群一覧
if (activeMessages.length > 0) {

  messages.push(
    `<div style="font-weight:normal;line-height:1.25em;">
    ☄<span style="font-size:0.95em;font-weight:bold;">活動中の流星群</span><br>
      ${activeMessages.join("<br>")}
    </div>`
  );
}

  return messages.join("<br>");
}