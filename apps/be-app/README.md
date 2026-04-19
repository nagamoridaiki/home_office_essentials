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
| GET | `/me` | ログイン中ユーザー（要認証。`{"id","email","role"}`。`role` はロール未推論時 `null`） |
| GET | `/todos` | Todo 一覧（要認証・要ロール。`{"todos": ["...", ...]}`） |

OpenAPI ドキュメント: サーバ起動後 http://localhost:8000/docs

## 認証・認可・ロール（バックエンドの責務）

本リポジトリの be-app は **ローカル開発向けのモック認証**です。本番向けの IdP 連携や JWT 検証は行いません。

### 認証（誰としてリクエストしているか）

- **`private_router` にぶら下がるルート**（`/me`, `/todos`）は、[`src/adapter/web/routers.py`](src/adapter/web/routers.py) の **`auth_dependency`** が先に実行されます。
- クライアントは **`Authorization: Bearer <トークン>`** を送ります。この **トークン文字列を「外部ユーザー ID」** とみなし、[`data/mock_users.json`](data/mock_users.json) の **`external_user_id`** と **完全一致**でユーザーを解決します（[`MockUserFileGateway`](src/adapter/gateways/mock_user_file_gateway.py)）。
- 解決に成功すると [`MockAuthUseCase`](src/application/usecases/auth.py) が **`Principal`**（`user_id` は JSON の内部 `id`、`email`、**`roles`**）を組み立て、[`PrincipalContext`](src/common/context.py) に保存します。解決できない場合は **401**（`UnauthenticatedError`）です。

### ロール（何の権限として振る舞うか）

- ロールは **DB ではなく Bearer トークン文字列に対するキーワード部分一致**で推論されます（`student` / `受講者` → `STUDENT` 等）。いずれにも当たらない場合は **`roles` は空配列**です（[`Role`](src/common/roles.py) は `admin` / `teacher` / `student` / `hr` の値を持つ列挙）。
- **`/me` のレスポンス `role`** は、推論結果の **先頭ロールの value** を返し、**ロールが無いときは `null`** です（暗黙のデフォルトロールは付けません）。

### 認可（そのルートにアクセスしていいか）

- [`require_role`](src/adapter/web/middleware/auth.py) は、**`PrincipalContext` に入っている `principal.roles` のいずれかが、許可リストに含まれるか**を見ます。含まれなければ **403**（`ForbiddenError`）です。
- 現状 **`/todos`** は **`list(Role)`**（定義済みの全ロール）を許可にしており、**`roles` が空のユーザーは `/me` には届いても `/todos` では拒否**されます。

### 設定・DI との関係（ざっくり）

- **`mock_users_path`**（[`config.py`](src/config.py)）でモックユーザ JSON の場所を指定し、[`main.py`](src/main.py) の **`from_dict`** で DI コンテナの **`Gateways`** に渡し、**`MockUserFileGateway`** がそのパスを開きます。
- **`MockAuthUseCase`** はコンテナ経由で **`app.state.auth_usecase`** に載せ、上記 **`auth_dependency`** が毎リクエストそれを `execute` します。

フロント側でトークンをどう保持するか・画面でどう扱うかは **fe-app の README** を参照してください。

## 環境変数

[`.env.example`](.env.example) をコピーして `.env` を作成します。

| 変数 | 説明 |
|------|------|
| `API_HOST` | 既定 `0.0.0.0` |
| `API_PORT` | 既定 `8000`（アプリ設定。uvicorn の CLI と揃える場合は起動オプションも合わせる） |
| `DEBUG` | FastAPI の `debug` に反映 |
| `CORS_ORIGINS` | 許可オリジン。`list[str]` 用のため **JSON 配列**推奨（例: `["http://localhost:3000"]`）。空だと CORS が効かない場合があります |
| `TODO_DATA_PATH` | 任意。Todo 一覧の JSON ファイルパス。未指定時は `data/todos.json`（`be-app` 直下） |
| `MOCK_USERS_PATH` | 任意。モックユーザ一覧 JSON。未指定時は `data/mock_users.json` |

## ディレクトリ構成

クリーンアーキテクチャに近い形で、**アプリケーション層**（ユースケースとポート）、**アダプター層**（HTTP・DI・永続化の具象）、**エントリ**（FastAPI）に分けています。依存の向きは概ね `main` → ユースケース → ゲートウェイ抽象 ← 具象ゲートウェイです。

```
apps/be-app/
├── data/
│   ├── todos.json              # Todo 一覧のデータ（JSON 配列 of 文字列）
│   └── mock_users.json         # モック認証用ユーザー（external_user_id / id / email）
├── src/
│   ├── main.py                 # FastAPI アプリ・CORS・ルート、DI の wire・app.state.auth
│   ├── config.py               # pydantic-settings（.env）
│   ├── common/                 # ロール・Principal・共通エラー
│   ├── enterprise/entities/    # User 等のドメインエンティティ
│   ├── application/            # アプリケーション層（フレームワーク非依存の意図）
│   │   ├── gateways/
│   │   │   ├── i_todo_gateway.py
│   │   │   └── i_user_gateway.py   # モック認証用ユーザー解決ポート
│   │   └── usecases/
│   │       ├── auth.py             # MockAuthUseCase
│   │       └── todo/
│   │           └── list_todos.py   # 一覧取得ユースケース
│   └── adapter/                # アダプター層（外部I/O・DI・Webスキーマ）
│       ├── di/
│       │   └── container.py    # dependency_injector（Gateways / UseCases）
│       ├── gateways/
│       │   ├── todo_file_gateway.py
│       │   └── mock_user_file_gateway.py
│       └── web/
│           ├── routers.py      # auth_dependency・public/private ルータ
│           ├── middleware/
│           └── schemas/          # todo / user 等のレスポンスモデル
├── .env.example
├── pyproject.toml
├── uv.lock
├── package.json                # pnpm / Turbo 用の dev スクリプト
└── README.md
```

`__init__.py` は置かず、Python 3 の名前空間パッケージとして `src.application` / `src.adapter` を解決しています。

## `.python-version` について

チームで Python を固定する運用では **コミットする**のが一般的です。ローカル専用にしたい場合のみルートの `.gitignore` に追加する、という運用もあります。

## フロントとの同時起動

ルートで `pnpm dev` を実行すると、`fe-app`（3000）と `be-app`（8000）が並列で立ち上がります。どちらかのポートを変えた場合は、もう一方の URL（CORS や `NEXT_PUBLIC_API_URL`）も合わせて更新してください。
