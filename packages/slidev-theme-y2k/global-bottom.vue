<script setup lang="ts">
import { useNav } from '@slidev/client'

// 全スライド共通の背景。スライドの下のレイヤーに 1 枚だけ置くので、
// ページを送ってもグラデーションの動きが途切れない。
// パステルのグラデーション → ぼかした光 → 細かな粒子 の順に重ねる。
// 書き出し (PDF / PNG) ではコマごとに位置がずれないよう止める。
// 下端のプログレスバー (<Y2kProgressBar>) もここに置く
const { isPrintMode } = useNav()

// 背景に散らす小さなきらめき (位置は % / 大きさは px)
const glints = [
  { x: 8, y: 14, size: 10, delay: 0 },
  { x: 86, y: 9, size: 14, delay: 2.4 },
  { x: 93, y: 62, size: 9, delay: 4.1 },
  { x: 14, y: 82, size: 12, delay: 1.3 },
  { x: 55, y: 92, size: 8, delay: 3.2 },
  { x: 47, y: 6, size: 7, delay: 5.0 },
]
</script>

<template>
  <div class="y2k-bg" :class="{ 'is-static': isPrintMode }" aria-hidden="true">
    <span class="y2k-bg__glow is-a" />
    <span class="y2k-bg__glow is-b" />
    <span class="y2k-bg__grain" />
    <svg
      v-for="(g, i) in glints"
      :key="i"
      class="y2k-bg__glint"
      :style="{ left: `${g.x}%`, top: `${g.y}%`, width: `${g.size}px`, animationDelay: `${g.delay}s` }"
      viewBox="0 0 100 100"
    >
      <path d="M50 0 C52 40 60 48 100 50 C60 52 52 60 50 100 C48 60 40 52 0 50 C40 48 48 40 50 0Z" />
    </svg>
  </div>
  <Y2kProgressBar />
</template>

<style scoped>
/* グラデーションを画面の 4 倍に広げ、見える位置をゆっくり往復させる */
.y2k-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: var(--y2k-bg-gradient);
  background-size: 400% 400%;
  animation: y2k-bg-drift var(--y2k-bg-duration) var(--y2k-ease-in-out) infinite alternate;
}

/* ぼかした光のかたまりを 2 つ漂わせ、オーロラのような揺らぎを足す */
.y2k-bg__glow {
  position: absolute;
  width: 55%;
  aspect-ratio: 1;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.7;
  animation: y2k-glow-float var(--y2k-glow-duration) var(--y2k-ease-in-out) infinite alternate;
}

.y2k-bg__glow.is-a {
  top: -25%;
  left: -12%;
  background: var(--y2k-blush);
}

.y2k-bg__glow.is-b {
  right: -18%;
  bottom: -30%;
  background: var(--y2k-aqua);
  /* 右下から始まるので、左上へ向かう別の軌道にする */
  animation-name: y2k-glow-float-b;
  animation-delay: calc(var(--y2k-glow-duration) / -2);
}

/* 印刷物のような細かな粒子。のっぺりしたグラデーションに質感を足す */
.y2k-bg__grain {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* 小さなきらめき。間隔をずらして明滅させる */
.y2k-bg__glint {
  position: absolute;
  fill: var(--y2k-white);
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.9));
  opacity: 0;
  animation: y2k-glint 6s var(--y2k-ease-in-out) infinite;
}

.y2k-bg.is-static,
.y2k-bg.is-static > * {
  animation: none;
}

/* 止めたときは色が一番重なる中ほどの位置にし、きらめきは見せる */
.y2k-bg.is-static {
  background-position: 50% 50%;
}

.y2k-bg.is-static .y2k-bg__glint {
  opacity: 0.8;
}

@media (prefers-reduced-motion: reduce) {
  .y2k-bg,
  .y2k-bg > * {
    animation: none;
  }

  .y2k-bg__glint {
    opacity: 0.8;
  }
}

/* 縦にも大きく振り、色の帯が斜めに流れて見えるようにする */
@keyframes y2k-bg-drift {
  0% {
    background-position: 0% 0%;
  }
  33% {
    background-position: 55% 100%;
  }
  66% {
    background-position: 100% 30%;
  }
  100% {
    background-position: 40% 0%;
  }
}

@keyframes y2k-glow-float {
  0% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(45%, 35%) scale(1.25);
  }
  100% {
    transform: translate(80%, 10%) scale(0.95);
  }
}

@keyframes y2k-glow-float-b {
  0% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-50%, -40%) scale(1.2);
  }
  100% {
    transform: translate(-85%, -5%) scale(0.95);
  }
}

@keyframes y2k-glint {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.4) rotate(0deg);
  }
  50% {
    opacity: 0.95;
    transform: scale(1) rotate(45deg);
  }
}
</style>
