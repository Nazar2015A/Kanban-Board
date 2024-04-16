import { useMemo, useState } from "react";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import PlusIcon from "../../icons/PlusIcon";
import { Column, Id } from "../../types/Column";
import { generateId } from "../../utils/genId";
import ColumnItem from "../ColumnItem/ColumnItem.component";
import { Task } from "../../types/Task";
import TaskCard from "../TaskCard/TaskCard.component";
import { useKanbanContext } from "../../context/useKanbanContext";

const KanbanBoard = () => {
  const { tasks, setTasks, columns, setColumns } = useKanbanContext();
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleCreateColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: "",
    };
    setColumns((prev) => [...prev, columnToAdd]);
  };
  const handleColumnDelete = (columnId: Id) => {
    setColumns((prev) => prev.filter((item) => item.id !== columnId));

    const newTasks = tasks.filter((t) => t.columnId !== columnId);
    setTasks(newTasks);
  };

  const handleUpdateColumn = (id: Id, title: string) => {
    const newColumns = columns.map((column) => {
      if (column.id !== id) return column;
      return {
        ...column,
        title,
      };
    });

    setColumns(newColumns);
  };

  const onCreateTask = (columnId: Id) => {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: "",
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const handleDeleteTask = (id: Id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };
  const handleUpdateTask = (id: Id, content: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        return {
          ...task,
          content,
        };
      })
    );
  };
  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  return (
    <div className="select-none m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnItem
                  key={column.id}
                  column={column}
                  onColumnDelete={handleColumnDelete}
                  onUpdateColumn={handleUpdateColumn}
                  onCreateTask={onCreateTask}
                  onDeleteTask={handleDeleteTask}
                  onUpdateTask={handleUpdateTask}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                />
              ))}
            </SortableContext>
          </div>
          <div className="h-[500px] max-h-[500px]">
            <button
              onClick={handleCreateColumn}
              className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex justify-center items-center gap-4"
            >
              <PlusIcon />
              Add Column
            </button>
          </div>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn ? (
              <ColumnItem
                column={activeColumn}
                onColumnDelete={handleColumnDelete}
                onUpdateColumn={handleUpdateColumn}
                onCreateTask={onCreateTask}
                onDeleteTask={handleDeleteTask}
                onUpdateTask={handleUpdateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            ) : null}
            {activeTask ? (
              <TaskCard
                task={activeTask}
                onDeleteTask={handleDeleteTask}
                onUpdateTask={handleUpdateTask}
              />
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
