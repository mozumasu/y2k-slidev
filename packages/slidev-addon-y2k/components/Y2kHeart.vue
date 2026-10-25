<script setup lang="ts">
import { useId } from 'vue'

// ぷっくり膨らんだ液体クロームのハート。
// 金属らしさは、膨らみに沿って回り込む輪の反射 (明るい中心 → 暗い輪 → 明るい縁) で出し、
// 縁にピンクと水色の干渉色を重ねて Y2K の虹色の照りを足す。
// ハイライトは左上の大きなやわらかい照り返し・細い筋・右の小さな点・下端の照り返しで、すべてハートの形で切り抜く。
// float で、ゆっくり上下に漂う
const { size = 120, float = true } = defineProps<{
  /** 幅 (px) */
  size?: number
  float?: boolean
}>()

const id = useId()
const HEART = 'M50 86 C20 64 3 47 3 29 C3 14 14 4 28 4 C38 4 46 10 50 19 C54 10 62 4 72 4 C86 4 97 14 97 29 C97 47 80 64 50 86Z'
</script>

<template>
  <svg
    class="y2k-heart"
    :class="{ 'is-float': float }"
    :width="size"
    :height="size * 0.9"
    viewBox="0 0 100 90"
    aria-hidden="true"
  >
    <defs>
      <clipPath :id="`${id}-clip`">
        <path :d="HEART" />
      </clipPath>

      <!-- 金属の反射: 膨らみの頂点が一番明るく、暗い輪を挟んで縁でまた明るくなる -->
      <radialGradient :id="`${id}-metal`" cx="0.4" cy="0.34" r="0.78">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="0.18" stop-color="#eef1fb" />
        <stop offset="0.42" stop-color="#b4bbd1" />
        <stop offset="0.6" stop-color="#5d6380" />
        <stop offset="0.72" stop-color="#8d94ae" />
        <stop offset="0.86" stop-color="#e6e9f5" />
        <stop offset="1" stop-color="#c3c9dd" />
      </radialGradient>

      <!-- 縁を暗くして膨らみを出す -->
      <radialGradient :id="`${id}-volume`" cx="0.42" cy="0.38" r="0.66">
        <stop offset="0.62" stop-color="#1c1f33" stop-opacity="0" />
        <stop offset="1" stop-color="#1c1f33" stop-opacity="0.3" />
      </radialGradient>

      <!-- 縁にだけ乗る干渉色。中心は透明にして金属の白さを残す -->
      <radialGradient :id="`${id}-edge`" cx="0.45" cy="0.4" r="0.7">
        <stop offset="0.6" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="1" />
      </radialGradient>
      <mask :id="`${id}-edge-mask`">
        <rect width="100" height="90" :fill="`url(#${id}-edge)`" />
      </mask>

      <!-- Y2K の虹色の照り (ピンク → 水色 → ラベンダー) -->
      <linearGradient :id="`${id}-iris`" x1="0" y1="0.2" x2="1" y2="0.8">
        <stop offset="0" stop-color="#ff9fe0" />
        <stop offset="0.45" stop-color="#a6dcff" />
        <stop offset="1" stop-color="#c8a6ff" />
      </linearGradient>

      <linearGradient :id="`${id}-glare`" x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.95" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>

      <linearGradient :id="`${id}-rim`" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.95" />
        <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.15" />
        <stop offset="1" stop-color="#ffd6f2" stop-opacity="0.8" />
      </linearGradient>

      <filter :id="`${id}-soft`" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.6" />
      </filter>
      <filter :id="`${id}-softer`" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>

    <g :clip-path="`url(#${id}-clip)`">
      <rect width="100" height="90" :fill="`url(#${id}-metal)`" />
      <rect width="100" height="90" :fill="`url(#${id}-iris)`" opacity="0.22" style="mix-blend-mode: color" />
      <rect width="100" height="90" :fill="`url(#${id}-iris)`" opacity="0.75" :mask="`url(#${id}-edge-mask)`" style="mix-blend-mode: soft-light" />
      <rect width="100" height="90" :fill="`url(#${id}-volume)`" />

      <!-- 下端の照り返し (床のピンクを拾う) -->
      <ellipse cx="54" cy="74" rx="22" ry="7" fill="#ffc4ec" opacity="0.55" :filter="`url(#${id}-softer)`" />

      <!-- 左上のやわらかい大きな照り返しと、その中の細い筋 -->
      <path
        d="M12 30 C12 18 20 11 30 11 C37 11 42 15 44 21 C36 17 26 19 20 26 C16 31 14 36 13 41 C12 37 12 34 12 30Z"
        :fill="`url(#${id}-glare)`"
        :filter="`url(#${id}-soft)`"
      />
      <path d="M17 26 C20 19 27 15 35 15" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity="0.95" />

      <!-- 右のふくらみの小さな点の照り返し -->
      <ellipse cx="76" cy="17" rx="6" ry="3.4" fill="#ffffff" opacity="0.85" transform="rotate(20 76 17)" :filter="`url(#${id}-soft)`" />
      <circle cx="79" cy="16" r="1.3" fill="#ffffff" />
    </g>

    <!-- 縁の光 -->
    <path :d="HEART" fill="none" :stroke="`url(#${id}-rim)`" stroke-width="0.9" />
  </svg>
</template>

<style scoped>
.y2k-heart {
  overflow: visible;
  filter:
    drop-shadow(0 0.5rem 0.9rem rgba(58, 36, 87, 0.22))
    drop-shadow(0 0 0.6rem rgba(255, 159, 224, 0.35));
}

.y2k-heart.is-float {
  animation: y2k-float 7s var(--y2k-ease-in-out, ease-in-out) infinite alternate;
}

@media (prefers-reduced-motion: reduce) {
  .y2k-heart.is-float {
    animation: none;
  }
}

@keyframes y2k-float {
  0% {
    transform: translateY(0) rotate(-8deg);
  }
  100% {
    transform: translateY(-0.6rem) rotate(-2deg);
  }
}
</style>
