// Slidev 本体 (@slidev/client) の styles/code.css (行番号の ::before に dark- 付き --uno) が
// .dark セレクタを入れ子で展開し、Vite 8 の lightningcss による CSS minify が
// "Invalid token in pseudo element" で落ちるため minify を無効化する。
// テーマに置くとテーマを使うデッキのビルドにも適用される。
// Slidev 52.20.1 / 53.0.0 + Vite 8.3.3 で再現。上流が直ったら削除する
export default {
  build: {
    cssMinify: false,
  },
}
