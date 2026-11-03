# convert_constellationship.py

import json
from pathlib import Path

SOURCE = Path("../data/source/constellationship.fab")
OUTPUT = Path("../data/constellation-lines-test.json")

NAME_MAP = {
    "And": "アンドロメダ座",
    "Aql": "わし座",
    "Aqr": "みずがめ座",
    "Ara": "さいだん座",
    "Ari": "おひつじ座",
    "Aur": "ぎょしゃ座",
    "Boo": "うしかい座",
    "Cnc": "かに座",
    "CMa": "おおいぬ座",
    "CMi": "こいぬ座",
    "Cap": "やぎ座",
    "Car": "りゅうこつ座",
    "Cas": "カシオペヤ座",
    "Cen": "ケンタウルス座",
    "Cep": "ケフェウス座",
    "Cet": "くじら座",
    "CrB": "かんむり座",
    "Crv": "からす座",
    "Crt": "コップ座",
    "Cyg": "はくちょう座",
    "Del": "いるか座",
    "Dra": "りゅう座",
    "Equ": "こうま座",
    "Eri": "エリダヌス座",
    "Gem": "ふたご座",
    "Her": "ヘルクレス座",
    "Hya": "うみへび座",
    "Leo": "しし座",
    "Lep": "うさぎ座",
    "Lib": "てんびん座",
    "Lup": "おおかみ座",
    "Lyr": "こと座",
    "Oph": "へびつかい座",
    "Ori": "オリオン座",
    "Peg": "ペガスス座",
    "Per": "ペルセウス座",
    "Psc": "うお座",
    "PsA": "みなみのうお座",
    "Pup": "とも座",
    "Pyx": "らしんばん座",
    "Sge": "や座",
    "Sgr": "いて座",
    "Sco": "さそり座",
    "Ser": "へび座",
    "Tau": "おうし座",
    "Tri": "さんかく座",
    "UMa": "おおぐま座",
    "UMi": "こぐま座",
    "Vel": "ほ座",
    "Vir": "おとめ座",
    "Qua": "しぶんぎ座"
}

# 元データとNAME_MAPの照合
source_codes = set()

with SOURCE.open("r", encoding="utf-8") as f:
    for line in f:
        parts = line.split()

        if len(parts) >= 2 and parts[1].isdigit():
            source_codes.add(parts[0])

print("\n--- 星座略号の照合結果 ---")

print("元データにあるがNAME_MAPにない略号:")
print(sorted(source_codes - NAME_MAP.keys()))

print("NAME_MAPにあるが元データにない略号:")
print(sorted(NAME_MAP.keys() - source_codes))

print("NAME_MAP登録数:", len(NAME_MAP))
print("元データとの一致数:", len(source_codes & NAME_MAP.keys()))

TARGETS = set(NAME_MAP.keys())

constellations = []

with open(SOURCE, "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()

        if not line or line.startswith("#"):
            continue

        parts = line.split()

        constellation_id = parts[0]

        if constellation_id not in TARGETS:
            continue

        segment_count = int(parts[1])

        values = list(map(int, parts[2:]))

        if len(values) != segment_count * 2:
            print(
                f"警告: {constellation_id} "
                f"線分数不一致 "
                f"({segment_count}本 / {len(values)//2}本)"
            )

        segments = []

        for i in range(0, len(values) - 1, 2):
            segments.append([
                f"hip-{values[i]}",
                f"hip-{values[i + 1]}"
            ])

        constellations.append({
            "id": constellation_id,
            "name": NAME_MAP[constellation_id],
            "lineColor": "#FF3CC8",
            "segments": segments
        })

result = {
    "constellations": constellations
}

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(
        result,
        f,
        ensure_ascii=False,
        indent=2
    )

print(f"{len(constellations)}星座を書き出しました")
print(f"出力先: {OUTPUT}")