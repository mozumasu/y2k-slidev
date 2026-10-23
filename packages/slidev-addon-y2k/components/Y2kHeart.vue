<script setup lang="ts">
import { useId } from 'vue'

// ぷっくりしたクロームのハート。左上にハイライトを入れて金属の照り返しに見せる。
// float で、ゆっくり上下に漂う
const { size = 120, float = true } = defineProps<{
  /** 幅 (px) */
  size?: number
  float?: boolean
}>()

const id = useId()
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
      <radialGradient :id="`${id}-chrome`" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stop-color="var(--y2k-chrome-light, #fff)" />
        <stop offset="0.35" stop-color="#d5ddf2" />
        <stop offset="0.65" stop-color="var(--y2k-chrome-dark, #5d6382)" />
        <stop offset="0.85" stop-color="var(--y2k-chrome-mid, #b8bfd6)" />
        <stop offset="1" stop-color="#eef2ff" />
      </radialGradient>
    </defs>
    <path
      :fill="`url(#${id}-chrome)`"
      d="M50 86 C20 64 3 47 3 29 C3 14 14 4 28 4 C38 4 46 10 50 19 C54 10 62 4 72 4 C86 4 97 14 97 29 C97 47 80 64 50 86Z"
    />
    <ellipse cx="27" cy="22" rx="11" ry="6" fill="#fff" opacity="0.85" transform="rotate(-30 27 22)" />
    <ellipse cx="74" cy="20" rx="5" ry="3" fill="#fff" opacity="0.6" transform="rotate(25 74 20)" />
  </svg>
</template>

<style scoped>
.y2k-heart {
  filter: drop-shadow(0 0.4rem 0.8rem rgba(58, 36, 87, 0.25));
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
