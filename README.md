# modern_home_office_essentials

## 概要

このリポジトリは **pnpm ワークスペース** と **Turborepo** で管理されたモノレポです。フロントエンドアプリや今後追加するパッケージをルートからまとめてビルド・開発できます。

## ディレクトリ構成

| パス | 役割 |
|------|------|
| `apps/` | デプロイ可能なアプリケーション（例: `fe-app` は Next.js） |
| `packages/` | 共有ライブラリ用。パッケージを追加する際は各ディレクトリに `package.json` を置き、`pnpm-workspace.yaml` に `packages/*` を追記します（詳細は `packages/README.md`）。 |

ワークスペースの定義は `pnpm-workspace.yaml`、タスクのオーケストレーションはルートの `turbo.json` と `package.json` のスクリプトで行います。

## 必要条件

- **Node.js** 18 以上（`package.json` の `engines` に準拠）
- **pnpm** 9.x（`package.json` の `packageManager` で指定。Corepack 利用時は `corepack enable` のうえ、リポジトリルートで pnpm がそのバージョンを使います）

## 開発環境の起動

リポジトリのルートで次を実行します。

```bash
pnpm install
pnpm dev
```

1. `pnpm install` … ワークスペース全体の依存関係をインストールします。
2. `pnpm dev` … `turbo run dev` を実行し、各パッケージの `dev` スクリプトを並列に起動します。現在は `apps/fe-app`（Next.js）の開発サーバーが立ち上がります。

特定のアプリだけ動かす場合の例:

```bash
pnpm --filter fe-app dev
```

## その他のルートコマンド

| コマンド | 説明 |
|----------|------|
| `pnpm build` | 全ワークスペースの `build`（本番用ビルド） |
| `pnpm lint` | リント |
| `pnpm check-types` | 型チェック |
| `pnpm format` | Prettier で `*.ts` / `*.tsx` / `*.md` を整形 |

本番ビルド後にフロントのみ起動する例:

```bash
pnpm build
pnpm --filter fe-app start
```
