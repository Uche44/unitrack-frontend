import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../lib/api";
import { X, FileText } from "lucide-react";

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

interface Submission {
  id: number;
  milestone: string;
  file_url: string;
  version: number;
  submitted_at: string;
  is_read: boolean;
  comment?: string;
  project: number;
}

interface ProjectDetail {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  submissions: Submission[];
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
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Student Details
        const studentRes = await api.get(
          `/api/supervisors/${supervisorId}/students/${studentId}/`
        );
        const apiStudent = studentRes.data;
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

        // 2. Fetch Project Details
        // We use the new endpoint we created
        try {
            const projectRes = await api.get(`/api/supervisor/student/${studentId}/project/`);
            setProject(projectRes.data);
            console.log('project data:',projectRes.data)
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                setProject(null); // No project found
            } else {
                console.error("Error fetching project:", err);
            }
        }

      } catch (err) {
        console.error("Failed to load student data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [supervisorId, studentId]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!student) return <div className="p-8 text-center text-red-500">Student not found</div>;

  const details = [
    { label: "Student Name:", value: student.fullName },
    { label: "Student Email:", value: student.email },
    { label: "Matric Number:", value: student.matricNo },
  ];

  return (
    <section className="w-full min-h-screen pt-16 bg-gray-100 p-6 space-y-6">
      {/* Student Details Card */}
      <section className="h-fit w-full bg-white px-6 py-6 rounded-2xl shadow-sm">
        <h2 className="text-3xl font-bold mb-4 border-b pb-2">Student Details</h2>
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            {details.map((item, i) => (
              <DetailRow
                key={i}
                label={item.label}
                value={item.value || "N/A"}
              />
            ))}
          </div>
          <span className="flex gap-2 items-center bg-green-50 px-4 py-2 rounded-lg border border-green-100">
            <p className="font-bold text-lg text-green-700">Supervisor:</p>
            <p className="font-semibold text-lg text-gray-900">
              {student.supervisor.fullName}
            </p>
          </span>
        </div>
      </section>

      {/* Project Details Card */}
      <section className="h-fit w-full bg-white px-6 py-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="text-green-600" />
            Project Status
        </h2>

        {project ? (
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{project.title || "Untitled Project"}</h3>
                    <p className="text-gray-600 mt-2">{project.description || "No description provided."}</p>
                    <div className="mt-2 text-sm text-gray-500">
                        Status: <span className="font-medium capitalize">{project.status.replace('_', ' ')}</span>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h4 className="font-semibold text-lg mb-3">Submissions</h4>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {project.submissions && project.submissions.length > 0 ? (
                            project.submissions.map((submission) => (
                                <div key={submission.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="font-bold text-gray-700 capitalize block">
                                                {submission.milestone.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Version {submission.version}
                                            </span>
                                        </div>
                                         <span className="text-xs text-gray-400">
                                            {new Date(submission.submitted_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    
                                    <button
                                        onClick={() => setPreviewUrl(submission.file_url)}
                                        className="w-full mt-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors text-sm font-medium"
                                    >
                                        View Document
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic col-span-full">No submissions yet.</p>
                        )}
                    </div>
                </div>
            </div>
        ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">This student has not started a project yet.</p>
            </div>
        )}
      </section>

      {/* File Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full h-[90vh] max-w-6xl flex flex-col shadow-2xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg">Document Preview</h3>
              <button
                onClick={() => setPreviewUrl(null)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close preview"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 bg-gray-100 p-2 overflow-hidden relative">
              <iframe
                src={previewUrl}
                className="w-full h-full border-none bg-white rounded-sm shadow-inner"
                title="Document Preview"
              />
            </div>
            <div className="p-3 border-t bg-gray-50 flex justify-end">
                 <a 
                    href={previewUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm font-medium"
                 >
                    Open in new tab
                 </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentPage;
