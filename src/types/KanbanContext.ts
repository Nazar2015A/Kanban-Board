import { Column } from "./Column";
import { Task } from "./Task";

export type KanbanContextType = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
};
