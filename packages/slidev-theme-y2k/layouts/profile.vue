<script setup lang="ts">
import type { ProfileLink, ProfileSection } from '../utils/profile.ts'
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import { isExternalUrl, normalizeProfileLinks, splitProfileName } from '../utils/profile.ts'
import { withBase } from '../utils/withBase.ts'
import Default from './default.vue'

// 自己紹介 (登壇資料の 2 枚目など)。default の枠 (eyebrow・ページ番号) 付き。
// 左: ホログラムの輪の丸い写真・名前・所属・リンクのピル、右: ピンクの英字見出し + 説明の並び。
// 右は本文 (md) があればそれを、無ければ sections を出す。写真は image か ::avatar:: スロット。
// 見出しは frontmatter の title (既定は Profile)。eyebrow / background は default レイアウトにそのまま渡る
const { image, name, affiliation, links, sections } = defineProps<{
  /** 写真 (public/ のルート絶対パスか URL)。::avatar:: スロットがあればそちらを優先する */
  image?: string
  /** 名前。末尾の (yamada) のような括弧書きは少し小さく出す */
  name?: string
  /** 所属・役割。改行はそのまま反映する */
  affiliation?: string
  /** 名前の下のピル。{ label, url? } か文字列の配列 */
  links?: (ProfileLink | string)[]
  /** 右カラムの項目。本文 (md) があればそちらを優先する */
  sections?: ProfileSection[]
}>()

const { $frontmatter } = useSlideContext()
const title = computed(() => ($frontmatter.title as string | undefined) ?? 'Profile')
const nameParts = computed(() => splitProfileName(name))
const lines = computed(() => normalizeProfileLinks(links))
const avatarSrc = computed(() => withBase(image))
</script>

<template>
  <Default class="profile">
    <div class="y2k-profile">
      <h1>{{ title }}</h1>
      <div class="y2k-profile__grid">
        <div class="y2k-profile__card">
          <div v-if="avatarSrc || $slots.avatar" class="y2k-profile__avatar">
            <slot name="avatar">
              <img :src="avatarSrc" alt="">
            </slot>
          </div>
          <p v-if="nameParts.main" class="y2k-profile__name">
            {{ nameParts.main }}
            <span v-if="nameParts.note" class="y2k-profile__name-note">{{ nameParts.note }}</span>
          </p>
          <p v-if="affiliation" class="y2k-profile__affiliation">{{ affiliation }}</p>
          <ul v-if="lines.length" class="y2k-profile__links">
            <li v-for="link in lines" :key="link.label">
              <a
                v-if="link.url"
                :href="link.url"
                :target="isExternalUrl(link.url) ? '_blank' : undefined"
                rel="noopener"
              >{{ link.label }}</a>
              <span v-else>{{ link.label }}</span>
            </li>
          </ul>
        </div>
        <div class="y2k-profile__about">
          <slot>
            <dl v-if="sections?.length" class="y2k-profile__sections">
              <template v-for="section in sections" :key="section.title">
                <dt>{{ section.title }}</dt>
                <dd>{{ section.description }}</dd>
              </template>
            </dl>
          </slot>
        </div>
      </div>
    </div>
  </Default>
</template>

<style scoped>
.y2k-profile {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.y2k-profile__grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  column-gap: 3rem;
  align-items: center;
  padding-bottom: 1.5rem;
}

.y2k-profile__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.y2k-profile__card p {
  margin: 0;
}

/* 写真はホログラムの輪で囲み、右下にピンクの影をずらして重ねる */
.y2k-profile__avatar {
  width: 9rem;
  height: 9rem;
  margin-bottom: 1.1rem;
  padding: 4px;
  border-radius: 50%;
  background: var(--y2k-holo);
  box-shadow: 0.35rem 0.35rem 0 var(--y2k-pink);
}

.y2k-profile__avatar :deep(img) {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.y2k-profile__name {
  font-family: var(--y2k-font-display);
  font-size: 1.9rem;
  font-style: italic;
  font-weight: 800;
  line-height: 1.25;
  text-shadow: var(--y2k-shadow-retro-sm);
}

.y2k-profile__name-note {
  font-size: 0.55em;
  text-shadow: none;
}

.y2k-profile__affiliation {
  margin-top: 0.45rem !important;
  color: var(--y2k-ink-soft);
  font-size: 0.8rem;
  line-height: 1.6;
  white-space: pre-line;
}

.y2k-profile__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
  margin: 1rem 0 0;
  padding: 0;
}

.slidev-layout .y2k-profile__links li {
  padding: 0.15rem 0.8rem;
  border-radius: 999px;
  background: var(--y2k-glass-strong);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.9);
  font-size: 0.7rem;
  line-height: 1.6;
}

.slidev-layout .y2k-profile__links li::before {
  content: none;
}

.y2k-profile__links a {
  color: var(--y2k-ink);
  text-decoration: none;
}

/* 右カラムはすりガラスのパネルに入れる */
.y2k-profile__about {
  padding: 1.6rem 1.8rem;
  border-radius: var(--y2k-radius);
  background: var(--y2k-glass);
  box-shadow: var(--y2k-shadow-float);
  backdrop-filter: blur(var(--y2k-glass-blur)) saturate(1.3);
  font-size: 0.85rem;
  line-height: 1.8;
}

.y2k-profile__about > :deep(:first-child) {
  margin-top: 0;
}

.y2k-profile__about > :deep(:last-child) {
  margin-bottom: 0;
}

.y2k-profile__sections {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.9rem 1.4rem;
  margin: 0;
}

/* 見出しは小さな英字。ピンクのレトロ 3D */
.y2k-profile__sections dt {
  color: var(--y2k-pink);
  font-family: var(--y2k-font-display);
  font-size: 0.85rem;
  font-style: italic;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1.8;
  text-shadow: 1px 1px 0 var(--y2k-ink);
  text-transform: uppercase;
}

.y2k-profile__sections dd {
  margin: 0;
}
</style>
