// data-special.js

// ======== ======== ======== ======== ========
//▼▼▼Special画像追加時に編集//
// スペシャルビューアー用：星空写真データ
// カンマ(,)の位置に注意
// 大文字小文字は厳密一致
const specialPhotos = {

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
      "2026年10月1日／大阪府茨木市山中／竹林に潜む、こぐま座と北極星",
      "2026年10月1日／大阪府茨木市山中／竹林に潜む、こぐま座と北極星"
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
      "2026年3月21日／京都府亀岡市山中／北斗七星（おおぐま座の一部）"
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
      "2026年5月29日／兵庫県猪名川町／大野山頂から望むしし座"
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
      "2026年4月24日／大阪府高槻市山中／谷に浮かぶ春の大三角"
    ]
  },

    "Ophiuchus": {
    normal: [
      "Ophiuchus-noline-pic01.jpg"
    ],
    lines: [
      "Ophiuchus-lines-pic01.jpg"
    ],
    caption: [
      "2025年8月22日／兵庫県旧青垣町／へび座・へびつかい座(一部)"
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
      "2026年9月12日／紀伊半島中部／夏の天の川といて座"
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
      "2026年9月12日／紀伊半島中部／かんむり座"
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
      "2026年8月13～14日／紀伊半島南部／ペルセウス座流星群と共演",
      "2026年8月13～14日／紀伊半島南部／ペルセウス座流星群と共演"
    ]
  },

  "Pegasus": {
    normal: [
      "Pegasus-nolines-pic01.jpg"
    ],
    lines: [
      "Pegasus-lines-pic01.jpg"
    ],
    caption: [
      "2026年9月12日／紀伊半島中部／秋の四辺形（ペガスス座の一部）"
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
      "2025年11月16日／紀伊半島南部／伐採地の立木とみずがめ座",
      "2025年11月16日／紀伊半島南部／伐採地の立木とみずがめ座"
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
      "2025年11月16日／紀伊半島南部／やぎ座",
      "2025年11月16日／紀伊半島南部／伐採地の立木とやぎ座"
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
      "2025年11月16日／紀伊半島南部／こうま座",
      "2025年11月16日／紀伊半島南部／伐採地の立木とこうま座"
    ]
  },

    "Cassiopeia": {
    normal: [
      "Cassiopeia-noline-pic01.jpg"
    ],
    lines: [
      "Cassiopeia-lines-pic01.jpg"
    ],
    caption: [
      "2025年10月28日／大阪府北摂／カシオペヤ座"
    ]
  },

      "Perseus": {
    normal: [
      "Perseus-noline-pic01.jpg",
            "Perseus-Taurus-noline-pic01.jpg"
    ],
    lines: [
      "Perseus-lines-pic01.jpg",
            "Perseus-Taurus-lines-pic01.jpg"
    ],
    caption: [
      "2025年12月14日／紀伊半島中部／ペルセウス座",
            "2025年12月14日／紀伊半島中部／ペルセウス座とおうし座（ふたご座流星）"
    ]
  },

      "Gemini": {
    normal: [
      "Gemini-noline-pic01.jpg"
    ],
    lines: [
      "Gemini-lines-pic01.jpg"
    ],
    caption: [
      "2026年3月21日／京都府亀岡市山中／ふたご座と木星"
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
      "2026年10月9日／大阪府高槻市山中／谷を昇るぎょしゃ座"
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
      "2025年11月16日／紀伊半島南部／こうま座",
      "2025年11月16日／紀伊半島南部／伐採地の立木とこうま座"
    ]
  },

        "Taurus": {
    normal: [
      "Taurus-noline-pic01.jpg",
            "Perseus-Taurus-noline-pic01.jpg"
    ],
    lines: [
      "Taurus-lines-pic01.jpg",
            "Perseus-Taurus-lines-pic01.jpg"
    ],
    caption: [
      "2025年12月14日／紀伊半島中部／おうし座（ふたご座流星）",
            "2025年12月14日／紀伊半島中部／ペルセウス座とおうし座（ふたご座流星）"
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
      "2025年1月26日／紀伊半島南部／吊り橋とオリオン"
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
      "2024年2月9日／紀伊半島南部／冬の大三角",
      "2025年1月26日／紀伊半島南部／冬のダイヤモンドと大三角"
    ]
  }
};
// ======== ======== ======== ======== ========