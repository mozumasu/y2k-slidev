import assert from 'node:assert/strict'
import { test } from 'node:test'
import { activeCodeStep } from './codeSteps.ts'

test('activeCodeStep はクリック数と同じ番号の説明を強調する', () => {
  assert.equal(activeCodeStep(0, 3), 0)
  assert.equal(activeCodeStep(1, 3), 1)
  assert.equal(activeCodeStep(2, 3), 2)
})

test('activeCodeStep は説明の数を超えたら最後の説明のまま (コードの行ハイライトと同じ)', () => {
  assert.equal(activeCodeStep(3, 3), 2)
  assert.equal(activeCodeStep(10, 3), 2)
  // 書き出し・一覧の「全クリック済み」(@slidev/client の CLICKS_MAX) も最終状態
  assert.equal(activeCodeStep(999999, 3), 2)
  assert.equal(activeCodeStep(Number.POSITIVE_INFINITY, 3), 2)
})

test('activeCodeStep は at の分だけずらし、それより前は最初の説明にする', () => {
  assert.equal(activeCodeStep(0, 3, 1), 0)
  assert.equal(activeCodeStep(1, 3, 1), 0)
  assert.equal(activeCodeStep(2, 3, 1), 1)
  assert.equal(activeCodeStep(4, 3, 1), 2)
})

test('activeCodeStep は説明が無い・クリック数が不正なら undefined', () => {
  assert.equal(activeCodeStep(0, 0), undefined)
  assert.equal(activeCodeStep(Number.NaN, 3), undefined)
})
