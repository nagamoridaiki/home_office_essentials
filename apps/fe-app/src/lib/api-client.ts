/**
 * 【このファイルの役割】
 * フロント（ブラウザ）からバックエンド API（be-app）へ HTTP リクエストを送るための共通関数を置いています。
 *
 * 【なぜまとめるか】
 * - API のアドレス（http://localhost:8000 など）を毎回書かず、環境変数 1 か所で切り替えられるようにするため
 * - 失敗時に同じようにエラーにできるようにするため
 *
 * 【使い方のイメージ】
 * `apiClient<{ todos: string[] }>("/todos")` のように、パスと返ってくる JSON の形（型）を指定して呼びます。
 */
const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";
// NEXT_PUBLIC_ で始まる変数だけ、ブラウザ側のコードに埋め込まれます（.env.local などで設定）

/**
 * 指定したパスに fetch でアクセスし、返ってきた JSON をオブジェクトとして返します。
 * @param url 先頭に / があるパス（例: "/todos"）。無くても内部で付けます。
 * @param init fetch の第2引数（メソッドやヘッダーなど）。GET だけなら省略することが多いです。
 */
export async function apiClient<T>(url: string, init?: RequestInit): Promise<T> {
  // 例: baseURL が http://localhost:8000、url が /todos → 実際には http://localhost:8000/todos へアクセス
  const path = url.startsWith("/") ? url : `/${url}`;
  const res = await fetch(`${baseURL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });
  // status が 200 番台以外（404 や 500 など）のときは「失敗」とみなし、呼び出し元でキャッチできるよう投げる
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  // レスポンス本文を JSON としてパース（文字列のままではなく JavaScript の値にする）
  return res.json() as Promise<T>;
}
