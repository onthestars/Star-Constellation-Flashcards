// star-chart/tools/check-last-unknowns.js

const fs = require("fs");
const path = require("path");

const stars = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "data", "stars-hyg-v42.json"),
    "utf8"
  )
);

const unknowns = stars
  .filter(
    star =>
      star.mag <= 2.5 &&
      (!star.label || !star.label.trim())
  )
  .sort((a, b) => a.mag - b.mag);

console.log(JSON.stringify(unknowns, null, 2));