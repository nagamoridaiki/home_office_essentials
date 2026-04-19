"use client";

import { useState, useCallback, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SessionManager, type Role } from "@/lib/session-manager";
import { apiClient } from "@/lib/api-client";

type MeResponse = { id: string; email: string; role: string | null };

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (SessionManager.isSignedIn()) {
      router.replace("/");
    }
  }, [router]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!userId || !password) {
        setError("ユーザーIDとパスワードを入力してください");
        return;
      }

      setLoading(true);
      setError("");

      try {
        // 仮トークン（user_id そのもの）を localStorage に保存してから /me を叩く
        SessionManager.setAuthentication(userId, {
          id: userId,
          email: `${userId}@local.example.com`,
          role: null,
        });

        // バックエンドの /me でロールを確定させる
        const me = await apiClient<MeResponse>("/me");

        SessionManager.setAuthentication(userId, {
          id: me.id,
          email: me.email,
          role: me.role as Role | null,
        });

        router.push("/");
      } catch {
        SessionManager.clearSession();
        setError("ログインに失敗しました。ユーザーIDを確認してください。");
      } finally {
        setLoading(false);
      }
    },
    [userId, password, router],
  );

  return (
    <div className="flex min-h-svh items-center justify-center px-6 py-12">
      <main className="flex w-full max-w-[420px] flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          ログイン
        </h1>
        <p className="text-[13px] text-foreground/50">
          ローカル環境専用のモックログインです。ユーザーID は be-app の{" "}
          <code className="rounded bg-black/[0.06] px-1 dark:bg-white/[0.08]">
            data/mock_users.json
          </code>{" "}
          の <code className="rounded bg-black/[0.06] px-1 dark:bg-white/[0.08]">external_user_id</code>{" "}
          と一致させてください（例: <code className="rounded bg-black/[0.06] px-1 dark:bg-white/[0.08]">teacher-dev-1</code>
          ）。トークン文字列に teacher / student などが含まれるとロールが付きます。
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="userId"
              className="text-[14px] font-medium text-foreground"
            >
              ユーザーID
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="例: teacher-dev-1"
              autoFocus
              autoComplete="username"
              className="rounded-xl border border-black/[0.08] bg-black/[0.05] px-4 py-3.5 text-[15px] leading-snug text-foreground outline-none placeholder:text-foreground/40 focus:border-foreground/30 dark:border-white/[0.145] dark:bg-white/[0.06] dark:placeholder:text-foreground/30 dark:focus:border-white/30"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-[14px] font-medium text-foreground"
            >
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="任意の文字列"
              autoComplete="current-password"
              className="rounded-xl border border-black/[0.08] bg-black/[0.05] px-4 py-3.5 text-[15px] leading-snug text-foreground outline-none placeholder:text-foreground/40 focus:border-foreground/30 dark:border-white/[0.145] dark:bg-white/[0.06] dark:placeholder:text-foreground/30 dark:focus:border-white/30"
            />
          </div>
          {error && (
            <p className="text-[14px] text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl border border-black/[0.08] bg-foreground px-4 py-3 text-[15px] font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50 dark:border-white/[0.145]"
          >
            {loading ? "ログイン中…" : "ログイン"}
          </button>
        </form>
      </main>
    </div>
  );
}
