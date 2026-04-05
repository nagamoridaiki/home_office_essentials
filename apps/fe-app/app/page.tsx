import type { Metadata } from "next";

const TODOS = [
  "デスクの配線を整理する",
  "モニターアームの高さを調整する",
  "キーボード用リストレストを買う",
  "作業ログを30分おきに取る",
  "夕方の換気を10分する",
] as const;

export const metadata: Metadata = {
  title: "やること",
  description: "ホームオフィス向けのTODO一覧（表示のみ）",
};

export default function Home() {
  return (
    <div className="flex min-h-svh items-center justify-center px-6 py-12">
      <main className="flex w-full max-w-[420px] flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          やること
        </h1>
        <ul
          className="overflow-hidden rounded-xl border border-black/[0.08] bg-black/[0.05] dark:border-white/[0.145] dark:bg-white/[0.06]"
          aria-label="TODO一覧（表示のみ、操作不可）"
        >
          {TODOS.map((text) => (
            <li
              key={text}
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
      </main>
    </div>
  );
}
