// sound-controls.js

// グローバル変数として公開（main.js から参照される）
window.soundEnabled = localStorage.getItem("soundEnabled") === "false" ? false : true;

function soundControlsInit() {

  const soundOnBtn  = document.getElementById("soundOnBtn");
  const soundOffBtn = document.getElementById("soundOffBtn");

  // 初期表示
  if (window.soundEnabled) {
    soundOnBtn.style.display  = "inline";
    soundOffBtn.style.display = "none";
  } else {
    soundOnBtn.style.display  = "none";
    soundOffBtn.style.display = "inline";
  }

  // 音声ON → OFF
  soundOnBtn.onclick = () => {
    window.soundEnabled = false;
    localStorage.setItem("soundEnabled", "false");
    soundOnBtn.style.display  = "none";
    soundOffBtn.style.display = "inline";
  };

  // 音声OFF → ON
  soundOffBtn.onclick = () => {
    window.soundEnabled = true;
    localStorage.setItem("soundEnabled", "true");
    soundOnBtn.style.display  = "inline";
    soundOffBtn.style.display = "none";
  };
}