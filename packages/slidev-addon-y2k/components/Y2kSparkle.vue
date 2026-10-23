<script setup lang="ts">
import { useId } from 'vue'

// クロームのきらめき。細く長い 4 方向の光芒に、45° 回した短い光芒と、
// 中心の白い光・ぼかした後光・細いフレアの線を重ねて、宝石に光が当たったように見せる。
// twinkle で、後光が呼吸するように明滅し、光芒がわずかに回る
const { size = 96, twinkle = true } = defineProps<{
  /** 一辺の長さ (px) */
  size?: number
  twinkle?: boolean
}>()

// 同じスライドに複数置いても gradient の id が衝突しないようにする
const id = useId()
</script>

<template>
  <svg
    class="y2k-sparkle"
    :class="{ 'is-twinkle': twinkle }"
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    aria-hidden="true"
  >
    <defs>
      <!-- 磨いた銀。中心が一番明るく、先端に向かって冷たい銀に沈む -->
      <radialGradient :id="`${id}-chrome`" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="0.12" stop-color="#f4f2fb" />
        <stop offset="0.3" stop-color="#c9cddb" />
        <stop offset="0.55" stop-color="#9097ad" />
        <stop offset="1" stop-color="#e9ebf3" />
      </radialGradient>
      <!-- 斜めに走る照り返し。光芒の上に薄く重ねる -->
      <linearGradient :id="`${id}-sheen`" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0.35" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.75" />
        <stop offset="0.65" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>
      <radialGradient :id="`${id}-halo`">
        <stop offset="0" stop-color="#ffffff" stop-opacity="1" />
        <stop offset="0.25" stop-color="#ffe3f6" stop-opacity="0.7" />
        <stop offset="0.6" stop-color="#dfe6ff" stop-opacity="0.25" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
      </radialGradient>
      <linearGradient :id="`${id}-flare`" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.9" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>
    </defs>

    <circle class="y2k-sparkle__halo" cx="50" cy="50" r="34" :fill="`url(#${id}-halo)`" />

    <!-- 細いフレアの線 (縦横に長く伸ばす) -->
    <rect x="-20" y="49.75" width="140" height="0.5" :fill="`url(#${id}-flare)`" />
    <rect x="-20" y="49.75" width="140" height="0.5" :fill="`url(#${id}-flare)`" transform="rotate(90 50 50)" />

    <g class="y2k-sparkle__rays">
      <!-- 45° 回した短い光芒 -->
      <path
        :fill="`url(#${id}-chrome)`"
        transform="rotate(45 50 50)"
        d="M50 30 C50.4 47 52.5 49.6 70 50 C52.5 50.4 50.4 52.5 50 70 C49.6 52.5 47 50.4 30 50 C47 49.6 49.6 47 50 30Z"
      />
      <!-- 主の光芒。中心近くまで細く絞り、先端を鋭くする -->
      <path
        :fill="`url(#${id}-chrome)`"
        stroke="#ffffff"
        stroke-width="0.3"
        stroke-opacity="0.9"
        d="M50 2 C50.7 42 55 49.3 98 50 C55 50.7 50.7 55 50 98 C49.3 55 45 50.7 2 50 C45 49.3 49.3 45 50 2Z"
      />
      <path
        :fill="`url(#${id}-sheen)`"
        d="M50 2 C50.7 42 55 49.3 98 50 C55 50.7 50.7 55 50 98 C49.3 55 45 50.7 2 50 C45 49.3 49.3 45 50 2Z"
      />
    </g>

    <circle cx="50" cy="50" r="3.2" fill="#ffffff" opacity="0.85" style="filter: blur(1px)" />
  </svg>
</template>

<style scoped>
.y2k-sparkle {
  overflow: visible;
  filter: drop-shadow(0 0.15rem 0.35rem rgba(58, 36, 87, 0.18));
}

.y2k-sparkle__halo,
.y2k-sparkle__rays {
  transform-box: view-box;
  transform-origin: 50% 50%;
}

.y2k-sparkle.is-twinkle .y2k-sparkle__halo {
  animation: y2k-sparkle-halo 3.6s var(--y2k-ease-in-out, ease-in-out) infinite alternate;
}

.y2k-sparkle.is-twinkle .y2k-sparkle__rays {
  animation: y2k-sparkle-rays 7s var(--y2k-ease-in-out, ease-in-out) infinite alternate;
}

@media (prefers-reduced-motion: reduce) {
  .y2k-sparkle.is-twinkle .y2k-sparkle__halo,
  .y2k-sparkle.is-twinkle .y2k-sparkle__rays {
    animation: none;
  }
}

@keyframes y2k-sparkle-halo {
  0% {
    opacity: 0.55;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes y2k-sparkle-rays {
  0% {
    transform: rotate(-4deg) scale(0.96);
  }
  100% {
    transform: rotate(6deg) scale(1.02);
  }
}
</style>
