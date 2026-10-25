<script setup lang="ts">
import { useNav } from '@slidev/client'
import { computed } from 'vue'
import { useTocItems } from './composables/useTocItems.ts'
import { findActiveNo } from './utils/toc.ts'

// ウィンドウ右端にカーソルを寄せると出る目次ドロワー。並びは partner-prop/prop-slidev に合わせる。
// 項目は frontmatter の `toc: ラベル` (無ければスライドタイトルの階層)。書き出し・プレゼンターでは出さない
const { currentPage, go, isPresenter, isPrintMode } = useNav()
const { items } = useTocItems()

const activeNo = computed(() => findActiveNo(items.value, currentPage.value))

// クリックしたリンクにフォーカスが残ると :focus-within でドロワーが開きっぱなしになる
function select(no: number, e: Event) {
  ;(e.currentTarget as HTMLElement).blur()
  go(no)
}
</script>

<template>
  <!-- Global Layer はスライドキャンバス (16:9 に縮尺・中央寄せ) の中に描かれるため、
       body に出してウィンドウの右端に固定する。キャンバスの縮尺を受けないので寸法は px で書く -->
  <Teleport to="body">
    <nav
      v-if="!isPrintMode && !isPresenter && items.length"
      class="y2k-toc-drawer"
      aria-label="目次"
    >
      <span class="y2k-toc-drawer__grip" aria-hidden="true" />
      <div class="y2k-toc-drawer__panel">
        <div class="y2k-toc-drawer__bar" aria-hidden="true">
          <span /><span /><span />
        </div>
        <p class="y2k-toc-drawer__title">Contents</p>
        <ol class="y2k-toc-drawer__list">
          <li
            v-for="(item, i) in items"
            :key="item.no"
            class="y2k-toc-drawer__item"
            :class="{ 'is-active': item.no === activeNo }"
          >
            <span class="y2k-toc-drawer__no">{{ String(i + 1).padStart(2, '0') }}</span>
            <a href="#" @click.prevent="select(item.no, $event)">{{ item.label }}</a>
            <ol v-if="item.children.length" class="y2k-toc-drawer__children">
              <li
                v-for="child in item.children"
                :key="child.no"
                class="y2k-toc-drawer__child"
                :class="{ 'is-active': child.no === activeNo }"
              >
                <a href="#" @click.prevent="select(child.no, $event)">{{ child.label }}</a>
              </li>
            </ol>
          </li>
        </ol>
      </div>
    </nav>
  </Teleport>
</template>

<style scoped>
/* 右端の細い透明帯が当たり判定。パネルはその子なので、引き出した後に
   パネル上へカーソルが移っても :hover が切れない */
.y2k-toc-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 16px;
  z-index: 100;
  color: var(--y2k-ink);
  font-family: Poppins, 'M PLUS Rounded 1c', sans-serif;
}

/* ドロワーがあることを控えめに示すピンクのピル */
.y2k-toc-drawer__grip {
  position: absolute;
  top: 50%;
  right: 5px;
  width: 4px;
  height: 48px;
  transform: translateY(-50%);
  border-radius: 999px;
  background: var(--y2k-pink);
  box-shadow: 0 0 8px var(--y2k-pink);
  opacity: 0.45;
  transition: opacity 0.15s ease;
}

.y2k-toc-drawer:hover .y2k-toc-drawer__grip,
.y2k-toc-drawer:focus-within .y2k-toc-drawer__grip {
  opacity: 0;
}

/* パネルはすりガラスのウィンドウ。左の縁をホログラムの線にする */
.y2k-toc-drawer__panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  padding: 0 26px 40px;
  overflow-y: auto;
  /* 下のスライドの濃い色が濁って透けないよう、ガラスは白を強めにする */
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px) saturate(1.3);
  border-left: 1px solid transparent;
  border-image: var(--y2k-holo) 1;
  box-shadow: -12px 0 32px -12px rgba(42, 36, 49, 0.25);
  transform: translateX(100%);
  transition: transform 0.25s var(--y2k-ease-in-out);
}

.y2k-toc-drawer:hover .y2k-toc-drawer__panel,
.y2k-toc-drawer:focus-within .y2k-toc-drawer__panel {
  transform: translateX(0);
}

/* 上端はウィンドウのタイトルバーと同じ真珠の粒 */
.y2k-toc-drawer__bar {
  display: flex;
  gap: 6px;
  margin: 0 -26px 24px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.4);
}

.y2k-toc-drawer__bar span {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fff 0 25%, var(--y2k-chrome-mid) 70%, var(--y2k-chrome-dark) 100%);
}

.y2k-toc-drawer__bar span:first-child {
  background: radial-gradient(circle at 35% 30%, #fff 0 20%, var(--y2k-pink) 65%, var(--y2k-pink-deep) 100%);
}

/* 見出しはピンクのレトロ 3D */
.y2k-toc-drawer__title {
  margin: 0 0 14px;
  color: var(--y2k-pink);
  font-size: 22px;
  font-style: italic;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-shadow: 2px 2px 0 var(--y2k-ink);
}

.y2k-toc-drawer__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.y2k-toc-drawer__item {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 12px;
  align-items: baseline;
  padding: 10px 0;
  border-bottom: 1px solid rgba(42, 36, 49, 0.08);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
}

.y2k-toc-drawer__no {
  color: var(--y2k-ink-soft);
  font-size: 13px;
  font-style: italic;
  font-weight: 800;
}

.y2k-toc-drawer__item.is-active > .y2k-toc-drawer__no {
  color: var(--y2k-pink);
  text-shadow: 1px 1px 0 var(--y2k-ink);
}

/* 子項目は番号なしで、親ラベルの開始位置に揃えて控えめに並べる */
.y2k-toc-drawer__children {
  grid-column: 2;
  list-style: none;
  margin: 4px 0 0;
  padding: 0;
}

.y2k-toc-drawer__child {
  padding: 3px 0;
  color: var(--y2k-ink-soft);
  font-size: 13px;
  font-weight: 500;
}

.y2k-toc-drawer a {
  color: inherit;
  text-decoration: none;
}

.y2k-toc-drawer a:hover,
.y2k-toc-drawer .is-active > a {
  color: var(--y2k-pink-deep);
}
</style>
