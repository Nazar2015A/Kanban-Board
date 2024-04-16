import { FC, useMemo } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column, Id } from "../../types/Column";
import DeleteIcon from "../../icons/DeleteIcon";
import { useEditMode } from "../../hooks/useEditMode";
import PlusIcon from "../../icons/PlusIcon";
import TaskCard from "../TaskCard/TaskCard.component";
import { Task } from "../../types/Task";

interface Props {
  column: Column;
  onColumnDelete: (columnId: Id) => void;
  onUpdateColumn: (id: Id, title: string) => void;
  onCreateTask: (id: Id) => void;
  onDeleteTask: (id: Id) => void;
  onUpdateTask: (id: Id, content: string) => void;
  tasks: Task[]
}

const ColumnItem: FC<Props> = ({
  column,
  onColumnDelete,
  onUpdateColumn,
  onCreateTask,
  onDeleteTask,
  onUpdateTask,
  tasks
}) => {
  const { editMode, closeEditMode, openEditMode, closeEditModeOnKeyDown } =
    useEditMode(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });
  const tasksId = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const handleColumnDelete = () => {
    onColumnDelete(column.id);
  };
  const handleUpdateColumn = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateColumn(column.id, event.target.value);
  };

  const handleCreateTask = () => {
    onCreateTask(column.id);
  };

  const handleUpdateTask = (id: Id, content: string) => {
    onUpdateTask(id, content);
  };

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-60 border-2 border-rose-500"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor select-none w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div
        onClick={openEditMode}
        {...attributes}
        {...listeners}
        className="overflow-hidden bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between"
      >
        <div className="flex gap-2 items-center">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm">
            {tasks.length}
          </div>
          {editMode ? (
            <input
              value={column.title}
              placeholder={column.title}
              onChange={handleUpdateColumn}
              autoFocus
              onBlur={closeEditMode}
              onKeyDown={closeEditModeOnKeyDown}
              className="rounded outline-none px-2 focus:bg-transparent focus:p-0 focus:border-1 focus:border-red-400"
            />
          ) : (
            <div className="my-auto h-[90%] w-full overflow-x-auto overflow-y-hidden whitespace-pre-wrap">
              {column.title || (
                <span className="text-grayColumn">Enter a column name</span>
              )}
            </div>
          )}
        </div>
        <button
          onClick={handleColumnDelete}
          className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2"
        >
          <DeleteIcon />
        </button>
      </div>
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksId}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDeleteTask={onDeleteTask}
              onUpdateTask={handleUpdateTask}
            />
          ))}
        </SortableContext>
      </div>
      <button
        onClick={handleCreateTask}
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
      >
        <PlusIcon /> Add task
      </button>
    </div>
  );
};

export default ColumnItem;
