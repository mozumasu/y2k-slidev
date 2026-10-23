<script setup lang="ts">
import { useNav, useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import { useTocItems } from '../composables/useTocItems.ts'
import { tocTitle } from '../utils/toc.ts'
import Default from './default.vue'

// 目次 (アジェンダ) のスライド。default の枠 (eyebrow・ページ番号) 付き。
// 項目は各スライドの frontmatter の `toc: ラベル` (`tocLevel: 2` で子項目)。
// 1 つも無ければスライドタイトルの階層を使う。項目を押すとそのスライドへ移動する。
// 見出しは frontmatter の title か本文の最初の見出し (`## Agenda`)。本文は項目の一覧に置き換わる
const { columns = 1 } = defineProps<{
  /** 段組みの列数。項目が多くて縦に収まらないときに 2 にする */
  columns?: number | string
}>()

const { slides, go } = useNav()
const { $page } = useSlideContext()
const { items } = useTocItems()
const title = computed(() => tocTitle(slides.value[$page.value - 1]?.meta, 'Agenda'))
</script>

<template>
  <Default class="toc">
    <div class="y2k-toc">
      <h1>{{ title }}</h1>
      <ol class="y2k-toc__list" :style="{ columnCount: Number(columns) || 1 }">
        <li v-for="(item, i) in items" :key="item.no" class="y2k-toc__item">
          <a href="#" class="y2k-toc__link" @click.prevent="go(item.no)">
            <span class="y2k-toc__no">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="y2k-toc__label">{{ item.label }}</span>
          </a>
          <ol v-if="item.children.length" class="y2k-toc__children">
            <li v-for="child in item.children" :key="child.no">
              <a href="#" @click.prevent="go(child.no)">{{ child.label }}</a>
            </li>
          </ol>
        </li>
      </ol>
    </div>
  </Default>
</template>

<style scoped>
.y2k-toc__list {
  margin: 0;
  padding: 0;
  column-gap: 3rem;
  list-style: none;
}

.y2k-toc__item {
  break-inside: avoid;
  padding: 0.55rem 0;
}

.y2k-toc__link {
  display: flex;
  align-items: baseline;
  gap: 1.1rem;
  color: var(--y2k-ink);
  text-decoration: none;
}

/* 番号はピンクのレトロ 3D */
.y2k-toc__no {
  flex: none;
  width: 2.6rem;
  color: var(--y2k-pink);
  font-family: var(--y2k-font-display);
  font-size: 1.6rem;
  font-style: italic;
  font-weight: 800;
  line-height: 1;
  text-shadow: 2px 2px 0 var(--y2k-ink);
}

.y2k-toc__label {
  flex: 1;
  padding-bottom: 0.45rem;
  border-bottom: 1px solid transparent;
  border-image: var(--y2k-holo) 1;
  font-size: 1.15rem;
  font-weight: 700;
}

.y2k-toc__link:hover .y2k-toc__label {
  color: var(--y2k-pink-deep);
}

.y2k-toc__children {
  margin: 0.3rem 0 0 3.7rem;
  padding: 0;
  list-style: none;
}

.y2k-toc__children li {
  padding: 0.1rem 0;
  font-size: 0.8rem;
}

.y2k-toc__children li::before {
  content: none;
}

.y2k-toc__children a {
  color: var(--y2k-ink-soft);
  text-decoration: none;
}
</style>
