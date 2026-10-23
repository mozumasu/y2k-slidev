<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import { activeCodeStep } from '../utils/codeSteps.ts'
import { RichText } from '../utils/richTextVNode.ts'

export interface CodeStep {
  /** 小見出し */
  title?: string
  /** 説明文。<em> / <strong> / <br> を解釈する (<em> はピンク) */
  text?: string
  /** 対応する行の目印 (例: '3-4')。右肩に小さく出す */
  lines?: string
}

// コードの行ハイライト ({1|3-4|6}) と連動する番号付きの説明
// クリック数に合わせて対応する説明をピンクの番号・左のピンクの線・白いガラスで強調し、ほかは薄くする。
// 説明の i 番目 (0 始まり) がコードの i 番目の範囲に対応する。クリックはコードブロックが登録するので、
// この部品は数えるだけ (コードが無いスライドで使うときは frontmatter に clicks: <説明の数 - 1> を置く)。
// --with-clicks なしの PDF / PNG 書き出し・一覧表示は、コードと同じく最後の説明を強調した最終状態になる
const { steps, at = 0, current } = defineProps<{
  steps: (string | CodeStep)[]
  /** コードブロックの 1 つ目の範囲が表示されるクリック数。コードの前に v-click が 1 つあれば 1 */
  at?: number
  /** 強調する説明を直接指定する (1 始まり)。指定するとクリック数は見ない。0 で全項目を通常表示 */
  current?: number
}>()

const { $clicks } = useSlideContext()

const items = computed<CodeStep[]>(() => steps.map(step => typeof step === 'string' ? { text: step } : step))
const active = computed(() => {
  if (current !== undefined)
    return current > 0 ? Math.min(current, items.value.length) - 1 : undefined
  return activeCodeStep($clicks.value, items.value.length, at)
})
</script>

<template>
  <ol class="y2k-code-steps" :class="{ 'has-active': active !== undefined }">
    <li
      v-for="(item, i) in items"
      :key="i"
      class="y2k-code-steps__item"
      :class="{ 'is-active': i === active }"
    >
      <span class="y2k-code-steps__no">{{ String(i + 1).padStart(2, '0') }}</span>
      <div class="y2k-code-steps__body">
        <p v-if="item.title || item.lines" class="y2k-code-steps__title">
          <span v-if="item.title">{{ item.title }}</span>
          <code v-if="item.lines" class="y2k-code-steps__lines">L{{ item.lines }}</code>
        </p>
        <p v-if="item.text" class="y2k-code-steps__text"><RichText :text="item.text" /></p>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.y2k-code-steps {
  --y2k-code-steps-dim: 0.42;
  --y2k-code-steps-duration: 0.3s;

  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* テーマの箇条書きのキラキラ (ul > li::before) は ol なので当たらないが、念のため消す */
.y2k-code-steps__item::marker {
  content: none;
}

.y2k-code-steps__item {
  position: relative;
  display: flex;
  gap: 0.85rem;
  margin: 0;
  padding: 0.6rem 0.85rem 0.6rem 1rem;
  border-radius: 12px;
  line-height: 1.6;
  transition:
    opacity var(--y2k-code-steps-duration) var(--y2k-ease-in-out, ease),
    background-color var(--y2k-code-steps-duration) var(--y2k-ease-in-out, ease),
    box-shadow var(--y2k-code-steps-duration) var(--y2k-ease-in-out, ease);
}

/* 左端のピンクの線 (強調中だけ出す) */
.y2k-code-steps__item::before {
  content: '';
  position: absolute;
  top: 0.45rem;
  bottom: 0.45rem;
  left: 0;
  width: 3px;
  border-radius: 2px;
  background: var(--y2k-pink, #ff4fc3);
  opacity: 0;
  transition: opacity var(--y2k-code-steps-duration) var(--y2k-ease-in-out, ease);
}

.has-active .y2k-code-steps__item:not(.is-active) {
  opacity: var(--y2k-code-steps-dim);
}

.y2k-code-steps__item.is-active {
  background: var(--y2k-glass-strong, rgba(255, 255, 255, 0.62));
  box-shadow: var(--y2k-shadow-float, 0 1rem 2rem -0.8rem rgba(42, 36, 49, 0.22));
}

.y2k-code-steps__item.is-active::before {
  opacity: 1;
}

/* 番号は太いイタリック。強調中はピンクのレトロ 3D */
.y2k-code-steps__no {
  flex: none;
  width: 1.6rem;
  color: var(--y2k-ink-soft, #5d5566);
  font-family: var(--y2k-font-display, sans-serif);
  font-size: 1.1rem;
  font-style: italic;
  font-weight: 700;
  line-height: 1.35;
  transition: color var(--y2k-code-steps-duration) var(--y2k-ease-in-out, ease);
}

.is-active .y2k-code-steps__no {
  color: var(--y2k-pink, #ff4fc3);
  text-shadow: 1.5px 1.5px 0 var(--y2k-ink, #2a2431);
}

.y2k-code-steps__body {
  flex: 1;
  min-width: 0;
}

.y2k-code-steps__body p {
  margin: 0;
}

.y2k-code-steps__title {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 700;
}

.y2k-code-steps__lines {
  margin-left: auto;
  padding: 0 !important;
  background: none !important;
  color: var(--y2k-ink-soft, #5d5566) !important;
  font-size: 0.6rem;
  font-weight: 400;
}

.y2k-code-steps__text {
  color: var(--y2k-ink-soft, #5d5566);
  font-size: 0.78rem;
}

.y2k-code-steps__text :deep(em) {
  color: var(--y2k-pink-deep, #d42a9c);
  font-style: normal;
  font-weight: 700;
}
</style>
