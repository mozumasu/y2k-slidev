<script setup lang="ts">
// シャボン玉。膜の干渉色をゆっくりめぐらせ、縁は細く明るく、中は背景が透けるようにする。
// 照り返しは左上に細い三日月と小さな点、右下に淡い反射を置く。
// float で、ゆっくり漂う
const { size = 140, float = true } = defineProps<{
  /** 直径 (px) */
  size?: number
  float?: boolean
}>()
</script>

<template>
  <!-- 外側は配置用。デッキ側の class (y2k-decor の position: absolute など) を
       内側の position: relative で打ち消さないよう、玉の描画は内側の要素に分ける -->
  <span class="y2k-bubble-wrap" aria-hidden="true">
    <span
      class="y2k-bubble"
      :class="{ 'is-float': float }"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
      <span class="y2k-bubble__film" />
      <span class="y2k-bubble__swirl" />
      <span class="y2k-bubble__rim" />
      <span class="y2k-bubble__glint is-arc" />
      <span class="y2k-bubble__glint is-dot" />
      <span class="y2k-bubble__glint is-low" />
    </span>
  </span>
</template>

<style scoped>
.y2k-bubble-wrap {
  display: inline-block;
}

.y2k-bubble {
  position: relative;
  display: block;
  border-radius: 50%;
  /* 中心はほぼ透明。縁に向かってわずかに白く曇らせ、球の厚みを出す */
  background: radial-gradient(circle at 45% 42%, rgba(255, 255, 255, 0) 52%, rgba(255, 255, 255, 0.12) 74%, rgba(255, 255, 255, 0.35) 100%);
  box-shadow:
    inset 0 0 0.6rem rgba(255, 255, 255, 0.35),
    0 0.8rem 1.6rem -0.6rem rgba(58, 36, 87, 0.12);
}

.y2k-bubble > span {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

/* 膜の干渉色。縁の帯だけに出し、内側へ行くほど薄くする */
.y2k-bubble__film {
  inset: 0;
  background: conic-gradient(from 210deg, #ff9fe0, #ffd2a1, #fff3a8, #b9ffd9, #a6dcff, #c8b0ff, #ff9fe0);
  mask: radial-gradient(circle, transparent 62%, rgba(0, 0, 0, 0.45) 78%, #000 93%, rgba(0, 0, 0, 0.7) 100%);
  opacity: 0.95;
  filter: blur(1.5px) saturate(1.2);
}

/* 膜の上を流れる淡い渦。玉全体にうっすら色を乗せて、ゆっくり回す */
.y2k-bubble__swirl {
  inset: 6%;
  background: conic-gradient(from 0deg, rgba(255, 159, 224, 0.22), rgba(166, 220, 255, 0.05), rgba(185, 255, 217, 0.2), rgba(200, 176, 255, 0.05), rgba(255, 159, 224, 0.22));
  filter: blur(6px);
  mix-blend-mode: screen;
}

/* 縁の細い白い線 */
.y2k-bubble__rim {
  inset: 0;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.7),
    inset 0 0 0.25rem rgba(255, 255, 255, 0.5);
}

/* 左上の細い三日月の照り返し */
.y2k-bubble__glint.is-arc {
  top: 10%;
  left: 10%;
  width: 62%;
  height: 62%;
  border-top: 3px solid rgba(255, 255, 255, 0.95);
  border-left: 1px solid rgba(255, 255, 255, 0.4);
  transform: rotate(-18deg);
  filter: blur(0.6px);
}

.y2k-bubble__glint.is-dot {
  top: 21%;
  left: 27%;
  width: 3.5%;
  height: 3.5%;
  background: #fff;
  box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.85);
  opacity: 0.9;
}

/* 右下の淡い反射 (地面からの照り返し) */
.y2k-bubble__glint.is-low {
  right: 12%;
  bottom: 10%;
  width: 46%;
  height: 46%;
  border-bottom: 2px solid rgba(255, 255, 255, 0.55);
  border-right: 1px solid rgba(255, 255, 255, 0.25);
  transform: rotate(-12deg);
  filter: blur(1px);
}

.y2k-bubble.is-float {
  animation: y2k-bubble-float 9s var(--y2k-ease-in-out, ease-in-out) infinite alternate;
}

.y2k-bubble.is-float .y2k-bubble__film {
  animation: y2k-bubble-hue 14s linear infinite;
}

.y2k-bubble.is-float .y2k-bubble__swirl {
  animation: y2k-bubble-spin 20s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .y2k-bubble.is-float,
  .y2k-bubble.is-float .y2k-bubble__film,
  .y2k-bubble.is-float .y2k-bubble__swirl {
    animation: none;
  }
}

@keyframes y2k-bubble-float {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-0.5rem, -0.9rem);
  }
}

@keyframes y2k-bubble-hue {
  to {
    filter: blur(1.5px) saturate(1.2) hue-rotate(360deg);
  }
}

@keyframes y2k-bubble-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
