<script setup lang="ts">
import { RichText } from '../utils/richTextVNode.ts'

// ピンクの見出し + 字下げした説明を縦に積むリスト (自己紹介の右側、サービスの特徴など)。
// 項目は items prop か、slot 内の md 箇条書き (前後に空行) で渡す。
// slot では `- **Work** 説明文` のように先頭の太字が見出しになる。
// clicks を付けると 1 項目ずつ v-click で表示する (slot のときは <v-clicks> で囲む)。
// description は <em> / <strong> / <br> だけを解釈する
export interface FeatureListItem {
  /** ピンクの見出し。書いたとおりの大文字・小文字で表示する */
  title: string
  description?: string
}

const { items, clicks = false } = defineProps<{
  items?: FeatureListItem[]
  /** 項目を 1 つずつ v-click で表示する */
  clicks?: boolean
}>()
</script>

<template>
  <div class="y2k-feature-list">
    <ul v-if="items">
      <li v-for="(item, i) in items" :key="i" v-click="clicks ? undefined : false">
        <strong>{{ item.title }}</strong>
        <span v-if="item.description"><RichText :text="item.description" /></span>
      </li>
    </ul>
    <slot v-else />
  </div>
</template>

<style scoped>
.y2k-feature-list {
  --y2k-feature-list-title-size: 1.3rem;
  --y2k-feature-list-gap: 1.6rem;
  /* 説明を見出しより下げる幅。見出しと説明で文字の大きさが違うので em ではなく rem で持つ */
  --y2k-feature-list-indent: 1.25rem;
}

.y2k-feature-list ul,
.y2k-feature-list :deep(ul) {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* 説明を字下げし、見出しだけ負のマージンで左端に戻す
   (md の箇条書きでは説明が li 直下のテキストになり、包む要素が無いため) */
.y2k-feature-list li,
.y2k-feature-list :deep(li) {
  margin: 0;
  padding: 0 0 0 var(--y2k-feature-list-indent);
  list-style: none;
  color: var(--y2k-ink, #2a2431);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  line-height: 1.8;
}

/* テーマの箇条書きのキラキラは、見出しが目印になるので出さない */
.y2k-feature-list li::before,
.y2k-feature-list :deep(li)::before {
  content: none;
}

.y2k-feature-list li + li,
.y2k-feature-list :deep(li + li) {
  margin-top: var(--y2k-feature-list-gap);
}

/* 先頭の太字をピンクのレトロ 3D の見出しにして、説明と改行する。大文字には変えず書いたとおりに出す */
.y2k-feature-list li > strong,
.y2k-feature-list :deep(li > strong:first-child) {
  display: block;
  margin: 0 0 0.3rem calc(var(--y2k-feature-list-indent) * -1);
  color: var(--y2k-pink, #ff4fc3);
  font-family: var(--y2k-font-display, sans-serif);
  font-size: var(--y2k-feature-list-title-size);
  font-style: italic;
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 1.2;
  text-shadow: 1.5px 1.5px 0 var(--y2k-ink, #2a2431);
}

.y2k-feature-list li > span {
  display: block;
}

.y2k-feature-list :deep(em),
.y2k-feature-list :deep(li > strong:not(:first-child)) {
  color: var(--y2k-pink-deep, #d42a9c);
  font-style: normal;
  font-weight: 700;
}

.y2k-feature-list :deep(p) {
  margin: 0;
}
</style>
