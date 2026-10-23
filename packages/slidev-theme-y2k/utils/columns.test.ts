import assert from 'node:assert/strict'
import { test } from 'node:test'
import { columnTemplate, parseColumnRatio } from './columns.ts'

test('未指定は 1:1', () => {
  assert.deepEqual(parseColumnRatio(undefined), [1, 1])
})

test('「左:右」の文字列', () => {
  assert.deepEqual(parseColumnRatio('3:2'), [3, 2])
  assert.deepEqual(parseColumnRatio('3/2'), [3, 2])
  assert.deepEqual(parseColumnRatio(' 1.5 : 1 '), [1.5, 1])
})

test('配列', () => {
  assert.deepEqual(parseColumnRatio([2, 3]), [2, 3])
})

test('左カラムの割合 (小数・%)', () => {
  assert.deepEqual(parseColumnRatio(0.6), [0.6, 1 - 0.6])
  assert.deepEqual(parseColumnRatio('40%'), [0.4, 1 - 0.4])
})

test('解釈できない値・0 以下・範囲外は 1:1', () => {
  assert.deepEqual(parseColumnRatio('wide'), [1, 1])
  assert.deepEqual(parseColumnRatio('0:1'), [1, 1])
  assert.deepEqual(parseColumnRatio(1.5), [1, 1])
  assert.deepEqual(parseColumnRatio('120%'), [1, 1])
  assert.deepEqual(parseColumnRatio([1, Number.NaN]), [1, 1])
})

test('grid-template-columns に変換する', () => {
  assert.equal(columnTemplate('3:2'), 'minmax(0, 3fr) minmax(0, 2fr)')
  assert.equal(columnTemplate(undefined), 'minmax(0, 1fr) minmax(0, 1fr)')
})

test('fallback で未指定・不正値のときの比率を変えられる', () => {
  assert.deepEqual(parseColumnRatio(undefined, [2, 3]), [2, 3])
  assert.deepEqual(parseColumnRatio('wide', [2, 3]), [2, 3])
  assert.deepEqual(parseColumnRatio('1:1', [2, 3]), [1, 1])
  assert.equal(columnTemplate(undefined, { fallback: [2, 3] }), 'minmax(0, 2fr) minmax(0, 3fr)')
})

test('middle で 2 カラムの間にトラックを挟む', () => {
  assert.equal(columnTemplate('3:2', { middle: 'auto' }), 'minmax(0, 3fr) auto minmax(0, 2fr)')
})
