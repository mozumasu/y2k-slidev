<script setup lang="ts">
import { withBase } from 'slidev-theme-y2k/utils/withBase.ts'
import { computed } from 'vue'

// 丸いアイコンの横に、しっぽ付きの吹き出しでひとことを添える (発表者のつぶやき・聴衆の疑問・会話など)。
// 動きは partner-prop/prop-slidev の <SpeechBubble> に合わせ、本文は slot、<code> はピンクの等幅になる。
// size: lg は答えとして中央に大きく置く版。pinned を付けると、スライドの下端中央に固定する。
// side: right でアイコンを右に置き、会話の相手側にする。color: pink でビビッドなピンクの吹き出しにする
const { image, name, size = 'md', side = 'left', color = 'glass', pinned = false } = defineProps<{
  /** アイコンの画像 (public/ のルート絶対パスか URL)。#icon スロットがあればそちらを優先する */
  image?: string
  /** アイコンの下に出す小さな名前 */
  name?: string
  size?: 'md' | 'lg'
  /** アイコンを置く側 */
  side?: 'left' | 'right'
  /** glass: 白いすりガラス / pink: ビビッドなピンク */
  color?: 'glass' | 'pink'
  /** スライドの下端中央に固定する */
  pinned?: boolean
}>()

const src = computed(() => withBase(image))
</script>

<template>
  <div
    class="y2k-speech"
    :class="[`is-${size}`, `is-${side}`, `is-${color}`, { 'is-pinned': pinned }]"
  >
    <span v-if="src || $slots.icon" class="y2k-speech__person">
      <span class="y2k-speech__icon">
        <slot name="icon">
          <img :src="src" alt="">
        </slot>
      </span>
      <span v-if="name" class="y2k-speech__name">{{ name }}</span>
    </span>
    <div class="y2k-speech__text">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.y2k-speech {
  --y2k-speech-icon: 3.6rem;
  --y2k-speech-tail: 0.7rem;
  --y2k-speech-bg: rgba(255, 255, 255, 0.86);
  --y2k-speech-text: var(--y2k-ink, #2a2431);

  display: flex;
  align-items: flex-start;
  gap: 1.1rem;
  max-width: 100%;
}

.y2k-speech.is-right {
  flex-direction: row-reverse;
}

.y2k-speech.is-pink {
  --y2k-speech-bg: var(--y2k-pink, #ff4fc3);
  --y2k-speech-text: var(--y2k-white, #fff);
}

/* スライド全体を基準に下端中央へ固定する (2 カラムの列の中に書いても位置が変わらない) */
.y2k-speech.is-pinned {
  position: fixed;
  left: 50%;
  bottom: 2.6rem;
  z-index: 5;
  transform: translateX(-50%);
  width: max-content;
  max-width: 80%;
}

.y2k-speech__person {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

/* アイコンはホログラムの輪で囲み、右下にピンクの影をずらす (profile の写真と同じ見せ方) */
.y2k-speech__icon {
  width: var(--y2k-speech-icon);
  height: var(--y2k-speech-icon);
  padding: 3px;
  border-radius: 50%;
  background: var(--y2k-holo, linear-gradient(120deg, #f2bfdc, #c3cff7));
  box-shadow: 0.2rem 0.2rem 0 var(--y2k-pink, #ff4fc3);
}

.y2k-speech__icon :deep(img) {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.y2k-speech__name {
  color: var(--y2k-ink-soft, #5d5566);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

/* 吹き出し本体。しっぽはアイコンの中ほどの高さから出す */
.y2k-speech__text {
  position: relative;
  min-width: 0;
  margin-top: calc(var(--y2k-speech-icon) / 2 - 1.35rem);
  padding: 0.7rem 1.2rem;
  border-radius: 1.2rem;
  background: var(--y2k-speech-bg);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.9),
    var(--y2k-shadow-float, 0 1rem 2rem -0.8rem rgba(42, 36, 49, 0.22));
  color: var(--y2k-speech-text);
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.7;
}

.y2k-speech__text::before {
  content: '';
  position: absolute;
  top: 1rem;
  left: calc(var(--y2k-speech-tail) * -0.55);
  width: var(--y2k-speech-tail);
  height: var(--y2k-speech-tail);
  border-radius: 0 0 0 0.2rem;
  background: var(--y2k-speech-bg);
  transform: rotate(45deg);
}

.is-right .y2k-speech__text::before {
  left: auto;
  right: calc(var(--y2k-speech-tail) * -0.55);
  border-radius: 0 0.2rem 0 0;
}

.y2k-speech__text :deep(p) {
  margin: 0;
  line-height: inherit;
}

.y2k-speech__text :deep(code) {
  padding: 0.05em 0.35em;
  border-radius: 6px;
  background: rgba(255, 79, 195, 0.12);
  color: var(--y2k-pink-deep, #d42a9c);
}

.is-pink .y2k-speech__text :deep(code) {
  background: rgba(255, 255, 255, 0.25);
  color: var(--y2k-white, #fff);
}

.is-pink .y2k-speech__text {
  text-shadow: 1px 1px 0 rgba(42, 36, 49, 0.35);
}

/* --- lg: 答えとして大きく置く --- */
.y2k-speech.is-lg {
  --y2k-speech-icon: 5.2rem;
  --y2k-speech-tail: 1rem;

  align-items: center;
}

.y2k-speech.is-lg .y2k-speech__text {
  margin-top: 0;
  padding: 1.1rem 1.8rem;
  border-radius: 1.6rem;
  font-size: 1.5rem;
  line-height: 1.5;
}

.y2k-speech.is-lg .y2k-speech__text::before {
  top: 50%;
  margin-top: calc(var(--y2k-speech-tail) / -2);
}
</style>
