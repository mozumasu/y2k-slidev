<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { handleBackground } from '@slidev/client/layoutHelper.ts'
import { computed } from 'vue'

// 章扉。左に大きなレトロ 3D の章番号、右に小さな英字と見出しを置く。
// 見出しは frontmatter の title、無ければスロット (md の `# 見出し`) をそのまま出す
const { background, no, eyebrow = 'Chapter', decor = true } = defineProps<{
  background?: string
  /** 章番号 (例: 01) */
  no?: string | number
  /** 見出しの上の小さな英字 */
  eyebrow?: string
  /** false で装飾を消す */
  decor?: boolean
}>()

const { $frontmatter } = useSlideContext()
const title = computed(() => $frontmatter.title as string | undefined)
const style = computed(() => handleBackground(background))
</script>

<template>
  <div class="slidev-layout section" :style="style">
    <template v-if="decor">
      <Y2kSparkle class="y2k-decor" :size="120" style="right: 9%; top: 12%" />
      <Y2kBubble class="y2k-decor" :size="160" style="right: -4%; bottom: -10%" />
    </template>
    <div class="y2k-content section__body">
      <p v-if="no !== undefined" class="y2k-display section__no">{{ no }}</p>
      <div class="section__text">
        <p class="y2k-eyebrow">{{ eyebrow }}</p>
        <h1 v-if="title" class="section__title">{{ title }}</h1>
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.section {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.section__body {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  padding-left: 2rem;
}

.slidev-layout .section__no {
  padding-right: 0.1em;
  font-size: 9rem;
  line-height: 1;
}

/* 番号と見出しの間にホログラムの縦線 */
.section__text {
  padding-left: 2.5rem;
  border-left: 1px solid transparent;
  border-image: var(--y2k-holo) 1;
}

.section__title,
.section__text :deep(h1) {
  margin: 0.6rem 0 0;
  font-size: 3rem;
}

.section__title::after,
.section__text :deep(h1)::after {
  display: none;
}
</style>
