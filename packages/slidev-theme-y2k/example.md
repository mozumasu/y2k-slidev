---
theme: ./
addons:
  - slidev-addon-y2k
title: Pearl & Chrome
layout: cover
eyebrow: Slidev Night · 2026
subtitle: "@mozumasu"
---

パステルのグラデーションがゆっくり動く Y2K テーマ

---
layout: toc
title: Agenda
---

---
layout: profile
name: もずます (mozumasu)
affiliation: "Software Engineer\nターミナルと dotfiles が好き"
image: /example-avatar.svg
links:
  - label: "X: @mozumasu"
    url: https://x.com/mozumasu
  - label: "GitHub: mozumasu"
    url: https://github.com/mozumasu
sections:
  - title: Work
    description: 開発環境と CI を整える仕事をしています
  - title: Like
    description: Neovim、WezTerm、Nix
  - title: Talk
    description: ターミナルの便利な使い方をよく話します
---

---
layout: section
no: "01"
title: About
toc: About
---

---
eyebrow: Our Statement
---

# Mission & Vision

<div class="grid grid-cols-2 gap-12 px-4 mt-4">
  <Y2kWindow title="Mission" label="01" class="h-56">
    Enter your grand mission statement.
  </Y2kWindow>
  <Y2kWindow title="Vision" label="02" color="noir" class="h-56">
    Enter your grand vision statement.
  </Y2kWindow>
</div>

<Y2kSparkle class="y2k-decor" :size="90" style="left: 46%; bottom: 6%" />
<Y2kBubble class="y2k-decor" :size="140" style="right: -3%; top: -6%" />

---
eyebrow: Variants
---

# Glass Colors

<div class="grid grid-cols-4 gap-6 mt-6">
  <Y2kWindow title="Pink" label="default" :stack="1" class="h-44">color="pink"</Y2kWindow>
  <Y2kWindow title="Pearl" label="02" color="pearl" :stack="1" class="h-44">color="pearl"</Y2kWindow>
  <Y2kWindow title="Ice" label="03" color="ice" :stack="1" class="h-44">color="ice"</Y2kWindow>
  <Y2kWindow title="Noir" label="04" color="noir" :stack="1" class="h-44">color="noir"</Y2kWindow>
</div>

---
eyebrow: Typography
---

# 箇条書きとコード

- 背景は全スライド共通のレイヤーなので、ページを送っても動きが途切れない
- **強調** はローズ、`inline code` はすりガラス
- 書き出し (PDF / PNG) と `prefers-reduced-motion` では背景を止める

```ts
// グラデーションの往復時間はトークンで変えられる
document.documentElement.style.setProperty('--y2k-bg-duration', '40s')
```

---
eyebrow: How it works
---

# 3 Steps

<Y2kSteps class="mt-4" :current="2" :steps="[
  { title: 'Install', description: 'テーマとアドオンを入れる', items: ['pnpm add', { text: 'addons に書く', highlight: true }] },
  { title: 'Write', description: 'md でスライドを書く', items: ['layout を選ぶ', 'Y2kWindow を置く'] },
  { title: 'Share', description: 'ビルドして公開する', items: ['slidev build', 'URL を共有'] },
]" />

---
eyebrow: Roadmap
---

# Chevron

<Y2kSteps class="mt-6" variant="chevron" :current="2" :steps="[
  { title: 'Design', items: ['配色を決める', { text: '背景を動かす', highlight: true }] },
  { title: 'Build', items: ['レイアウト', 'コンポーネント'] },
  { title: 'Polish', items: ['書き出しを確かめる'] },
  { title: 'Ship', items: ['公開する'] },
]" />

---
layout: code
title: Code & Steps
eyebrow: Layout · code
file: topPartners.ts
---

<Y2kCodeSteps :steps="[
  { title: '型で受け取る', text: '案件は <em>Deal</em> 型で受け取る', lines: '1-5' },
  { title: '集計する', text: '<em>パートナーごと</em>に受注額を足す', lines: '8-12' },
  { title: '大きい順に返す', text: '<em>上位 N 社</em>だけを返す', lines: '13-15' },
]" />

::code::

```ts {1-5|8-12|13-15}
interface Deal {
  partnerId: string
  amount: number
  status: 'won' | 'lost' | 'open'
}

export function topPartners(deals: Deal[], limit = 3) {
  const totals = deals
    .filter(deal => deal.status === 'won')
    .reduce((map, { partnerId, amount }) =>
      map.set(partnerId, (map.get(partnerId) ?? 0) + amount),
    new Map<string, number>())
  return [...totals]
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
}
```

---
layout: code-compare
title: Before / After
eyebrow: Layout · code-compare
beforeCaption: 集計の途中経過を変数に持ち回る
afterCaption: 絞り込みと集計を 1 つの流れで読める
codeSize: 0.75rem
---

```ts
const totals = {}
for (const deal of deals) {
  if (deal.status !== 'won')
    continue
  if (!totals[deal.partnerId])
    totals[deal.partnerId] = 0
  totals[deal.partnerId] += deal.amount
}
```

::after::

```ts {3-5}
const totals = new Map<string, number>()
deals
  .filter(d => d.status === 'won')
  .forEach(({ partnerId: id, amount }) =>
    totals.set(id, (totals.get(id) ?? 0) + amount))
```

---
layout: two-cols
title: Two Columns
eyebrow: Layout · two-cols
toc: Layouts
---

左のカラム。Slidev 組み込みの two-cols と同じく、本文が左に入る

- `ratio` で左右の比率を変えられる
- `reverse` で左右を入れ替える

::right::

<Y2kWindow title="Right" label="::right::" class="h-48">
  ::right:: 以降が右のカラムに入る
</Y2kWindow>

---
layout: image-right
title: Screenshot
eyebrow: Layout · image-right
image: /example-screen.svg
url: https://y2k-slidev.localhost
tocLevel: 2
toc: image-left / image-right
---

画面のスクリーンショットを、ブラウザの窓に入れて見せる

- `url` はアドレスバーに出る
- `frame: false` で窓に入れずに置く
- `image-left` は左右反転

---
layout: statement
title: 背景は、止めずにゆっくり動かす
label: Key Message
subtitle: Slow motion keeps the audience calm.
toc: Statement
---

ページを送っても動きが途切れないよう、背景はスライドの下に 1 枚だけ置いています

---
layout: qa
title: 書き出した PDF でも背景は動きますか？
toc: Q&A
---

いいえ。PDF と PNG では、*色が一番重なる位置で止めて* 書き出します

---
layout: end
---

@mozumasu
