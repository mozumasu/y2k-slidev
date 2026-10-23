// vue-tsc 用の型シム。

// Vite が実行時に定義する import.meta.env の最小型。vite は workspace の
// 直接依存ではなく vite/client の型を参照できないため自前で宣言する
interface ImportMeta {
  readonly env: {
    readonly DEV: boolean
    readonly PROD: boolean
    readonly BASE_URL: string
  }
}

// SVG は Vite が URL 文字列として解決する
declare module '*.svg' {
  const url: string
  export default url
}

// PNG も Vite が URL 文字列として解決する (base 付き・ハッシュ付きの配信パスになる)
declare module '*.png' {
  const url: string
  export default url
}

declare module '*.webp' {
  const url: string
  export default url
}

// CSS は Vite が読み込む副作用 import (TypeScript 6 から型の解決を求められる)
declare module '*.css' {}
