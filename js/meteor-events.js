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

// ▼ 流星群メッセージ取得
function getMeteorMessage(date) {

  const mmdd =
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0");

  const messages = [];

  for (const meteor of meteorEvents) {

    if (!isMeteorActive(mmdd, meteor)) {
      continue;
    }

    if (meteor.peak === mmdd) {

      messages.push(
        `☄ 本日、${meteor.name}が極大です。`
      );

      continue;
    }

    if (meteor.peak) {

      const [peakMonth, peakDay] =
        meteor.peak.split("-");

      messages.push(
        `☄ ${meteor.name}活動中（極大は${Number(peakMonth)}月${Number(peakDay)}日頃）`
      );

      continue;
    }

    messages.push(
      `☄ ${meteor.name}活動中`
    );
  }

  return messages.join("<br>");
}