// スマホ判定（2026年仕様：AndroidはMobileが無くてもスマホ扱い）
function isSmartphone() {
  const ua = navigator.userAgent;

  // iPad（iOS13以降はMacintoshを名乗る）を確実に除外
  const isIpad = (/iPad|Macintosh/.test(ua) && 'ontouchend' in document);
  if (isIpad) return false;

  // iPhone
  if (/iPhone/.test(ua)) return true;

  // Androidスマホ（Mobile が無くてもスマホ扱い）
  if (/Android/.test(ua)) return true;

  // それ以外はPC・タブレット扱い
  return false;
}

function updateOrientationWarning() {
  const warn = document.getElementById("rotate-warning");
  const copyright = document.getElementById("copyright");
  const specialThanks = document.getElementById("specialThanksBtn");

  // PC・タブレットは常に非警告
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
