import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

type Prop = {
  /**
   * inline: ヘッダーのメニュー項目に混ぜる用。周りのリンクと同じ見た目にする
   * fixed:  そのヘッダーが無いページ用。画面右上に固定する
   */
  variant?: 'inline' | 'fixed'
  className?: string
}

/**
 * ライト / ダークの切り替えボタン。本体サイト（moldspoon.jp）の ThemeToggle と同じ作り。
 *
 * 初期値は OS の設定（next-themes の "system"）。ここで明示的に選ぶと localStorage に
 * 保存され、以後は OS 設定より優先される。保存先のキーは本体サイトと同じ "theme" で、
 * moldspoon.jp と /blog は同一オリジンなので、どちらで切り替えても両方に反映される。
 *
 * アイコンとラベルはどちらも「今どちらなのか」を表す。押したときの動作は
 * title / aria-label 側で説明する（両者を混ぜると意味が読み取れなくなるため）。
 *
 * resolvedTheme はサーバー側では確定しない。マウント前に描画すると必ず片方に倒れて
 * 一瞬逆の表示が出るので、マウントするまでは何も出さない。
 */
const ThemeToggle: React.FC<Prop> = ({ variant = 'inline', className = '' }) => {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return null
  }

  const isDark = resolvedTheme === 'dark'
  const label = isDark ? 'ライトモードに切り替える' : 'ダークモードに切り替える'

  // inline は背景を敷かず文字色も周囲から継承する。ヘッダーとハンバーガーメニュー
  // （濃色の背景に白文字）の両方に置くため、どちらでも成立させる必要がある
  const variantClass = variant === 'fixed'
    ? 'fixed top-3 right-3 z-[90] h-9 px-3 rounded-full ' +
      'border border-gray-300 dark:border-gray-600 ' +
      'bg-white/90 dark:bg-gray-800/90 backdrop-blur ' +
      'text-gray-700 dark:text-gray-100 ' +
      'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150'
    : 'px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 ' +
      'hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-150'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={label}
      aria-label={label}
      className={`inline-flex items-center gap-1.5 ${variantClass} ${className}`}
    >
      {isDark
        ? <i className="ri-moon-fill text-sm text-blue-300" />
        : <i className="ri-sun-fill text-sm text-orange-500" />}
      <span className={variant === 'fixed' ? 'text-xs font-bold whitespace-nowrap' : 'text-sm whitespace-nowrap'}>
        {isDark ? 'ダーク' : 'ライト'}
      </span>
    </button>
  )
}

export default ThemeToggle
