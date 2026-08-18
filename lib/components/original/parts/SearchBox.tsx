import { useState } from 'react'

/**
 * サイドバーの検索ボックス。
 * 以前はトップ用と記事詳細用で同じマークアップが layout.tsx に2つ書かれていたので、
 * 片方だけ直してしまわないよう1箇所にまとめた。
 */
const SearchBox: React.FC<unknown> = () => {
  const [composing, setComposition] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const startComposition = () => setComposition(true)
  const endComposition = () => setComposition(false)

  const handleSearch = () => {
    const googleSearchUrl = `https://www.google.com/search?q=site:moldspoon.jp/blog+${encodeURIComponent(
      searchQuery
    )}`
    window.open(googleSearchUrl, '_blank')
  }

  return (
    <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-700 p-5 mb-4">
      <h3 className="!mt-0 mb-4">検索</h3>
      <div className="border border-gray-200 dark:border-gray-700 rounded py-2 px-3 flex focus-within:border-orange-400 transition-colors">
        <i className="mt-0.5 mr-2 cursor-pointer ri-search-line" onClick={handleSearch}></i>
        <input
          type="text"
          name="search"
          aria-label="サイト内検索"
          className="w-full text-base bg-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            // 日本語入力の変換確定の Enter で検索してしまわないよう composing を見る
            if (e.key === 'Enter' && !composing) {
              handleSearch()
            }
          }}
          onCompositionStart={startComposition}
          onCompositionEnd={endComposition}
        />
      </div>
      <p className="text-xs mt-2 mb-0 text-gray-600 dark:text-gray-300">※Google検索を使用しています。</p>
    </div>
  )
}

export default SearchBox
