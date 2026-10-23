import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildTocItems, findActiveNo, pageAt, progressRatio, tocFromTree, tocTitle } from './toc.ts'

test('toc: を持つスライドだけをラベルで載せる', () => {
  assert.deepEqual(buildTocItems([
    { no: 1, frontmatter: {} },
    { no: 2, frontmatter: { toc: '背景' } },
    { no: 3, frontmatter: { toc: '' } },
    { no: 5, frontmatter: { toc: '提案' } },
  ]), [
    { no: 2, label: '背景', children: [] },
    { no: 5, label: '提案', children: [] },
  ])
})

test('tocLevel: 2 は直前の項目の子になり、先頭なら第 1 階層になる', () => {
  assert.deepEqual(buildTocItems([
    { no: 2, frontmatter: { toc: '詳細', tocLevel: 2 } },
    { no: 3, frontmatter: { toc: '機能' } },
    { no: 4, frontmatter: { toc: '可視化', tocLevel: 2 } },
    { no: 6, frontmatter: { toc: '支援', tocLevel: '2' } },
  ]), [
    { no: 2, label: '詳細', children: [] },
    { no: 3, label: '機能', children: [
      { no: 4, label: '可視化', children: [] },
      { no: 6, label: '支援', children: [] },
    ] },
  ])
})

test('tocTree からはタイトルがあり hideInToc でないものを 2 段分取る', () => {
  assert.deepEqual(tocFromTree([
    { no: 1, title: '表紙', hideInToc: true, children: [] },
    { no: 2, title: '章 1', children: [
      { no: 3, title: '節', children: [{ no: 4, title: '3 段目', children: [] }] },
      { no: 5, children: [] },
    ] },
  ]), [
    { no: 2, label: '章 1', children: [{ no: 3, label: '節', children: [] }] },
  ])
})

test('現在ページ以下で最も後ろの項目 (子を含む) を現在の章にする', () => {
  const items = buildTocItems([
    { no: 2, frontmatter: { toc: 'A' } },
    { no: 4, frontmatter: { toc: 'A-1', tocLevel: 2 } },
    { no: 7, frontmatter: { toc: 'B' } },
  ])
  assert.equal(findActiveNo(items, 1), undefined)
  assert.equal(findActiveNo(items, 3), 2)
  assert.equal(findActiveNo(items, 5), 4)
  assert.equal(findActiveNo(items, 9), 7)
})

test('進捗率は 1 枚目で 0、最後で 1', () => {
  assert.equal(progressRatio(1, 5), 0)
  assert.equal(progressRatio(3, 5), 0.5)
  assert.equal(progressRatio(5, 5), 1)
  assert.equal(progressRatio(1, 1), 0)
})

test('バー上の位置からページを求める', () => {
  assert.equal(pageAt(0, 5), 1)
  assert.equal(pageAt(0.5, 5), 3)
  assert.equal(pageAt(1, 5), 5)
  assert.equal(pageAt(1.5, 5), 5)
  assert.equal(pageAt(-1, 5), 1)
})

test('toc レイアウトの見出しはスライドタイトル、無ければ既定値', () => {
  assert.equal(tocTitle({ slide: { title: ' アジェンダ ' } }), 'アジェンダ')
  assert.equal(tocTitle({ slide: { title: '' } }), '目次')
  assert.equal(tocTitle({ slide: {} }), '目次')
  assert.equal(tocTitle(undefined, 'Agenda'), 'Agenda')
})
