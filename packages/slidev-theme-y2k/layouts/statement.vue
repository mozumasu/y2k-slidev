<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { handleBackground } from '@slidev/client/layoutHelper.ts'
import { computed, useSlots } from 'vue'
import { withBase } from '../utils/withBase.ts'

// 言いたいことを 1 枚で大きく見せる (発表の結論・キーメッセージなど)。
// label がピンクの小さな英字、title がレトロ 3D の大きな一文、subtitle がその下の英字サブコピー、
// 本文 (md) が 2〜3 行の説明。下のビジュアルは ::visual:: スロットか image で置く
const { background, subtitle, label, image, align = 'center', decor = true } = defineProps<{
  background?: string
  /** 一文の下に添えるサブコピー */
  subtitle?: string
  /** 一文の上に出す小さな英字 (例: KEY MESSAGE) */
  label?: string
  /** 下に置く画像のパス。::visual:: スロットがあればそちらを優先する */
  image?: string
  /** テキストの揃え。ビジュアルは常に中央 */
  align?: 'left' | 'center'
  /** false で装飾を消す */
  decor?: boolean
}>()

const { $frontmatter } = useSlideContext()
const title = computed(() => $frontmatter.title as string | undefined)
const style = computed(() => handleBackground(background))
const slots = useSlots()
const hasVisual = computed(() => Boolean(slots.visual) || Boolean(image))
</script>

<template>
  <div class="slidev-layout statement" :class="`is-align-${align}`" :style="style">
    <template v-if="decor">
      <Y2kSparkle class="y2k-decor" :size="90" style="right: 8%; top: 12%" />
      <Y2kSparkle class="y2k-decor" :size="40" style="left: 9%; bottom: 16%" />
    </template>
    <div class="y2k-content y2k-statement__text">
      <p v-if="label" class="y2k-eyebrow y2k-statement__label">{{ label }}</p>
      <h1 v-if="title" class="y2k-display y2k-statement__title">{{ title }}</h1>
      <p v-if="subtitle" class="y2k-statement__subtitle">{{ subtitle }}</p>
      <div v-if="$slots.default" class="y2k-statement__body">
        <slot />
      </div>
    </div>
    <div v-if="hasVisual" class="y2k-content y2k-statement__visual">
      <slot name="visual">
        <img :src="withBase(image)" alt="">
      </slot>
    </div>
  </div>
</template>

<style scoped>
.statement {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding-left: 6rem;
  padding-right: 6rem;
}

.is-align-center .y2k-statement__text {
  text-align: center;
}

.slidev-layout .y2k-statement__label {
  margin-bottom: 1rem;
  color: var(--y2k-pink-deep);
  font-weight: 700;
}

.slidev-layout .y2k-statement__title {
  font-size: 3rem;
  line-height: 1.3;
}

.slidev-layout .y2k-statement__subtitle {
  margin: 1rem 0 0;
  color: var(--y2k-ink-soft);
  font-size: 1rem;
  font-style: italic;
  letter-spacing: 0.04em;
}

.y2k-statement__body {
  margin-top: 1.4rem;
  color: var(--y2k-ink-soft);
  line-height: 1.9;
}

.y2k-statement__body :deep(p) {
  margin: 0;
}

.y2k-statement__visual {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.y2k-statement__visual :deep(img) {
  max-height: 10rem;
  object-fit: contain;
}
</style>
