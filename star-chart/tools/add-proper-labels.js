// star-chart/tools/add-proper-labels.js

const fs = require("fs");
const path = require("path");

// ▼ 日本語辞書
const nameMap = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "data", "star-name-ja.json"),
    "utf8"
  )
);

// ▼ proper一覧
const properStars = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "data", "proper-stars.json"),
    "utf8"
  )
);

// ▼ 星データ
const starsPath = path.join(
  __dirname,
  "..",
  "data",
  "stars-hyg-v42.json"
);

const stars = JSON.parse(
  fs.readFileSync(starsPath, "utf8")
);

// ▼ HIP番号 → 日本語名
const hipToJaName = {};

for (const star of properStars) {
  const jaName = nameMap[star.proper];

  if (jaName) {
    hipToJaName[`hip-${star.hip}`] = jaName;
  }
}

// ▼ label付与
let updated = 0;

for (const star of stars) {
  const jaName = hipToJaName[star.id];

  if (jaName) {
    if (!star.label || star.label.trim() === "") {
      star.label = jaName;
      updated++;
    }
  }
}

// ▼ 保存
fs.writeFileSync(
  starsPath,
  JSON.stringify(stars, null, 2),
  "utf8"
);

console.log(`追加件数: ${updated}`);
console.log("stars-hyg-v42.json 更新完了");