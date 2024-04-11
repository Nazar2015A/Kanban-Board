import { createContext, useContext } from "react";
import { KanbanContextType } from "../types/KanbanContext";

export const KanbanBoardContext = createContext<KanbanContextType | undefined>(
  undefined
);

export const useKanbanContext = () => {
  const kanbanContext = useContext(KanbanBoardContext);

  if (kanbanContext === undefined) {
    throw new Error("useKanbanContext must be used with a KanbanBoardContext");
  }

  return kanbanContext;
};
