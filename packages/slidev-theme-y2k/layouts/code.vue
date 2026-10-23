<script setup lang="ts">
import type { ColumnRatio } from '../utils/columns.ts'
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import { columnTemplate, parseColumnRatio } from '../utils/columns.ts'
import Default from './default.vue'

// コード例と説明 (default の枠: eyebrow・ページ番号 付き)
// 見出しは frontmatter の title。本文が説明 (左)、::code:: 以降がコード (右)。
// ::lead:: を書くと 2 カラムの上に全幅のリード文を出す。
// コードはタイトルバー付きのすりガラスの窓に入れ、本文の高さを上限に、収まらない分は窓の中でスクロールする。
// クリック連動の説明はアドオンの <Y2kCodeSteps> を本文に置く。
// eyebrow / background は default レイアウトにそのまま渡る
const { ratio, reverse = false, align = 'start', gap, codeSize, file } = defineProps<{
  /** 説明:コード の比率。'1:2' / [1, 2] / 0.4 / '40%' (説明の割合)。既定は 2:3 (コードを広く) */
  ratio?: ColumnRatio
  /** 左にコード・右に説明にする (ratio は 説明:コード のまま) */
  reverse?: boolean
  /** 説明カラム内の縦位置 */
  align?: 'start' | 'center' | 'end'
  /** カラム間の余白 (CSS の長さ) */
  gap?: string
  /** このスライドのコードの文字サイズ (CSS の長さ。例: 0.7rem)。行が多いときに小さくする */
  codeSize?: string
  /** コードの窓のタイトルバーに出すファイル名 */
  file?: string
}>()

const DEFAULT_RATIO: [number, number] = [2, 3]

const { $frontmatter } = useSlideContext()
const title = computed(() => $frontmatter.title as string | undefined)

const gridStyle = computed(() => {
  const [text, code] = parseColumnRatio(ratio, DEFAULT_RATIO)
  return {
    gridTemplateColumns: columnTemplate(reverse ? [code, text] : [text, code]),
    ...(gap ? { columnGap: gap } : {}),
    ...(codeSize ? { '--slidev-code-font-size': codeSize } : {}),
  }
})
</script>

<template>
  <Default class="code">
    <div class="y2k-code">
      <h1 v-if="title">{{ title }}</h1>
      <div v-if="$slots.lead" class="y2k-code__lead">
        <slot name="lead" />
      </div>
      <div class="y2k-code__grid" :class="{ 'is-reverse': reverse }" :style="gridStyle">
        <div class="y2k-code__text" :style="{ alignSelf: align }">
          <slot />
        </div>
        <div class="y2k-code-window y2k-code__pane">
          <div class="y2k-code-window__bar">
            <span class="y2k-code-window__dots" aria-hidden="true"><span /><span /><span /></span>
            <span v-if="file" class="y2k-code-window__file">{{ file }}</span>
          </div>
          <div class="y2k-code-window__body">
            <slot name="code" />
          </div>
        </div>
      </div>
    </div>
  </Default>
</template>

<style scoped>
.y2k-code {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.y2k-code__lead {
  margin-bottom: 1rem;
  line-height: 1.8;
}

.y2k-code__lead > :deep(*) {
  margin: 0;
}

.y2k-code__grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  column-gap: 2.25rem;
  /* 右下のページ番号に窓が掛からないよう少し空ける */
  padding-bottom: 1.25rem;
}

.y2k-code__text {
  min-width: 0;
  line-height: 1.8;
}

.y2k-code__text > :deep(:first-child) {
  margin-top: 0;
}

.y2k-code__pane {
  align-self: start;
  max-height: 100%;
}

.is-reverse .y2k-code__text {
  order: 2;
}
</style>
