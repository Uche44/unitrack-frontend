export type UserRole = "student" | "supervisor" | "admin";

export interface User {
  fullname: string;
  email: string;
  role: UserRole;
  staffId?: string; 
  matricNo?: string; 
}
