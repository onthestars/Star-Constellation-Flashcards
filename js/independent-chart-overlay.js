
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
  let pendingObservationTimestamp = null;

  // 星座カードから受け取った中心座標
  let pendingConstellationCenter = null;

  // 観測日時を星図へ送信
  function sendObservationDate() {
    if (
      !isOpen ||
      !frameReady ||
      pendingObservationTimestamp === null ||
      !frame.contentWindow
    ) {
      return;
    }

    frame.contentWindow.postMessage(
      {
        type: "set-observation-date",
        timestamp: pendingObservationTimestamp
      },
      CHART_ORIGIN
    );

    pendingObservationTimestamp = null;
  }

  let frameReady = false;

  // 右上のプラネタリウムボタンの状態を更新
  function updatePlanetariumButtonState() {

    const button = document.getElementById(
      "showPlanetariumBtn"
    );

    if (!button) return;

    button.style.opacity = isOpen ? 0.4 : 1;
    button.style.pointerEvents = isOpen ? "none" : "auto";
    button.setAttribute("aria-disabled", String(isOpen));
  }

  // 月日を「10月2日」の形式に変換
  function formatMeteorDate(mmdd) {
    const [month, day] = mmdd.split("-");

    return `${Number(month)}月${Number(day)}日`;
  }

  // ヘッダーのタイトルを設定
  function updateChartTitle() {
    title.textContent = "トレミーのプラネタリウム";
  }

  // 選択した流星群の放射点を星図へ送信
  function sendRadiantCoordinates() {
    if (!isOpen || !selectedMeteor || !frame.contentWindow) {
      return;
    }

    console.log(
      "流星群の送信直前:",
      selectedMeteor.name,
      selectedMeteor.start,
      selectedMeteor.end
    );

    frame.contentWindow.postMessage(
      {
        type: "set-meteor-radiant",
        name: selectedMeteor.name,
        peak: selectedMeteor.peak,
        start: selectedMeteor.start,
        end: selectedMeteor.end,
        ra: selectedMeteor.radiantRa,
        dec: selectedMeteor.radiantDec
      },
      CHART_ORIGIN
    );
  }

  // 星座カードの中心座標を星図へ送信
  function sendConstellationCenter() {

    if (
      !isOpen ||
      !frameReady ||
      !pendingConstellationCenter ||
      !frame.contentWindow
    ) {
      return;
    }

    frame.contentWindow.postMessage(
      {
        type: "set-constellation-center",
        name: pendingConstellationCenter.name,
        ra: pendingConstellationCenter.ra,
        dec: pendingConstellationCenter.dec
      },
      CHART_ORIGIN
    );

    pendingConstellationCenter = null;
  }

  // 星図カードを開く
  function openIndependentChart(meteor, timestamp) {
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
    pendingObservationTimestamp = Number.isFinite(timestamp) ? timestamp : null;

    updateChartTitle(meteor);

    overlay.style.display = "block";

    window.bringPanelToFront(overlay);

    isOpen = true;

    updatePlanetariumButtonState();

    if (frame.getAttribute("src") !== CHART_URL) {
      frameReady = false;
      frame.src = CHART_URL;
    } else {
      sendObservationDate();
      sendRadiantCoordinates();
    }
  }

  // 通常のプラネタリウムを開く
  function openPlanetarium() {

    selectedMeteor = null;

    updateChartTitle();

    overlay.style.display = "block";

    window.bringPanelToFront(overlay);

    // パネルを上から下へ表示
    const panel = document.getElementById(
      "independent-chart-panel"
    );

    panel.classList.remove("planetarium-panel-fade-in");

    // アニメーションを再実行
    void panel.offsetWidth;

    panel.classList.add("planetarium-panel-fade-in");

    isOpen = true;

    if (frame.getAttribute("src") !== CHART_URL) {
      frameReady = false;
      frame.src = CHART_URL;
    }
  }

  // 指定した日時でプラネタリウムを開く
  function openPlanetariumAtDate(timestamp) {

    if (!Number.isFinite(timestamp)) return;

    pendingObservationTimestamp = timestamp;

    openPlanetarium();

    // すでに星図が読み込み済みなら、そのまま日時を送信
    sendObservationDate();
  }

  // 星座カードから中心座標を指定してプラネタリウムを開く
  function openPlanetariumAtConstellation(
    ra,
    dec,
    timestamp,
    name
  ) {

    if (
      !Number.isFinite(ra) ||
      !Number.isFinite(dec) ||
      ra < 0 ||
      ra >= 360 ||
      dec < -90 ||
      dec > 90 ||
      !Number.isFinite(timestamp)
    ) {
      console.error("星座の中心座標が不正です。");
      return;
    }

    // 観測日時を設定
    pendingObservationTimestamp = timestamp;

    // 通常のプラネタリウムを開く
    openPlanetarium();

    // 中心座標を保留
    pendingConstellationCenter = {
      name: name,
      ra: ra,
      dec: dec
    };

    // 読み込み済みなら直ちに送信
    sendObservationDate();
    sendConstellationCenter();
  }

  // 星図の読み込み完了後に必要な情報を送信
  frame.addEventListener("load", function () {
    if (!isOpen || frame.src === "about:blank") {
      return;
    }

    frameReady = true;

    sendObservationDate();
    sendRadiantCoordinates();
    sendConstellationCenter();
  });

  // オーバーレイを閉じる
  function closeIndependentChart() {
    isOpen = false;
    frameReady = false;
    pendingObservationTimestamp = null;
    pendingConstellationCenter = null;
    updatePlanetariumButtonState();
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

  // 星空ガイドから呼び出す関数
  window.openPlanetarium = openPlanetarium;
  window.openPlanetariumAtDate = openPlanetariumAtDate;

  window.openPlanetariumAtConstellation =
    openPlanetariumAtConstellation;

  console.log("星図カードオーバーレイを初期化しました。");
})();
