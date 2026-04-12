"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useTodoList } from "@/hooks/useTodoList";
import type { TodoText } from "@/types/todo";

type TodoContextValue = {
  todos: TodoText[];
  addTodo: (text: string) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
};

const TodoContext = createContext<TodoContextValue | null>(null);

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodos must be used within TodoProvider");
  return ctx;
}

export function TodoProvider({ children }: { children: ReactNode }) {
  const { todos, addTodo, isPending, isError, error } = useTodoList();

  return (
    <TodoContext.Provider
      value={{ todos, addTodo, isPending, isError, error }}
    >
      {children}
    </TodoContext.Provider>
  );
}
