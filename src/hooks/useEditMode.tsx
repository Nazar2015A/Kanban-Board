import { useState } from "react";

export const useEditMode = (initialValue: boolean = false) => {
  const [editMode, setEditMode] = useState<boolean>(initialValue || false);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };
  const closeEditMode = () => {
    setEditMode(false);
  };
  const openEditMode = () => {
    setEditMode(true);
  };

  const closeEditModeOnKeyDown = (
    event: React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
  ) => {
    if (event.key !== "Enter") return;
    setEditMode(false);
  };

  return {
    editMode,
    toggleEditMode,
    closeEditMode,
    openEditMode,
    closeEditModeOnKeyDown,
  };
};
