// props で受け取った文字列を v-html を使わずに描画するための軽量パーサー。
// 解釈するのは強調 (<em> / <strong>) と改行 (<br>) だけで、それ以外のタグは
// 文字列のまま残す (Vue がテキストとしてエスケープするので HTML は注入されない)

export type RichTextNode
  = | { type: 'text', text: string }
    | { type: 'br' }
    | { type: 'em' | 'strong', children: RichTextNode[] }

const TAG = /<(\/?)(em|strong)\s*>|<br\s*\/?>/gi

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': '\'',
  '&nbsp;': ' ',
}

function decodeEntities(text: string): string {
  return text.replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, m => ENTITIES[m] ?? m)
}

/** 許可したタグだけを木構造にする。閉じ忘れは末尾で閉じ、対応しない閉じタグは文字列として残す */
export function parseRichText(source: string | number | null | undefined): RichTextNode[] {
  const root: RichTextNode[] = []
  const stack: { tag: 'em' | 'strong', children: RichTextNode[] }[] = []
  const current = () => stack.at(-1)?.children ?? root
  const pushText = (text: string) => {
    if (text)
      current().push({ type: 'text', text: decodeEntities(text) })
  }

  const src = String(source ?? '')
  let last = 0
  for (const m of src.matchAll(TAG)) {
    pushText(src.slice(last, m.index))
    last = m.index + m[0].length
    const [raw, closing, name] = m
    if (!name) {
      current().push({ type: 'br' })
      continue
    }
    const tag = name.toLowerCase() as 'em' | 'strong'
    if (!closing) {
      stack.push({ tag, children: [] })
      continue
    }
    if (stack.at(-1)?.tag !== tag) {
      pushText(raw)
      continue
    }
    const node = stack.pop()!
    current().push({ type: tag, children: node.children })
  }
  pushText(src.slice(last))

  while (stack.length) {
    const node = stack.pop()!
    current().push({ type: node.tag, children: node.children })
  }
  return root
}
