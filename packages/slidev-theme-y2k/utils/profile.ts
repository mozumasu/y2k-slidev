// profile レイアウトの名前・links (名前の下のグレーの行) を整える。
// frontmatter の値は型が保証されないので、ここで形をそろえて不正な項目を落とす

/** 右カラムの 1 項目 (アドオンの <Y2kFeatureList> の items と同じ形) */
export interface ProfileSection {
  /** ピンクの見出し (例: Work)。書いたとおりに表示する */
  title: string
  /** 説明。<em> / <strong> / <br> だけを解釈する */
  description?: string
}

export interface ProfileLink {
  /** 行に出す文字 (例: X: @yamada) */
  label: string
  /** 押したときに開く URL。無ければリンクにしない */
  url?: string
  /** Phosphor のアイコン名 (例: x-logo / github-logo) */
  icon?: string
}

function text(value: unknown): string | undefined {
  if (typeof value !== 'string')
    return undefined
  const trimmed = value.trim()
  return trimmed || undefined
}

/**
 * links の値を ProfileLink の配列にする。
 * 文字列はラベルだけのチップ、label の無い項目と配列以外の値は捨てる
 */
export function normalizeProfileLinks(links: unknown): ProfileLink[] {
  if (!Array.isArray(links))
    return []
  return links.flatMap((item): ProfileLink[] => {
    if (typeof item === 'string') {
      const label = text(item)
      return label ? [{ label }] : []
    }
    if (!item || typeof item !== 'object')
      return []
    const record = item as Record<string, unknown>
    const label = text(record.label)
    if (!label)
      return []
    const link: ProfileLink = { label }
    const url = text(record.url)
    const icon = text(record.icon)
    if (url)
      link.url = url
    if (icon)
      link.icon = icon
    return [link]
  })
}

/**
 * 名前を本体と末尾の括弧書き (ハンドル名・読み) に分ける。
 * 「山田 太郎 (yamada)」→ { main: '山田 太郎', note: '(yamada)' }。全角の括弧も同じ
 */
export function splitProfileName(name: string | undefined): { main: string, note?: string } {
  const trimmed = name?.trim() ?? ''
  const m = /[(（][^()（）]+[)）]$/.exec(trimmed)
  const main = m ? trimmed.slice(0, m.index).trimEnd() : ''
  return m && main ? { main, note: m[0] } : { main: trimmed }
}

/** 別タブで開く URL (http / https) か。ページ内リンクや相対パスは同じタブで開く */
export function isExternalUrl(url: string | undefined): boolean {
  return !!url && /^https?:\/\//i.test(url)
}
