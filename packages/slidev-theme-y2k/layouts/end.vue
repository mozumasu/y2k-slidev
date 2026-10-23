<script setup lang="ts">
import { handleBackground } from '@slidev/client/layoutHelper.ts'
import { computed } from 'vue'

// 締めのスライド。中央にレトロ 3D で大きなメッセージ (既定は Thank you) を出す。
// スロットはメッセージの下の補足 (SNS アカウントなど)
const { background, message = 'Thank you', decor = true } = defineProps<{
  background?: string
  message?: string
  /** false で装飾を消す */
  decor?: boolean
}>()

const style = computed(() => handleBackground(background))
</script>

<template>
  <div class="slidev-layout end" :style="style">
    <template v-if="decor">
      <Y2kHeart class="y2k-decor" :size="160" style="right: 4%; top: 6%" />
      <Y2kSparkle class="y2k-decor" :size="130" style="left: 8%; bottom: 12%" />
      <Y2kBubble class="y2k-decor" :size="120" style="left: 10%; top: 10%" />
    </template>
    <div class="y2k-content end__body">
      <p class="y2k-display end__message">{{ message }}</p>
      <hr class="y2k-rule">
      <div v-if="$slots.default" class="y2k-eyebrow end__note">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.end {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-align: center;
}

.slidev-layout .end__message {
  padding: 0 0.15em;
  font-size: 5.5rem;
}

.end__note {
  color: var(--y2k-ink);
}

.end__note :deep(p) {
  margin: 0;
}
</style>
