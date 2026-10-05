// moon-animation.js

// 月の軌道アニメーション専用ファイル

let animationId = null;   // アニメーションID
let resizeTimer = null;   // resize連打対策

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

    let currentPhase = 0;

    function runPhase(phaseIndex) {

        // フェードイン準備
        moon.style.transition = "opacity 1.5s ease";
        moon.style.opacity = 0;
        moon.src = "image/common/" + phases[phaseIndex];

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
    moon.style.transform = `rotate(${rotateDeg}deg)`;

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
