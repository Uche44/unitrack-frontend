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
    email?: string;
    staff_id?: string;
    is_approved?: boolean;
    is_fully_booked?: boolean;
  };
}

export interface Submission {
  id: number;
  milestone: string;
  file_url: string;
  version: number;
  submitted_at: string;
  is_read?: boolean;
  is_approved?: boolean;
  is_rejected?: boolean;
  rejection_comment?: string;
  comment?: string;
  project: number;
}

export interface ProjectDetail {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  submissions: Submission[];
}