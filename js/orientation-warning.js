// orientation-warning.js

function isSmartphone() {
  return /iPhone|Android.+Mobile/.test(navigator.userAgent);
}

function updateOrientationWarning() {
  const warn = document.getElementById("rotate-warning");
  const copyright = document.getElementById("copyright");
  const specialThanks = document.getElementById("specialThanksBtn");

  // PC・タブレットは常に表示
  if (!isSmartphone()) {
    warn.style.display = "none";
    copyright.style.display = "";
    specialThanks.style.display = "";
    return;
  }

  // スマホ横画面
  if (window.innerWidth > window.innerHeight) {
    warn.style.display = "flex";
    copyright.style.display = "none";
    specialThanks.style.display = "none";
  } else {
    // スマホ縦画面
    warn.style.display = "none";
    copyright.style.display = "";
    specialThanks.style.display = "";
  }
}

window.addEventListener("resize", updateOrientationWarning);
window.addEventListener("orientationchange", updateOrientationWarning);

// 初期実行
updateOrientationWarning();
