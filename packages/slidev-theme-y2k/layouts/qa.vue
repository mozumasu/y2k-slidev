<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { handleBackground } from '@slidev/client/layoutHelper.ts'
import { computed } from 'vue'

// 問いと答えを 1 枚で見せる (聴衆への問いかけ、よくある質問など)。
// title が問い (左上の見出し)、本文 (md) が答え。答えはピンクのウィンドウに入れ、クリックで出す
// (click: false で最初から出す)。本文中の *強調* は白のレトロ 3D になる。
// credit は答えの下に小さく添える出典で、答えの次のクリックで出る
const { background, mark = 'A.', click = true, credit } = defineProps<{
  background?: string
  /** 答えのウィンドウのタイトルバーに出す目印 */
  mark?: string
  /** 答えをクリックで出すか。false で最初から表示する */
  click?: boolean
  /** 答えの下に小さく添える出典・クレジット */
  credit?: string
}>()

const { $frontmatter } = useSlideContext()
const title = computed(() => $frontmatter.title as string | undefined)
const style = computed(() => handleBackground(background))
</script>

<template>
  <div class="slidev-layout qa" :style="style">
    <div class="y2k-content y2k-qa__question">
      <span class="y2k-qa__q" aria-hidden="true">Q.</span>
      <h1 v-if="title" class="y2k-qa__title">{{ title }}</h1>
    </div>
    <!-- v-click は false を渡すとクリック対象にならない -->
    <div v-click="click" class="y2k-content y2k-qa__answer">
      <Y2kWindow :label="mark" :stack="2" class="y2k-qa__window">
        <div class="y2k-qa__body">
          <slot />
        </div>
      </Y2kWindow>
      <p v-if="credit" v-click class="y2k-qa__credit">{{ credit }}</p>
    </div>
  </div>
</template>

<style scoped>
.qa {
  position: relative;
  display: flex;
  flex-direction: column;
}

.y2k-qa__question {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

/* 問いの目印はピンクのレトロ 3D */
.y2k-qa__q {
  flex: none;
  color: var(--y2k-pink);
  font-family: var(--y2k-font-display);
  font-size: 2.6rem;
  font-style: italic;
  font-weight: 800;
  line-height: 1;
  text-shadow: 3px 3px 0 var(--y2k-ink);
}

.slidev-layout .y2k-qa__title {
  margin: 0;
  font-size: 2rem;
  line-height: 1.35;
}

.slidev-layout .y2k-qa__title::after {
  display: none;
}

.y2k-qa__answer {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.y2k-qa__window {
  width: 78%;
}

.y2k-qa__body {
  color: var(--y2k-white);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.6;
}

/* Slidev の p は行の高さを rem で固定しているので、大きな文字で折り返すと行が重なる */
.y2k-qa__body :deep(p) {
  margin: 0;
  line-height: inherit;
}

.y2k-qa__body :deep(em),
.y2k-qa__body :deep(strong) {
  color: var(--y2k-white);
  font-style: normal;
  font-weight: 800;
  text-shadow: 2px 2px 0 var(--y2k-ink);
}

.slidev-layout .y2k-qa__credit {
  margin: 1rem 0 0;
  color: var(--y2k-ink-soft);
  font-size: 0.7rem;
}
</style>
