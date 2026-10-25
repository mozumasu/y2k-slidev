<script setup lang="ts">
import type { ProfileLink, ProfileSection } from '../utils/profile.ts'
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import { isExternalUrl, normalizeProfileLinks, splitProfileName } from '../utils/profile.ts'
import { withBase } from '../utils/withBase.ts'
import Default from './default.vue'

// 自己紹介 (登壇資料の 2 枚目など)。default の枠 (eyebrow・ページ番号) 付き。並びは partner-prop/prop-slidev に合わせる。
// 左: ホログラムの輪の丸い写真・名前・所属・リンクの行、右: ピンクの英字見出し + 説明の縦のリスト (<Y2kFeatureList>)。
// 右は本文の md 箇条書き (`- **Work** 説明`) か sections prop。写真は image か ::avatar:: スロット。
// 見出しは frontmatter の title (既定は Profile)。eyebrow / background は default レイアウトにそのまま渡る
const { image, name, affiliation, links, sections } = defineProps<{
  /** 写真 (public/ のルート絶対パスか URL)。::avatar:: スロットがあればそちらを優先する */
  image?: string
  /** 名前。末尾の (yamada) のような括弧書きは少し小さく出す */
  name?: string
  /** 所属・役割。改行はそのまま反映する */
  affiliation?: string
  /** 名前の下のリンクの行。{ label, url? } か文字列の配列 */
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
        <div class="y2k-profile__person">
          <div v-if="avatarSrc || $slots.avatar" class="y2k-profile__avatar">
            <slot name="avatar">
              <img :src="avatarSrc" :alt="name ?? ''">
            </slot>
          </div>
          <p v-if="nameParts.main" class="y2k-profile__name">
            {{ nameParts.main }}<small v-if="nameParts.note">{{ nameParts.note }}</small>
          </p>
          <p v-if="affiliation" class="y2k-profile__affiliation">{{ affiliation }}</p>
          <ul v-if="lines.length" class="y2k-profile__links">
            <li v-for="link in lines" :key="link.label">
              <a
                v-if="link.url"
                :href="link.url"
                :target="isExternalUrl(link.url) ? '_blank' : undefined"
                :rel="isExternalUrl(link.url) ? 'noopener noreferrer' : undefined"
              >{{ link.label }}</a>
              <span v-else>{{ link.label }}</span>
            </li>
          </ul>
        </div>

        <Y2kFeatureList class="y2k-profile__sections" :items="$slots.default ? undefined : sections">
          <slot />
        </Y2kFeatureList>
      </div>
    </div>
  </Default>
</template>

<style scoped>
.y2k-profile {
  --y2k-profile-avatar-size: 10.5rem;

  display: flex;
  flex-direction: column;
  height: 100%;
}

.y2k-profile__grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 19rem minmax(0, 1fr);
  align-items: center;
  column-gap: 3rem;
  padding-bottom: 1.5rem;
}

/* --- 左: 写真・名前・所属・リンク --- */
.y2k-profile__person {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* 写真はホログラムの輪で囲み、右下にピンクの影をずらして重ねる。スロットで差し替えた画像も丸く切り抜く */
.y2k-profile__avatar {
  width: var(--y2k-profile-avatar-size);
  aspect-ratio: 1;
  padding: 4px;
  border-radius: 50%;
  background: var(--y2k-holo);
  box-shadow: 0.35rem 0.35rem 0 var(--y2k-pink);
}

.y2k-profile__avatar :deep(img) {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.slidev-layout .y2k-profile__name {
  margin: 1.1rem 0 0;
  font-family: var(--y2k-font-display);
  font-size: 1.75rem;
  font-style: italic;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: 0.02em;
  text-shadow: var(--y2k-shadow-retro-sm);
}

.y2k-profile__name small {
  margin-left: 0.3em;
  font-size: 0.6em;
  text-shadow: none;
}

.slidev-layout .y2k-profile__affiliation {
  margin: 0.5rem 0 0;
  color: var(--y2k-ink-soft);
  font-size: 0.95rem;
  line-height: 1.5;
  white-space: pre-line;
}

.y2k-profile__links {
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
  color: var(--y2k-ink-soft);
  font-size: 0.8rem;
  line-height: 1.8;
  text-align: left;
}

.slidev-layout .y2k-profile__links li {
  margin: 0;
  padding: 0;
}

/* 行頭の目印は小さなピンクのキラキラ */
.slidev-layout .y2k-profile__links li::before {
  content: '✦';
  position: static;
  margin-right: 0.45em;
  color: var(--y2k-pink);
  font-size: 0.8em;
}

/* リンクも周りと同じ色。Slidev の a の点線の下線は消す */
.slidev-layout .y2k-profile__links a {
  color: inherit;
  border: none;
  text-decoration: none;
}
</style>
