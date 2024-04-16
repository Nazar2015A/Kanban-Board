import { ChangeEvent, FC, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Task } from "../../types/Task";
import DeleteIcon from "../../icons/DeleteIcon";
import { Id } from "../../types/Column";
import { useEditMode } from "../../hooks/useEditMode";

interface Props {
  task: Task;
  onDeleteTask: (id: Id) => void;
  onUpdateTask: (id: Id, conetnt: string) => void;
}

const TaskCard: FC<Props> = ({ task, onDeleteTask, onUpdateTask }) => {
  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);
  const { editMode, toggleEditMode, closeEditModeOnKeyDown } =
    useEditMode(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const handleMouseEnter = () => {
    setMouseIsOver(true);
  };
  const handleMouseLeave = () => {
    setMouseIsOver(false);
  };
  const handleTaskDelete = () => {
    onDeleteTask(task.id);
  };
  const handleEditAndMouseToggle = () => {
    toggleEditMode();
    setMouseIsOver(false);
  };
  const handleTaskChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateTask(task.id, event.target.value);
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
        className="
        opacity-30
      bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative
      "
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="relative bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab"
      >
        <textarea
          autoFocus
          value={task.content}
          placeholder="Enter a task name"
          onBlur={toggleEditMode}
          onKeyDown={closeEditModeOnKeyDown}
          onChange={handleTaskChange}
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleEditAndMouseToggle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative select-none bg-mainBackgroundColor p-2.5 overflow-y-auto h-[100px] min-h-[100px] items-start flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab task"
    >
      <div className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content || (
          <span className="text-grayColumn">Enter a task name</span>
        )}
      </div>
      {mouseIsOver ? (
        <button
          onClick={handleTaskDelete}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
        >
          <DeleteIcon />
        </button>
      ) : null}
    </div>
  );
};

export default TaskCard;
