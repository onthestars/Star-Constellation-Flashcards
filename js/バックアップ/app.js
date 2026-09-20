// ===============================
// 星空カード：アプリ本体ロジック（app.js）
// ===============================

// HTML要素取得
const cardContainer = document.getElementById("card-container");
const pageInfo = document.getElementById("page-info");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const flipBtn = document.getElementById("flip-btn");

// 状態管理
let currentSeason = "spring";
let cards = [];
let currentIndex = 0;
let isFlipped = false;

// ===============================
// 画像パス生成（あなたのフォルダ構成に完全対応）
// ===============================
// 例：image/spring/Q/card-Leo-Q.png
function getImagePath(season, item) {
  if (!item.id) return "";

  // other フォルダは例外処理
  const base = item.other ? "image/other" : `image/${season}/Q`;

  return `${base}/card-${item.id}-Q.png`;
}

// ===============================
// カード生成（種類別）
// ===============================
function createCoverCard(item) {
  return `
    <div class="card">
      <div class="cover">
        <h2>${item.title}</h2>
      </div>
    </div>
  `;
}

function createLegendCard(item) {
  return `
    <div class="card">
      <div class="legend">
        <h2>${item.title}</h2>
        <p>星座カードの見方や記号の説明などをここに記載。</p>
      </div>
    </div>
  `;
}

function createStarCard(season, item) {
  const img = getImagePath(season, item);

  return `
    <div class="card">
      <div class="flip-inner">
        <div class="front">
          <h2>${item.name}</h2>
          ${img ? `<img src="${img}" alt="${item.name}">` : ""}
        </div>
        <div class="back">
          <h2>${item.name}</h2>
          <p>${item.description}</p>
        </div>
      </div>
    </div>
  `;
}

// ===============================
// 季節データ → カードHTML生成
// ===============================
function generateCards(season) {
  const data = cardData[season];
  const result = [];

  data.forEach(item => {
    if (item.type === "cover") {
      result.push(createCoverCard(item));
    } else if (item.type === "legend") {
      result.push(createLegendCard(item));
    } else {
      result.push(createStarCard(season, item));
    }
  });

  return result;
}

// ===============================
// カード表示更新
// ===============================
function updateCardDisplay() {
  cardContainer.innerHTML = cards[currentIndex];

  pageInfo.textContent =
    `${currentIndex + 1} / ${cards.length}（${seasonLabel(currentSeason)}）`;

  const flipInner = cardContainer.querySelector(".flip-inner");
  if (flipInner) {
    flipInner.classList.toggle("flipped", isFlipped);
  }
}

// ===============================
// 季節ラベル
// ===============================
function seasonLabel(season) {
  switch (season) {
    case "spring": return "春";
    case "summer": return "夏";
    case "autumn": return "秋";
    case "winter": return "冬";
    case "south": return "南";
    default: return "";
  }
}

// ===============================
// 季節読み込み
// ===============================
function loadSeason(season) {
  currentSeason = season;
  cards = generateCards(season);
  currentIndex = 0;
  isFlipped = false;
  updateCardDisplay();
}

// ===============================
// ボタン操作
// ===============================
prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    isFlipped = false;
    updateCardDisplay();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    isFlipped = false;
    updateCardDisplay();
  }
});

flipBtn.addEventListener("click", () => {
  const flipInner = cardContainer.querySelector(".flip-inner");
  if (flipInner) {
    isFlipped = !isFlipped;
    flipInner.classList.toggle("flipped", isFlipped);
  }
});

// 季節ボタン
document.querySelectorAll("button[data-season]").forEach(btn => {
  btn.addEventListener("click", () => {
    const season = btn.getAttribute("data-season");
    loadSeason(season);
  });
});

// ===============================
// 初期表示：春
// ===============================
loadSeason("spring");
