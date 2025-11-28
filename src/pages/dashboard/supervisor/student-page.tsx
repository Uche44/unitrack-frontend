import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../lib/api";
// import type { Student } from "../../../types/user";

export interface StudentResponse {
  id: number;
  fullName: string;
  email: string;
  matricNo: string;
  supervisor: {
    id: number;
    fullName: string;
  };
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <span className="flex gap-2 w-full">
    <p className="font-semibold text-xl text-green-700">{label}</p>
    <p className="font-normal text-xl text-gray-900">{value}</p>
  </span>
);

const StudentPage = () => {
  const { supervisorId, studentId } = useParams();
  const [student, setStudent] = useState<StudentResponse | null>(null);

  useEffect(() => {
    const loadStudent = async () => {
      const res = await api.get(
        `/api/supervisors/${supervisorId}/students/${studentId}/`
      );

      const apiStudent = res.data;
      setStudent({
        id: apiStudent.id,
        fullName: apiStudent.full_name,
        email: apiStudent.email,
        matricNo: apiStudent.matric_no,
        supervisor: {
          id: apiStudent.supervisor.id,
          fullName: apiStudent.supervisor.full_name,
        },
      });
    };

    loadStudent();
  }, [supervisorId, studentId]);

  if (!student) return <div>Loading...</div>;

  const details = [
    { label: "Student Name:", value: student.fullName },
    { label: "Student Email:", value: student.email },
    { label: "Matric Number:", value: student.matricNo },
  ];

  return (
    <section className="w-full min-h-screen pt-16 bg-gray-100">
      <section className="h-fit w-full bg-white px-4 py-6 rounded-2xl">
        <h2 className="text-3xl font-bold mb-2">Student Details</h2>
        <div className="h-fit w-full flex justify-between items-end">
          <div className="h-fit w-[50%]">
            {details.map((item, i) => (
              <DetailRow
                key={i}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
          <span className="flex gap-2">
            <p className="font-bold text-2xl text-green-700">You:</p>
            <p className="font-semibold text-2xl text-gray-900">
              {student.supervisor.fullName}
            </p>
          </span>
        </div>
      </section>
    </section>
  );
};

export default StudentPage;
