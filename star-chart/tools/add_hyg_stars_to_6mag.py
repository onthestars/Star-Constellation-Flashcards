import csv
import json
import math
from pathlib import Path

# フォルダー設定
ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"

OLD_JSON = DATA / "stars-hyg.json"
SOURCE_CSV = DATA / "source" / "hyg_v42.csv"

# 既存ファイルを上書きしないテスト用ファイル
OUTPUT_JSON = DATA / "stars-hyg-v42-6mag-test.json"


def main():
    # 既存の恒星データを読み込む
    with open(OLD_JSON, "r", encoding="utf-8") as f:
        old_stars = json.load(f)

    # HYG v4.2 CSVを読み込む
    hyg_by_hip = {}

    with open(
        SOURCE_CSV,
        "r",
        encoding="utf-8-sig",
        newline=""
    ) as f:
        reader = csv.DictReader(f)

        for row in reader:
            hip_text = (row.get("hip") or "").strip()

            if not hip_text:
                continue

            try:
                hip = int(float(hip_text))
                mag = float(row["mag"])
                ra = float(row["ra"])
                dec = float(row["dec"])
            except (ValueError, TypeError, KeyError):
                continue

            if not all(math.isfinite(v) for v in (mag, ra, dec)):
                continue

            if mag > 6.0 and hip not in {10826, 55302}:
               continue

            hyg_by_hip[hip] = row

    # 既存データを保持しながら更新する
    new_stars = []
    existing_hips = set()

    updated = 0

    for original in old_stars:
        star = original.copy()

        star_id = str(star.get("id", ""))

        if star_id.startswith("hip-"):
            try:
                hip = int(star_id[4:])
            except ValueError:
                hip = None

            if hip is not None:
                existing_hips.add(hip)
                source = hyg_by_hip.get(hip)

                if source is not None:
                    star["ra"] = float(source["ra"]) * 15.0
                    star["dec"] = float(source["dec"])
                    star["mag"] = float(source["mag"])
                    star["con"] = source.get("con", "")
                    star["spect"] = source.get("spect", "")
                    updated += 1

        new_stars.append(star)

    # 既存データにないHIP恒星を追加する
    added = 0

    additional_stars = []

    for hip, source in hyg_by_hip.items():
        if hip in existing_hips:
            continue

        star = {
            "id": f"hip-{hip}",
            "ra": float(source["ra"]) * 15.0,
            "dec": float(source["dec"]),
            "mag": float(source["mag"]),
            "con": source.get("con", ""),
            "spect": source.get("spect", "")
        }

        additional_stars.append(star)
        added += 1

    # 追加分は明るい順に並べる
    additional_stars.sort(key=lambda star: star["mag"])

    new_stars.extend(additional_stars)

    # テスト用JSONを書き出す
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(
            new_stars,
            f,
            ensure_ascii=False,
            indent=2
        )

    # 結果を表示
    print("===== 6等星までの恒星データ作成結果 =====")
    print("元の恒星数:", len(old_stars))
    print("HYG v4.2の対象HIP恒星数:", len(hyg_by_hip))
    print("既存恒星の更新数:", updated)
    print("新しく追加した恒星数:", added)
    print("完成した恒星数:", len(new_stars))
    print("出力ファイル:", OUTPUT_JSON.name)

    # HIP番号の重複確認
    ids = [star["id"] for star in new_stars]
    print("ID重複数:", len(ids) - len(set(ids)))

    # みなみのうお座のHIP 107608を確認
    target = next(
        (s for s in new_stars if s["id"] == "hip-107608"),
        None
    )

    print("HIP 107608:", target)


if __name__ == "__main__":
    main()