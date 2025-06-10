import { User } from "@prisma/client"; 

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}