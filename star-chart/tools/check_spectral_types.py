# tools/check_spectral_types.py

import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "data" / "stars-hyg-v42.json"


def main():
    with DATA_FILE.open("r", encoding="utf-8") as file:
        stars = json.load(file)

    classes = Counter()
    full_types = Counter()

    missing = 0

    for star in stars:
        spect = str(star.get("spect", "")).strip()

        if not spect:
            missing += 1
            continue

        full_types[spect] += 1

        # スペクトル型の先頭の分類文字を取得
        match = re.match(r"([OBAFGKM])", spect.upper())

        if match:
            classes[match.group(1)] += 1
        else:
            classes["その他"] += 1

    print("恒星スペクトル型の調査")
    print("------------------------------")
    print(f"恒星総数: {len(stars)}")
    print(f"スペクトル型あり: {len(stars) - missing}")
    print(f"スペクトル型なし: {missing}")

    print("\n【スペクトル分類別】")

    for spectral_class in "OBAFGKM":
        print(f"{spectral_class}型: {classes[spectral_class]}")

    print(f"その他: {classes['その他']}")

    print("\n【登録されているスペクトル型】")
    print(f"種類数: {len(full_types)}")

    print("\n出現数の多い上位30種類:")

    for spect, count in full_types.most_common(30):
        print(f"{spect}: {count}")


if __name__ == "__main__":
    main()