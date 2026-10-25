import type { TocEntry } from '../utils/toc.ts'
import { useNav } from '@slidev/client'
import { computed } from 'vue'
import { buildTocItems, tocFromTree } from '../utils/toc.ts'

// toc レイアウトと目次ドロワー (global-top.vue) に出す項目。
// frontmatter の `toc: ラベル` を優先し、1 つも無いデッキはスライドタイトルの階層で代用する
export function useTocItems() {
  const { slides, tocTree } = useNav()
  const items = computed<TocEntry[]>(() => {
    const custom = buildTocItems(slides.value.map(s => ({
      no: s.no,
      frontmatter: ((s.meta as { slide?: { frontmatter?: Record<string, unknown> } }).slide?.frontmatter) ?? {},
    })))
    return custom.length ? custom : tocFromTree(tocTree.value)
  })
  return { items }
}
