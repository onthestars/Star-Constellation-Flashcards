// data-links.js

// 星図リンク（RA/DEC）データとリンク生成

// ▼ 時刻文字列生成（utils-time.js に移す場合は削除）
function getCurrentTimeString() {
  const now = new Date();
  const y  = now.getFullYear();
  const m  = String(now.getMonth() + 1).padStart(2, '0');
  const d  = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${y}${m}${d}-${hh}${mm}${ss}`;
}

// ▼ 星図URL生成（utils-link.js に移す場合は削除）
function makeLink(ra, dec, lat, lon, fov) {
  const time = getCurrentTimeString();
  return `https://peteworden.github.io/Soleil/chart.html?ra=${ra}&dec=${dec}&lat=${lat}&lon=${lon}&time=${time}&fov=${fov}`;
}

// ▼ 星図リンク
const links = {};

/* 春の星座 */
// ▼ 春の星座
links["Ursa-Minor"] = makeLink(234.777, 77.916, 34.81, 135.53, 40.00);
links["Crater"]     = makeLink(170.33, -15.144, 34.81, 135.53, 40.00);
links["Corvus"]     = makeLink(185.341, -18.145, 34.81, 135.53, 40.00);
links["Hydra"]      = makeLink(157.816, -20.135, 34.81, 135.53, 90.00);
links["Cancer"]     = makeLink(127.367, 14.912, 34.81, 135.53, 40.00);
links["Ursa-Major"] = makeLink(165.396, 57.859, 34.81, 135.53, 40.00);
links["Bootes"]     = makeLink(219.034, 29.886, 34.81, 135.53, 40.00);
links["Virgo"]      = makeLink(200.338, -2.137, 34.81, 135.53, 40.00);
links["Leo"]        = makeLink(157.851, 14.865, 34.81, 135.53, 40.00);

// ▼ 夏の星座
links["Lyra"]             = makeLink(281.485, 36.029, 34.81, 135.53, 40.00);
links["Aquila"]           = makeLink(292.835, 2.057, 34.81, 135.53, 40.00);
links["Cygnus"]           = makeLink(307.731, 43.09, 34.81, 135.53, 40.00);
links["Delphinus"]        = makeLink(310.316, 12.095, 34.81, 135.53, 40.00);
links["Sagitta"]          = makeLink(297.797, 18.068, 34.81, 135.53, 40.00);
links["Sagittarius"]      = makeLink(285.406, -24.961, 34.81, 135.53, 40.00);
links["Scorpius"]         = makeLink(247.906, -26.056, 34.81, 135.53, 40.00);
links["Libra"]            = makeLink(227.867, -14.099, 34.81, 135.53, 40.00);
links["Draco"]            = makeLink(255.093, 59.962, 34.81, 135.53, 70.00);
links["Hercules"]         = makeLink(257.766, 26.968, 34.81, 135.53, 40.00);
links["Ophiuchus"]        = makeLink(257.852, -5.031, 34.81, 135.53, 60.00);
links["Corona-Borealis"]  = makeLink(235.27, 29.916, 34.81, 135.53, 40.00);
links["Corona-Australis"] = makeLink(277.966, -40.98, 34.81, 135.53, 40.00);

// ▼ 秋の星座
links["Aquarius"]         = makeLink(335.357, -12.865, 34.81, 135.53, 60.00);
links["Piscis-Austrinus"] = makeLink(332.885, -31.868, 34.81, 135.53, 40.00);
links["Capricornus"]      = makeLink(312.882, -19.899, 34.81, 135.53, 40.00);
links["Equuleus"]         = makeLink(317.832, 6.11, 34.81, 135.53, 40.00);
links["Pegasus"]          = makeLink(337.822, 20.137, 34.81, 135.53, 40.00);
links["Pisces"]           = makeLink(5.345, 10.148, 34.81, 135.53, 60.00);
links["Andromeda"]        = makeLink(10.363, 38.146, 34.81, 135.53, 40.00);
links["Cepheus"]          = makeLink(330.138, 70.129, 34.81, 135.53, 40.00);
links["Cassiopeia"]       = makeLink(15.411, 60.143, 34.81, 135.53, 40.00);
links["Cetus"]            = makeLink(26.579, -11.867, 34.81, 135.53, 60.00);
links["Perseus"]          = makeLink(50.446, 42.095, 34.81, 135.53, 40.00);
links["Aries"]            = makeLink(37.876, 20.118, 34.81, 135.53, 40.00);
links["Triangulum"]       = makeLink(30.39, 32.128, 34.81, 135.53, 40.00);

// ▼ 冬の星座
links["Gemini"]      = makeLink(105.401, 21.961, 34.81, 135.53, 40.00);
links["Auriga"]      = makeLink(90.477, 41.999, 34.81, 135.53, 40.00);
links["Taurus"]      = makeLink(67.888, 18.056, 34.81, 135.53, 40.00);
links["Orion"]       = makeLink(80.351, 3.025, 34.81, 135.53, 40.00);
links["Canis-Major"] = makeLink(100.278, -24.026, 34.81, 135.53, 40.00);
links["Canis-Minor"] = makeLink(112.857, 5.943, 34.81, 135.53, 40.00);
links["Eridanus"]    = makeLink(57.77, -29.92, 34.81, 135.53, 60.00);
links["Lepus"]       = makeLink(81.539, -19.978, 34.81, 135.53, 40.00);

// ▼ 南の星座
links["Lupus"]                          = makeLink(225.425, -40.103, 34.81, 135.53, 40.00);
links["Centaurus"]                      = makeLink(200.39, -47.137, 34.81, 135.53, 40.00);
links["Ara"]                            = makeLink(258.045, -55.031, 34.81, 135.53, 40.00);
links["Argo-Puppis-Vela-Carina-Pyxis"]  = makeLink(130.126, -62.094, 34.81, 135.53, 70.00);