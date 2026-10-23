<script setup lang="ts">
import ImageLeft from './image-left.vue'

// image-left の左右反転 (図版が右、テキストが左)。
// frontmatter (image / url / frame / ratio など) は属性としてそのまま image-left に渡る
</script>

<template>
  <ImageLeft class="image-right" side="right">
    <template v-for="(_, name) in $slots" #[name]>
      <slot :name="name" />
    </template>
  </ImageLeft>
</template>
