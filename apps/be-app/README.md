# be-app

モノレポ内の **FastAPI** バックエンドです。Python の依存管理は **uv**、Node 経由の起動は **pnpm**（ワークスペースの `dev` スクリプト）です。全体構成は [リポジトリ README](../../README.md) を参照してください。

## 必要条件

- Python 3.12 以上（[`.python-version`](.python-version) をコミットしてバージョンを揃えることを推奨）
- [uv](https://docs.astral.sh/uv/getting-started/installation/)

## セットアップ

```bash
cd apps/be-app
uv sync
cp .env.example .env   # 必要に応じて編集
```

`uv.lock` は依存の再現性のため **リポジトリにコミットすることを推奨**します。

## 開発サーバの起動

**推奨** — リポジトリルートから（ポート **8000**、Next の 3000 と重複しません）:

```bash
pnpm be:dev
```

同等のコマンド:

```bash
pnpm --filter be-app dev
```

`apps/be-app` 直下で:

```bash
pnpm dev
```

実体は `uv run uvicorn src.main:app --reload --host 0.0.0.0` です。待受ポートを変える場合は、このスクリプトに `--port <番号>` を足すか、別途起動ラッパーを用意してください。`Settings` の `API_PORT` はアプリ内設定用であり、単体では uvicorn のバインドポートは変わりません。

## エンドポイント

| メソッド | パス | 説明 |
|----------|------|------|
| GET | `/health` | ヘルスチェック（例: `{"status":"ok"}`） |

OpenAPI ドキュメント: サーバ起動後 http://localhost:8000/docs

## 環境変数

[`.env.example`](.env.example) をコピーして `.env` を作成します。

| 変数 | 説明 |
|------|------|
| `API_HOST` | 既定 `0.0.0.0` |
| `API_PORT` | 既定 `8000`（アプリ設定。uvicorn の CLI と揃える場合は起動オプションも合わせる） |
| `DEBUG` | FastAPI の `debug` に反映 |
| `CORS_ORIGINS` | カンマ区切り（例: `http://localhost:3000,http://127.0.0.1:3000`） |

## ソース構成

```
apps/be-app/
├── src/
│   ├── main.py      # FastAPI アプリ・CORS・ルート
│   └── config.py    # pydantic-settings（.env）
├── .env.example
├── pyproject.toml
├── uv.lock
├── package.json     # pnpm / Turbo 用の dev スクリプト
└── README.md
```

## `.python-version` について

チームで Python を固定する運用では **コミットする**のが一般的です。ローカル専用にしたい場合のみルートの `.gitignore` に追加する、という運用もあります。

## フロントとの同時起動

ルートで `pnpm dev` を実行すると、`fe-app`（3000）と `be-app`（8000）が並列で立ち上がります。どちらかのポートを変えた場合は、もう一方の URL（CORS や `NEXT_PUBLIC_API_URL`）も合わせて更新してください。
