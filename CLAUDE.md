# moldspoon_blog 開発メモ

Next.js 13 (Pages Router) + MDX の技術ブログ。`https://moldspoon.jp/blog` で公開している。

このファイルは**コードを読んでも分からない運用上の制約**を記録するもの。実装の説明は書かない。

---

## デプロイ経路

| 項目 | 値 |
|---|---|
| ホスティング | Vercel（プロジェクト名 `moldspoon-blog`） |
| 本番ブランチ | **`template`**（`main` でも `master` でもない） |
| 素の URL | `https://moldspoon-blog.vercel.app` |
| 公開 URL | `https://moldspoon.jp/blog` |
| `basePath` | `/blog` |

**`moldspoon.jp/blog` は本体リポジトリ（`~/dev/moldspoon`）の `vercel.json` による rewrite で配信されている。**
別リポジトリ・別 Vercel プロジェクトなので、本体を触っても反映されないし、その逆も同じ。

```json
{ "source": "/blog/:match+", "destination": "https://moldspoon-blog.vercel.app/blog/:match+" }
```

デプロイ結果は GitHub のコミットステータスで分かる。

```bash
gh api repos/yutav/moldspoon_blog/commits/<sha>/status \
  --jq '.statuses[]? | "\(.state) — \(.description)"'
```

---

## Node.js バージョン

**`package.json` の `engines` と Vercel のプロジェクト設定の、両方が必要。**

2026-08-15、1年ぶりに push したらデプロイが落ちた。

```
Found invalid or discontinued Node.js Version: "18.x".
Please set Node.js Version to 24.x in your Project Settings to use Node.js 24.
```

- Vercel は Node が EOL を迎えると新規ビルドを打ち切る
- このエラーは**クローン直後・依存インストール前**に出る。つまり Vercel は
  `package.json` を読む前にプロジェクト設定の値を検証している。
  **`engines` を書くだけでは直らない**
- 設定場所は Settings → **Build and Deployment** → Node.js Version（General ではない）
- 設定変更後、既存デプロイの **Redeploy は作成時のビルド設定を再利用する**ので効かない。
  新しいコミットを push すること

`engines` も併記してある。プロジェクト設定だけだと、次に EOL が来たとき同じ調査をやり直すことになるため。

---

## 脆弱な依存があるとデプロイが拒否される

ビルドが成功しても、その後の `Deploying outputs...` で止まることがある。

```
Vulnerable version of next-mdx-remote detected (4.4.1).
Please update to version 6.0.0 or later.
```

ビルドログの末尾まで見ないと気づけない。**「ビルドは通ったのにデプロイされない」ときはここを疑う。**

このときの `next-mdx-remote` は参照ゼロの未使用依存だったので、上げずに削除した。
同様のことが起きたら、まず本当に使っているかを確認すること。

```bash
grep -rn "<パッケージ名>" pages lib hooks scripts components
grep -n "<パッケージ名>" yarn.lock   # 他パッケージから要求されていないかも見る
```

---

## ローカルビルドの既知の問題

`npm run build` が下記で落ちることがあるが、**Vercel では起きない。無視してよい。**

```
pages/api/og.js from Terser
invalid unicode code point at line 1 column 1836011
```

`@vercel/og` が抱える巨大なフォントデータを minify する段で出る。
コンパイル自体は全て成功した後なので、コードの問題ではない。

**この症状で「直前の変更が原因だ」と判断しないこと。** 実際に一度、無関係な依存削除を
疑って戻しかけた。切り分けるなら、変更を stash して同じエラーが出るかを見る。

構造の確認だけなら dev サーバの SSR 出力で足りる。

```bash
npm run dev   # :3001
curl -sS http://localhost:3001/blog/posts/<slug> | grep -o 'href="[^"]*"' | sort -u
```

---

## パッケージマネージャは yarn

`engines` を入れたため、ローカルの Node が 24 未満だと弾かれる。

```bash
yarn install --ignore-engines
yarn remove <pkg> --ignore-engines
```

---

## コミット時の注意

### 未追跡の下書き記事がある

`pages/posts/` に、git 管理外の書きかけ記事が置かれている（`no-neta-blog.mdx` など）。
`before_posts/` にも同様のものがある。

**`git add -A` や `git commit -a` をしないこと。** 下書きを巻き込む。
変更したファイルを明示的に指定して add する。

### `public/sitemap-0.xml` はコミットしない

追跡されているが、中身は `http://localhost:3001/...` のまま。
ローカルで `npm run build` すると（`NODE_ENV` が production でないため）再び localhost の
URL で上書きされる。**本番のサイトマップは Vercel のビルドで生成されるので、
リポジトリ側の中身は配信に影響しない。** 差分が出たら戻す。

```bash
git checkout -- public/sitemap-0.xml
```

---

## レイアウトの描画

以前は `lib/components/layout.tsx` に、マウントするまで本文を `opacity: 0; display: none` で
隠す仕組みがあった（本体リポジトリにも同じものがあった）。

これはプロフィール・タグ・前後記事・フッターごと初期 HTML から消すため、
**クローラーからは内部リンクの無いページに見えていた。** 2026-08-15 に撤去済み。

ちらつき対策が必要な場合は、レイアウト全体を隠すのではなく個々のコンポーネント側で
持たせること（`mounted` ガード等）。

あわせて `currentUrl` を `window.location.href` から `process.env.baseUrl + router.asPath` に
変更した。前者はサーバー側で空になるため、`og:url` が初期 HTML から欠落していた。
