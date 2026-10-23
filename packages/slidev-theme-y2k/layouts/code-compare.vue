<script setup lang="ts">
import type { ColumnRatio } from '../utils/columns.ts'
import { useSlideContext } from '@slidev/client'
import { computed, useSlots } from 'vue'
import { columnTemplate } from '../utils/columns.ts'
import Default from './default.vue'

// Before / After のコードを左右に並べる (default の枠: eyebrow・ページ番号 付き)
// 見出しは frontmatter の title。本文が Before、::after:: 以降が After。
// ::before:: を使った場合は、最初の ::before:: より前の本文を 2 カラムの上に全幅のリード文として出す。
// Before は真珠のガラス、After はビビッドなピンクのラベルで、変えた後のほうに目が行くようにする。
// eyebrow / background は default レイアウトにそのまま渡る
const {
  ratio,
  beforeLabel = 'Before',
  afterLabel = 'After',
  beforeCaption,
  afterCaption,
  arrow = true,
  codeSize,
} = defineProps<{
  /** Before:After の比率。'1:1' / [2, 3] / 0.4 / '40%' (Before の割合)。既定は 1:1 */
  ratio?: ColumnRatio
  beforeLabel?: string
  afterLabel?: string
  /** Before のコードの下に出す補足 */
  beforeCaption?: string
  /** After のコードの下に出す補足 */
  afterCaption?: string
  /** 2 つのコードの間に右向きの矢印を出す */
  arrow?: boolean
  /** このスライドのコードの文字サイズ (CSS の長さ。例: 0.7rem) */
  codeSize?: string
}>()

const { $frontmatter } = useSlideContext()
const title = computed(() => $frontmatter.title as string | undefined)

const slots = useSlots()
const hasLead = computed(() => !!slots.before && !!slots.default)
const gridStyle = computed(() => ({
  gridTemplateColumns: columnTemplate(ratio, arrow ? { middle: 'auto' } : {}),
  ...(codeSize ? { '--slidev-code-font-size': codeSize } : {}),
}))
</script>

<template>
  <Default class="code-compare">
    <div class="y2k-compare">
      <h1 v-if="title">{{ title }}</h1>
      <div v-if="hasLead" class="y2k-compare__lead">
        <slot />
      </div>
      <div class="y2k-compare__grid" :class="{ 'has-arrow': arrow }" :style="gridStyle">
        <section class="y2k-compare__side is-before">
          <p class="y2k-compare__label">{{ beforeLabel }}</p>
          <div class="y2k-code-window">
            <div class="y2k-code-window__bar">
              <span class="y2k-code-window__dots" aria-hidden="true"><span /><span /><span /></span>
            </div>
            <div class="y2k-code-window__body">
              <slot v-if="$slots.before" name="before" />
              <slot v-else />
            </div>
          </div>
          <p v-if="beforeCaption" class="y2k-compare__caption">{{ beforeCaption }}</p>
        </section>
        <div v-if="arrow" class="y2k-compare__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="30" height="30">
            <path d="M8 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <section class="y2k-compare__side is-after">
          <p class="y2k-compare__label">{{ afterLabel }}</p>
          <div class="y2k-code-window">
            <div class="y2k-code-window__bar">
              <span class="y2k-code-window__dots" aria-hidden="true"><span /><span /><span /></span>
            </div>
            <div class="y2k-code-window__body">
              <slot name="after" />
            </div>
          </div>
          <p v-if="afterCaption" class="y2k-compare__caption">{{ afterCaption }}</p>
        </section>
      </div>
    </div>
  </Default>
</template>

<style scoped>
.y2k-compare {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.y2k-compare__lead {
  margin-bottom: 1rem;
  line-height: 1.8;
}

.y2k-compare__lead > :deep(*) {
  margin: 0;
}

.y2k-compare__grid {
  flex: 1;
  min-height: 0;
  display: grid;
  /* 行の高さは中身に合わせ (矢印を中身の中央に置くため)、本文の高さを上限にする */
  grid-template-rows: fit-content(100%);
  align-content: start;
  column-gap: 2rem;
  padding-bottom: 1.25rem;
}

.y2k-compare__grid.has-arrow {
  column-gap: 0.9rem;
}

.y2k-compare__side {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.slidev-layout .y2k-compare__label {
  align-self: flex-start;
  margin: 0 0 0.6rem;
  padding: 0.15rem 1rem;
  border-radius: 999px;
  font-family: var(--y2k-font-display);
  font-size: 0.95rem;
  font-style: italic;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.4;
}

.is-before .y2k-compare__label {
  background: var(--y2k-glass-strong);
  color: var(--y2k-ink-soft);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.9);
}

.is-after .y2k-compare__label {
  background: var(--y2k-pink);
  color: var(--y2k-white);
  text-shadow: 1px 1px 0 var(--y2k-ink);
  box-shadow: 2px 2px 0 var(--y2k-ink);
}

/* Before は少し引かせ、After を主役にする */
.is-before .y2k-code-window {
  opacity: 0.88;
}

.slidev-layout .y2k-compare__caption {
  margin: 0.6rem 0 0;
  color: var(--y2k-ink-soft);
  font-size: 0.75rem;
  line-height: 1.6;
}

.is-after .y2k-compare__caption {
  color: var(--y2k-ink);
}

.y2k-compare__arrow {
  align-self: center;
  color: var(--y2k-pink);
  filter: drop-shadow(1.5px 1.5px 0 var(--y2k-ink));
}
</style>
