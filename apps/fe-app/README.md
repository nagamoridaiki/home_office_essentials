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

## 認証・認可・ロール（フロントの責務）

fe-app は **ブラウザ側のモックログイン**であり、**トークンの発行やロールの真偽検証は行いません**。権限の判定は **be-app が HTTP ステータス（401 / 403）とレスポンスで返す結果に従う**形です。

### トークンとセッション（[`src/lib/session-manager.ts`](src/lib/session-manager.ts)）

- **ログインフォームの「ユーザー ID」**を、そのまま **Bearer トークン**として `localStorage` に保存します（キーは実装どおり `mock_auth_token` 等）。be-app ではこの文字列が **`data/mock_users.json` の `external_user_id` と一致する必要**があります。
- **パスワード欄**は UI 上の必須チェック用であり、**API には送っていません**（ローカルモック用）。
- 併せて表示用の **`id` / `email` / `role`** を `localStorage` に保存しますが、**信頼できる値はログイン成功後に `GET /me` で返ってきた内容で上書き**します。

### API 呼び出し（[`src/lib/api-client.ts`](src/lib/api-client.ts)）

- すべてのリクエストで **`Authorization: Bearer <上記トークン>`** を付与します。トークンが無い場合は **`UnauthenticatedError`** を投げ、呼び出し側で未ログイン扱いにできます。
- **401** は `UnauthenticatedError`、**403** は `ForbiddenError` にマッピングします（例: ロール不足で `/todos` が拒否された場合）。
- TanStack Query 利用箇所では [`src/lib/query-client-provider.tsx`](src/lib/query-client-provider.tsx) が **`UnauthenticatedError` → `/login`**、**`ForbiddenError` → `/forbidden`** のように共通で画面遷移します。`apiClient` を直接使うコードでは、呼び出し側で同様の処理が必要です。

### ロール表示（[`src/lib/session-manager.ts`](src/lib/session-manager.ts) の型）

- フロントの **`Role` 型**は be-app の **`Role` 列挙の value**（`admin` / `teacher` / `student` / `hr`）と揃えています。
- **`/me` の `role` が `null`** のときは、トークンにロール用キーワードが無かった等の意味合いで、**クライアントでも `null` のまま保持**します（勝手にデフォルトロールを付けない）。

### ログイン画面（[`src/app/login/page.tsx`](src/app/login/page.tsx)）

1. フォームのユーザー ID で **仮の `SessionManager.setAuthentication`** を行い、続けて **`apiClient("/me")`** を呼びます（この時点で初めて be-app が Bearer を検証します）。
2. 成功したら **`/me` の JSON** で `id` / `email` / `role` を **再保存**し、トークンキーは **引き続きフォームに入力した外部ユーザー ID** のままにします（Bearer は外部 ID のまま、表示用 `id` は be-app が返す内部 IDになり得ます）。

### フロントが「やらない」こと

- JWT の検証やロールの再計算、エンドポイントごとの RBAC の最終判断（**be-app の責務**）。
- サーバが返したロールと矛盾する独自の管理者判定（モックの一貫性のため、表示はサーバ準拠に寄せています）。

トークンの解釈・`Principal` の組み立て・`@require_role` による拒否は **be-app の README** を参照してください。

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
