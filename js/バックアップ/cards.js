// ===============================
// 星空カード：データ専用ファイル（cards.js）
// ===============================

const cardData = {

  // ===============================
  // 春
  // ===============================
  spring: [
    { type: "cover", title: "春の星座" },
    { type: "legend", title: "凡例" },

    { name: "こぐま", id: "Ursa-Minor", other: false,
      description: "北極星の近くにある小さな星座。こぐま座β星コカブが目印。" },

    { name: "コップ", id: "Crater", other: false,
      description: "しし座の近くにある小さな星座。暗い星が多く見つけにくい。" },

    { name: "からす", id: "Corvus", other: false,
      description: "4つの星が四角形を作る特徴的な形。春の南の空に見える。" },

    { name: "うみへび", id: "Hydra", other: false,
      description: "全天で最も長い星座。頭部のアルファルドが目印。" },

    { name: "かに", id: "Cancer", other: false,
      description: "プレセペ星団（M44）が有名。双眼鏡で美しい。" },

    { name: "おおぐま", id: "Ursa-Major", other: false,
      description: "北斗七星を含む大きな星座。季節を問わず見える。" },

    { name: "うしかい", id: "Bootes", other: false,
      description: "アルクトゥルスが非常に明るい。春の大曲線の起点。" },

    { name: "おとめ", id: "Virgo", other: false,
      description: "スピカが目印。春の銀河団が多く観察できる領域。" },

    { name: "しし", id: "Leo", other: false,
      description: "レグルスが輝く。ししの大鎌が特徴的。" },

    { name: "春の大曲線", id: "spring-10", other: true,
      description: "北斗七星の柄からアルクトゥルス、スピカへと続く曲線。" },

    { name: "春の大三角", id: "spring-11", other: true,
      description: "アルクトゥルス・スピカ・デネボラで作る春の代表的な三角形。" }
  ],

  // ===============================
  // 夏
  // ===============================
  summer: [
    { type: "cover", title: "夏の星座" },
    { type: "legend", title: "凡例" },

    { name: "こと", id: "Lyra", other: false,
      description: "ベガを含む小さな星座。夏の大三角の一角。" },

    { name: "わし", id: "Aquila", other: false,
      description: "アルタイルが目印。夏の大三角の一角。" },

    { name: "はくちょう", id: "Cygnus", other: false,
      description: "デネブを含む大きな星座。天の川に沿って広がる。" },

    { name: "夏の大三角", id: "summer-04", other: true,
      description: "ベガ・アルタイル・デネブで作る夏の代表的な三角形。" },

    { name: "いるか", id: "Delphinus", other: false,
      description: "小さな星座だが形が特徴的で見つけやすい。" },

    { name: "や", id: "Sagitta", other: false,
      description: "矢の形をした小さな星座。天の川の中にある。" },

    { name: "いて", id: "Sagittarius", other: false,
      description: "天の川が最も濃い領域。M天体が多く観察できる。" },

    { name: "さそり", id: "Scorpius", other: false,
      description: "アンタレスが赤く輝く。形が分かりやすい人気の星座。" },

    { name: "てんびん", id: "Libra", other: false,
      description: "春から夏にかけて見える。暗い星が多い。" },

    { name: "りゅう", id: "Draco", other: false,
      description: "北極星の近くまで伸びる長い星座。" },

    { name: "ヘルクレス", id: "Hercules", other: false,
      description: "球状星団M13が有名。夏の天の川の近くにある。" },

    { name: "へびつかい", id: "Ophiuchus", other: false,
      description: "へび座を両手で持つ形。夏の南の空に広がる。" },

    { name: "かんむり", id: "Corona-Borealis", other: false,
      description: "半円形の星並びが特徴。北のかんむり座とは別物。" },

    { name: "みなみのかんむり", id: "Corona-Australis", other: false,
      description: "南の空に見える小さな星座。暗い星が多い。" }
  ],

  // ===============================
  // 秋
  // ===============================
  autumn: [
    { type: "cover", title: "秋の星座" },
    { type: "legend", title: "凡例" },

    { name: "みずがめ", id: "Aquarius", other: false,
      description: "秋の南の空に広がる大きな星座。暗い星が多く形は分かりにくい。" },

    { name: "みなみのうお", id: "Piscis-Austrinus", other: false,
      description: "フォーマルハウトが明るく目立つ。秋の代表的な一等星。" },

    { name: "やぎ", id: "Capricornus", other: false,
      description: "三角形の形が特徴。夏から秋にかけて見える。" },

    { name: "こうま", id: "Equuleus", other: false,
      description: "小さな星座だが形が整っていて見つけやすい。" },

    { name: "ペガスス", id: "Pegasus", other: true,
      description: "秋の四辺形として有名。大きな四角形が目印。" },

    { name: "うお", id: "Pisces", other: false,
      description: "細長い星並びが特徴。秋の天の川の外側に位置する。" },

    { name: "アンドロメダ", id: "Andromeda", other: false,
      description: "アンドロメダ銀河M31が有名。肉眼でもぼんやり見える。" },

    { name: "ケフェウス", id: "Cepheus", other: false,
      description: "五角形の形が特徴。北極星の近くにある。" },

    { name: "カシオペヤ", id: "Cassiopeia", other: false,
      description: "W字型が非常に分かりやすい。北の空で一年中見える。" },

    { name: "くじら", id: "Cetus", other: false,
      description: "大きな星座。ミラの変光が有名。" },

    { name: "ペルセウス", id: "Perseus", other: false,
      description: "ペルセウス座流星群で有名。二重星団hχが美しい。" },

    { name: "おひつじ", id: "Aries", other: false,
      description: "春分点がある星座。暗い星が多い。" },

    { name: "さんかく", id: "Triangulum", other: false,
      description: "小さな三角形の星座。アンドロメダの近くにある。" }
  ],

  // ===============================
  // 冬
  // ===============================
  winter: [
    { type: "cover", title: "冬の星座" },
    { type: "legend", title: "凡例" },

    { name: "ふたご", id: "Gemini", other: false,
      description: "カストルとポルックスの二つの明るい星が特徴。" },

    { name: "ぎょしゃ", id: "Auriga", other: false,
      description: "カペラが非常に明るい。五角形の形が特徴。" },

    { name: "おうし", id: "Taurus", other: false,
      description: "アルデバランとプレアデス星団M45が有名。" },

    { name: "オリオン", id: "Orion", other: false,
      description: "冬の代表的な星座。三つ星とベテルギウス・リゲルが目印。" },

    { name: "おおいぬ", id: "Canis-Major", other: false,
      description: "シリウスが非常に明るい。冬の大三角の一角。" },

    { name: "こいぬ", id: "Canis-Minor", other: false,
      description: "プロキオンが目印。冬の大三角の一角。" },

    { name: "冬の大六角・冬の大三角", id: "winter-07", other: true,
      description: "冬の明るい星を結んだ巨大な図形。星探しの基本。" },

    { name: "エリダヌス", id: "Eridanus", other: false,
      description: "長く伸びる川の星座。アケルナルが明るい。" },

    { name: "うさぎ", id: "Lepus", other: false,
      description: "オリオンの足元にある小さな星座。" },

    { name: "おおかみ", id: "Lupus", other: false,
      description: "南の空にある星座。暗い星が多い。" },

    { name: "ケンタウルス", id: "Centaurus", other: false,
      description: "南天の明るい星が多い。α星は全天で最も近い恒星系。" },

    { name: "さいだん", id: "Ara", other: false,
      description: "南の空にある小さな星座。" },

    { name: "アルゴ", id: "Argo", other: false,
      description: "巨大な星座だったが現在は分割されている（とも・りゅうこつ等）。" }
  ],

  // ===============================
  // 南
  // ===============================
  south: [
    { type: "cover", title: "南の星座" },
    { type: "legend", title: "凡例" },

    { name: "みなみのかんむり", id: "Corona-Australis", other: false,
      description: "南の空に見える小さな星座。夏にも登場する。" },

    { name: "みなみのうお", id: "Piscis-Austrinus", other: false,
      description: "フォーマルハウトが明るい。南天の代表的な星座。" },

    { name: "ケンタウルス", id: "Centaurus", other: false,
      description: "南天の明るい星が多い。α星は最も近い恒星系。" },

    { name: "さいだん", id: "Ara", other: false,
      description: "南の空にある小さな星座。" }
  ]
};
