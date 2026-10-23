import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseRichText } from './richText.ts'

test('タグの無い文字列はテキスト 1 つになる', () => {
  assert.deepEqual(parseRichText('制約なし'), [{ type: 'text', text: '制約なし' }])
})

test('数値・空値も扱える', () => {
  assert.deepEqual(parseRichText(360), [{ type: 'text', text: '360' }])
  assert.deepEqual(parseRichText(undefined), [])
})

test('<em> / <strong> / <br> を解釈する', () => {
  assert.deepEqual(parseRichText('まずは<em>育成</em>を<br>完了<strong>させる</strong>'), [
    { type: 'text', text: 'まずは' },
    { type: 'em', children: [{ type: 'text', text: '育成' }] },
    { type: 'text', text: 'を' },
    { type: 'br' },
    { type: 'text', text: '完了' },
    { type: 'strong', children: [{ type: 'text', text: 'させる' }] },
  ])
})

test('<br/> と大文字のタグも受け付ける', () => {
  assert.deepEqual(parseRichText('A<br/>B<EM>C</EM>'), [
    { type: 'text', text: 'A' },
    { type: 'br' },
    { type: 'text', text: 'B' },
    { type: 'em', children: [{ type: 'text', text: 'C' }] },
  ])
})

test('入れ子の強調を扱える', () => {
  assert.deepEqual(parseRichText('<strong>a<em>b</em></strong>'), [
    { type: 'strong', children: [
      { type: 'text', text: 'a' },
      { type: 'em', children: [{ type: 'text', text: 'b' }] },
    ] },
  ])
})

test('許可していないタグは文字列のまま残す', () => {
  assert.deepEqual(parseRichText('<img src=x onerror=alert(1)><script>x</script>'), [
    { type: 'text', text: '<img src=x onerror=alert(1)><script>x</script>' },
  ])
})

test('閉じ忘れは末尾で閉じ、対応しない閉じタグは文字列にする', () => {
  assert.deepEqual(parseRichText('<em>a'), [{ type: 'em', children: [{ type: 'text', text: 'a' }] }])
  assert.deepEqual(parseRichText('a</em>'), [
    { type: 'text', text: 'a' },
    { type: 'text', text: '</em>' },
  ])
})

test('よく使う文字参照を戻す', () => {
  assert.deepEqual(parseRichText('A&amp;B&nbsp;&lt;C&gt;'), [{ type: 'text', text: 'A&B <C>' }])
})
