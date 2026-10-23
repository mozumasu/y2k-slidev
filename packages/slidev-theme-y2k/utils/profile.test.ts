import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isExternalUrl, normalizeProfileLinks, splitProfileName } from './profile.ts'

test('normalizeProfileLinks は label / url / icon をそろえる', () => {
  assert.deepEqual(normalizeProfileLinks([
    { label: ' @mozumasu ', url: 'https://x.com/mozumasu', icon: 'x-logo' },
    { label: 'mozumasu', icon: 'github-logo' },
  ]), [
    { label: '@mozumasu', url: 'https://x.com/mozumasu', icon: 'x-logo' },
    { label: 'mozumasu', icon: 'github-logo' },
  ])
})

test('normalizeProfileLinks は文字列をラベルだけのチップにする', () => {
  assert.deepEqual(normalizeProfileLinks(['ブログ', '  ']), [{ label: 'ブログ' }])
})

test('normalizeProfileLinks は label の無い項目と配列以外を捨てる', () => {
  assert.deepEqual(normalizeProfileLinks([{ url: 'https://example.com' }, null, 1, { label: '' }]), [])
  assert.deepEqual(normalizeProfileLinks(undefined), [])
  assert.deepEqual(normalizeProfileLinks({ label: 'a' }), [])
})

test('normalizeProfileLinks は空の url / icon を省く', () => {
  assert.deepEqual(normalizeProfileLinks([{ label: 'a', url: ' ', icon: 3 }]), [{ label: 'a' }])
})

test('isExternalUrl は http / https だけを別タブで開く', () => {
  assert.equal(isExternalUrl('https://example.com'), true)
  assert.equal(isExternalUrl('HTTP://example.com'), true)
  assert.equal(isExternalUrl('/10'), false)
  assert.equal(isExternalUrl('mailto:a@example.com'), false)
  assert.equal(isExternalUrl(undefined), false)
})

test('splitProfileName は末尾の括弧書きを分ける', () => {
  assert.deepEqual(splitProfileName('山田 太郎 (yamada)'), { main: '山田 太郎', note: '(yamada)' })
  assert.deepEqual(splitProfileName('山田 太郎（やまだ）'), { main: '山田 太郎', note: '（やまだ）' })
})

test('splitProfileName は括弧が無ければそのまま返す', () => {
  assert.deepEqual(splitProfileName(' 山田 太郎 '), { main: '山田 太郎' })
  assert.deepEqual(splitProfileName('(yamada)'), { main: '(yamada)' })
  assert.deepEqual(splitProfileName(undefined), { main: '' })
})
