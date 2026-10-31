
// js/independent-chart-overlay.js
"use strict";

(function () {
  const CHART_URL = new URL(
    "star-chart/index.html",
    document.baseURI
  ).href;

  const CHART_ORIGIN = new URL(CHART_URL).origin;

  const overlay = document.getElementById(
    "independent-chart-overlay"
  );
  const title = document.getElementById(
    "independent-chart-title"
  );
  const closeButton = document.getElementById(
    "independent-chart-close"
  );
  const frame = document.getElementById(
    "independent-chart-frame"
  );

  if (!overlay || !title || !closeButton || !frame) {
    console.error(
      "星図カードオーバーレイのHTML要素が見つかりません。"
    );
    return;
  }

  let selectedMeteor = null;
  let isOpen = false;

  // 月日を「10月2日」の形式に変換
  function formatMeteorDate(mmdd) {
    const [month, day] = mmdd.split("-");

    return `${Number(month)}月${Number(day)}日`;
  }

  // ヘッダーに流星群名・出現期間・極大日を表示
  function updateChartTitle(meteor) {
    const nameElement = document.createElement("span");
    nameElement.className = "independent-chart-title-name";
    nameElement.textContent = meteor.name;

    const periodElement = document.createElement("span");
    periodElement.className = "independent-chart-title-period";

    periodElement.textContent =
      `${formatMeteorDate(meteor.start)} - ` +
      `${formatMeteorDate(meteor.end)}` +
      `（${formatMeteorDate(meteor.peak)}頃極大）`;

    title.replaceChildren(nameElement, periodElement);
  }

  // 選択した流星群の放射点を星図へ送信
  function sendRadiantCoordinates() {
    if (!isOpen || !selectedMeteor || !frame.contentWindow) {
      return;
    }

    frame.contentWindow.postMessage(
      {
        type: "set-meteor-radiant",
        name: selectedMeteor.name,
        ra: selectedMeteor.radiantRa,
        dec: selectedMeteor.radiantDec
      },
      CHART_ORIGIN
    );
  }

  // 星図カードを開く
  function openIndependentChart(meteor) {
    if (
      !meteor ||
      typeof meteor.name !== "string" ||
      !Number.isFinite(meteor.radiantRa) ||
      !Number.isFinite(meteor.radiantDec) ||
      meteor.radiantRa < 0 ||
      meteor.radiantRa >= 360 ||
      meteor.radiantDec < -90 ||
      meteor.radiantDec > 90
    ) {
      console.error("流星群の放射点データが不正です。", meteor);
      return;
    }

    selectedMeteor = meteor;

    updateChartTitle(meteor);

    overlay.style.display = "block";
    isOpen = true;

    if (frame.getAttribute("src") !== CHART_URL) {
      frame.src = CHART_URL;
    } else {
      sendRadiantCoordinates();
    }
  }

  // 星図の読み込み完了後に放射点を送信
  frame.addEventListener("load", function () {
    if (!isOpen || frame.src === "about:blank") {
      return;
    }

    sendRadiantCoordinates();
  });

  // オーバーレイを閉じる
  function closeIndependentChart() {
    isOpen = false;
    selectedMeteor = null;
    overlay.style.display = "none";
    frame.src = "about:blank";
  }

  closeButton.addEventListener(
    "click",
    closeIndependentChart
  );

  // Escapeキーでも閉じる
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen) {
      closeIndependentChart();
    }
  });

  // meteor-events.js から呼び出す関数
  window.openIndependentChart = openIndependentChart;

  console.log("星図カードオーバーレイを初期化しました。");
})();
