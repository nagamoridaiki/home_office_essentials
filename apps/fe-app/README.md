This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

このアプリはリポジトリルートの pnpm + Turbo モノレポの一部です。開発サーバーはルートで次のように起動します。

```bash
cd ../..
pnpm dev
```

`apps/fe-app` 直下だけで動かす場合:

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

編集の起点は `src/app/page.tsx` などです。保存するとホットリロードされます。

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## ディレクトリ構成（フロントエンド）

App Router のエントリとアプリコードは **`src/`** 以下にまとめています。インポートエイリアスは `src/*`**（`tsconfig.json` の `paths`）です。

```
apps/fe-app/
├── src/
│   ├── app/                 # App Router（ルート・レイアウト・グローバル CSS）
│   │   ├── layout.tsx       # ルートレイアウト（フォント・Provider など）
│   │   ├── page.tsx         # `/`
│   │   ├── globals.css
│   │   └── new/
│   │       └── page.tsx     # `/new`
│   ├── components/          # 複数ルートで使う UI（必要に応じて ui/ や features/ などに分割）
│   ├── contexts/            # React Context・Provider（テストや Story からも @/contexts/... で参照）
│   ├── hooks/               # カスタムフック（状態・副作用。Context の実装と分離しやすい）
│   ├── constants/           # マジックナンバー・初期データ・文言などの定数
│   ├── types/               # 共有の型定義
│   └── lib/                 # Next / React に依存しない純粋な処理（ユーティリティ・ドメインロジックなど）
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

ルートに **`public/`** を置くと、その中身が URL `/` からそのまま配信されます（画像・`favicon.ico` など）。まだ無い場合は必要になったら作成すれば問題ありません。

### 置き場所の目安

| 置くもの | 置き先の例 |
|----------|------------|
| ページ・レイアウト・ルートグループ | `src/app/` |
| 特定レイアウト専用の小さな UI | `src/app/` 配下の `_components` など（URL に含めたくない場合は `_` プレフィックス） |
| 複数画面で使うコンポーネント | `src/components/`（大きくなったら `features/<機能名>/` など） |
| グローバルな Context / Provider | `src/contexts/` |
| フックに切り出した状態・API 呼び出し | `src/hooks/` |
| 環境に依存しない定数 | `src/constants/` |
| 共有型 | `src/types/` |
| フォーマット・バリデーションなど純関数 | `src/lib/`（必要なら `src/utils/` を別けてもよい） |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
