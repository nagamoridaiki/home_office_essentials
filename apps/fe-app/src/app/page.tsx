"use client";

import Link from "next/link";
import { useTodos } from "@/contexts/todo-context";

export default function Home() {
  const { todos } = useTodos();

  return (
    <div className="flex min-h-svh items-center justify-center px-6 py-12">
      <main className="flex w-full max-w-[420px] flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          やること
        </h1>
        <ul
          className="overflow-hidden rounded-xl border border-black/[0.08] bg-black/[0.05] dark:border-white/[0.145] dark:bg-white/[0.06]"
          aria-label="TODO一覧"
        >
          {todos.map((text, i) => (
            <li
              key={`${text}-${i}`}
              className="flex items-start gap-3 border-b border-black/[0.08] px-4 py-3.5 text-[15px] leading-snug text-foreground last:border-b-0 dark:border-white/[0.145]"
            >
              <span
                className="mt-0.5 size-[18px] shrink-0 rounded border-[1.5px] border-black/[0.08] bg-background box-border dark:border-white/[0.145]"
                aria-hidden
              />
              <span className="min-w-0 flex-1">{text}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/new"
          className="flex items-center justify-center rounded-xl border border-black/[0.08] bg-foreground px-4 py-3 text-[15px] font-medium text-background transition-colors hover:bg-foreground/90 dark:border-white/[0.145]"
        >
          タスクを追加
        </Link>
      </main>
    </div>
  );
}
