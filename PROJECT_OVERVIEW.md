# PROJECT_OVERVIEW.md

# トレミーの48星座カード

## プロジェクト概要

トレミーの48星座をカード形式で学習するためのWebアプリ。

主な目的は、

- トレミーの48星座の学習
- 季節ごとの星空理解
- 実際の星空との対応確認
- 星空写真記録のアーカイブ

である。

主な利用環境はスマートフォン縦画面。

---

# システム概要

本プロジェクトは、

```text
カード画像
↓
カード表示
↓
季節移動
↓
星図連携
↓
Special Viewer
```

を中核とする。

また補助機能として、

```text
背景画像
月アニメーション
効果音
```

を持つ。

---

# ディレクトリ構造

```text
app
└─ src
   └─ main
      ├─ css
      ├─ image
      ├─ js
      ├─ sound
      └─ res
```

---

# imageフォルダ構成

```text
image
├─ spring
│   ├─ Q
│   ├─ A
│   ├─ other
│   └─ Special
│
├─ summer
│   ├─ Q
│   ├─ A
│   ├─ other
│   └─ Special
│
├─ autumn
│   ├─ Q
│   ├─ A
│   └─ Special
│
├─ winter
│   ├─ Q
│   ├─ A
│   ├─ other
│   └─ Special
│
├─ south
│   ├─ Q
│   ├─ A
│   └─ Special
│
├─ moon
│   └─ Special
│
├─ common
└─ icon
```

---

# JavaScript構成

## コアファイル

### main.js

アプリ全体の初期化および状態管理。

管理状態

```javascript
currentSeason
index
isBack
isFinalNull
animationClass
```

---

### navigation.js

カード移動制御。

機能

```text
前へ
次へ
スワイプ
季節自動判定
```

---

### viewer.js

カード表示制御。

機能

```text
カード表示
表裏切替
Specialボタン制御
星図リンク制御
```

---

# データ管理

## images.js

プロジェクトの最重要ファイル。

管理内容

```text
カード画像一覧

裏面生成

seasonStart

detectSeasonByIndex()

ARGO_Q_INDEX
```

---

## data-links.js

星図リンク管理。

```text
RA
DEC
FOV
```

からリンク生成。

---

## data-special.js

Special Viewer用データ。

管理内容

```text
画像

キャプション

星座線あり

星座線なし
```

---

## data-season.js

季節ボタン画像管理。

---

# Special Viewer

関連ファイル

```text
viewer.js

data-special.js

star-special-viewer.js
```

機能

```text
写真表示

星座線ON/OFF

スワイプ

キャプション表示
```

---

# Moon Viewer

関連ファイル

```text
moon-special-viewer.js

moon-animation.js
```

機能

```text
月画像表示

スワイプ

前後移動

月軌道アニメーション
```

---

# 状態管理

状態は main.js に集約される。

| 変数 | 説明 |
|--------|--------|
| currentSeason | 現在の季節 |
| index | 現在表示中のカード |
| isBack | 表裏状態 |
| isFinalNull | 終端カード状態 |
| animationClass | アニメーション状態 |

---

# システム依存関係

本アプリは images.js の配列順序に依存する。

依存箇所

```text
seasonStart

detectSeasonByIndex()

links[]

ARGO_Q_INDEX

hasPhotoFor()

getStarNameFromIndex()
```

カードの追加・削除・並び替えを行う場合は注意すること。

---

# 命名規則

## カード

表面

```text
card-Leo-Q.png
```

裏面

```text
card-Leo-A.png
```

意味

```text
Q = Question
A = Answer
```

---

## Special画像

星座線なし

```text
Leo-noline-pic01.jpg
```

星座線あり

```text
Leo-lines-pic01.jpg
```

---

## 月画像

```text
Moon-pic001.jpg
```

---

# データ追加手順

## 星座カード追加

1. Qカード作成
2. Aカード作成
3. images.jsへ追加
4. 必要に応じてdata-links.jsへ追加

---

## Special追加

編集箇所

```text
data-special.js

viewer.js
  hasPhotoFor()

star-special-viewer.js
  getStarNameFromIndex()

star-special-viewer.js
  getSpecialFolder()
```

---

## 月画像追加

編集箇所

```text
moonImages[]

moonCaptions[]
```

---

# 既知の課題

## index依存設計

現在のシステムは images.js の配列順序に依存する。

そのため、

```text
カード追加
カード削除
カード並び替え
```

の際には動作確認が必要。

---

## Special管理の分散

Special対象の管理が以下に分散している。

```text
viewer.js

data-special.js

star-special-viewer.js
```

---

# 将来改善候補

優先度A

```text
images.js依存の低減
```

優先度B

```text
links[]のindex依存解消
```

優先度C

```text
seasonStartの自動生成
```

優先度D

```text
Special対象管理の一元化
```

---

# 権利表記

© トレミーの48星座カード All rights reserved.