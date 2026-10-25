<script setup lang="ts">
import { useNav } from '@slidev/client'
import { computed, ref } from 'vue'
import { pageAt, progressRatio } from '../utils/toc.ts'

// スライド下端のプログレスバー。クリック・ドラッグでそのページへ移動する。
// 動きは partner-prop/prop-slidev と同じ。global-bottom.vue から置き、PDF / PNG 書き出しには写さない
const { currentPage, total, go, isPrintMode } = useNav()

const progress = computed(() => progressRatio(currentPage.value, total.value))

const track = ref<HTMLElement>()
const dragging = ref(false)

function pageFromEvent(e: PointerEvent) {
  const rect = track.value!.getBoundingClientRect()
  return pageAt((e.clientX - rect.left) / rect.width, total.value)
}

function onPointerDown(e: PointerEvent) {
  dragging.value = true
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  go(pageFromEvent(e))
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value)
    return
  const page = pageFromEvent(e)
  if (page !== currentPage.value)
    go(page)
}

function onPointerUp() {
  dragging.value = false
}
</script>

<template>
  <div
    v-if="!isPrintMode"
    ref="track"
    class="y2k-progress"
    :class="{ 'is-dragging': dragging }"
    role="slider"
    :aria-valuemin="1"
    :aria-valuemax="total"
    :aria-valuenow="currentPage"
    aria-label="スライド位置"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div class="y2k-progress__bar" :style="{ transform: `scaleX(${progress})` }" />
  </div>
</template>

<style scoped>
/* スライドより前面に出す (global-bottom はスライドの下のレイヤーなので z-index を付ける) */
.y2k-progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.35);
  cursor: pointer;
  touch-action: none;
  transition: height 0.15s ease;
}

/* バー自体は細くて狙いにくいので、上に透明の当たり判定を広げる */
.y2k-progress::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 14px;
}

.y2k-progress:hover,
.y2k-progress.is-dragging {
  height: 7px;
}

/* 進んだ分はピンクからラベンダーへのグラデーション。先端を光らせる */
.y2k-progress__bar {
  height: 100%;
  background: linear-gradient(90deg, var(--y2k-pink), #c58cff);
  box-shadow: 0 0 8px rgba(255, 79, 195, 0.6);
  transform-origin: left;
  transition: transform 0.45s var(--y2k-ease-in-out);
}

.y2k-progress.is-dragging .y2k-progress__bar {
  transition: none;
}
</style>
