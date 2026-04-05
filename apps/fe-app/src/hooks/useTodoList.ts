"use client";

import { useCallback, useState } from "react";
import { INITIAL_TODOS } from "@/constants/todos";
import type { TodoText } from "@/types/todo";

export function useTodoList() {
  const [todos, setTodos] = useState<TodoText[]>(() => [...INITIAL_TODOS]);

  const addTodo = useCallback((text: string) => {
    setTodos((prev) => [...prev, text]);
  }, []);

  return { todos, addTodo };
}
