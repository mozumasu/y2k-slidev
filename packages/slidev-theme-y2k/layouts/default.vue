<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { handleBackground } from '@slidev/client/layoutHelper.ts'
import { computed } from 'vue'

// 本文の基本フレーム。見出しは md の `# 見出し` で書く。
// eyebrow を書くと見出しの上に小さな英字を出す。右下にページ番号を出す
const { background, eyebrow } = defineProps<{
  background?: string
  /** 見出しの上の小さな英字 (章の名前など) */
  eyebrow?: string
}>()

const { $page } = useSlideContext()
const style = computed(() => handleBackground(background))
const pageLabel = computed(() => String($page.value).padStart(2, '0'))
</script>

<template>
  <div class="slidev-layout default" :style="style">
    <div class="y2k-content">
      <p v-if="eyebrow" class="y2k-eyebrow default__eyebrow">{{ eyebrow }}</p>
      <slot />
    </div>
    <p class="default__page">
      <span class="default__page-line" aria-hidden="true" />{{ pageLabel }}
    </p>
  </div>
</template>

<style scoped>
.default {
  position: relative;
}

/* 本文に置いた装飾 (class="y2k-decor") の top / bottom がスライド全体の高さ基準になるよう広げる */
.default > .y2k-content {
  height: 100%;
}

.slidev-layout .default__eyebrow {
  margin-bottom: 0.5rem;
}

/* ページ番号はホログラムの短い線と 2 桁の数字 */
.slidev-layout .default__page {
  position: absolute;
  right: 2rem;
  bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0;
  color: var(--y2k-ink-soft);
  font-family: var(--y2k-font-display);
  font-size: 0.8rem;
  font-style: italic;
  letter-spacing: 0.1em;
}

.default__page-line {
  width: 1.6rem;
  height: 1px;
  background: var(--y2k-holo);
}
</style>
