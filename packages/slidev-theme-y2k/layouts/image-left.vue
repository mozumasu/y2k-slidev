<script setup lang="ts">
import type { ColumnRatio } from '../utils/columns.ts'
import { computed } from 'vue'
import { withBase } from '../utils/withBase.ts'
import TwoCols from './two-cols.vue'

// 図版 (スクリーンショットなど) + テキストの 2 カラム。見出しは frontmatter の title。
// 図版はタイトルバー付きのすりガラスの窓に入れ、バーに url を出せる (ブラウザの画面の見せ方)。
// 図版は image か ::image:: スロットで渡し、本文はテキスト側に入る。
// ::text:: を使った場合は、最初の ::text:: より前の本文を 2 カラムの上に全幅で出す (リード文)。
// image-right はこのレイアウトの左右反転 (side: right)
const {
  image,
  alt = '',
  url,
  frame = true,
  ratio,
  align = 'center',
  side = 'left',
} = defineProps<{
  /** 図版の画像 (public/ のルート絶対パスか URL) */
  image?: string
  alt?: string
  /** 窓のタイトルバーに出す文字 (画面の URL など) */
  url?: string
  /** false で窓に入れず、画像をそのまま置く */
  frame?: boolean
  /** 見た目の左:右の比率 (two-cols と同じ形式)。既定は 1:1 */
  ratio?: ColumnRatio
  /** カラム内の縦位置 */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** 図版を置く側 */
  side?: 'left' | 'right'
}>()

const src = computed(() => withBase(image))
</script>

<template>
  <TwoCols
    class="image-left"
    :class="`is-image-${side}`"
    :ratio="ratio"
    :reverse="side === 'right'"
    :align="align"
  >
    <template v-if="$slots.text" #default>
      <slot />
    </template>
    <template #left>
      <div v-if="frame" class="y2k-code-window y2k-image__window">
        <div class="y2k-code-window__bar">
          <span class="y2k-code-window__dots" aria-hidden="true"><span /><span /><span /></span>
          <span v-if="url" class="y2k-code-window__file y2k-image__url">{{ url }}</span>
        </div>
        <div class="y2k-image__body">
          <slot name="image">
            <img v-if="src" :src="src" :alt="alt">
          </slot>
        </div>
      </div>
      <div v-else class="y2k-image__body is-bare">
        <slot name="image">
          <img v-if="src" :src="src" :alt="alt">
        </slot>
      </div>
    </template>
    <template #right>
      <slot v-if="$slots.text" name="text" />
      <slot v-else />
    </template>
  </TwoCols>
</template>

<style scoped>
.y2k-image__window {
  overflow: hidden;
}

/* URL はアドレスバー風の白いピルに入れる */
.y2k-image__url {
  flex: 1;
  padding: 0.1rem 0.7rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.6);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.y2k-image__body {
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.y2k-image__body :deep(img) {
  display: block;
  width: 100%;
  height: auto;
  max-height: 22rem;
  object-fit: contain;
}

.y2k-image__body.is-bare :deep(img) {
  border-radius: var(--y2k-radius);
}
</style>
