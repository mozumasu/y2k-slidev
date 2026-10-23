import { defineShikiSetup } from '@slidev/types'

// コードブロックのハイライト。半透明の白地に載せるので、キーワードが紫・赤系の明るいテーマを使う。
// デッキ側で setup/shiki.ts を置けば上書きできる
export default defineShikiSetup(() => ({
  themes: {
    light: 'catppuccin-latte',
    dark: 'catppuccin-mocha',
  },
}))
