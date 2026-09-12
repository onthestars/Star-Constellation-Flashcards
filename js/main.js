const cards = document.querySelectorAll('.card');
const pageIndicator = document.getElementById('pageIndicator');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const flipBtn = document.getElementById('flipBtn');

let currentIndex = 0;
let isBack = false;

function updateView() {
  cards.forEach(card => card.style.display = "none");
  const card = cards[currentIndex];
  card.style.display = "block";

  const flipInner = card.querySelector('.flip-inner');
  flipInner.classList.toggle('flipped', isBack);

  pageIndicator.textContent =
    `カード ${currentIndex + 1} / ${cards.length} ｜ ` +
    (isBack ? '裏面' : '表面');

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === cards.length - 1;
}

function animatePageTurn(oldIndex, newIndex, direction) {
  const oldCard = cards[oldIndex];
  const newCard = cards[newIndex];

  const oldWrap = oldCard.querySelector('.page-wrapper');
  const newWrap = newCard.querySelector('.page-wrapper');

  newCard.style.display = "block";

  // 方向ごとに transform-origin を切り替える
  if (direction === "next") {
    // 次へ：右ページをめくるイメージ（右→左）
    oldWrap.style.transformOrigin = "right center";
    newWrap.style.transformOrigin = "right center";

    oldWrap.style.animationName = "page-turn-old-next";
    newWrap.style.animationName = "page-turn-new-next";
  } else {
    // 前へ：左ページをめくるイメージ（左→右）
    oldWrap.style.transformOrigin = "left center";
    newWrap.style.transformOrigin = "left center";

    oldWrap.style.animationName = "page-turn-old-prev";
    newWrap.style.animationName = "page-turn-new-prev";
  }

  oldWrap.classList.add("page-turn");
  newWrap.classList.add("page-turn");

  setTimeout(() => {
    oldCard.style.display = "none";
    oldWrap.classList.remove("page-turn");
    newWrap.classList.remove("page-turn");
  }, 600);
}

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    const oldIndex = currentIndex;
    currentIndex--;
    isBack = false;

    animatePageTurn(oldIndex, currentIndex, "prev");
    updateView();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentIndex < cards.length - 1) {
    const oldIndex = currentIndex;
    currentIndex++;
    isBack = false;

    animatePageTurn(oldIndex, currentIndex, "next");
    updateView();
  }
});

flipBtn.addEventListener('click', () => {
  isBack = !isBack;
  updateView();
});

function showCardWithFade(index) {
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => card.style.display = 'none');

  const target = cards[index];
  target.style.display = 'block';

  // 一度クラスを消してから付ける（連続押しでも発火させる）
  target.classList.remove('fade-in');
  void target.offsetWidth; // ← 強制再描画（重要）
  target.classList.add('fade-in');
}

function jumpToSeason(season) {
  // DOM上で最初に出てくる、その季節のカードを探す
  const targetIndex = [...cards].findIndex(card => card.dataset.season === season);
  if (targetIndex === -1) return;  // その季節がなければ何もしない

  currentIndex = targetIndex;
  showCardWithFade(currentIndex);  // ← フェードインで表示する
}

// ボタンにイベントを付ける
document.getElementById("springBtn").onclick = () => jumpToSeason("spring");
document.getElementById("summerBtn").onclick = () => jumpToSeason("summer");
document.getElementById("autumnBtn").onclick = () => jumpToSeason("autumn");
document.getElementById("winterBtn").onclick = () => jumpToSeason("winter");
document.getElementById("southBtn").onclick = () => jumpToSeason("south");

updateView();