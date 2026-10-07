// meteor.js

function spawnMeteorCore() {

  const core = document.createElement("div");

  core.className = "meteor-core";

  core.style.left = "100px";
  core.style.top = "150px";

  document.body.appendChild(core);

}

spawnMeteorCore();