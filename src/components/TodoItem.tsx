type TodoItemProps = {
  id: number;
  title: string;
  onDelete: (id: number) => void;
};

export default function TodoItem({ id, title, onDelete }: TodoItemProps) {
  return (
    <li className="flex justify-between items-center border p-2 rounded-md shadow-sm bg-white hover:shadow-md transition">
      <span>{title}</span>
      <button
        onClick={() => onDelete(id)}
        className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
      >
        ❌
      </button>
    </li>
  );
}
