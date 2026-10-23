// 目次 (toc レイアウト) の項目を組み立てる純粋関数。Slidev ランタイムに依存しないので単体テストできる

export interface TocEntry {
  no: number
  label: string
  children: TocEntry[]
}

export interface TocSlide {
  no: number
  frontmatter: Record<string, unknown>
}

export interface TocTreeNode {
  no: number
  title?: string
  hideInToc?: boolean
  children: TocTreeNode[]
}

/**
 * frontmatter に `toc: ラベル` を書いたスライドだけをそのラベルで載せる (オプトイン)。
 * `tocLevel: 2` の項目は直前の第 1 階層の子になる (階層は 2 段まで)
 */
export function buildTocItems(slides: readonly TocSlide[]): TocEntry[] {
  const tree: TocEntry[] = []
  for (const { no, frontmatter } of slides) {
    const label = frontmatter.toc
    if (typeof label !== 'string' || label.length === 0)
      continue
    const entry: TocEntry = { no, label, children: [] }
    // 先頭に第 1 階層が無いまま tocLevel: 2 が来たら第 1 階層として扱う
    const parent = Number(frontmatter.tocLevel) >= 2 ? tree.at(-1) : undefined
    ;(parent ? parent.children : tree).push(entry)
  }
  return tree
}

/** `toc:` が 1 つも無いデッキ用。Slidev の tocTree (スライドタイトルの階層) から 2 段分を作る */
export function tocFromTree(tree: readonly TocTreeNode[]): TocEntry[] {
  const visible = (t: TocTreeNode) => !!t.title && !t.hideInToc
  return tree.filter(visible).map(t => ({
    no: t.no,
    label: t.title!,
    children: t.children.filter(visible).map(c => ({ no: c.no, label: c.title!, children: [] })),
  }))
}

/** 現在ページが属する項目 = 開始ページが現在ページ以下で最大のもの (子項目も含めて見る) */
export function findActiveNo(items: readonly TocEntry[], currentPage: number): number | undefined {
  let active: number | undefined
  for (const item of items) {
    for (const entry of [item, ...item.children]) {
      if (entry.no <= currentPage)
        active = entry.no
    }
  }
  return active
}

/** 1 枚目で 0、最終スライドで 1 になる進捗率 */
export function progressRatio(currentPage: number, total: number): number {
  return total > 1 ? Math.min(1, Math.max(0, (currentPage - 1) / (total - 1))) : 0
}

/** バー上の位置 (0〜1) からページ番号を求める */
export function pageAt(ratio: number, total: number): number {
  const r = Math.min(1, Math.max(0, ratio))
  return Math.round(r * (Math.max(1, total) - 1)) + 1
}

/**
 * toc レイアウトの見出し。Slidev はスライドの meta.slide.title に frontmatter の title、
 * 無ければ本文の最初の見出し (`## 目次` など) を入れるので、それを使う
 */
export function tocTitle(meta: Record<string, unknown> | undefined, fallback = '目次'): string {
  const title = (meta?.slide as { title?: unknown } | undefined)?.title
  return typeof title === 'string' && title.trim() ? title.trim() : fallback
}
