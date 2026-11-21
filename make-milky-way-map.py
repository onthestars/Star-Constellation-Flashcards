# コマンド py .\make-milky-way-map.py

from scipy.interpolate import griddata
import csv
from pathlib import Path

import json
import numpy as np
import matplotlib.pyplot as plt
import astropy.units as u
from astropy.coordinates import ICRS
from astropy_healpix import HEALPix
from astropy.coordinates import SkyCoord

# CSVの場所
base_dir = Path(__file__).resolve().parent
csv_path = base_dir / "star-chart" / "data" / "gaia-dr3-star-density.csv"

# CSVを読み込む
pixels = []
counts = []

with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
    reader = csv.DictReader(f)

    if not reader.fieldnames:
        raise ValueError("CSVの列名を読み取れません。")

    reader.fieldnames = [name.strip() for name in reader.fieldnames]

    if "healpix" not in reader.fieldnames or "star_count" not in reader.fieldnames:
        raise ValueError(f"CSVの列名が想定と異なります: {reader.fieldnames}")

    for row in reader:
        pixels.append(int(row["healpix"]))
        counts.append(int(row["star_count"]))

pixels = np.array(pixels)
counts = np.array(counts)

# データの基本チェック
if len(pixels) != 49152:
    raise ValueError(f"区画数が想定と異なります: {len(pixels)}行")

if np.any(pixels < 0) or np.any(pixels >= 49152):
    raise ValueError("HEALPixの区画番号に範囲外の値があります。")

if len(np.unique(pixels)) != len(pixels):
    raise ValueError("同じ区画番号が重複しています。")

# HEALPixの区画中心を赤経・赤緯に変換
# GaiaのHEALPix区画番号はNested方式として扱う
hp = HEALPix(nside=64, order="nested", frame=ICRS())
sky = hp.healpix_to_skycoord(pixels)


# ==========================================
# HEALPix座標変換の往復チェック
# ==========================================

roundtrip_pixels = hp.skycoord_to_healpix(sky)

mismatch_count = np.count_nonzero(
    pixels != roundtrip_pixels
)

print("\nHEALPix座標変換チェック")
print(f"変換した区画数: {len(pixels):,}")
print(f"一致しなかった区画数: {mismatch_count:,}")

if mismatch_count == 0:
    print("OK: すべての区画番号が一致しました")
else:
    print("注意: 区画番号に不一致があります")

ra = sky.ra.wrap_at(180 * u.deg).radian
dec = sky.dec.radian

# 赤道座標から銀河座標へ変換
galactic = SkyCoord(
    ra=sky.ra,
    dec=sky.dec,
    frame="icrs"
).galactic

# 天球の全天密度マップを描画
density = np.log10(counts + 1)

fig = plt.figure(figsize=(13, 7))
ax = fig.add_subplot(111, projection="mollweide")

scatter = ax.scatter(
    -ra,
    dec,
    c=density,
    s=5,
    cmap="inferno",
    linewidths=0,
    rasterized=True
)

ax.grid(True, alpha=0.3)
ax.set_title("Gaia DR3 Star Density (G < 17)", pad=18)

colorbar = fig.colorbar(
    scatter,
    ax=ax,
    orientation="horizontal",
    pad=0.08,
    fraction=0.05
)
colorbar.set_label("log10(star count + 1)")

plt.savefig(
    base_dir / "gaia-dr3-density-map.png",
    dpi=180,
    bbox_inches="tight"
)

plt.show()

print("\n銀河面からの角度別・恒星数の平均")

abs_b = np.abs(galactic.b.deg)

for lower in range(0, 90, 5):
    upper = lower + 5
    mask = (abs_b >= lower) & (abs_b < upper)

    if np.any(mask):
        print(
            f"|b| {lower:2d}～{upper:2d}度: "
            f"平均 {counts[mask].mean():,.1f}個 / 区画"
        )

print("全天マップを作成しました。")
print(f"区画数: {len(pixels)}")
print(f"恒星数の最小値: {counts.min():,}")
print(f"恒星数の最大値: {counts.max():,}")
print(f"恒星数の中央値: {np.median(counts):,.0f}")

print(f"恒星数の平均値: {counts.mean():,.2f}")
print(f"恒星数の上位10%の境界: {np.percentile(counts, 90):,.0f}")
print(f"恒星数の上位1%の境界: {np.percentile(counts, 99):,.0f}")

print("恒星数の分布:")
for value in [100, 300, 500, 1000, 2000, 5000, 10000]:
    print(f"{value:>6}個以上: {np.count_nonzero(counts >= value):>6}区画")


# ==========================================
# 銀河経度ごとの恒星密度を調べる
# ==========================================

longitude = galactic.l.deg
abs_b = np.abs(galactic.b.deg)

print("\n銀河経度ごとの恒星密度")
print("経度範囲 | 銀河面付近 | 高緯度側 | 比率")

for start in range(0, 360, 30):
    end = start + 30

    sector = (longitude >= start) & (longitude < end)

    inner = sector & (abs_b < 5)
    outer = sector & (abs_b >= 30) & (abs_b < 40)

    if np.any(inner) and np.any(outer):
        inner_mean = counts[inner].mean()
        outer_mean = counts[outer].mean()

        print(
            f"{start:3d}～{end:3d}度 | "
            f"{inner_mean:8,.1f} | "
            f"{outer_mean:8,.1f} | "
            f"{inner_mean / outer_mean:5.1f}倍"
        )

# ==========================================
# 銀河座標による長方形の密度マップ
# ==========================================

fig = plt.figure(figsize=(14, 7))
ax = fig.add_subplot(111)

scatter = ax.scatter(
    longitude,
    galactic.b.deg,
    c=np.log10(counts + 1),
    s=4,
    cmap="inferno",
    linewidths=0,
    rasterized=True
)

ax.set_xlim(0, 360)
ax.set_ylim(-90, 90)
ax.set_xlabel("Galactic Longitude (degrees)")
ax.set_ylabel("Galactic Latitude (degrees)")
ax.set_title("Gaia DR3 - Galactic Density Map")
ax.grid(True, alpha=0.3)

colorbar = fig.colorbar(scatter, ax=ax)
colorbar.set_label("log10(star count + 1)")

plt.savefig(
    base_dir / "gaia-dr3-galactic-detail.png",
    dpi=180,
    bbox_inches="tight"
)

plt.show()


# ==========================================
# Gaia ArchiveとHEALPix番号を照合
# ==========================================

check_csv_path = (
    base_dir / "star-chart" / "data" / "gaia-healpix-check.csv"
)

gaia_pixels = []
python_pixels = []

with open(check_csv_path, newline="", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)

    for row in reader:
        ra_value = float(row["ra"])
        dec_value = float(row["dec"])
        gaia_pixel = int(float(row["healpix"]))

        coord = SkyCoord(
            ra=ra_value * u.deg,
            dec=dec_value * u.deg,
            frame="icrs"
        )

        python_pixel = int(hp.skycoord_to_healpix(coord))

        gaia_pixels.append(gaia_pixel)
        python_pixels.append(python_pixel)

gaia_pixels = np.array(gaia_pixels)
python_pixels = np.array(python_pixels)

mismatch = gaia_pixels != python_pixels
mismatch_count = np.count_nonzero(mismatch)

print("\nGaia ArchiveとのHEALPix照合")
print(f"照合した恒星数: {len(gaia_pixels):,}")
print(f"一致しなかった数: {mismatch_count:,}")

if mismatch_count == 0:
    print("OK: すべてのHEALPix番号が一致しました")
else:
    print("注意: 不一致があります")
    print("不一致例（最大10件）:")

    for i in np.flatnonzero(mismatch)[:10]:
        print(
            f"Gaia={gaia_pixels[i]}, "
            f"Python={python_pixels[i]}"
        )


# ==========================================
# HEALPix隣接区画による密度平滑化テスト
# ==========================================

# HEALPixの区画番号を配列の添字として使える形にする
count_by_pixel = np.zeros(hp.npix, dtype=float)
count_by_pixel[pixels] = counts

# 各区画の隣接区画番号を取得
neighbors = hp.neighbours(pixels)

# 隣接区画のうち有効なものの数
neighbor_counts = np.sum(neighbors >= 0, axis=0)

# 平滑化をn回行う
smoothed_counts = count_by_pixel[pixels].copy()

for _ in range(1): #【調整対象】

    # 現在の密度を区画番号で参照できるようにする
    smoothed_by_pixel = np.zeros(hp.npix, dtype=float)
    smoothed_by_pixel[pixels] = smoothed_counts

    # 自分自身の密度から合計を開始
    next_smoothed = smoothed_counts.copy()

    # 隣接区画の密度を加算
    for i in range(neighbors.shape[0]):
        neighbor_ids = neighbors[i]
        valid = neighbor_ids >= 0

        next_smoothed[valid] += smoothed_by_pixel[
            neighbor_ids[valid]
        ]

    # 実際に存在する区画数で平均
    smoothed_counts = next_smoothed / (neighbor_counts + 1)

# 平滑化した全天マップを保存
fig = plt.figure(figsize=(12, 6))
ax = fig.add_subplot(111, projection="mollweide")

smoothed_log = np.log10(smoothed_counts + 1)

scatter = ax.scatter(
    ra,
    dec,
    c=smoothed_log,
    s=2,
    cmap="gray",
    rasterized=True
)

ax.grid(True, alpha=0.3)
ax.set_title("Gaia DR3 - Smoothed Galactic Star Density")

fig.colorbar(
    scatter,
    ax=ax,
    label="log10(smoothed star count + 1)"
)

plt.savefig(
    base_dir / "gaia-dr3-galactic-map-smoothed.png",
    dpi=180,
    bbox_inches="tight"
)

plt.show()
plt.close(fig)

print("\n平滑化テスト画像を保存しました。")
print("gaia-dr3-galactic-map-smoothed.png")


# ==========================================
# 天の川の輪郭抽出・試作
# ==========================================

# 銀河経度・銀河緯度を再計算
galactic = SkyCoord(
    ra=sky.ra,
    dec=sky.dec,
    frame="icrs"
).galactic

gal_l = galactic.l.wrap_at(180 * u.deg).radian
gal_b = galactic.b.radian

# 銀河経度・銀河緯度を度に変換
lon_deg = np.degrees(gal_l)
lat_deg = np.degrees(gal_b)

# 経度の境界をまたいでも補間できるようにデータを複製
lon_extended = np.concatenate([
    lon_deg - 360,
    lon_deg,
    lon_deg + 360
])

lat_extended = np.tile(lat_deg, 3)
density_extended = np.tile(smoothed_counts, 3)

# 全天を0.5度間隔の格子にする
grid_lon = np.linspace(-180, 180, 721)
grid_lat = np.linspace(-90, 90, 361)

mesh_lon, mesh_lat = np.meshgrid(grid_lon, grid_lat)

# 恒星密度を格子上に補間
grid_density = griddata(
    (lon_extended, lat_extended),
    density_extended,
    (mesh_lon, mesh_lat),
    method="linear"
)

# 補間できなかった部分を最近傍値で補う
missing = np.isnan(grid_density)

if np.any(missing):
    nearest_density = griddata(
        (lon_extended, lat_extended),
        density_extended,
        (mesh_lon[missing], mesh_lat[missing]),
        method="nearest"
    )
    grid_density[missing] = nearest_density

# 輪郭候補を描画
fig, ax = plt.subplots(figsize=(14, 7))

image = ax.imshow(
    np.log10(grid_density + 1),
    extent=[-180, 180, -90, 90],
    origin="lower",
    aspect="auto",
    cmap="gray"
)

levels = [1500, 2500, 3000]

contours = ax.contour(
    mesh_lon,
    mesh_lat,
    grid_density,
    levels=levels,
    colors=["cyan", "yellow", "red"],
    linewidths=1.2
)

ax.clabel(
    contours,
    inline=True,
    fontsize=9,
    fmt="%d"
)

ax.set_title("Milky Way Boundary - Trial")
ax.set_xlabel("Galactic Longitude (degrees)")
ax.set_ylabel("Galactic Latitude (degrees)")
ax.set_xlim(-180, 180)
ax.set_ylim(-90, 90)
ax.grid(alpha=0.25)

fig.colorbar(
    image,
    ax=ax,
    label="log10(smoothed star count + 1)"
)

plt.savefig(
    base_dir / "milky-way-boundary-trial.png",
    dpi=180,
    bbox_inches="tight"
)

plt.show()
plt.close(fig)

print("\n天の川の輪郭試作画像を保存しました。")
print("milky-way-boundary-trial.png")


# ==========================================
# 黄色の輪郭（n個）を抽出して赤道座標へ変換
# ==========================================

# 黄色の輪郭を抽出
yellow_contour = ax.contour(
    mesh_lon,
    mesh_lat,
    grid_density,
    levels=[3750], #【調整対象】
    colors=["yellow"]
)

# 輪郭線の座標を取得
contour_segments = yellow_contour.allsegs[0]

# 銀河座標から赤道座標へ変換
boundary_ra = []
boundary_dec = []

for segment in contour_segments:
    if len(segment) < 3:
        continue

    galactic_coords = SkyCoord(
        l=segment[:, 0] * u.deg,
        b=segment[:, 1] * u.deg,
        frame="galactic"
    )

    icrs_coords = galactic_coords.icrs

    boundary_ra.extend(icrs_coords.ra.deg.tolist())
    boundary_dec.extend(icrs_coords.dec.deg.tolist())

    print(f"輪郭のまとまり数: {len(contour_segments)}")
print("各輪郭の点数:", [len(s) for s in contour_segments])

print("\n黄色の輪郭抽出結果")
print(f"輪郭点数: {len(boundary_ra):,}")
print(f"赤経の範囲: {min(boundary_ra):.3f} ～ {max(boundary_ra):.3f} 度")
print(f"赤緯の範囲: {min(boundary_dec):.3f} ～ {max(boundary_dec):.3f} 度")


# ==========================================
# 輪郭の整理（n点以上を採用）
# ==========================================

MIN_CONTOUR_POINTS = 20 #【調整対象】

boundary_segments = []

for segment in contour_segments:
    if len(segment) < MIN_CONTOUR_POINTS:
        continue

    # 銀河座標
    galactic_coords = SkyCoord(
        l=segment[:, 0] * u.deg,
        b=segment[:, 1] * u.deg,
        frame="galactic"
    )

    # 赤道座標へ変換
    icrs_coords = galactic_coords.icrs

    boundary_segments.append({
        "ra": icrs_coords.ra.deg.tolist(),
        "dec": icrs_coords.dec.deg.tolist()
    })

print("\n整理後の輪郭")
print(f"採用した輪郭数: {len(boundary_segments)}")

for i, segment in enumerate(boundary_segments):
    print(
        f"輪郭 {i + 1}: "
        f"{len(segment['ra'])} 点"
    )

print(
    "合計点数:",
    sum(len(segment["ra"]) for segment in boundary_segments)
)


# ==========================================
# 天の川の輪郭をJSONファイルに保存
# ==========================================

output_data = {
    "segments": boundary_segments
}

json_path = base_dir / "star-chart" / "data" / "milky-way-boundary.json"

with open(json_path, "w", encoding="utf-8") as f:
    json.dump(
        output_data,
        f,
        ensure_ascii=False,
        indent=2
    )

print("\n天の川の輪郭データを保存しました。")
print(f"保存先: {json_path}")
print(f"輪郭数: {len(boundary_segments)}")
print(
    "座標点数:",
    sum(len(segment["ra"]) for segment in boundary_segments)
)