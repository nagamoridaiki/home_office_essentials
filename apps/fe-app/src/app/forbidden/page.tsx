"use client";

import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-svh items-center justify-center px-6 py-12">
      <main className="flex w-full max-w-[420px] flex-col gap-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          アクセス権限がありません
        </h1>
        <p className="text-[15px] text-foreground/60">
          このページを表示する権限がありません。
        </p>
        <Link
          href="/"
          className="flex items-center justify-center rounded-xl border border-black/[0.08] bg-foreground px-4 py-3 text-[15px] font-medium text-background transition-colors hover:bg-foreground/90 dark:border-white/[0.145]"
        >
          トップに戻る
        </Link>
      </main>
    </div>
  );
}
