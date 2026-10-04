// moon-animation.js
// 月の軌道アニメーション専用ファイル

let animationId = null;   // アニメーションID
let resizeTimer = null;   // resize連打対策

function startMoonOrbitSequence() {
    const moon = document.getElementById("moon");
    const moonAnime = document.getElementById("moonAnime");

    const w = window.innerWidth;
    const h = window.innerHeight;

    const cx = w / 2; //画面幅 w のちょうど中央を軌道の中心 X 座標にする
    const cy = h * 0.50; // 画面高さ h の 50%（中央より少し上）を軌道の中心 Y 座標にする
    const r = Math.min(w, h) * 0.70; //円軌道の半径 r 

    const baseDeg = 10; //月画像の回転角の基準値

    const phases = [
        "moon5-crescent.png",
        "moon6-half.png",
        "moon1-full.png",
        "moon2-half.png",
        "moon3-crescent.png",
        "moon4-new.png"
    ];

    let currentPhase = 0;

    // ★ 月の当たり判定を月に追従させる
    function syncMoonHitbox() {
        const rect = moon.getBoundingClientRect();
        moonAnime.style.position = "absolute";
        moonAnime.style.left = rect.left + "px";
        moonAnime.style.top = rect.top + "px";
        moonAnime.style.width = rect.width + "px";
        moonAnime.style.height = rect.height + "px";
        moonAnime.style.zIndex = 9999;
        moonAnime.style.cursor = "pointer";
    }

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

            moon.style.left = x + "px";
            moon.style.top  = y + "px";

            // ★ 月の位置に当たり判定を追従させる
            syncMoonHitbox();

            const orbitDeg = -(theta - Math.PI/2) * (180 / Math.PI) / 3;
            const rotateDeg = baseDeg + orbitDeg;
            moon.style.transform = `rotate(${rotateDeg}deg)`;

            // 終盤でフェードアウト開始
            if (theta < 0.3 && !fadeOutStarted) {
                fadeOutStarted = true;
                moon.style.opacity = 0;
            }

            theta -= 0.002;

            // 軌道終了 → 次フェーズへ
            if (theta <= 0) {

                currentPhase++;
                if (currentPhase >= phases.length) {
                    currentPhase = 0;
                }

                setTimeout(() => {
                    runPhase(currentPhase);
                }, 1200); //次の月フェーズを開始する前に待つ秒数(ms)

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
