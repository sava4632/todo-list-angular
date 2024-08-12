import { MessageResponse } from "../../interfaces/message-respose.interface";
import { User } from "../../interfaces/user.interface";

export interface AuthResponse extends MessageResponse<User> {}
