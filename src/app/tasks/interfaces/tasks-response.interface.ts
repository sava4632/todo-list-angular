import { MessageResponse } from "../../interfaces/message-respose.interface";
import { Task } from "../../interfaces/task.interface";

export interface TasksResponse extends MessageResponse<Task[]> {}

export interface TaskResponse extends MessageResponse<Task> {}
