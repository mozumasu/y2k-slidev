<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { handleBackground } from '@slidev/client/layoutHelper.ts'
import { computed } from 'vue'

// 表紙。小さな英字 (eyebrow) → レトロ 3D のタイトル → ホログラムの線 → リード文 → 発表者名。
// 装飾は画面の端で見切れるように置き、中央の文字を広く空ける。
// title は Slidev の予約フィールドで props に届かないため frontmatter から読む
const { background, eyebrow, subtitle, decor = true } = defineProps<{
  background?: string
  /** タイトル上の小さな英字 (イベント名・日付など) */
  eyebrow?: string
  /** 一番下の行 (発表者名など)。改行はそのまま反映する */
  subtitle?: string
  /** false で装飾を消す */
  decor?: boolean
}>()

const { $frontmatter } = useSlideContext()
const title = computed(() => $frontmatter.title as string | undefined)
const style = computed(() => handleBackground(background))
</script>

<template>
  <div class="slidev-layout cover" :style="style">
    <template v-if="decor">
      <Y2kHeart class="y2k-decor" :size="190" style="left: -4%; bottom: -9%" />
      <Y2kSparkle class="y2k-decor" :size="150" style="right: 7%; top: 9%" />
      <Y2kSparkle class="y2k-decor" :size="46" style="right: 19%; top: 32%" />
      <Y2kBubble class="y2k-decor" :size="220" style="right: -6%; bottom: -14%" />
    </template>
    <div class="y2k-content cover__body">
      <p v-if="eyebrow" class="y2k-eyebrow">{{ eyebrow }}</p>
      <h1 v-if="title" class="y2k-display cover__title">{{ title }}</h1>
      <hr class="y2k-rule">
      <div v-if="$slots.default" class="cover__lead">
        <slot />
      </div>
      <p v-if="subtitle" class="y2k-eyebrow cover__subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<style scoped>
.cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-align: center;
}

.cover__body {
  max-width: 80%;
}

.cover__title {
  margin-top: 1rem;
  padding: 0 0.15em; /* イタリックの右肩が切れないよう余白を取る */
}

.cover__lead {
  font-family: var(--y2k-font-display);
  font-size: 1.15rem;
  font-style: italic;
  color: var(--y2k-ink-soft);
}

.cover__lead :deep(p) {
  margin: 0;
}

.slidev-layout .cover__subtitle {
  margin-top: 1.6rem;
  color: var(--y2k-ink);
  white-space: pre-line;
}
</style>
