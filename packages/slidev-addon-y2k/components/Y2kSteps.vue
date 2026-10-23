<script setup lang="ts">
import { withBase } from 'slidev-theme-y2k/utils/withBase.ts'

export interface StepItem {
  text: string
  /** 重要な項目としてピンクで強調する */
  highlight?: boolean
}

export interface Step {
  title: string
  /** card: カードの上の見出し (省略時は `${labelPrefix} ${2 桁の番号}`) */
  label?: string
  description?: string
  /** UnoCSS のアイコンクラス (例: i-carbon-rocket) */
  icon?: string
  /** アイコン代わりの画像パス */
  image?: string
  /** 小さなピル型のタグ (機能名など) */
  tags?: string[]
  /** チェックリスト */
  items?: (string | StepItem)[]
}

// 手順を横に並べる
// variant
// - card: STEP 01 の見出し + すりガラスのカード。カードの間をホログラムの線でつなぐ
// - chevron: 矢羽根を横に連結し、current 番目までをビビッドなピンク、残りを真珠のガラスにする
const { steps, variant = 'card', current, labelPrefix = 'Step' } = defineProps<{
  steps: Step[]
  variant?: 'card' | 'chevron'
  /**
   * 1 から数えて何番目までを完了・現在 (ピンク) にするか。省略時はすべてピンク。
   * v-click で 1 つずつ進めるなら :current="$clicks + 1" とする
   */
  current?: number
  labelPrefix?: string
}>()

function isActive(index: number) {
  return current === undefined || index < current
}

function toItem(item: string | StepItem): StepItem {
  return typeof item === 'string' ? { text: item } : item
}
</script>

<template>
  <div
    class="y2k-steps"
    :class="`is-${variant}`"
    :style="{ '--y2k-steps-cols': steps.length }"
  >
    <!-- 列ごとに icon-<i> の slot でアイコン部分を差し替えられる (i は 0 始まり) -->
    <div
      v-for="(step, i) in steps"
      :key="i"
      class="y2k-steps__step"
      :class="{ 'is-active': isActive(i) }"
    >
      <template v-if="variant === 'card'">
        <p class="y2k-steps__label">
          {{ step.label ?? `${labelPrefix} ${String(i + 1).padStart(2, '0')}` }}
        </p>
        <div class="y2k-steps__card">
          <div v-if="step.icon || step.image || $slots[`icon-${i}`]" class="y2k-steps__icon">
            <slot :name="`icon-${i}`" :step="step">
              <span v-if="step.icon" :class="step.icon" />
              <img v-else-if="step.image" :src="withBase(step.image)" :alt="step.title">
            </slot>
          </div>
          <h3 class="y2k-steps__title">{{ step.title }}</h3>
          <p v-if="step.description" class="y2k-steps__description">{{ step.description }}</p>
          <ul v-if="step.tags?.length" class="y2k-steps__tags">
            <li v-for="tag in step.tags" :key="tag">{{ tag }}</li>
          </ul>
          <ul v-if="step.items?.length" class="y2k-steps__items">
            <li v-for="(item, j) in step.items.map(toItem)" :key="j" :class="{ 'is-highlight': item.highlight }">
              {{ item.text }}
            </li>
          </ul>
        </div>
      </template>

      <template v-else>
        <div class="y2k-steps__chevron">{{ step.title }}</div>
        <div v-if="step.icon || step.image || $slots[`icon-${i}`]" class="y2k-steps__icon">
          <slot :name="`icon-${i}`" :step="step">
            <span v-if="step.icon" :class="step.icon" />
            <img v-else-if="step.image" :src="withBase(step.image)" :alt="step.title">
          </slot>
        </div>
        <div class="y2k-steps__body">
          <p v-if="step.description" class="y2k-steps__description">{{ step.description }}</p>
          <ul v-if="step.tags?.length" class="y2k-steps__tags">
            <li v-for="tag in step.tags" :key="tag">{{ tag }}</li>
          </ul>
          <ul v-if="step.items?.length" class="y2k-steps__items">
            <li v-for="(item, j) in step.items.map(toItem)" :key="j" :class="{ 'is-highlight': item.highlight }">
              {{ item.text }}
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.y2k-steps {
  --y2k-steps-arrow: 1.1rem;

  display: grid;
  grid-template-columns: repeat(var(--y2k-steps-cols), minmax(0, 1fr));
  color: var(--y2k-ink, #2a2431);
}

.y2k-steps p,
.y2k-steps h3,
.y2k-steps ul {
  margin: 0;
  padding: 0;
}

.y2k-steps li {
  margin: 0;
  list-style: none;
}

/* テーマの箇条書きのキラキラは、この部品では項目ごとに描き直す */
.y2k-steps li::before {
  content: none;
}

.y2k-steps__step {
  display: flex;
  flex-direction: column;
}

.y2k-steps__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  font-size: 2.4rem;
  color: var(--y2k-pink, #ff4fc3);
}

.y2k-steps__icon img {
  max-height: 100%;
  object-fit: contain;
}

.y2k-steps__title {
  font-family: var(--y2k-font-display, sans-serif);
  font-size: 1.35rem;
  font-style: italic;
  font-weight: 700;
  line-height: 1.25;
}

.y2k-steps__description {
  color: var(--y2k-ink-soft, #5d5566);
  font-size: 0.78rem;
  line-height: 1.7;
}

.y2k-steps__tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem;
}

.y2k-steps__tags li {
  padding: 0.1rem 0.6rem;
  border-radius: 999px;
  background: var(--y2k-ink, #2a2431);
  color: var(--y2k-white, #fff);
  font-size: 0.6rem;
  letter-spacing: 0.04em;
  line-height: 1.6;
}

.y2k-steps__items {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-size: 0.8rem;
  text-align: left;
}

.y2k-steps__items li {
  position: relative;
  padding-left: 1.2em;
}

.y2k-steps .y2k-steps__items li::before {
  content: '✦';
  position: absolute;
  left: 0;
  color: var(--y2k-ink-soft, #5d5566);
  font-size: 0.85em;
}

.y2k-steps__items li.is-highlight {
  color: var(--y2k-pink-deep, #d42a9c);
  font-weight: 700;
}

.y2k-steps .y2k-steps__items li.is-highlight::before {
  color: var(--y2k-pink, #ff4fc3);
}

/* --- card --- */
.is-card {
  column-gap: 1.6rem;
}

/* 見出しは太いイタリック。完了・現在の手順はピンクのレトロ 3D */
.y2k-steps__label {
  position: relative;
  margin-bottom: 0.8rem !important;
  color: var(--y2k-ink-soft, #5d5566);
  font-family: var(--y2k-font-display, sans-serif);
  font-size: 1.05rem;
  font-style: italic;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-align: center;
}

.is-card .is-active .y2k-steps__label {
  color: var(--y2k-pink, #ff4fc3);
  text-shadow: 1.5px 1.5px 0 var(--y2k-ink, #2a2431);
}

/* カードの間をホログラムの線でつなぐ (見出しの高さで、隣のカードとの隙間に引く) */
.is-card .y2k-steps__step + .y2k-steps__step .y2k-steps__label::before {
  content: '';
  position: absolute;
  top: 50%;
  right: calc(50% + 2.6rem);
  width: calc(100% - 5.2rem + 1.6rem);
  height: 1px;
  background: var(--y2k-holo, linear-gradient(90deg, #f2bfdc, #c3cff7));
}

.y2k-steps__card {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.4rem 1.2rem;
  border-radius: var(--y2k-radius, 14px);
  background: var(--y2k-glass, rgba(255, 255, 255, 0.42));
  box-shadow: var(--y2k-shadow-float, 0 1.2rem 2.6rem -0.8rem rgba(42, 36, 49, 0.22));
  backdrop-filter: blur(var(--y2k-glass-blur, 14px)) saturate(1.3);
  text-align: center;
}

/* ホログラムの 1px の縁 */
.y2k-steps__card::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: var(--y2k-holo, linear-gradient(90deg, #f2bfdc, #c3cff7));
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
  pointer-events: none;
}

.is-card .y2k-steps__step:not(.is-active) .y2k-steps__card {
  opacity: 0.6;
}

/* --- chevron --- */
.y2k-steps__chevron {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3.2rem;
  margin-right: calc(var(--y2k-steps-arrow) * -1);
  padding: 0 var(--y2k-steps-arrow);
  background: var(--y2k-glass-strong, rgba(255, 255, 255, 0.62));
  color: var(--y2k-ink-soft, #5d5566);
  clip-path: polygon(
    0 0,
    calc(100% - var(--y2k-steps-arrow)) 0,
    100% 50%,
    calc(100% - var(--y2k-steps-arrow)) 100%,
    0 100%,
    var(--y2k-steps-arrow) 50%
  );
  font-family: var(--y2k-font-display, sans-serif);
  font-size: 1.05rem;
  font-style: italic;
  font-weight: 700;
}

.is-chevron .y2k-steps__step:last-child .y2k-steps__chevron {
  margin-right: 0;
}

/* 隣の矢羽根との間に細い隙間を残す */
.is-chevron .y2k-steps__step + .y2k-steps__step .y2k-steps__chevron {
  margin-left: 4px;
}

.is-chevron .y2k-steps__step:first-child .y2k-steps__chevron {
  clip-path: polygon(
    0 0,
    calc(100% - var(--y2k-steps-arrow)) 0,
    100% 50%,
    calc(100% - var(--y2k-steps-arrow)) 100%,
    0 100%
  );
}

.is-chevron .is-active .y2k-steps__chevron {
  background: var(--y2k-pink, #ff4fc3);
  color: var(--y2k-white, #fff);
  text-shadow: 1.5px 1.5px 0 var(--y2k-ink, #2a2431);
}

.is-chevron .y2k-steps__icon {
  margin-top: 1.2rem;
  color: var(--y2k-ink-soft, #5d5566);
}

.is-chevron .is-active .y2k-steps__icon {
  color: var(--y2k-pink, #ff4fc3);
}

.is-chevron .y2k-steps__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  min-height: 8rem;
  margin-top: 1.1rem;
  padding: 0.25rem 0.9rem;
}

/* 列の区切りはホログラムの縦線 */
.is-chevron .y2k-steps__step + .y2k-steps__step .y2k-steps__body {
  border-left: 1px solid transparent;
  border-image: var(--y2k-holo, linear-gradient(180deg, #f2bfdc, #c3cff7)) 1;
}

.is-chevron .y2k-steps__step:not(.is-active) .y2k-steps__body {
  opacity: 0.6;
}
</style>
