# fe-app

モノレポ内の **Next.js**（App Router）フロントエンドです。ルートの説明は [リポジトリ README](../../README.md) を参照してください。

## 起動方法

**推奨（フロント＋API 同時）** — リポジトリルートで:

```bash
pnpm install
pnpm dev
```

**このパッケージだけ**（ポート 3000）:

```bash
# ルートから
pnpm --filter fe-app dev

# または apps/fe-app で
pnpm dev
```

ブラウザ: http://localhost:3000

バックエンドは別ターミナルで `pnpm be:dev`（ルート）または `pnpm dev`（`apps/be-app`）を実行し、http://localhost:8000 を利用します。

## バックエンドとの連携

- API のベース URL は環境変数で渡すのが一般的です（例: `NEXT_PUBLIC_API_URL=http://localhost:8000` を `.env.local` に記載し、クライアントから `fetch` する）。
- CORS は `be-app` 側の `CORS_ORIGINS` で調整します（開発時は `http://localhost:3000` が既定）。

## 技術スタック

- Next.js 16（App Router）
- React 19
- TypeScript、Tailwind CSS 4

公式ドキュメント: [Next.js Documentation](https://nextjs.org/docs)

## ディレクトリ構成

App Router とアプリコードは **`src/`** 以下です。パスエイリアス `@/*` は [`tsconfig.json`](tsconfig.json) の `paths` で `src/*` に解決されます。

```
apps/fe-app/
├── src/
│   ├── app/           # ルート・レイアウト・ページ（App Router）
│   ├── components/    # 複数画面で使う UI
│   ├── contexts/      # React Context / Provider
│   ├── hooks/         # カスタムフック
│   ├── constants/     # 定数
│   ├── types/         # 共有型
│   └── lib/           # フレームワークに依存しない処理
├── public/            # 静的ファイル（必要に応じて作成）
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

### 置き場所の目安

| 置くもの | 置き先の例 |
|----------|------------|
| ページ・レイアウト | `src/app/` |
| ルート専用の小さな UI | `src/app/` 配下の `_components` など（`_` で URL に含めない） |
| 共通コンポーネント | `src/components/`（肥大化したら `features/<機能名>/` など） |
| Context / Provider | `src/contexts/` |
| 状態・API 呼び出しのフック | `src/hooks/` |
| 定数・共有型・純関数 | `src/constants/`、`src/types/`、`src/lib/` |

## ビルド・本番起動

```bash
# ルートから
pnpm --filter fe-app build
pnpm --filter fe-app start
```

## デプロイ

[Vercel](https://vercel.com/) など Next.js 向けホスティングが利用できます。手順は [Deploying](https://nextjs.org/docs/app/building-your-application/deploying) を参照してください。
