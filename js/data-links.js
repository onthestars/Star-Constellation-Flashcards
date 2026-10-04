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

// ▼ links 配列（images.length と同じ長さ）
const links = new Array(images.length).fill(null);

/* 春の星座 */
links[2]  = makeLink(234.777, 77.916, 34.81, 135.53, 40.00);
links[3]  = makeLink(170.33, -15.144, 34.81, 135.53, 40.00);
links[4]  = makeLink(185.341, -18.145, 34.81, 135.53, 40.00);
links[5]  = makeLink(157.816, -20.135, 34.81, 135.53, 90.00);
links[6]  = makeLink(127.367, 14.912, 34.81, 135.53, 40.00);
links[7]  = makeLink(165.396, 57.859, 34.81, 135.53, 40.00);
links[8]  = makeLink(219.034, 29.886, 34.81, 135.53, 40.00);
links[9]  = makeLink(200.338, -2.137, 34.81, 135.53, 40.00);
links[10] = makeLink(157.851, 14.865, 34.81, 135.53, 40.00);
links[11] = makeLink(212.107, 27.583, 34.81, 135.53, 110.00);
links[12] = makeLink(195.194, 8.909, 34.81, 135.53, 100.00);

/* 夏の星座 */
links[22] = makeLink(281.485, 36.029, 34.81, 135.53, 40.00);
links[23] = makeLink(292.835, 2.057, 34.81, 135.53, 40.00);
links[24] = makeLink(307.731, 43.09, 34.81, 135.53, 40.00);
links[25] = makeLink(310.316, 12.095, 34.81, 135.53, 40.00);
links[26] = makeLink(297.797, 18.068, 34.81, 135.53, 40.00);
links[27] = makeLink(285.406, -24.961, 34.81, 135.53, 40.00);
links[28] = makeLink(247.906, -26.056, 34.81, 135.53, 40.00);
links[29] = makeLink(227.867, -14.099, 34.81, 135.53, 40.00);
links[30] = makeLink(255.093, 59.962, 34.81, 135.53, 70.00);
links[31] = makeLink(257.766, 26.968, 34.81, 135.53, 40.00);
links[32] = makeLink(257.852, -5.031, 34.81, 135.53, 60.00);
links[33] = makeLink(235.27, 29.916, 34.81, 135.53, 40.00);
links[34] = makeLink(277.966, -40.98, 34.81, 135.53, 40.00);
links[35] = makeLink(294.678, 29.203, 34.81, 135.53, 100.00);

/* 秋の星座 */
links[49] = makeLink(335.357, -12.865, 34.81, 135.53, 60.00);
links[50] = makeLink(332.885, -31.868, 34.81, 135.53, 40.00);
links[51] = makeLink(312.882, -19.899, 34.81, 135.53, 40.00);
links[52] = makeLink(317.832, 6.11, 34.81, 135.53, 40.00);
links[53] = makeLink(337.822, 20.137, 34.81, 135.53, 40.00);
links[54] = makeLink(5.345, 10.148, 34.81, 135.53, 60.00);
links[55] = makeLink(10.363, 38.146, 34.81, 135.53, 40.00);
links[56] = makeLink(330.138, 70.129, 34.81, 135.53, 40.00);
links[57] = makeLink(15.411, 60.143, 34.81, 135.53, 40.00);
links[58] = makeLink(26.579, -11.867, 34.81, 135.53, 60.00);
links[59] = makeLink(50.446, 42.095, 34.81, 135.53, 40.00);
links[60] = makeLink(37.876, 20.118, 34.81, 135.53, 40.00);
links[61] = makeLink(30.39, 32.128, 34.81, 135.53, 40.00);

/* 冬の星座 */
links[75] = makeLink(105.401, 21.961, 34.81, 135.53, 40.00);
links[76] = makeLink(90.477, 41.999, 34.81, 135.53, 40.00);
links[77] = makeLink(67.888, 18.056, 34.81, 135.53, 40.00);
links[78] = makeLink(80.351, 3.025, 34.81, 135.53, 40.00);
links[79] = makeLink(100.278, -24.026, 34.81, 135.53, 40.00);
links[80] = makeLink(112.857, 5.943, 34.81, 135.53, 40.00);
links[81] = makeLink(57.77, -29.92, 34.81, 135.53, 60.00);
links[82] = makeLink(81.539, -19.978, 34.81, 135.53, 40.00);
links[83] = makeLink(100.852, 0.575, 34.81, 135.53, 100.00);

/* 南の星座 */
links[92] = makeLink(225.425, -40.103, 34.81, 135.53, 40.00);
links[93] = makeLink(200.39, -47.137, 34.81, 135.53, 40.00);
links[94] = makeLink(258.045, -55.031, 34.81, 135.53, 40.00);
links[95] = makeLink(130.126, -62.094, 34.81, 135.53, 70.00);