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
  viewer.classList.remove(
    "fade-out",
    "fade-in",
    "slide-out-left",
    "slide-out-right",
  );
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
      peteChartBtn,
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
  (v) => {
    isBack = v;
  },
  specialBtn,
  prevBtn,
  nextBtn,
  peteChartBtn,
);

// ▼ navigation.js のセットアップ
setupNavigation(
  nextBtn,
  prevBtn,
  viewer,
  () => index,
  (v) => {
    index = v;
  },
  () => isBack,
  (v) => {
    isBack = v;
  },
  () => isFinalNull,
  (v) => {
    isFinalNull = v;
  },
  () => currentSeason,
  (v) => {
    currentSeason = v;
  },
  () => animationClass,
  (v) => {
    animationClass = v;
  },
  (idx, back) =>
    updateViewer(idx, back, viewer, specialBtn, prevBtn, nextBtn, peteChartBtn),
  () => updateSeasonButtons(currentSeason, seasonImages),
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
    index = saved !== null ? Number(saved) : 0;

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
    peteChartBtn,
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
  const panel = document.querySelector(".constellation-card-panel");

  const closeButton = document.getElementById("cardPanelCloseBtn");

  const showButton = document.getElementById("showCardBtn");

  // 再表示ボタンの状態を更新
  function updateShowButtonState() {
    if (!panel || !showButton) {
      return;
    }

    const isVisible = getComputedStyle(panel).display !== "none";

    showButton.style.opacity = isVisible ? 0.4 : 1;
  }

  // 閉じるボタン（星座カードパネル）
  if (closeButton && panel && !closeButton.dataset.initialized) {
    closeButton.addEventListener("click", function () {
      panel.style.display = "none";

      updateShowButtonState();
    });

    closeButton.dataset.initialized = "true";
  }

  // Escapeキーでも閉じる
if (panel && !panel.dataset.escapeInitialized) {
  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      getComputedStyle(panel).display !== "none"
    ) {
      panel.style.display = "none";

      updateShowButtonState();
    }
  });

  panel.dataset.escapeInitialized = "true";
}

  // 再表示ボタン
  if (showButton && panel && !showButton.dataset.initialized) {
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

const OBSERVATION_LOCATION_KEY = "starConstellationObservationLocation";

// 観測地点データ
const OBSERVATION_LOCATIONS = {
  // ================================
  // 北海道・東北地方
  // ================================

  hokkaido: {
    prefecture: "北海道",
    name: "札幌市",
    displayName: "北海道／札幌市",
    group: "北海道・東北地方",
    latitude: 43.06417,
    longitude: 141.34694,
  },
  aomori: {
    prefecture: "青森県",
    name: "青森市",
    displayName: "青森県／青森市",
    group: "北海道・東北地方",
    latitude: 40.82444,
    longitude: 140.74,
  },
  iwate: {
    prefecture: "岩手県",
    name: "盛岡市",
    displayName: "岩手県／盛岡市",
    group: "北海道・東北地方",
    latitude: 39.70361,
    longitude: 141.1525,
  },
  miyagi: {
    prefecture: "宮城県",
    name: "仙台市",
    displayName: "宮城県／仙台市",
    group: "北海道・東北地方",
    latitude: 38.26889,
    longitude: 140.87194,
  },
  akita: {
    prefecture: "秋田県",
    name: "秋田市",
    displayName: "秋田県／秋田市",
    group: "北海道・東北地方",
    latitude: 39.71861,
    longitude: 140.1025,
  },
  yamagata: {
    prefecture: "山形県",
    name: "山形市",
    displayName: "山形県／山形市",
    group: "北海道・東北地方",
    latitude: 38.24056,
    longitude: 140.36333,
  },
  fukushima: {
    prefecture: "福島県",
    name: "福島市",
    displayName: "福島県／福島市",
    group: "北海道・東北地方",
    latitude: 37.75,
    longitude: 140.46778,
  },

  // ================================
  // 関東地方
  // ================================

  ibaraki: {
    prefecture: "茨城県",
    name: "水戸市",
    displayName: "茨城県／水戸市",
    group: "関東地方",
    latitude: 36.34139,
    longitude: 140.44667,
  },
  tochigi: {
    prefecture: "栃木県",
    name: "宇都宮市",
    displayName: "栃木県／宇都宮市",
    group: "関東地方",
    latitude: 36.56583,
    longitude: 139.88361,
  },
  gunma: {
    prefecture: "群馬県",
    name: "前橋市",
    displayName: "群馬県／前橋市",
    group: "関東地方",
    latitude: 36.39111,
    longitude: 139.06083,
  },
  saitama: {
    prefecture: "埼玉県",
    name: "さいたま市",
    displayName: "埼玉県／さいたま市",
    group: "関東地方",
    latitude: 35.85694,
    longitude: 139.64889,
  },
  chiba: {
    prefecture: "千葉県",
    name: "千葉市",
    displayName: "千葉県／千葉市",
    group: "関東地方",
    latitude: 35.60472,
    longitude: 140.12333,
  },
  tokyo: {
    prefecture: "東京都",
    name: "新宿区",
    displayName: "東京都／新宿区",
    group: "関東地方",
    latitude: 35.68944,
    longitude: 139.69167,
  },
  kanagawa: {
    prefecture: "神奈川県",
    name: "横浜市",
    displayName: "神奈川県／横浜市",
    group: "関東地方",
    latitude: 35.44778,
    longitude: 139.6425,
  },

  // ================================
  // 中部地方
  // ================================

  niigata: {
    prefecture: "新潟県",
    name: "新潟市",
    displayName: "新潟県／新潟市",
    group: "中部地方",
    latitude: 37.90222,
    longitude: 139.02361,
  },
  toyama: {
    prefecture: "富山県",
    name: "富山市",
    displayName: "富山県／富山市",
    group: "中部地方",
    latitude: 36.69528,
    longitude: 137.21139,
  },
  ishikawa: {
    prefecture: "石川県",
    name: "金沢市",
    displayName: "石川県／金沢市",
    group: "中部地方",
    latitude: 36.59444,
    longitude: 136.62556,
  },
  fukui: {
    prefecture: "福井県",
    name: "福井市",
    displayName: "福井県／福井市",
    group: "中部地方",
    latitude: 36.06528,
    longitude: 136.22194,
  },
  yamanashi: {
    prefecture: "山梨県",
    name: "甲府市",
    displayName: "山梨県／甲府市",
    group: "中部地方",
    latitude: 35.66389,
    longitude: 138.56833,
  },
  nagano: {
    prefecture: "長野県",
    name: "長野市",
    displayName: "長野県／長野市",
    group: "中部地方",
    latitude: 36.65139,
    longitude: 138.18111,
  },
  gifu: {
    prefecture: "岐阜県",
    name: "岐阜市",
    displayName: "岐阜県／岐阜市",
    group: "中部地方",
    latitude: 35.39111,
    longitude: 136.72222,
  },
  shizuoka: {
    prefecture: "静岡県",
    name: "静岡市",
    displayName: "静岡県／静岡市",
    group: "中部地方",
    latitude: 34.97694,
    longitude: 138.38306,
  },
  aichi: {
    prefecture: "愛知県",
    name: "名古屋市",
    displayName: "愛知県／名古屋市",
    group: "中部地方",
    latitude: 35.18028,
    longitude: 136.90667,
  },

  // ================================
  // 近畿地方
  // ================================

  mie: {
    prefecture: "三重県",
    name: "津市",
    displayName: "三重県／津市",
    group: "近畿地方",
    latitude: 34.73028,
    longitude: 136.50861,
  },
  shiga: {
    prefecture: "滋賀県",
    name: "大津市",
    displayName: "滋賀県／大津市",
    group: "近畿地方",
    latitude: 35.00444,
    longitude: 135.86833,
  },
  kyoto: {
    prefecture: "京都府",
    name: "京都市",
    displayName: "京都府／京都市",
    group: "近畿地方",
    latitude: 35.02139,
    longitude: 135.75556,
  },
  osaka: {
    prefecture: "大阪府",
    name: "大阪市",
    displayName: "大阪府／大阪市",
    group: "近畿地方",
    latitude: 34.68639,
    longitude: 135.52,
  },
  hyogo: {
    prefecture: "兵庫県",
    name: "神戸市",
    displayName: "兵庫県／神戸市",
    group: "近畿地方",
    latitude: 34.69139,
    longitude: 135.18306,
  },
  nara: {
    prefecture: "奈良県",
    name: "奈良市",
    displayName: "奈良県／奈良市",
    group: "近畿地方",
    latitude: 34.68528,
    longitude: 135.83278,
  },
  wakayama: {
    prefecture: "和歌山県",
    name: "和歌山市",
    displayName: "和歌山県／和歌山市",
    group: "近畿地方",
    latitude: 34.22611,
    longitude: 135.1675,
  },

  // ================================
  // 中国地方
  // ================================

  tottori: {
    prefecture: "鳥取県",
    name: "鳥取市",
    displayName: "鳥取県／鳥取市",
    group: "中国地方",
    latitude: 35.50361,
    longitude: 134.23833,
  },
  shimane: {
    prefecture: "島根県",
    name: "松江市",
    displayName: "島根県／松江市",
    group: "中国地方",
    latitude: 35.47222,
    longitude: 133.05056,
  },
  okayama: {
    prefecture: "岡山県",
    name: "岡山市",
    displayName: "岡山県／岡山市",
    group: "中国地方",
    latitude: 34.66167,
    longitude: 133.935,
  },
  hiroshima: {
    prefecture: "広島県",
    name: "広島市",
    displayName: "広島県／広島市",
    group: "中国地方",
    latitude: 34.39639,
    longitude: 132.45944,
  },
  yamaguchi: {
    prefecture: "山口県",
    name: "山口市",
    displayName: "山口県／山口市",
    group: "中国地方",
    latitude: 34.18583,
    longitude: 131.47139,
  },

  // ================================
  // 四国地方
  // ================================

  tokushima: {
    prefecture: "徳島県",
    name: "徳島市",
    displayName: "徳島県／徳島市",
    group: "四国地方",
    latitude: 34.06583,
    longitude: 134.55944,
  },
  kagawa: {
    prefecture: "香川県",
    name: "高松市",
    displayName: "香川県／高松市",
    group: "四国地方",
    latitude: 34.34028,
    longitude: 134.04333,
  },
  ehime: {
    prefecture: "愛媛県",
    name: "松山市",
    displayName: "愛媛県／松山市",
    group: "四国地方",
    latitude: 33.84167,
    longitude: 132.76611,
  },
  kochi: {
    prefecture: "高知県",
    name: "高知市",
    displayName: "高知県／高知市",
    group: "四国地方",
    latitude: 33.55972,
    longitude: 133.53111,
  },

  // ================================
  // 九州・沖縄地方
  // ================================

  fukuoka: {
    prefecture: "福岡県",
    name: "福岡市",
    displayName: "福岡県／福岡市",
    group: "九州・沖縄地方",
    latitude: 33.60639,
    longitude: 130.41806,
  },
  saga: {
    prefecture: "佐賀県",
    name: "佐賀市",
    displayName: "佐賀県／佐賀市",
    group: "九州・沖縄地方",
    latitude: 33.24944,
    longitude: 130.29889,
  },
  nagasaki: {
    prefecture: "長崎県",
    name: "長崎市",
    displayName: "長崎県／長崎市",
    group: "九州・沖縄地方",
    latitude: 32.74472,
    longitude: 129.87361,
  },
  kumamoto: {
    prefecture: "熊本県",
    name: "熊本市",
    displayName: "熊本県／熊本市",
    group: "九州・沖縄地方",
    latitude: 32.78972,
    longitude: 130.74167,
  },
  oita: {
    prefecture: "大分県",
    name: "大分市",
    displayName: "大分県／大分市",
    group: "九州・沖縄地方",
    latitude: 33.23806,
    longitude: 131.6125,
  },
  miyazaki: {
    prefecture: "宮崎県",
    name: "宮崎市",
    displayName: "宮崎県／宮崎市",
    group: "九州・沖縄地方",
    latitude: 31.91111,
    longitude: 131.42389,
  },
  kagoshima: {
    prefecture: "鹿児島県",
    name: "鹿児島市",
    displayName: "鹿児島県／鹿児島市",
    group: "九州・沖縄地方",
    latitude: 31.56028,
    longitude: 130.55806,
  },
  okinawa: {
    prefecture: "沖縄県",
    name: "那覇市",
    displayName: "沖縄県／那覇市",
    group: "九州・沖縄地方",
    latitude: 26.2125,
    longitude: 127.68111,
  },

  // ================================
  // 海外・その他
  // ================================

  "north-pole": {
    prefecture: "北極点",
    name: "北極点",
    displayName: "北極点",
    group: "海外・その他",
    latitude: 90,
    longitude: 0,
  },
  "south-pole": {
    prefecture: "南極点",
    name: "南極点",
    displayName: "南極点",
    group: "海外・その他",
    latitude: -90,
    longitude: 0,
  },
  "brazil-rio": {
    prefecture: "ブラジル",
    name: "リオ",
    displayName: "ブラジル／リオ",
    group: "海外・その他",
    latitude: -22.9068,
    longitude: -43.1729,
  },
};

// 保存された観測地点IDを取得
function getSavedObservationLocationId() {
  const savedId = localStorage.getItem(OBSERVATION_LOCATION_KEY);

  // 有効な保存データがなければ大阪府を初期地点にする
  if (!OBSERVATION_LOCATIONS[savedId]) {
    return "osaka";
  }

  return savedId;
}

// 保存された観測地点を取得
function getObservationLocation() {
  const locationId = getSavedObservationLocationId();

  return OBSERVATION_LOCATIONS[locationId];
}

// 観測地点を保存
function setObservationLocation(locationId) {
  if (!OBSERVATION_LOCATIONS[locationId]) {
    return false;
  }

  localStorage.setItem(OBSERVATION_LOCATION_KEY, locationId);

  const location = OBSERVATION_LOCATIONS[locationId];

  // 座標が設定されている場合のみ星空ガイドの観測地点を更新
  if (
    Number.isFinite(location.latitude) &&
    Number.isFinite(location.longitude) &&
    typeof window.setStarGuideObserver === "function"
  ) {
    window.setStarGuideObserver(location.latitude, location.longitude);

    // 座標が有効な場合のみ、ほかのパネルへ変更を通知
    window.dispatchEvent(
      new CustomEvent("observation-location-changed", {
        detail: location,
      }),
    );
  }

  // 星空ガイド・プラネタリウムの基準地表示を更新
  updateObservationLocationLabel(location);

  return true;
}

// 他のJSファイルから利用できるようにする
window.getObservationLocation = getObservationLocation;

window.setObservationLocation = setObservationLocation;

// =================================
// 共有機能用・一時的な観測地点変更
// =================================

// 一時的に適用している観測地点
let temporaryObservationLocationId = null;

// 保存されている観測地点IDを取得
window.getSavedObservationLocationId = getSavedObservationLocationId;

// 現在有効な観測地点を取得
window.getEffectiveObservationLocation = function () {
  const locationId =
    temporaryObservationLocationId || getSavedObservationLocationId();

  return OBSERVATION_LOCATIONS[locationId];
};

// 保存せずに、両パネルの観測地点を一時変更
window.setTemporaryObservationLocation = function (locationId) {
  const location = OBSERVATION_LOCATIONS[locationId];

  if (
    !location ||
    !Number.isFinite(location.latitude) ||
    !Number.isFinite(location.longitude) ||
    typeof window.setStarGuideObserver !== "function"
  ) {
    return false;
  }

  // 一時適用する地点IDを記録
  temporaryObservationLocationId = locationId;

  // 星空ガイドの観測地点を変更
  window.setStarGuideObserver(location.latitude, location.longitude);

  // 両パネルへ観測地点の変更を通知
  window.dispatchEvent(
    new CustomEvent("observation-location-changed", {
      detail: location,
    }),
  );

  // 両パネルの地点表示を更新
  updateObservationLocationLabel(location);

  // localStorageには保存しない
  return true;
};

// 一時変更を解除
window.clearTemporaryObservationLocation = function () {
  temporaryObservationLocationId = null;

  const location = getObservationLocation();

  if (!location) return false;

  // 元の地点に戻す
  window.setStarGuideObserver(location.latitude, location.longitude);

  window.dispatchEvent(
    new CustomEvent("observation-location-changed", {
      detail: location,
    }),
  );

  updateObservationLocationLabel(location);

  return true;
};

// =================================
// 観測地点選択欄の初期化
// =================================

function initObservationLocationSetting() {
  const container = document.getElementById("observation-location-list");

  if (!container) return;

  // 地方の表示順
  const regionOrder = [
    "北海道・東北地方",
    "関東地方",
    "中部地方",
    "近畿地方",
    "中国地方",
    "四国地方",
    "九州・沖縄地方",
    "海外・その他",
  ];

  // 保存済みの観測地点
  const savedLocationId = getSavedObservationLocationId();

  // 地方ごとに地点を分類
  const groupedLocations = {};

  Object.entries(OBSERVATION_LOCATIONS).forEach(function ([id, location]) {
    const group = location.group;

    if (!groupedLocations[group]) {
      groupedLocations[group] = [];
    }

    groupedLocations[group].push({
      id: id,
      location: location,
    });
  });

  // 一覧を生成
  container.innerHTML = "";

  regionOrder.forEach(function (groupName) {
    const locations = groupedLocations[groupName];

    if (!locations || !locations.length) return;

    const details = document.createElement("details");
    details.className = "observation-region";

    // 選択中の地点がある地方を最初から開く
    details.open = locations.some(function (item) {
      return item.id === savedLocationId;
    });

    const summary = document.createElement("summary");
    summary.textContent = groupName;

    details.appendChild(summary);

    const list = document.createElement("div");
    list.className = "observation-location-items";

    locations.forEach(function (item) {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "observation-location-item";
      button.dataset.locationId = item.id;

      button.textContent = item.location.displayName || item.location.name;

      button.setAttribute(
        "aria-pressed",
        item.id === savedLocationId ? "true" : "false",
      );

      if (item.id === savedLocationId) {
        button.classList.add("is-selected");
      }

      list.appendChild(button);
    });

    details.appendChild(list);
    container.appendChild(details);
  });

  // イベントの重複登録を防止
  if (!container.dataset.initialized) {
    container.addEventListener("click", function (event) {
      const button = event.target.closest(".observation-location-item");

      if (!button || !container.contains(button)) return;

      const locationId = button.dataset.locationId;

      if (!setObservationLocation(locationId)) return;

      // 選択状態を更新
      container
        .querySelectorAll(".observation-location-item")
        .forEach(function (item) {
          const selected = item.dataset.locationId === locationId;

          item.classList.toggle("is-selected", selected);

          item.setAttribute("aria-pressed", selected ? "true" : "false");
        });
    });

    container.dataset.initialized = "true";
  }

  // 保存済みの地点を反映
  setObservationLocation(savedLocationId);
}

// =================================
// 星空ガイド・プラネタリウムの基準地表示
// =================================

function updateObservationLocationLabel(location) {
  if (!location) return;

  const displayName = location.prefecture ? `（${location.prefecture}）` : "";

  // 星空ガイド
  const starGuideLabel = document.getElementById("star-guide-location");

  if (starGuideLabel) {
    starGuideLabel.textContent = displayName;
  }

  // プラネタリウム
  const planetariumLabel = document.getElementById(
    "independent-chart-location",
  );

  if (planetariumLabel) {
    planetariumLabel.textContent = displayName;
  }
}

// 観測地点選択欄を初期化
initObservationLocationSetting();

// =================================
// 設定パネルの開閉
// =================================

function initSettingPanel() {
  const panel = document.getElementById("setting-panel");

  const closeButton = document.getElementById("settingPanelCloseBtn");

  const showButton = document.getElementById("showSettingBtn");

  // 再表示ボタンの状態を更新
  function updateShowButtonState() {
    if (!panel || !showButton) {
      return;
    }

    const isVisible = getComputedStyle(panel).display !== "none";

    showButton.style.opacity = isVisible ? 0.4 : 1;
  }

  // 閉じるボタン（設定パネル）
  if (closeButton && panel && !closeButton.dataset.initialized) {
    closeButton.addEventListener("click", function () {
      panel.style.display = "none";

      updateShowButtonState();
    });

    closeButton.dataset.initialized = "true";
  }

    // Escapeキーでも閉じる
  if (panel && !panel.dataset.escapeInitialized) {
    document.addEventListener("keydown", function (event) {
      if (
        event.key === "Escape" &&
        getComputedStyle(panel).display !== "none"
      ) {
        panel.style.display = "none";

        updateShowButtonState();
      }
    });

    panel.dataset.escapeInitialized = "true";
  }

  // 設定ボタン
  if (showButton && panel && !showButton.dataset.initialized) {
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

const showPlanetariumBtn = document.getElementById("showPlanetariumBtn");

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
    "slide-out-right",
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
      peteChartBtn,
    );
  }, 300);
}

// =================================
// 星空ガイド共有URLの受け取り
// =================================

(function () {
  const params = new URLSearchParams(window.location.search);

  const locationId = params.get("guideLocation");
  const observationDate = params.get("guideDate");

  // 星空ガイド共有URLでなければ何もしない
  if (!locationId || !observationDate) {
    return;
  }

  // 日付の形式を確認
  if (!/^\d{4}-\d{2}-\d{2}$/.test(observationDate)) {
    return;
  }

  // 元の設定を取得する関数があるか確認
  if (
    typeof window.getSavedObservationLocationId !== "function" ||
    typeof window.getStarGuideObservationDate !== "function"
  ) {
    return;
  }

  // =================================
  // 共有前の設定を一時退避
  // =================================

  window.starGuideSharedState = {
    active: true,

    originalLocationId: window.getSavedObservationLocationId(),

    originalObservationDate: window.getStarGuideObservationDate(),
  };

  // =================================
  // 共有された設定を一時適用
  // =================================

  if (
    typeof window.setTemporaryObservationLocation !== "function" ||
    !window.setTemporaryObservationLocation(locationId)
  ) {
    return;
  }

  if (
    typeof window.setStarGuideObservationDate !== "function" ||
    !window.setStarGuideObservationDate(observationDate)
  ) {
    window.clearTemporaryObservationLocation();
    return;
  }

  // 星空ガイドを自動表示
  if (typeof window.openStarGuide === "function") {
    window.openStarGuide();
  }

  // =================================
  // 共有URLを開いたときの通知
  // =================================

  const shareNotice = document.getElementById("star-guide-share-notice");

  const shareNoticeClose = document.getElementById(
    "star-guide-share-notice-close",
  );

  let shareNoticeTimer = null;

  // 通知を閉じる
  function hideStarGuideShareNotice() {
    if (shareNotice) {
      shareNotice.hidden = true;
    }

    if (shareNoticeTimer !== null) {
      clearTimeout(shareNoticeTimer);
      shareNoticeTimer = null;
    }
  }

  // 通知を表示する
  if (shareNotice) {
    shareNotice.hidden = false;

    shareNoticeTimer = setTimeout(() => {
      hideStarGuideShareNotice();
    }, 6000);
  }

  // ×ボタン
  if (shareNoticeClose) {
    shareNoticeClose.addEventListener("click", hideStarGuideShareNotice);
  }
})();

// =================================
// 星空ガイド共有状態の解除・復元
// =================================

window.restoreStarGuideSharedState = function () {
  const sharedState = window.starGuideSharedState;

  // 共有状態が有効でなければ何もしない
  if (!sharedState || !sharedState.active) {
    return false;
  }

  // 星空ガイドの表示状態
  const guidePanel = document.getElementById("star-guide-panel");

  // プラネタリウムの表示状態
  const planetariumPanel = document.getElementById("independent-chart-overlay");

  const guideIsOpen =
    guidePanel && window.getComputedStyle(guidePanel).display !== "none";

  const planetariumIsOpen =
    planetariumPanel &&
    window.getComputedStyle(planetariumPanel).display !== "none";

  // どちらか一方でも開いていれば復元しない
  if (guideIsOpen || planetariumIsOpen) {
    return false;
  }

  // 元の観測地点に戻す
  if (typeof window.clearTemporaryObservationLocation === "function") {
    window.clearTemporaryObservationLocation();
  }

  // 共有状態を解除
  sharedState.active = false;

  // 元の星空ガイド選択日に戻す
  if (typeof window.setStarGuideObservationDate === "function") {
    window.setStarGuideObservationDate(sharedState.originalObservationDate);
  }

  // 共有状態を解除
  sharedState.active = false;

  console.log("星空ガイド共有状態を解除しました。");

  return true;
};
