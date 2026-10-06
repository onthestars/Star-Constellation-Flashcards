// meteor-event.js

document.addEventListener("DOMContentLoaded", () => {

  const meteor = document.getElementById("meteor");

  if (!meteor) return;

  const directions = [

    // 右上 → 左下
    {
      startTop: "5%",
      startLeft: "110%",
      endTop: "75%",
      endLeft: "10%",
      angle: "145deg"
    },

    // 左上 → 右下
    {
      startTop: "5%",
      startLeft: "-20%",
      endTop: "75%",
      endLeft: "90%",
      angle: "35deg"
    },

    // 左 → 右
    {
      startTop: "40%",
      startLeft: "-20%",
      endTop: "40%",
      endLeft: "90%",
      angle: "0deg"
    },

    // 右 → 左
    {
      startTop: "40%",
      startLeft: "110%",
      endTop: "40%",
      endLeft: "10%",
      angle: "180deg"
    },

    // 上 → 下
    {
      startTop: "-20%",
      startLeft: "50%",
      endTop: "85%",
      endLeft: "50%",
      angle: "90deg"
    }

  ];

  function launchMeteor() {

    meteor.classList.remove("active");

    void meteor.offsetWidth;

let dir;
const r = Math.random();

if (r < 0.60) {

  // 60% 右上 → 左下
  dir = {
    startTop: "5%",
    startLeft: "110%",
    endTop: "75%",
    endLeft: "10%",
    angle: "145deg"
  };

} else if (r < 0.85) {

  // 25% 左上 → 右下
  dir = {
    startTop: "5%",
    startLeft: "-20%",
    endTop: "75%",
    endLeft: "90%",
    angle: "35deg"
  };

} else if (r < 0.95) {

  // 10% 上 → 下
  dir = {
    startTop: "-20%",
    startLeft: "50%",
    endTop: "85%",
    endLeft: "50%",
    angle: "90deg"
  };

} else if (r < 0.98) {

  // 3% 左 → 右
  dir = {
    startTop: "40%",
    startLeft: "-20%",
    endTop: "40%",
    endLeft: "90%",
    angle: "0deg"
  };

} else {

  // 2% 右 → 左
  dir = {
    startTop: "40%",
    startLeft: "110%",
    endTop: "40%",
    endLeft: "10%",
    angle: "180deg"
  };

}

    meteor.style.setProperty(
      "--meteor-start-top",
      dir.startTop
    );

    meteor.style.setProperty(
      "--meteor-start-left",
      dir.startLeft
    );

    meteor.style.setProperty(
      "--meteor-end-top",
      dir.endTop
    );

    meteor.style.setProperty(
      "--meteor-end-left",
      dir.endLeft
    );

    meteor.style.transform =
      `rotate(${dir.angle})`;

    meteor.classList.add("active");
  }

// 体感１０秒に１回流れる
setInterval(() => {

  if (Math.random() < 0.50) {
    launchMeteor();
  }

}, 5000);

});