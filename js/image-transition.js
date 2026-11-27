// js/image-transition.js

/**
 * 写真切り替えアニメーション
 *
 * direction:
 *   "next" → 現在の写真が左へ退出し、新しい写真が右から登場
 *   "prev" → 現在の写真が右へ退出し、新しい写真が左から登場
 */

async function animateImageTransition(viewer, nextSrc, direction, onComplete) {
  if (!viewer || !nextSrc) return false;

  // 次の画像を先読み
  const preload = new Image();
  preload.src = nextSrc;

  try {
    await preload.decode();
  } catch {
    // 読み込みに失敗した場合は現在の写真を維持
    return false;
  }

  const isNext = direction === "next";

  // 現在の写真を退出させる
  await viewer.animate(
    [
      {
        transform: "translateX(0) scale(1)",
        opacity: 1,
      },
      {
        transform: `translateX(${isNext ? "-40px" : "40px"}) scale(0.98)`,
        opacity: 0,
      },
    ],
    {
      duration: 400,
      easing: "ease",
      fill: "forwards",
    },
  ).finished;

  // 写真と関連情報を更新
  viewer.src = nextSrc;

  if (typeof onComplete === "function") {
    onComplete();
  }

  // 新しい写真を登場させる
    await viewer.animate(
    [
      {
        transform: `translateX(${isNext ? "30px" : "-30px"}) scale(0.98)`,
        opacity: 0,
      },
      {
        transform: "translateX(0) scale(1)",
        opacity: 1,
      },
    ],
    {
      duration: 400,
      easing: "ease",
      fill: "forwards",
    },
  ).finished;
  
  return true;
}