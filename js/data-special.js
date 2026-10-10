// data-special.js

// ======== ======== ======== ======== ========
//▼▼▼Special画像追加時に編集//
// スペシャルビューアー用：星空写真データ
// カンマ(,)の位置に注意
// 大文字小文字は厳密一致
const specialPhotos = {

  // ▼春の星座
  "Ursa-Minor": {
    normal: [
      "Ursa-Minor-noline-pic01.jpg",
      "Ursa-Minor-noline-pic02.jpg"
    ],
    lines: [
      "Ursa-Minor-lines-pic01.jpg",
      "Ursa-Minor-lines-pic02.jpg"
    ],
    caption: [
      "竹林に潜む、こぐま座と北極星（ポラリス）／2026年10月1日／大阪府茨木市山中",
      "竹林に潜む、こぐま座と北極星（ポラリス）／2026年10月1日／大阪府茨木市山中"
    ]
  },

  "Ursa-Major": {
    normal: [
      "Ursa-Major-noline-pic01.jpg"
    ],
    lines: [
      "Ursa-Major-lines-pic01.jpg"
    ],
    caption: [
      "北斗七星（おおぐま座の一部）／2026年3月21日／京都府亀岡市山中"
    ]
  },

  "Leo": {
    normal: [
      "Leo-noline-pic01.jpg"
    ],
    lines: [
      "Leo-lines-pic01.jpg"
    ],
    caption: [
      "大野山頂から望むしし座／2026年5月29日／兵庫県猪名川町"
    ]
  },

  "Spring-Triangle": {
    normal: [
      "Spring-Triangle-noline-pic01.jpg"
    ],
    lines: [
      "Spring-Triangle-lines-pic01.jpg"
    ],
    caption: [
      "谷に浮かぶ春の大三角／2026年4月24日／大阪府高槻市山中"
    ]
  },

  // ▼夏の星座
  "Ophiuchus": {
    normal: [
      "Ophiuchus-noline-pic01.jpg"
    ],
    lines: [
      "Ophiuchus-lines-pic01.jpg"
    ],
    caption: [
      "へび座・へびつかい座(一部)／2025年8月22日／兵庫県旧青垣町"
    ]
  },

  "Sagittarius": {
    normal: [
      "Sagittarius-noline-pic01.jpg"
    ],
    lines: [
      "Sagittarius-lines-pic01.jpg"
    ],
    caption: [
      "夏の天の川といて座／2026年9月12日／紀伊半島中部"
    ]
  },

  "Corona-Borealis": {
    normal: [
      "Corona-Borealis-noline-pic01.jpg"
    ],
    lines: [
      "Corona-Borealis-lines-pic01.jpg"
    ],
    caption: [
      "かんむり座／2026年9月12日／紀伊半島中部"
    ]
  },

  "Summer-Triangle": {
    normal: [
      "Summer-Triangle-noline-pic01.jpg",
      "Summer-Triangle-noline-pic02.jpg"
    ],
    lines: [
      "Summer-Triangle-lines-pic01.jpg",
      "Summer-Triangle-lines-pic02.jpg"
    ],
    caption: [
      "夏の大三角とペルセウス座流星群／2026年8月13～14日／紀伊半島南部",
      "夏の大三角とペルセウス座流星群／2026年8月13～14日／紀伊半島南部"
    ]
  },

  // ▼秋の星座
  "Pegasus": {
    normal: [
      "Pegasus-nolines-pic01.jpg"
    ],
    lines: [
      "Pegasus-lines-pic01.jpg"
    ],
    caption: [
      "秋の四辺形（ペガスス座の一部）／2026年9月12日／紀伊半島中部"
    ]
  },

  "Aquarius": {
    normal: [
      "Aquarius-noline-pic01.jpg",
      "Aquarius-Capricornus-Equuleus-noline-pic01.jpg"
    ],
    lines: [
      "Aquarius-lines-pic01.jpg",
      "Aquarius-Capricornus-Equuleus-lines-pic01.jpg"
    ],
    caption: [
      "伐採地の立木と、こうま座（上）、みずがめ座（中）、やぎ座（下）／2025年11月16日／紀伊半島南部",
      "伐採地の立木と、こうま座（上）、みずがめ座（中）、やぎ座（下）／2025年11月16日／紀伊半島南部"
    ]
  },

  "Pisces": {
    normal: [
      "Pisces-noline-pic01.jpg"
    ],
    lines: [
      "Pisces-lines-pic01.jpg"
    ],
    caption: [
      "2025年11月16日／紀伊半島南部／うお座（左）と秋の四辺形"
    ]
  },

  "Capricornus": {
    normal: [
      "Capricornus-noline-pic01.jpg",
      "Aquarius-Capricornus-Equuleus-noline-pic01.jpg"
    ],
    lines: [
      "Capricornus-lines-pic01.jpg",
      "Aquarius-Capricornus-Equuleus-lines-pic01.jpg"
    ],
    caption: [
      "やぎ座／2025年11月16日／紀伊半島南部",
      "伐採地の立木と、こうま座（上）、みずがめ座（中）、やぎ座（下）／2025年11月16日／紀伊半島南部"
    ]
  },

  "Equuleus": {
    normal: [
      "Equuleus-noline-pic01.jpg",
      "Aquarius-Capricornus-Equuleus-noline-pic01.jpg"
    ],
    lines: [
      "Equuleus-lines-pic01.jpg",
            "Aquarius-Capricornus-Equuleus-lines-pic01.jpg"
    ],
    caption: [
      "2こうま座／025年11月16日／紀伊半島南部",
      "伐採地の立木と、こうま座（上）、みずがめ座（中）、やぎ座（下）／2025年11月16日／紀伊半島南部"
    ]
  },

  "Cassiopeia": {
    normal: [
      "Cassiopeia-noline-pic01.jpg",
      "Cassiopeia-noline-pic02.jpg",
      "Cassiopeia-noline-pic03.jpg"
    ],
    lines: [
      "Cassiopeia-lines-pic01.jpg",
      "Cassiopeia-lines-pic02.jpg",
      "Cassiopeia-lines-pic03.jpg"
    ],
    caption: [
      "カシオペヤ座／2025年10月28日／大阪府吹田市千里ニュータウン",
      "カシオペヤ座とアンドロメダ銀河（丸囲み）／2026年10月9日／大阪府高槻市",
      "カシオペヤ座／2026年10月9日／大阪府高槻市"
    ]
  },

    "Cepheus": {
    normal: [
      "Cepheus-Cassiopeia-noline-pic01.jpg",
      "Cepheus-noline-pic01.jpg"

    ],
    lines: [
      "Cepheus-Cassiopeia-lines-pic01.jpg",
      "Cepheus-lines-pic01.jpg"

    ],
    caption: [
      "ケフェウス座（王）とカシオペヤ座（妃）／2026年10月9日／大阪府高槻市山中",
      "ケフェウス座／2026年10月9日／大阪府高槻市山中"

    ]
  },

  "Perseus": {
    normal: [
      "Perseus-Taurus-noline-pic01.jpg",
      "Perseus-noline-pic01.jpg",
      "Perseus-noline-pic02.jpg",
            "Perseus-Cassiopeia-Triangulum-Aries-noline-pic01.jpg"

    ],
    lines: [
      "Perseus-Taurus-lines-pic01.jpg",
      "Perseus-lines-pic01.jpg",
      "Perseus-lines-pic02.jpg",
                  "Perseus-Cassiopeia-Triangulum-Aries-lines-pic01.jpg"

    ],
    caption: [
      "ペルセウス座とおうし座（ふたご座流星）／2025年12月14日／紀伊半島中部",
      "ペルセウス座／2025年12月14日／紀伊半島中部",
      "ペルセウス座／2026年10月9日／大阪府高槻市",
      "（左から）カシオペヤ座、ペルセウス座、さんかく座、おひつじ座。丸囲みはプレアデス星団（すばる）／2026年10月9日／大阪府高槻市"
    ]
  },

    "Triangulum": {
    normal: [
      "Triangulum-Aries-Perseus-noline-pic01.jpg",
      "Triangulum-Aries-noline-pic01.jpg"
    ],
    lines: [
      "Triangulum-Aries-Perseus-lines-pic01.jpg",
      "Triangulum-Aries-lines-pic01.jpg"
    ],
    caption: [
      "(左から）＠ペルセウス座、さんかく座、おひつじ座／2026年10月9日／高槻市山中",
      "さんかく座（上）とおひつじ座／2026年10月9日／高槻市山中"
    ]
  },

      "Aries": {
    normal: [
            "Triangulum-Aries-Perseus-noline-pic01.jpg",
            "Triangulum-Aries-noline-pic01.jpg"
    ],
    lines: [
            "Triangulum-Aries-Perseus-lines-pic01.jpg",
            "Triangulum-Aries-lines-pic01.jpg"
    ],
    caption: [
            "(左から）＠ペルセウス座、さんかく座、おひつじ座／2026年10月9日／高槻市山中",
            "さんかく座（上）とおひつじ座／2026年10月9日／高槻市山中"
    ]
  },

  // ▼冬の星座
  "Gemini": {
    normal: [
      "Gemini-noline-pic01.jpg"
    ],
    lines: [
      "Gemini-lines-pic01.jpg"
    ],
    caption: [
      "ふたご座と木星／2026年3月21日／京都府亀岡市山中"
    ]
  },

  "Auriga": {
    normal: [
      "Auriga-noline-pic01.jpg"
    ],
    lines: [
      "Auriga-lines-pic01.jpg"
    ],
    caption: [
      "谷を昇るぎょしゃ座／2026年10月9日／大阪府高槻市山中"
    ]
  },

  "Equuleus": {
    normal: [
      "Equuleus-noline-pic01.jpg",
      "Aquarius-Capricornus-Equuleus-noline-pic01.jpg"
    ],
    lines: [
      "Equuleus-lines-pic01.jpg",
            "Aquarius-Capricornus-Equuleus-lines-pic01.jpg"
    ],
    caption: [
      "こうま座／2025年11月16日／紀伊半島南部",
      "伐採地の立木と、こうま座（上）、みずがめ座（中）、やぎ座（下）／2025年11月16日／紀伊半島南部"
    ]
  },

  "Taurus": {
    normal: [
            "Perseus-Taurus-noline-pic01.jpg",
      "Taurus-noline-pic02.jpg"

    ],
    lines: [
            "Perseus-Taurus-lines-pic01.jpg",
      "Taurus-lines-pic02.jpg"

    ],
    caption: [
      "ペルセウス座とおうし座（ふたご座流星）／2025年12月14日／紀伊半島中部",
      "おうし座（ふたご座流星）／2025年12月14日／紀伊半島中部"
    ]
  },
  
  "Orion": {
    normal: [
      "Orion-noline-pic01.jpg"
    ],
    lines: [
      "Orion-lines-pic01.jpg"
    ],
    caption: [
      "吊り橋とオリオン／2025年1月26日／紀伊半島南部"
    ]
  },

  "Winter-Triangle": {
    normal: [
      "Winter-Triangle-noline-pic01.jpg",
      "Winter-Triangle-noline-pic02.jpg"
    ],
    lines: [
      "Winter-Triangle-lines-pic01.jpg",
      "Winter-Triangle-lines-pic02.jpg"
    ],
    caption: [
      "冬の大三角／2024年2月9日／紀伊半島南部",
      "冬のダイヤモンドと大三角／2025年1月26日／紀伊半島南部"
    ]
  }
};
// ======== ======== ======== ======== ========

// ▼ Special画像を降順表示
Object.values(specialPhotos).forEach(photo => {
  photo.normal.reverse();
  photo.lines.reverse();
  photo.caption.reverse();
});