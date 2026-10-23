# y2k-slidev

真珠色のグラデーションに、ビビッドなピンク、レトロ 3D の見出し、クロームの銀、すりガラスのウィンドウを重ねた Y2K 風の [Slidev](https://sli.dev) テーマとアドオンのモノレポ。

| package | 内容 |
| ------- | ---- |
| [`slidev-theme-y2k`](./packages/slidev-theme-y2k) | 背景・配色・文字・レイアウト (cover / toc / profile / default / section / two-cols / image-left / image-right / code / code-compare / statement / qa / end) |
| [`slidev-addon-y2k`](./packages/slidev-addon-y2k) | コンポーネント (Y2kWindow / Y2kSteps / Y2kCodeSteps / Y2kHeart / Y2kSparkle / Y2kBubble) |

## 使い方

```md
---
theme: slidev-theme-y2k
addons:
  - slidev-addon-y2k
---
```

テーマのレイアウトはアドオンのコンポーネントを使います。Slidev はテーマの package.json に書いた `slidev.addons` を読まないので、デッキの `addons:` にもアドオンを書いてください。

ローカルで確認するときは `pnpm install` のあと `pnpm --filter slidev-theme-y2k dev` を実行します。

## 背景

背景のグラデーションは全スライド共通のレイヤー (`global-bottom.vue`) に 1 枚だけ置き、32 秒かけてゆっくり往復させています。その上に、ときどき横切る光の筋、小さなきらめき、細かな粒子を重ねています。スライドごとに背景を描いていないので、ページを送っても動きは途切れません。

- 往復の時間は CSS 変数 `--y2k-bg-duration` で変えられます
- PDF や PNG に書き出すときと、OS で「視差効果を減らす」(`prefers-reduced-motion`) を有効にしているときは止まります
- 1 枚だけ別の背景にしたいときは、frontmatter に `background:` を書きます

## レイアウト

| layout | 用途 | 主な frontmatter |
| ------ | ---- | ---------------- |
| `cover` | 表紙 | `title` / `eyebrow` (タイトル上の小さな英字) / `subtitle` (発表者名など) / `decor: false` で装飾を消す |
| `toc` | 目次 | 各スライドの `toc: ラベル` を並べる (`tocLevel: 2` で子項目)。1 つも無ければスライドタイトルの階層を使う。`columns: 2` で 2 段組み |
| `profile` | 自己紹介 | `name` (末尾の括弧書きは小さく出る) / `affiliation` / `image` / `links` / `sections`。本文 (md) を書くと `sections` の代わりに右に出る |
| `default` | 本文 | 見出しは md の `# 見出し` で書く。`eyebrow` で見出しの上に小さな英字を出す |
| `section` | 章扉 | `title` / `no` (章番号) / `eyebrow` (既定は `Chapter`) / `decor: false` |
| `two-cols` | 2 カラム | `title` / `ratio` / `reverse` / `align`。本文が左、`::right::` 以降が右。`::left::` を使うと、その前の本文が全幅のリード文になる |
| `image-left` / `image-right` | 画像と説明 | `title` / `image` / `url` (窓のアドレスバーに出す文字) / `frame: false` で窓に入れない / `ratio` |
| `code` | 説明とコード | `title` / `file` (コードの窓のファイル名) / `ratio` (説明:コード、既定は `2:3`) / `reverse` / `codeSize`。本文が説明、`::code::` 以降がコード、`::lead::` は全幅のリード文になる |
| `code-compare` | コードの Before / After | `title` / `beforeCaption` / `afterCaption` / `ratio` / `arrow` / `codeSize`。本文が Before、`::after::` 以降が After |
| `statement` | キーメッセージ | `title` (大きな一文) / `label` / `subtitle` / `image`。本文は一文の下の説明 |
| `qa` | 問いと答え | `title` が問い、本文が答え。答えはクリックで出る (`click: false` で最初から出す) / `credit` |
| `end` | 締め | `message` (既定は `Thank you`) / `decor: false`。本文は補足になる |

## コンポーネント

```md
<Y2kWindow title="Mission" label="01" :stack="2">
  Enter your grand mission statement.
</Y2kWindow>

<Y2kHeart class="y2k-decor" :size="110" style="left: 2%; top: 20%" />
<Y2kSparkle class="y2k-decor" :size="120" style="left: 45%; bottom: 4%" />
<Y2kBubble class="y2k-decor" :size="120" style="right: 2%; bottom: 6%" />
```

- `Y2kWindow`: すりガラスのウィンドウです。縁はホログラムの細い線です。`color` は `pink` (既定) / `pearl` / `rose` / `ice` / `noir` (暗いガラス) から選べます。`label` はタイトルバーの右の小さな英字、`stack` は後ろに重ねる枚数です
- `Y2kHeart` / `Y2kSparkle` / `Y2kBubble`: クロームのハート、キラキラ星、シャボン玉です。ゆっくり動きます。止めたいときは `:float="false"` (星は `:twinkle="false"`) を指定します
- 装飾に `class="y2k-decor"` を付けるとスライド上の好きな位置に置けます。位置は `style` の `top` / `left` などで指定します。クリックは下の要素に届きます

## 手順とコードの説明

```md
<Y2kSteps :current="2" :steps="[
  { title: 'Install', description: 'テーマとアドオンを入れる', items: ['pnpm add', { text: 'addons に書く', highlight: true }] },
  { title: 'Write', items: ['layout を選ぶ'] },
]" />

<Y2kCodeSteps :steps="[
  { title: '型で受け取る', text: '案件は <em>Deal</em> 型で受け取る', lines: '1-5' },
  '説明だけの項目は文字列で書ける',
]" />
```

- `Y2kSteps`: 手順を横に並べます。`variant` は `card` (すりガラスのカード、既定) と `chevron` (矢羽根) から選べます。`current` 番目までをピンクにし、残りを薄くします。v-click で 1 つずつ進めるときは `:current="$clicks + 1"` を指定します
- `Y2kCodeSteps`: `code` レイアウトの説明側に置き、コードの行ハイライト (`{1-5|8-12}`) と同じクリックで説明を 1 つずつ強調します。`text` の `<em>` はピンクになります
