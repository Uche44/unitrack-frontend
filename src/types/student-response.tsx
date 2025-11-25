export interface StudentResponse {
  id: number;
  full_name: string;
  email: string;
  matric_no: string;
  department: string;
  role: string;
  created_at: string;
  supervisor: {
    id: number;
    full_name: string;
    email: string;
    staff_id: string;
    is_approved: boolean;
    is_fully_booked: boolean;
  };
}