// code / code-compare の左右比率 (frontmatter の ratio) を
// grid-template-columns に変換する。
// 受け付ける形式:
// - '3:2' / '3/2' / '3 2' : 左右の比 (見た目の左:右)
// - [3, 2]                : 同上
// - 0.6 / '60%'           : 左カラムの割合 (残りが右)
// 解釈できない値は fallback (既定は 1:1) にする

export type ColumnRatio = string | number | [number, number]

const EQUAL: [number, number] = [1, 1]

function valid(left: number, right: number): [number, number] | undefined {
  return Number.isFinite(left) && Number.isFinite(right) && left > 0 && right > 0
    ? [left, right]
    : undefined
}

function fromFraction(fraction: number): [number, number] | undefined {
  return fraction > 0 && fraction < 1 ? valid(fraction, 1 - fraction) : undefined
}

export function parseColumnRatio(ratio: ColumnRatio | undefined, fallback: [number, number] = EQUAL): [number, number] {
  if (ratio === undefined || ratio === null)
    return fallback
  if (Array.isArray(ratio))
    return valid(Number(ratio[0]), Number(ratio[1])) ?? fallback
  if (typeof ratio === 'number')
    return fromFraction(ratio) ?? fallback

  const text = ratio.trim()
  const percent = /^(\d+(?:\.\d+)?)%$/.exec(text)
  if (percent)
    return fromFraction(Number(percent[1]) / 100) ?? fallback
  const pair = /^(\d+(?:\.\d+)?)(?:\s*[:/]\s*|\s+)(\d+(?:\.\d+)?)$/.exec(text)
  if (pair)
    return valid(Number(pair[1]), Number(pair[2])) ?? fallback
  return fallback
}

export interface ColumnTemplateOptions {
  /** 未指定・解釈できない値のときの比率 (既定は 1:1) */
  fallback?: [number, number]
  /** 2 カラムの間に挟むトラック (例: 'auto' で矢印の列を足す) */
  middle?: string
}

/** minmax(0, …) にして、中身の最小幅で比率が崩れないようにする */
export function columnTemplate(ratio: ColumnRatio | undefined, { fallback, middle }: ColumnTemplateOptions = {}): string {
  const [left, right] = parseColumnRatio(ratio, fallback)
  return [`minmax(0, ${left}fr)`, middle, `minmax(0, ${right}fr)`].filter(Boolean).join(' ')
}
