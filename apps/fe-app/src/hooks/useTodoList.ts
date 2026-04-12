"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { TodoText } from "@/types/todo";

type TodoListResponse = { todos: string[] };

async function fetchTodos(): Promise<TodoListResponse> {
  return apiClient<TodoListResponse>("/todos");
}

export function useTodoList() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const [localTodos, setLocalTodos] = useState<TodoText[]>([]);

  const todos = useMemo(() => {
    const server = data?.todos ?? [];
    return [...server, ...localTodos];
  }, [data?.todos, localTodos]);

  const addTodo = useCallback((text: string) => {
    setLocalTodos((prev) => [...prev, text]);
  }, []);

  return { todos, addTodo, isPending, isError, error };
}
