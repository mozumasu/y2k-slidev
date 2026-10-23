<script setup lang="ts">
import type { ColumnRatio } from '../utils/columns.ts'
import { useSlideContext } from '@slidev/client'
import { computed, useSlots } from 'vue'
import { columnTemplate } from '../utils/columns.ts'
import Default from './default.vue'

// 2 カラム (default の枠: eyebrow・ページ番号 付き)。見出しは frontmatter の title。
// Slidev 組み込みの two-cols と同じく、本文が左・::right:: 以降が右。
// ::left:: を使った場合は、最初の ::left:: より前の本文を 2 カラムの上に全幅で出す (リード文などに使う)。
// eyebrow / background は default レイアウトにそのまま渡る
const { ratio, reverse = false, align = 'start', gap } = defineProps<{
  /** 見た目の左:右の比率。'3:2' / [3, 2] / 0.6 / '60%' (左の割合)。既定は 1:1 */
  ratio?: ColumnRatio
  /** 左右のスロットを入れ替えて表示する (ratio は入れ替え後の見た目の左:右) */
  reverse?: boolean
  /** カラム内の縦位置 */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** カラム間の余白 (CSS の長さ) */
  gap?: string
}>()

const { $frontmatter } = useSlideContext()
const title = computed(() => $frontmatter.title as string | undefined)

const slots = useSlots()
const hasHeader = computed(() => !!slots.left && !!slots.default)
const gridStyle = computed(() => ({
  gridTemplateColumns: columnTemplate(ratio),
  alignItems: align,
  ...(gap ? { columnGap: gap } : {}),
}))
</script>

<template>
  <Default class="two-cols">
    <div class="y2k-two-cols" :class="{ 'is-reverse': reverse }">
      <h1 v-if="title">{{ title }}</h1>
      <div v-if="hasHeader" class="y2k-two-cols__header">
        <slot />
      </div>
      <div class="y2k-two-cols__grid" :style="gridStyle">
        <div class="y2k-two-cols__col is-left">
          <slot v-if="$slots.left" name="left" />
          <slot v-else />
        </div>
        <div class="y2k-two-cols__col is-right">
          <slot name="right" />
        </div>
      </div>
    </div>
  </Default>
</template>

<style scoped>
.y2k-two-cols {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.y2k-two-cols__header {
  margin-bottom: 1rem;
  line-height: 1.8;
}

.y2k-two-cols__header > :deep(*) {
  margin: 0;
}

.y2k-two-cols__grid {
  flex: 1;
  min-height: 0;
  display: grid;
  column-gap: 2.5rem;
  padding-bottom: 1.25rem;
}

.y2k-two-cols__col {
  min-width: 0;
  min-height: 0;
  line-height: 1.8;
}

.y2k-two-cols__col > :deep(:first-child) {
  margin-top: 0;
}

.is-reverse .is-left {
  order: 2;
}
</style>
