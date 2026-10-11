// moon-animation.js

// 月の軌道アニメーション専用ファイル

let animationId = null;   // アニメーションID
let resizeTimer = null;   // resize連打対策

// ▼ 前回の満月が特殊イベントか
let lastSpecialMoon = false;

function startMoonOrbitSequence() {
    const moon = document.getElementById("moon");

    const w = window.innerWidth;
    const h = window.innerHeight;

    const cx = w / 2;
    const cy = h * 0.50; // 月の高さ（画面サイズで変わる）
    const r = Math.min(w, h) * 0.80;

    const baseDeg = 10;

    const phases = [
        "moon5-crescent.png",
        "moon6-half.png",
        "moon1-full.png",
        "moon2-half.png",
        "moon3-crescent.png",
        "moon4-new.png"
    ];

// ▼ 開始月相をランダム化
let currentPhase = Math.floor(Math.random() * phases.length);

function runPhase(phaseIndex) {

    // ▼ 表示する月画像
    let moonImage = phases[phaseIndex];

    // ▼ スーパームーン判定
    let isSuperMoon = false;

    // ▼ 今回特殊満月か
    let isSpecialMoon = false;

    // ▼ 満月イベント抽選
    if (moonImage === "moon1-full.png") {

        // 前回特殊満月なら今回は通常満月固定
        if (!lastSpecialMoon) {

            const rand = Math.random();

            // 5% スーパームーン
            if (rand < 0.03) {

                isSuperMoon = true;
                isSpecialMoon = true;

            // 10% ハーベストムーン
            } else if (rand < 0.08) {

                moonImage = "moon-harvest.png";
                isSpecialMoon = true;
            }
        }

// ▼ 特殊満月が出たら次回の満月抽選を1回休み
lastSpecialMoon = isSpecialMoon;
    }

    // フェードイン準備
    moon.style.transition = "opacity 1.5s ease";
    moon.style.opacity = 0;
    moon.src = "image/common/" + moonImage;

        // ▼ スーパームーン演出
if (isSuperMoon) {
    moon.style.filter =
        "brightness(1.25) drop-shadow(0 0 12px rgba(255,240,180,0.8))";
} else {
    moon.style.filter = "";
}

        // フェードイン開始
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                moon.style.opacity = 1;
            });
        });

        let theta = Math.PI;
        let fadeOutStarted = false;

        function animate() {
    const x = cx + r * Math.cos(theta);
    const y = cy - r * Math.sin(theta);

    // 月画像を動かす（必須）
    moon.style.left = x + "px";
    moon.style.top  = y + "px";

    // 当たり判定も同じ位置に動かす（必須）
    const moonAnime = document.getElementById("moonAnime");
    moonAnime.style.left = x + "px";
    moonAnime.style.top  = y + "px";

    const orbitDeg = -(theta - Math.PI/2) * (180 / Math.PI) / 3;
    const rotateDeg = baseDeg + orbitDeg;
if (isSuperMoon) {
    moon.style.transform =
        `rotate(${rotateDeg}deg) scale(1.15)`;
} else {
    moon.style.transform =
        `rotate(${rotateDeg}deg)`;
}

    if (theta < 0.3 && !fadeOutStarted) {
        fadeOutStarted = true;
        moon.style.opacity = 0;
    }

    theta -= 0.002;

    if (theta <= 0) {
        currentPhase++;
        if (currentPhase >= phases.length) {
            currentPhase = 0;
        }

        setTimeout(() => {
            runPhase(currentPhase);
        }, 1500);

        return;
    }

    animationId = requestAnimationFrame(animate);
}


        animate();
    }

    runPhase(currentPhase);
}

// 初期起動
window.onload = startMoonOrbitSequence;

// resize時の安全な再起動
window.onresize = () => {

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {

        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        startMoonOrbitSequence();

    }, 200);
};
