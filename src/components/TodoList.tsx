import TodoItem from "@/components/TodoItem";

type TodoListProps = {
  todos: { id: number; title: string }[];
  onDelete: (id: number) => void;
};

export default function TodoList({ todos, onDelete }: TodoListProps) {
  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
