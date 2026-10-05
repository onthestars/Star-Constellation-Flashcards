// animation-controls.js

window.animationClass = null;

function animationControlsInit() {

  window.applyViewerAnimation = function(viewer) {
    if (!window.animationClass) return;

    viewer.classList.remove("slide-out-left", "fade-in");
    void viewer.offsetWidth;
    viewer.classList.add(window.animationClass);

    window.animationClass = null;
  };
}
