// parseRichText の結果を VNode にして描画する関数型コンポーネント。
// v-html を使わずに props の文字列中の <em> / <strong> / <br> だけを解釈する
import type { FunctionalComponent, VNodeChild } from 'vue'
import type { RichTextNode } from './richText.ts'
import { h } from 'vue'
import { parseRichText } from './richText.ts'

function toVNodes(nodes: RichTextNode[]): VNodeChild[] {
  return nodes.map((node) => {
    if (node.type === 'text')
      return node.text
    if (node.type === 'br')
      return h('br')
    return h(node.type, toVNodes(node.children))
  })
}

export const RichText: FunctionalComponent<{ text?: string | number }> = props => toVNodes(parseRichText(props.text))
RichText.props = ['text']
