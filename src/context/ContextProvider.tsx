import { FC, PropsWithChildren, useMemo, useState } from "react";
import { Column } from "../types/Column";
import { Task } from "../types/Task";
import { KanbanBoardContext } from "./useKanbanContext";
import { KanbanContextType } from "../types/KanbanContext";
import { KanbanLocalStorage } from "../types/KanbanLocalStorage";

const kanbanLocalStorage: KanbanLocalStorage = JSON.parse(
  localStorage.getItem("kanban")!
);

const ContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [columns, setColumns] = useState<Column[]>(
    kanbanLocalStorage.columns || []
  );
  const [tasks, setTasks] = useState<Task[]>(kanbanLocalStorage.tasks || []);

  const kanbanContextValue: KanbanContextType = {
    tasks,
    setTasks,
    columns,
    setColumns,
  };
  useMemo(() => {
    localStorage.setItem("kanban", JSON.stringify({ tasks, columns }));
  }, [tasks, columns]);

  return (
    <KanbanBoardContext.Provider value={kanbanContextValue}>
      {children}
    </KanbanBoardContext.Provider>
  );
};

export default ContextProvider;
