// <CodeSteps> の「今どの説明を強調するか」の計算。Vue に依存しないので node --test で検証できる

/**
 * 現在のクリック数から、強調する説明の番号 (0 始まり) を返す。undefined は強調なし (全項目を通常表示)。
 *
 * コードブロックの行ハイライト `{1|3-4|6}` は、クリック 0 で 1 つ目の範囲、
 * クリック 1 で 2 つ目…と進み、それ以降は最後の範囲のまま止まる。これと同じく
 * - at より前 (コードがまだ 1 つ目の範囲) は 0 番目
 * - 説明の数を超えたら最後の説明のまま
 * にする。--with-clicks なしの PDF / PNG 書き出しや一覧表示は「全クリック済み」で描かれるため、
 * コードと同じく最後の説明が強調された最終状態になる。
 *
 * @param clicks スライドの現在のクリック数 ($clicks)
 * @param count 説明の数
 * @param at コードブロックの 1 つ目の範囲が表示されるクリック数 (コードの前に v-click が 1 つあれば 1)
 */
export function activeCodeStep(clicks: number, count: number, at = 0): number | undefined {
  if (count <= 0 || Number.isNaN(clicks))
    return undefined
  const index = Math.floor(Math.min(clicks, Number.MAX_SAFE_INTEGER)) - Math.floor(at)
  return Math.min(Math.max(index, 0), count - 1)
}
