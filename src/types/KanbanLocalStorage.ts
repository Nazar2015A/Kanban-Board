import { Column } from "./Column";
import { Task } from "./Task";

export type KanbanLocalStorage = {
  columns: Column[];
  tasks: Task[];
};
