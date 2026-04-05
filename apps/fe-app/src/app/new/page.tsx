"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTodos } from "@/contexts/todo-context";

export default function NewTodo() {
  const [text, setText] = useState("");
  const { addTodo } = useTodos();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    addTodo(trimmed);
    router.push("/");
  };

  return (
    <div className="flex min-h-svh items-center justify-center px-6 py-12">
      <main className="flex w-full max-w-[420px] flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          タスクを追加
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="新しいタスクを入力..."
            autoFocus
            className="rounded-xl border border-black/[0.08] bg-black/[0.05] px-4 py-3.5 text-[15px] leading-snug text-foreground outline-none placeholder:text-foreground/40 focus:border-foreground/30 dark:border-white/[0.145] dark:bg-white/[0.06] dark:placeholder:text-foreground/30 dark:focus:border-white/30"
          />
          <button
            type="submit"
            className="rounded-xl border border-black/[0.08] bg-foreground px-4 py-3 text-[15px] font-medium text-background transition-colors hover:bg-foreground/90 dark:border-white/[0.145]"
          >
            追加
          </button>
          <Link
            href="/"
            className="text-center text-[15px] text-foreground/60 transition-colors hover:text-foreground"
          >
            戻る
          </Link>
        </form>
      </main>
    </div>
  );
}
