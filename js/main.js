// js/main.js

// カードアニメーション初期化
animationControlsInit();

// 状態
let currentSeason = null;
let index = 0;
let isBack = false;
let isFinalNull = false;
let animationClass = null;

// DOM
const viewer = document.getElementById("card-img");
const prevBtn = document.getElementById("prevBtn");
const flipBtn = document.getElementById("flipBtn");
const nextBtn = document.getElementById("nextBtn");

const springBtn = document.getElementById("springBtn");
const summerBtn = document.getElementById("summerBtn");
const autumnBtn = document.getElementById("autumnBtn");
const winterBtn = document.getElementById("winterBtn");
const southBtn = document.getElementById("southBtn");

const specialBtn = document.getElementById("specialBtn");
const peteChartBtn = document.getElementById("peteChartBtn");

// 季節ジャンプ（フェードアウト → フェードイン）
function jumpToSeason(season) {

  viewer.classList.remove("flip-rotate");
  viewer.classList.remove("fade-out", "fade-in", "slide-out-left", "slide-out-right");
  void viewer.offsetWidth;
  viewer.classList.add("fade-out");

  setTimeout(() => {

    currentSeason = season;
    updateSeasonButtons(currentSeason, seasonImages);

    index = seasonStart[season];
    isBack = false;
    isFinalNull = false;

    viewer.classList.remove("fade-out");
    void viewer.offsetWidth;
    viewer.classList.add("fade-in");

    updateViewer(
      index,
      isBack,
      viewer,
      specialBtn,
      prevBtn,
      nextBtn,
      peteChartBtn
    );

  }, 300);
}

// ▼ viewer.js のセットアップ
setupViewerClick(viewer, () => index);
setupPeteChartButton(peteChartBtn);

setupFlipButton(
  flipBtn,
  viewer,
  () => index,
  () => isBack,
  (v) => { isBack = v; },
  specialBtn,
  prevBtn,
  nextBtn,
  peteChartBtn
);

// ▼ navigation.js のセットアップ
setupNavigation(
  nextBtn,
  prevBtn,
  viewer,
  () => index,
  (v) => { index = v; },
  () => isBack,
  (v) => { isBack = v; },
  () => isFinalNull,
  (v) => { isFinalNull = v; },
  () => currentSeason,
  (v) => { currentSeason = v; },
  () => animationClass,
  (v) => { animationClass = v; },
  (idx, back) => updateViewer(
    idx,
    back,
    viewer,
    specialBtn,
    prevBtn,
    nextBtn,
    peteChartBtn
  ),
  () => updateSeasonButtons(currentSeason, seasonImages)
);

// ▼ 季節ボタン
springBtn.onclick = () => {
  animationClass = "fade-in";
  jumpToSeason("spring");
};

summerBtn.onclick = () => {
  animationClass = "fade-in";
  jumpToSeason("summer");
};

autumnBtn.onclick = () => {
  animationClass = "fade-in";
  jumpToSeason("autumn");
};

winterBtn.onclick = () => {
  animationClass = "fade-in";
  jumpToSeason("winter");
};

southBtn.onclick = () => {
  animationClass = "fade-in";
  jumpToSeason("south");
};

// 外部リンクから戻った場合の復帰処理
window.addEventListener("load", () => {

  if (sessionStorage.getItem("fromExternal") === "true") {

    const saved = sessionStorage.getItem("lastCardIndex");
    index = (saved !== null) ? Number(saved) : 0;

    sessionStorage.removeItem("fromExternal");

  } else {
    index = 0;
  }

  isBack = false;
  isFinalNull = false;

  updateViewer(
    index,
    isBack,
    viewer,
    specialBtn,
    prevBtn,
    nextBtn,
    peteChartBtn
  );
});

// ▼ 今夜の月ガイド
updateMoonObservation();
initMoonObservationPanel();

// =================================
// 星座カードパネルの開閉
// =================================

// =================================
// パネルを最前面に表示
// =================================

let highestPanelZIndex = 10000;

window.bringPanelToFront = function (panel) {

  if (!panel) return;

  highestPanelZIndex++;

  panel.style.zIndex = highestPanelZIndex;

};

function initConstellationCardPanel() {

  const panel = document.querySelector(
    ".constellation-card-panel"
  );

  const closeButton = document.getElementById(
    "cardPanelCloseBtn"
  );

  const showButton = document.getElementById(
    "showCardBtn"
  );

  // 再表示ボタンの状態を更新
  function updateShowButtonState() {

    if (!panel || !showButton) {
      return;
    }

    const isVisible =
      getComputedStyle(panel).display !== "none";

    showButton.style.opacity =
      isVisible ? 0.4 : 1;
  }

  // 閉じるボタン
  if (
    closeButton &&
    panel &&
    !closeButton.dataset.initialized
  ) {

    closeButton.addEventListener("click", function () {

      panel.style.display = "none";

      updateShowButtonState();

    });

    closeButton.dataset.initialized = "true";
  }

  // 再表示ボタン
  if (
    showButton &&
    panel &&
    !showButton.dataset.initialized
  ) {

    showButton.addEventListener("click", function () {
      panel.style.display = "flex";

      window.bringPanelToFront(panel);

      panel.classList.remove("panel-fade-in");
      void panel.offsetWidth;
      panel.classList.add("panel-fade-in");
      updateShowButtonState();
    });

    showButton.dataset.initialized = "true";
  }

  // 初期状態を反映
  updateShowButtonState();
}

// 星座カードパネルの初期化
initConstellationCardPanel();

// =================================
// 観測地点の共通管理
// =================================

const OBSERVATION_LOCATION_KEY =
  "starConstellationObservationLocation";

// 観測地点データ
const OBSERVATION_LOCATIONS = {

  // 大阪府
  "osaka-north": {
    prefecture: "大阪府",
    region: "北部",
    name: "豊能町役場",
    latitude: 34.918859,
    longitude: 135.494068
  },
  "osaka-central": {
    prefecture: "大阪府",
    region: "中部",
    name: "吹田市役所",
    latitude: 34.759456,
    longitude: 135.516883
  },
  "osaka-south": {
    prefecture: "大阪府",
    region: "南部",
    name: "泉南市役所",
    latitude: 34.365951,
    longitude: 135.273406
  },

  // 兵庫県
  "hyogo-north": {
    prefecture: "兵庫県",
    region: "北部",
    name: "豊岡市役所",
    latitude: 35.544485,
    longitude: 134.820151
  },
  "hyogo-central": {
    prefecture: "兵庫県",
    region: "中部",
    name: "三田市役所",
    latitude: 34.889879,
    longitude: 135.225392
  },
  "hyogo-south": {
    prefecture: "兵庫県",
    region: "南部",
    name: "西宮市役所",
    latitude: 34.737545,
    longitude: 135.341441
  },

  // 京都府
  "kyoto-north": {
    prefecture: "京都府",
    region: "北部",
    name: "舞鶴市役所",
    latitude: 35.474655,
    longitude: 135.386148
  },
  "kyoto-central": {
    prefecture: "京都府",
    region: "中部",
    name: "亀岡市役所",
    latitude: 35.013530,
    longitude: 135.573309
  },
  "kyoto-south": {
    prefecture: "京都府",
    region: "南部",
    name: "和束町役場",
    latitude: 34.795757,
    longitude: 135.905050
  },

  // 滋賀県
  "shiga-north": {
    prefecture: "滋賀県",
    region: "北部",
    name: "長浜市役所",
    latitude: 35.380763,
    longitude: 136.278568
  },
  "shiga-central": {
    prefecture: "滋賀県",
    region: "中部",
    name: "近江八幡市役所",
    latitude: 35.128222,
    longitude: 136.097729
  },
  "shiga-south": {
    prefecture: "滋賀県",
    region: "南部",
    name: "甲賀市役所",
    latitude: 34.966276,
    longitude: 136.166628
  },

  // 奈良県
  "nara-north": {
    prefecture: "奈良県",
    region: "北部",
    name: "奈良市役所",
    latitude: 34.685136,
    longitude: 135.804834
  },
  "nara-central": {
    prefecture: "奈良県",
    region: "中部",
    name: "五條市役所",
    latitude: 34.356048,
    longitude: 135.695688
  },
  "nara-south": {
    prefecture: "奈良県",
    region: "南部",
    name: "十津川村役場",
    latitude: 33.988538,
    longitude: 135.792589
  },

  // 三重県
  "mie-north": {
    prefecture: "三重県",
    region: "北部",
    name: "いなべ市役所",
    latitude: 35.158181,
    longitude: 136.516895
  },
  "mie-central": {
    prefecture: "三重県",
    region: "中部",
    name: "津市役所",
    latitude: 34.718264,
    longitude: 136.505714
  },
  "mie-south": {
    prefecture: "三重県",
    region: "南部",
    name: "熊野市役所",
    latitude: 33.888772,
    longitude: 136.100279
  },

  // 和歌山県
  "wakayama-north": {
    prefecture: "和歌山県",
    region: "北部",
    name: "和歌山市役所",
    latitude: 34.230277,
    longitude: 135.170865
  },
  "wakayama-central": {
    prefecture: "和歌山県",
    region: "中部",
    name: "田辺市役所",
    latitude: 33.729379,
    longitude: 135.389206
  },
  "wakayama-south": {
    prefecture: "和歌山県",
    region: "南部",
    name: "串本町役場",
    latitude: 33.485801,
    longitude: 135.786985
  },

  // 愛知県
  "aichi-north": {
    prefecture: "愛知県",
    region: "北部",
    name: "犬山市役所",
    latitude: 35.378617,
    longitude: 136.944504
  },
  "aichi-central": {
    prefecture: "愛知県",
    region: "中部",
    name: "豊田市役所",
    latitude: 35.082508,
    longitude: 137.156080
  },
  "aichi-south": {
    prefecture: "愛知県",
    region: "南部",
    name: "田原市役所",
    latitude: 34.668790,
    longitude: 137.264121
  },

  // 神奈川県
  "kanagawa-west": {
    prefecture: "神奈川県",
    region: "西部",
    name: "箱根町役場",
    latitude: 35.232359,
    longitude: 139.107202
  },
  "kanagawa-central": {
    prefecture: "神奈川県",
    region: "中部",
    name: "平塚市役所",
    latitude: 35.335067,
    longitude: 139.349473
  },
  "kanagawa-east": {
    prefecture: "神奈川県",
    region: "東部",
    name: "川崎市役所",
    latitude: 35.530822,
    longitude: 139.703002
  }

};


// 旧データとの互換性
const LEGACY_OBSERVATION_LOCATION_IDS = {
  osaka: "osaka-central",
  nose: "osaka-north",
  suita: "osaka-central",
  kumatori: "osaka-south"
};


// 保存された観測地点IDを取得
function getSavedObservationLocationId() {

  const savedId = localStorage.getItem(
    OBSERVATION_LOCATION_KEY
  );

  // 旧IDを新IDに変換
  const locationId =
    LEGACY_OBSERVATION_LOCATION_IDS[savedId] ||
    savedId;

  // 不正な値の場合は大阪府中部
  if (!OBSERVATION_LOCATIONS[locationId]) {
    return "osaka-central";
  }

  return locationId;
}


// 保存された観測地点を取得
function getObservationLocation() {

  const locationId =
    getSavedObservationLocationId();

  return OBSERVATION_LOCATIONS[locationId];
}


// 観測地点を保存
function setObservationLocation(locationId) {

  if (!OBSERVATION_LOCATIONS[locationId]) {
    return false;
  }

  localStorage.setItem(
    OBSERVATION_LOCATION_KEY,
    locationId
  );

  const location = OBSERVATION_LOCATIONS[locationId];

  // 星空ガイドの観測地点を更新
  if (typeof window.setStarGuideObserver === "function") {
    window.setStarGuideObserver(
      location.latitude,
      location.longitude
    );
  }

  // 星空ガイドの基準地表示を更新
  updateObservationLocationLabel(location);

  // 観測地点の変更をほかのパネルへ通知
window.dispatchEvent(
  new CustomEvent("observation-location-changed", {
    detail: location
  })
);

  return true;
}


// 他のJSファイルから利用できるようにする
window.getObservationLocation =
  getObservationLocation;

window.setObservationLocation =
  setObservationLocation;


// =================================
// 観測地点選択欄の初期化
// =================================

function initObservationLocationSetting() {

  const radioButtons = document.querySelectorAll(
    'input[name="observation-location"]'
  );

  if (!radioButtons.length) return;

  // 保存済みの観測地点を取得
  const savedLocationId =
    getSavedObservationLocationId();

  // 保存値をラジオボタンに反映
  radioButtons.forEach(function (radio) {

    radio.checked =
      radio.value === savedLocationId;

    // イベントの重複登録を防止
    if (radio.dataset.initialized) return;

    radio.addEventListener("change", function () {

      if (!radio.checked) return;

      setObservationLocation(radio.value);

    });

    radio.dataset.initialized = "true";

  });

  // 保存済みのIDを新形式で保存
  setObservationLocation(savedLocationId);

}

// =================================
// 星空ガイド・プラネタリウムの基準地表示
// =================================

function updateObservationLocationLabel(location) {

  if (!location) return;

  // 星空ガイド
  const starGuideLabel = document.getElementById(
    "star-guide-location"
  );

  if (starGuideLabel) {
    starGuideLabel.textContent =
      `${location.prefecture}${location.region}`;
  }

  // プラネタリウム
  const planetariumLabel = document.getElementById(
    "independent-chart-location"
  );

  if (planetariumLabel) {
    planetariumLabel.textContent =
      `${location.prefecture}${location.region}`;
  }
}

// 観測地点選択欄を初期化
initObservationLocationSetting();

// =================================
// 設定パネルの開閉
// =================================

function initSettingPanel() {

  const panel = document.getElementById(
    "setting-panel"
  );

  const closeButton = document.getElementById(
    "settingPanelCloseBtn"
  );

  const showButton = document.getElementById(
    "showSettingBtn"
  );

  // 再表示ボタンの状態を更新
  function updateShowButtonState() {

    if (!panel || !showButton) {
      return;
    }

    const isVisible =
      getComputedStyle(panel).display !== "none";

    showButton.style.opacity =
      isVisible ? 0.4 : 1;
  }

  // 閉じるボタン
  if (
    closeButton &&
    panel &&
    !closeButton.dataset.initialized
  ) {

    closeButton.addEventListener("click", function () {

      panel.style.display = "none";

      updateShowButtonState();

    });

    closeButton.dataset.initialized = "true";
  }

  // 設定ボタン
  if (
    showButton &&
    panel &&
    !showButton.dataset.initialized
  ) {

    showButton.addEventListener("click", function () {

      panel.style.display = "flex";

      window.bringPanelToFront(panel);

      // 共通アニメーションを再実行
      panel.classList.remove("panel-fade-in");
      void panel.offsetWidth;
      panel.classList.add("panel-fade-in");

      updateShowButtonState();

    });

    showButton.dataset.initialized = "true";
  }

  // 初期状態を反映
  updateShowButtonState();
}

// 設定パネルの初期化
initSettingPanel();

// =================================
// プラネタリウムパネルの表示
// =================================

const showPlanetariumBtn = document.getElementById(
  "showPlanetariumBtn"
);

if (showPlanetariumBtn) {

  showPlanetariumBtn.addEventListener("click", function () {

    if (typeof window.openPlanetarium === "function") {
      window.openPlanetarium();
    }

  });

}

// ▼ 凡例へ移動
function jumpToExplanatoryNote() {

  viewer.classList.remove(
    "fade-out",
    "fade-in",
    "slide-out-left",
    "slide-out-right"
  );

  void viewer.offsetWidth;

  viewer.classList.add("fade-out");

  setTimeout(() => {

    index = 1;
    isBack = false;
    isFinalNull = false;

    viewer.classList.remove("fade-out");

    void viewer.offsetWidth;

    viewer.classList.add("fade-in");

    updateViewer(
      index,
      isBack,
      viewer,
      specialBtn,
      prevBtn,
      nextBtn,
      peteChartBtn
    );

  }, 300);
}