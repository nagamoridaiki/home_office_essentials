/**
 * 【このファイルの役割】
 * TanStack Query 用の QueryClient をアプリ全体に渡し、データ取得（query）・更新（mutation）が失敗したときの
 * 共通処理（例: ログイン画面・禁止画面への遷移）を 1 か所にまとめます。
 *
 * 【api-client.ts との違い】
 * - api-client.ts … バックエンド（be-app）への HTTP（fetch）、URL・認証ヘッダー・ステータスに応じた例外の出し方。
 *   バックエンドの「REST API」とのやり取りだけを担当します。
 * - このファイル … HTTP や fetch は書かない。React Query の「箱」とデフォルト挙動、および失敗時の画面方針だけ。
 *   api-client が投げたエラー（UnauthenticatedError など）を、ここで受けて router で反応するイメージです。
 */

// Next.js（App Router）の部品は、最初から「サーバー上で動く」ものと決まっています。
// このファイルは画面遷移（useRouter）や React のフック（useRef）を使うので、「ブラウザ側で動く部品」にします。
// その印がファイル先頭の "use client" です。付けないと、useRouterやuseRef などの「ブラウザ用の React / Next の機能」が使えずエラーになります。
"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, type ReactNode } from "react";
import { ForbiddenError, UnauthenticatedError } from "@/lib/errors";

/**
 * ここで「データ取得・送信が失敗したときの共通処理」を1か所にまとめます。
 *
 * - 「データを取る」（useQuery）と「データを送る・変える」（useMutation）では、
 *   失敗の通知の受け口が別々です。
 * - 片方だけに処理を書くと、「取る側はログインへ飛ぶのに、送る側は飛ばない」などの抜けが出ます。
 * - だから両方（queryCache と mutationCache）に、同じ onError を渡します。
 */
function makeQueryClient(onError: (error: Error) => void) {
  return new QueryClient({
    queryCache: new QueryCache({ onError }),
    mutationCache: new MutationCache({ onError }),
    defaultOptions: {
      queries: {
        // retry: 失敗したら自動で「もう一度やり直す」設定。
        // ログイン切れなどは、やり直しても同じ失敗のままなので、無駄に繰り返さないように false にします。
        retry: false,
        // refetchOnWindowFocus: 別のタブから戻ったときに自動で取り直す設定。
        // そのたびにまた失敗して、ログイン画面へ飛ばす処理が何度も走りやすいので false にします。
        refetchOnWindowFocus: false,
      },
    },
  });
}

/**
 * アプリ全体の「失敗したらどの画面へ行くか」を、ここ1つに集めます。
 * （実際に「ログイン切れ」などのエラーを投げるのは api-client 側のイメージです）
 */
export function QueryClientProviderWrapper({ children }: { children: ReactNode }) {
  // コードから「/login へ行く」などの画面遷移をするための道具です（<Link> をクリックするのに近い）。
  const router = useRouter();
  // エラーが短い時間に複数まとめて来たとき、router.push が何度も続かないようにするための「いま処理中」フラグです。
  const isHandling = useRef(false);

  const handleError = (error: Error) => {
    // 複数の query が同時に失敗したり、query の直後に mutation が失敗したりすると、onError が短時間に何度も呼ばれる。
    // そのたびに router.push まで走ると連打になるので、ここで最初の1回だけ通す。
    if (isHandling.current) return;
    isHandling.current = true;

    // エラーが「ログイン切れ」か「権限なし」かを、名前付きの型で判定します。
    // 数字のステータスコードだけだと、読み手が意味を取り違えやすいので、型で意図をはっきりさせます。
    if (error instanceof UnauthenticatedError) {
      router.push("/login");
    } else if (error instanceof ForbiddenError) {
      router.push("/forbidden");
    }

    // 少し待ってから「処理中」を終了に戻します。
    // これがないと、最初の1回だけ遷移して、その後ずっとエラーを無視し続ける可能性があります。
    setTimeout(() => {
      isHandling.current = false;
    }, 0);
  };

  // QueryClient は「取得したデータを覚えておく箱」です。
  // 画面が更新されるたびに新しい箱を作ると、中身が消えたり、通信の状態がおかしくなります。
  // だから最初の1回だけ作って、ずっと同じ箱を使い回します（useRef で作り直されないようにしています）。
  const [queryClient] = useRef([makeQueryClient(handleError)]).current;

  return (
    // この中に書かれた画面（children）が、同じ QueryClient（同じ箱）を共有できるようにします。
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
