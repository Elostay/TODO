"use client";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchTodos, createTodo, deleteTodo } from "@/utils/api";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";

const LOCAL_STORAGE_KEY = "todos";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const [todos, setTodos] = useState<
    { id: number; title: string; completed: boolean }[]
  >([]);

  useEffect(() => {
    const savedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    } else if (data) {
      setTodos(data);
    }
  }, [data]);

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos]);

  const addTodoMutation = useMutation({
    mutationFn: createTodo,
    onMutate: async (newTitle) => {
      const newTodo = {
        id: Date.now(),
        title: newTitle,
        completed: false,
      };
      setTodos((prevTodos) => {
        const updatedTodos = [...prevTodos, newTodo];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
        return updatedTodos;
      });
      return newTodo;
    },
    onSuccess: (newTodoFromServer) => {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === newTodoFromServer.id ? newTodoFromServer : todo
        )
      );
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onMutate: async (id) => {
      setTodos((prevTodos) => {
        const updatedTodos = prevTodos.filter((todo) => todo.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
        return updatedTodos;
      });
    },
  });

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка завантаження</p>;

  return (
    <div className="min-h-screen bg-soft-gradient p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📋 Список тудушок</h1>
      <TodoForm onAdd={addTodoMutation.mutate} />
      <TodoList todos={todos} onDelete={deleteTodoMutation.mutate} />
    </div>
  );
}
