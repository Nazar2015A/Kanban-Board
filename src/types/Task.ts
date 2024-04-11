import { Id } from "./Column";

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
};
