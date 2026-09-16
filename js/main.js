const cards = document.querySelectorAll('.card');
const pageIndicator = document.getElementById('pageIndicator');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const flipBtn = document.getElementById('flipBtn');

let currentIndex = 0;
let isBack = false;

function updateView() {
  // すべて非表示
  cards.forEach(card => card.style.display = "none");

  // 現在のカードだけ表示
  const card = cards[currentIndex];
  card.style.display = "block";

  // 表裏の反転
  const flipInner = card.querySelector('.flip-inner');
  flipInner.classList.toggle('flipped', isBack);

  // インジケーター更新
  pageIndicator.textContent =
    `カード ${currentIndex + 1} / ${cards.length} ｜ ` +
    (isBack ? '裏面' : '表面');

  // ボタンの無効化
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === cards.length - 1;
}

// 前へ
prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    isBack = false;
    updateView();
  }
});

// 次へ
nextBtn.addEventListener('click', () => {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    isBack = false;
    updateView();
  }
});

// 表裏反転
flipBtn.addEventListener('click', () => {
  isBack = !isBack;
  updateView();
});

// ▼▼▼ ここから季節ジャンプ機能 ▼▼▼

// 指定した季節の最初のカードへジャンプ
function jumpToSeason(season) {
  const targetIndex = [...cards].findIndex(card => card.dataset.season === season);
  if (targetIndex === -1) return;  // その季節がなければ何もしない

  currentIndex = targetIndex;
  isBack = false;
  updateView();
}

// ボタンにイベントを付ける
document.getElementById("springBtn").onclick = () => jumpToSeason("spring");
document.getElementById("summerBtn").onclick = () => jumpToSeason("summer");
document.getElementById("autumnBtn").onclick = () => jumpToSeason("autumn");
document.getElementById("winterBtn").onclick = () => jumpToSeason("winter");
document.getElementById("southBtn").onclick = () => jumpToSeason("south");

// 初期表示
updateView();
