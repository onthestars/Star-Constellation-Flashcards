// data-star-special.js

// ======== ======== ======== ======== ========
//▼▼▼Special画像追加時に編集//
// スペシャルビューアー用：星空写真データ
// カンマ(,)の位置に注意
// 大文字小文字は厳密一致
const specialPhotos = {

  // ▼春の星座
  "Ursa-Minor": {
    noline: [
      "Ursa-Minor-noline-pic01.jpg",
      "Ursa-Minor-noline-pic02.jpg",
      "Ursa-Minor-Polaris-noline-pic01.jpg"
    ],
    lines: [
      "Ursa-Minor-lines-pic01.jpg",
      "Ursa-Minor-lines-pic02.jpg",
      "Ursa-Minor-Polaris-lines-pic01.jpg"
    ],
    caption: [
      "竹林に潜む、こぐま座と北極星（ポラリス）／2026年10月1日／大阪府茨木市山中",
      "竹林に潜む、こぐま座と北極星（ポラリス）／2026年10月1日／大阪府茨木市山中",
      "反射望遠鏡で観た北極星（ポラリス）／2025年12月6日／大阪府吹田市千里ニュータウン"      
    ]
  },

  "Ursa-Major": {
    noline: [
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
    noline: [
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
    noline: [
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
      "Lyra": {
    noline: [
      "Lyra-noline-pic01.jpg"
    ],
    lines: [
      "Lyra-lines-pic01.jpg"
    ],
    caption: [
      "こと座（1等星のベガ＝織姫星）／2026年7月12日／兵庫県猪名川町山中"
    ]
  },
  
      "Aquila": {
    noline: [
      "Aquila-noline-pic01.jpg"
    ],
    lines: [
      "Aquila-lines-pic01.jpg"
    ],
    caption: [
      "田を飛び立つわし座／2026年10月9日／大阪府高槻市山中"
    ]
  },

  "Ophiuchus": {
    noline: [
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
    noline: [
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
    noline: [
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
    noline: [
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
    noline: [
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
    noline: [
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
    noline: [
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
    noline: [
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
    noline: [
      "Equuleus-noline-pic01.jpg",
      "Aquarius-Capricornus-Equuleus-noline-pic01.jpg"
    ],
    lines: [
      "Equuleus-lines-pic01.jpg",
            "Aquarius-Capricornus-Equuleus-lines-pic01.jpg"
    ],
    caption: [
      "こうま座／025年11月16日／紀伊半島南部",
      "伐採地の立木と、こうま座（上）、みずがめ座（中）、やぎ座（下）／2025年11月16日／紀伊半島南部"
    ]
  },

  "Cassiopeia": {
    noline: [
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
    noline: [
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
    noline: [
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
    noline: [
      "Triangulum-Aries-Perseus-noline-pic01.jpg",
      "Triangulum-Aries-noline-pic01.jpg"
    ],
    lines: [
      "Triangulum-Aries-Perseus-lines-pic01.jpg",
      "Triangulum-Aries-lines-pic01.jpg"
    ],
    caption: [
      "(左から）ペルセウス座、さんかく座、おひつじ座／2026年10月9日／高槻市山中",
      "さんかく座（上）とおひつじ座／2026年10月9日／高槻市山中"
    ]
  },

      "Aries": {
    noline: [
            "Triangulum-Aries-Perseus-noline-pic01.jpg",
            "Triangulum-Aries-noline-pic01.jpg"
    ],
    lines: [
            "Triangulum-Aries-Perseus-lines-pic01.jpg",
            "Triangulum-Aries-lines-pic01.jpg"
    ],
    caption: [
            "(左から）ペルセウス座、さんかく座、おひつじ座／2026年10月9日／高槻市山中",
            "さんかく座（上）とおひつじ座／2026年10月9日／高槻市山中"
    ]
  },

  // ▼冬の星座
  "Gemini": {
    noline: [
      "Gemini-noline-pic01.jpg",
      "Gemini-noline-pic02.jpg"
    ],
    lines: [
      "Gemini-lines-pic01.jpg",
      "Gemini-lines-pic02.jpg"      
    ],
    caption: [
      "ふたご座と木星／2026年3月21日／京都府亀岡市山中",
      "ふたご座と電力鉄塔／2024年1月31日未明／大阪府吹田市千里ニュータウン"      
    ]
  },

  "Auriga": {
    noline: [
      "Auriga-noline-pic01.jpg"
    ],
    lines: [
      "Auriga-lines-pic01.jpg"
    ],
    caption: [
      "谷を昇るぎょしゃ座／2026年10月9日／大阪府高槻市山中"
    ]
  },

  "Taurus": {
    noline: [
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
    noline: [
      "Orion-noline-pic01.jpg"
    ],
    lines: [
      "Orion-lines-pic01.jpg"
    ],
    caption: [
      "吊り橋とオリオン／2025年1月26日／紀伊半島南部"
    ]
  },

    "Canis-Major": {
    noline: [
      "Canis-Major-noline-pic01.jpg"
    ],
    lines: [
      "Canis-Major-lines-pic01.jpg"
    ],
    caption: [
      "ダム湖とおおいぬ座（1等星のシリウスは太陽を除き、全天で最も明るく見える恒星）／2024年2月9日／紀伊半島南部"
    ]
  },

  "Winter-Triangle": {
    noline: [
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
  photo.noline.reverse();
  photo.lines.reverse();
  photo.caption.reverse();
});