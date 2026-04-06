# home-office-essentials

## 概要

**pnpm ワークスペース**と **Turborepo** で管理するモノレポです。フロントエンド（Next.js）とバックエンド（FastAPI）を同じリポジトリで開発し、ルートからタスクをまとめて実行できます。

**結論:** 下の「クイックスタート」どおりに進めれば、**フロント（ポート 3000）とバックエンド（ポート 8000）の両方を同時に起動**し、ブラウザと API で動作確認まで行えます。

---

## クイックスタート（初めて環境を作る場合）

リポジトリの**ルートディレクトリ**（`package.json` がある場所）で作業します。ターミナルを開き、クローン済みのフォルダに移動してください。

```bash
cd /path/to/home_office_essentials
```

（`/path/to/...` は自分の PC 上の実際のパスに読み替えてください。）

### 0. 事前に入れておくもの（バージョンの確認）

次のコマンドで、インストール済みか確認できます。エラーになるものは、リンク先の手順で入れてください。

| 確認コマンド | 目安 | 入っていない場合 |
|--------------|------|------------------|
| `node -v` | **v18** 以上 | [Node.js](https://nodejs.org/) をインストール |
| `pnpm -v` | **9.x** | 下記「pnpm の導入」を参照 |
| `uv --version` | 表示されれば OK | [uv のインストール](https://docs.astral.sh/uv/getting-started/installation/) |

**pnpm の導入（どちらか一方でよい）**

- **すでに npm でグローバル導入している場合**（例: `npm install -g pnpm`）: **そのままで問題ありません。** `pnpm -v` が **9.x** ならクイックスタートに進んでください。バージョンが古い場合は `npm install -g pnpm@9` などで揃えてください。
- **Corepack を使う場合（任意）:** Node に付属の Corepack で、リポジトリの `package.json` に書かれた pnpm バージョンに合わせやすくなります。

```bash
corepack enable
```

Corepack を使わず npm だけで入れた pnpm と、どちらを使ってもこのリポジトリの開発はできます。ルートで `pnpm install` が通れば準備 OK です。

**Python:** `uv` が自動で適切な Python を入れる場合もあります。うまくいかないときは **Python 3.12 以上**をシステムに入れてから、もう一度 `uv sync` を試してください。バージョンの目安は [`apps/be-app/.python-version`](apps/be-app/.python-version) です。

### 1. Node の依存関係を入れる

```bash
pnpm install
```

ワークスペース全体（`fe-app`・`be-app` など）に必要な npm パッケージが入ります。

### 2. バックエンド（Python）の依存関係を入れる

```bash
cd apps/be-app
uv sync
cd ../..
```

- `uv sync` は **`apps/be-app` 内で**実行します（`pyproject.toml` と `uv.lock` がある場所）。
- 最後の `cd ../..` で、**再びリポジトリのルート**に戻ります。

**（任意・推奨）** バックエンド用の設定ファイルを作る場合:

```bash
cp apps/be-app/.env.example apps/be-app/.env
```

なくても既定値で起動できますが、環境変数を変えたいときに使います。

### 3. フロントとバックエンドを同時に起動する

**必ずルートディレクトリで**次を実行します。

```bash
pnpm dev
```

- Turborepo が **`fe-app` と `be-app` の `dev` を並列で起動**します。
- ターミナルに Turbo の画面が出たり、Next / uvicorn のログが流れたりします。**そのターミナルは開いたまま**にしてください（止めるときは `Ctrl+C`）。

### 4. 動作確認

**フロントエンド**

1. ブラウザで **http://localhost:3000** を開く。
2. Next.js の画面が表示されれば OK です。

**バックエンド**

1. ブラウザで **http://localhost:8000/docs** を開く（FastAPI の API ドキュメント）。
2. 別のターミナル（新しいウィンドウ）を開き、ルートから次を実行しても確認できます。

```bash
curl http://localhost:8000/health
```

`{"status":"ok"}` のような JSON が返れば OK です。

**うまくいかないとき**

- **ポートが既に使われている**（`EADDRINUSE` など）: 他のアプリが 3000 や 8000 を使っていないか確認する。
- **`uv: command not found`**: uv をインストールし、ターミナルを開き直す。
- **`pnpm dev` で片方しか動かない**: エラーメッセージ全文を確認する。`apps/be-app` で `uv sync` をもう一度試す。

---

## ディレクトリ構成

| パス | 役割 |
|------|------|
| [`apps/fe-app`](apps/fe-app/) | Next.js フロントエンド |
| [`apps/be-app`](apps/be-app/) | FastAPI バックエンド（Python / uv） |
| [`packages/`](packages/) | 共有ライブラリ用（現状はプレースホルダ。利用時は各パッケージに `package.json` を置き、`pnpm-workspace.yaml` に `packages/*` を追加する。詳細は [`packages/README.md`](packages/README.md)） |

ワークスペース定義は [`pnpm-workspace.yaml`](pnpm-workspace.yaml)、タスク定義は [`turbo.json`](turbo.json) とルート [`package.json`](package.json) のスクリプトです。

## 開発の起動（コマンド一覧）

| コマンド | 内容 |
|----------|------|
| `pnpm dev` | **fe-app と be-app を同時起動**（上記クイックスタート） |
| `pnpm be:dev` | バックエンド（be-app）のみ |
| `pnpm --filter fe-app dev` | フロントエンドのみ |
| `pnpm --filter be-app dev` | バックエンドのみ（`be:dev` と同じ） |

同時起動時の**ポート**（既定のままなら衝突しません）:

| アプリ | 既定 URL | 備考 |
|--------|----------|------|
| fe-app | http://localhost:3000 | 環境変数 `PORT` で変更可 |
| be-app | http://localhost:8000 | CORS は `http://localhost:3000` を許可済み（`apps/be-app/.env` で調整） |

各アプリの詳細は [apps/fe-app/README.md](apps/fe-app/README.md) と [apps/be-app/README.md](apps/be-app/README.md) を参照してください。

## その他のルートコマンド

| コマンド | 説明 |
|----------|------|
| `pnpm build` | 全ワークスペースの `build`（be-app に `build` が無い場合はスキップ） |
| `pnpm lint` | リント |
| `pnpm check-types` | 型チェック |
| `pnpm format` | Prettier（`*.ts` / `*.tsx` / `*.md`） |

本番ビルド後にフロントのみ起動する例:

```bash
pnpm build
pnpm --filter fe-app start
```

## メンテナンスの目安

- **`apps/be-app/pyproject.toml` や `uv.lock` を変えたあと**は、もう一度 `cd apps/be-app && uv sync` を実行してください。
- **ルートの `package.json` やワークスペースの依存を変えたあと**は、`pnpm install` を実行してください。
