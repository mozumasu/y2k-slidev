---
theme: ../slidev-theme-y2k
addons:
  # addon の相対パスは deck ディレクトリの 1 つ上 (packages/) から解決される
  - ./slidev-addon-y2k
title: slidev-addon-y2k
---

# Components

<div class="grid grid-cols-2 gap-10 mt-4">
  <Y2kWindow title="Y2kWindow" class="h-48">
    stack で後ろに重ねる枚数を変えられる
  </Y2kWindow>
  <div class="flex items-center justify-around">
    <Y2kHeart />
    <Y2kSparkle />
    <Y2kBubble />
  </div>
</div>
