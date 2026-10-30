# tools/convert_hyg_v42.py

import csv
import gzip
import json
import re
from pathlib import Path

# プロジェクトのルートフォルダ
ROOT = Path(__file__).resolve().parent.parent

# 入力ファイル
OLD_JSON = ROOT / "data" / "stars-hyg.json"

SOURCE_CSV = ROOT / "data" / "source" / "hyg_v42.csv"
SOURCE_GZ = ROOT / "data" / "source" / "hygdata_v42.csv.gz"

# 出力ファイル（元データは上書きしない）
OUTPUT_JSON = ROOT / "data" / "stars-hyg-v42.json"


def load_hyg_csv():
    if SOURCE_CSV.exists():
        path = SOURCE_CSV
        open_func = open
    elif SOURCE_GZ.exists():
        path = SOURCE_GZ
        open_func = gzip.open
    else:
        raise FileNotFoundError(
            "HYG v4.2 CSVが見つかりません。\n"
            "data/source/ に hygdata_v42.csv または "
            "hygdata_v42.csv.gz を置いてください。"
        )

    print(f"読み込み元: {path}")

    stars_by_hip = {}

    with open_func(
        path, "rt", encoding="utf-8-sig", newline=""
    ) as file:
        reader = csv.DictReader(file)

        for row in reader:
            hip_text = (row.get("hip") or "").strip()

            if not hip_text:
                continue

            try:
                hip = int(float(hip_text))
            except ValueError:
                continue

            stars_by_hip[hip] = row

    return stars_by_hip


def main():
    if not OLD_JSON.exists():
        raise FileNotFoundError(
            f"元データが見つかりません: {OLD_JSON}"
        )

    with OLD_JSON.open("r", encoding="utf-8") as file:
        old_stars = json.load(file)

    hyg_stars = load_hyg_csv()

    matched = 0
    no_hip = 0
    not_found = 0
    no_spect = 0

    new_stars = []

    for original in old_stars:
        star = original.copy()

        # id から HIP番号を取得
        match = re.fullmatch(
            r"hip-(\d+)",
            str(star.get("id", ""))
        )

        if not match:
            no_hip += 1
            new_stars.append(star)
            continue

        hip = int(match.group(1))
        source = hyg_stars.get(hip)

        if source is None:
            not_found += 1
            new_stars.append(star)
            continue

        try:
            # HYGのRAは時間単位なので度に変換
            star["ra"] = float(source["ra"]) * 15.0
            star["dec"] = float(source["dec"])
            star["mag"] = float(source["mag"])
        except (ValueError, TypeError, KeyError):
            not_found += 1
            new_stars.append(star)
            continue

        constellation = (source.get("con") or "").strip()
        if constellation:
            star["con"] = constellation

        spectral_type = (source.get("spect") or "").strip()

        if spectral_type:
            star["spect"] = spectral_type
        else:
            no_spect += 1

        matched += 1
        new_stars.append(star)

    with OUTPUT_JSON.open("w", encoding="utf-8") as file:
        json.dump(
            new_stars,
            file,
            ensure_ascii=False,
            indent=2
        )

    print("\n変換完了")
    print(f"元の恒星数: {len(old_stars)}")
    print(f"HIP照合成功: {matched}")
    print(f"HIP番号なし: {no_hip}")
    print(f"HYGに該当なし・データ不備: {not_found}")
    print(f"スペクトル型なし: {no_spect}")
    print(f"\n出力先: {OUTPUT_JSON}")


if __name__ == "__main__":
    main()