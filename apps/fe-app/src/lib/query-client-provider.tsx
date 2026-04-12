"use client";

/**
 * 【このファイルの役割】
 * 「React Query（@tanstack/react-query）」を画面で使えるようにするラッパーです。
 *
 * 【React Query とは（ざっくり）】
 * サーバーからデータを取ってきたり、読み込み中・エラー・成功の状態を管理したりするためのライブラリです。
 * `useQuery` などのフックを使うには、そのコンポーネントがこのプロバイダの「内側」にある必要があります。
 *
 * 【なぜ "use client" が必要か】
 * layout.tsx はサーバーでも動くコンポーネントですが、React Query はブラウザ上の React の仕組みに依存します。
 * そのため「クライアント専用の部品」としてこのファイルを分け、layout からここを読み込んでいます。
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * アプリ全体を包み、その子ども（children）の中で `useQuery` が使えるようにします。
 */
export function QueryClientProviderWrapper({ children }: { children: ReactNode }) {
  // QueryClient は「設定やキャッシュを持つ箱」。1つのアプリで同じ箱を使い回す必要がある
  // useState( () => ... ) の形にすると、最初の1回だけ作られ、再描画のたびに新しく作り直されない
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 失敗しても自動で何度も再試行しない（挙動が分かりやすい）
            retry: false,
            // 別タブから戻ってきたときに、勝手にデータを取り直さない
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  // 下の子コンポーネントに queryClient を渡す（これが無いと useQuery がエラーになる）
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
