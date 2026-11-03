// star-chart/tools/check-missing-labels.js

const fs = require("fs");
const path = require("path");

// ▼ 星データ読込
const jsonPath = path.join(
  __dirname,
  "..",
  "star-chart",
  "data",
  "stars-hyg-v42.json"
);

const stars = JSON.parse(
  fs.readFileSync(jsonPath, "utf8")
);

// ▼ 2等星まででラベル未設定を抽出
const missing = stars
  .filter(
    star =>
      star.id.startsWith("hip-") &&
      star.mag <= 2.5 &&
      (!star.label || !star.label.trim())
  )
  .sort((a, b) => a.mag - b.mag);

// ▼ 確認用表示
console.table(
  missing.map(star => ({
    id: star.id,
    mag: star.mag,
    con: star.con
  }))
);

console.log(`未登録件数: ${missing.length}`);

// ▼ JSON出力
const outputPath = path.join(
  __dirname,
  "..",
  "missing-stars.json"
);

fs.writeFileSync(
  outputPath,
  JSON.stringify(missing, null, 2),
  "utf8"
);

console.log(`出力完了: ${outputPath}`);