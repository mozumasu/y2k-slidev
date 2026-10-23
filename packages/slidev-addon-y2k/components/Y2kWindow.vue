<script setup lang="ts">
// すりガラスのウィンドウ。縁はホログラムの細い線で、後ろに同じガラスを右下へずらして重ねる。
// label はタイトルバーの小さな英字、title は本文の上の太いイタリックの見出し、本文はスロット
const { title, label, color = 'pink', stack = 2 } = defineProps<{
  title?: string
  /** タイトルバーの右に出す小さな英字 (例: 01 / MISSION) */
  label?: string
  color?: 'pink' | 'pearl' | 'rose' | 'ice' | 'noir'
  /** 後ろに重ねる枚数 (0〜3) */
  stack?: number
}>()
</script>

<template>
  <div class="y2k-window" :class="`is-${color}`" :style="{ '--y2k-window-stack': stack }">
    <span
      v-for="i in stack"
      :key="i"
      class="y2k-window__layer"
      :style="{ '--y2k-window-i': stack - i + 1 }"
      aria-hidden="true"
    />
    <div class="y2k-window__frame">
      <div class="y2k-window__bar">
        <span class="y2k-window__dots" aria-hidden="true">
          <span /><span /><span />
        </span>
        <span v-if="label" class="y2k-window__label">{{ label }}</span>
      </div>
      <div class="y2k-window__body">
        <p v-if="title" class="y2k-window__title">{{ title }}</p>
        <div class="y2k-window__content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.y2k-window {
  --y2k-window-bg: var(--y2k-glass, rgba(255, 255, 255, 0.42));
  --y2k-window-bar: rgba(255, 255, 255, 0.35);
  --y2k-window-text: var(--y2k-ink, #2a2431);
  --y2k-window-sub: var(--y2k-ink-soft, #5d5566);
  --y2k-window-step: var(--y2k-window-offset, 0.55rem);
  --y2k-window-radius: var(--y2k-radius, 14px);
  position: relative;
  /* 重ねたガラスがはみ出す分だけ右下に余白を取り、周りの要素と重ならないようにする */
  padding: 0 calc(var(--y2k-window-step) * var(--y2k-window-stack)) calc(var(--y2k-window-step) * var(--y2k-window-stack)) 0;
}

/* ビビッドなピンクのガラス (既定)。見出しは白のレトロ 3D */
.y2k-window.is-pink {
  --y2k-window-bg: color-mix(in srgb, var(--y2k-pink, #ff4fc3) 88%, transparent);
  --y2k-window-bar: rgba(255, 255, 255, 0.28);
  --y2k-window-text: var(--y2k-white, #fff);
  --y2k-window-sub: rgba(255, 255, 255, 0.92);
}

.y2k-window.is-pink .y2k-window__title {
  font-weight: 800;
  text-shadow: 2px 2px 0 var(--y2k-ink, #2a2431);
}

.y2k-window.is-rose {
  --y2k-window-bg: rgba(239, 200, 222, 0.5);
}

.y2k-window.is-ice {
  --y2k-window-bg: rgba(200, 214, 240, 0.5);
}

/* 暗いガラスに銀の文字。1 枚だけ強調したいときに使う */
.y2k-window.is-noir {
  --y2k-window-bg: rgba(34, 29, 41, 0.78);
  --y2k-window-bar: rgba(255, 255, 255, 0.06);
  --y2k-window-text: #f4f1f7;
  --y2k-window-sub: #c3c8d5;
}

.y2k-window__layer,
.y2k-window__frame {
  position: relative;
  border-radius: var(--y2k-window-radius);
  background: var(--y2k-window-bg);
  backdrop-filter: blur(var(--y2k-glass-blur, 14px)) saturate(1.3);
}

/* ホログラムの 1px の縁。中を抜いた疑似要素で描き、ガラスの透けを邪魔しない */
.y2k-window__layer::before,
.y2k-window__frame::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: var(--y2k-holo);
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
  pointer-events: none;
}

.y2k-window__layer {
  position: absolute;
  inset: 0 calc(var(--y2k-window-step) * var(--y2k-window-stack)) calc(var(--y2k-window-step) * var(--y2k-window-stack)) 0;
  opacity: calc(1 - var(--y2k-window-i) * 0.28);
  transform: translate(
    calc(var(--y2k-window-step) * var(--y2k-window-i)),
    calc(var(--y2k-window-step) * var(--y2k-window-i))
  );
}

.y2k-window__frame {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--y2k-shadow-float, 0 1.2rem 2.6rem -0.8rem rgba(42, 36, 49, 0.22));
}

.y2k-window__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.8rem;
  background: var(--y2k-window-bar);
  border-bottom: 1px solid rgba(255, 255, 255, 0.55);
}

.y2k-window.is-noir .y2k-window__bar {
  border-bottom-color: rgba(255, 255, 255, 0.12);
}

.y2k-window__dots {
  display: flex;
  gap: 0.35rem;
}

/* ボタンは真珠の粒。色ではなく照りで見せる */
.y2k-window__dots > span {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fff 0 25%, var(--y2k-chrome-mid, #c3c8d5) 70%, var(--y2k-chrome-dark, #4a4f61) 100%);
  box-shadow: 0 0 0 0.5px rgba(42, 36, 49, 0.25);
}

.y2k-window__label {
  color: var(--y2k-window-sub);
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: var(--y2k-tracking-caps, 0.32em);
  text-transform: uppercase;
}

.y2k-window__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.4rem 1.8rem 1.8rem;
  color: var(--y2k-window-text);
  text-align: center;
}

.y2k-window__title {
  margin: 0 0 0.6rem;
  font-family: var(--y2k-font-display, sans-serif);
  font-size: 1.9rem;
  font-style: italic;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.15;
}

.y2k-window__content {
  color: var(--y2k-window-sub);
  font-size: 0.8rem;
  line-height: 1.8;
}

.y2k-window__content :deep(p) {
  margin: 0;
}
</style>
