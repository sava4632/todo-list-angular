import { User } from "./user.interface";

export interface Task {
  id:          number;
  title:       string;
  description: string;
  isCompleted:  boolean;
  dueDate:     string;
  user:        User;
}
