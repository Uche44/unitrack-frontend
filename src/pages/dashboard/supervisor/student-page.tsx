import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../lib/api";
import { X, FileText } from "lucide-react";
import { useUserStore } from "../../../context/user-context";
import { Navigate } from "react-router-dom";
import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';


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
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionComment, setRejectionComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
const [pageNumber, setPageNumber] = useState<number>(1);
  const user = useUserStore((state) => state.user);

  // Protect route - redirect if not supervisor
  if (user?.role !== 'supervisor') {
    return <Navigate to="/auth/login" replace />;
  }

  // Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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

  const handleApprove = async () => {
    if (!project) return;
    
    setActionLoading(true);
    try {
      await api.post(`/api/projects/${project.id}/proposal/action/`, {
        action: "approve",
      });
      
      // Refresh project data
      const projectRes = await api.get(`/api/supervisor/student/${studentId}/project/`);
      setProject(projectRes.data);
      setShowApproveModal(false);
      
      // Show success message (you can use toast if available)
      alert("Proposal approved successfully!");
    } catch (err: any) {
      console.error("Failed to approve proposal:", err);
      alert(err?.response?.data?.error || "Failed to approve proposal");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!project) return;
    
    setActionLoading(true);
    try {
      await api.post(`/api/projects/${project.id}/proposal/action/`, {
        action: "reject",
        comment: rejectionComment,
      });
      
      // Refresh project data
      const projectRes = await api.get(`/api/supervisor/student/${studentId}/project/`);
      setProject(projectRes.data);
      setShowRejectModal(false);
      setRejectionComment("");
      
      // Show success message
      alert("Proposal rejected");
    } catch (err: any) {
      console.error("Failed to reject proposal:", err);
      alert(err?.response?.data?.error || "Failed to reject proposal");
    } finally {
      setActionLoading(false);
    }
  };

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
            <p className="font-bold text-lg text-green-700">Supervisor (You):</p>
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
            Project 
        </h2>

        {project ? (
            <div className="space-y-6">
                <div className="md:flex md:items-start md:justify-between">
                  <div>
                      <h3 className="md:text-xl font-bold text-gray-800"> <span className=" font-semibold mb-4">
            
            Title:
        </span> {project.title || "Untitled Project"}</h3>
                      <p className="text-gray-600 mt-2">
                        <span className=" font-semibold mb-4">
            
            Description:
        </span> {""}
                         {project.description || "No description provided."}</p>
                      <div className="mt-2 text-sm text-gray-500">
                          Status: <span className="font-medium capitalize">{project.status.replace('_', ' ')}</span>
                      </div>
                  
                     
                  </div>

 {/* Approve/Reject Buttons - Only show for pending proposals */}
                      {project.status === 'proposal_pending' && (
                          <div className="mt-4 flex gap-3">
                              <button
                                  onClick={() => setShowApproveModal(true)}
                                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm cursor-pointer"
                              >
                                  ✓ Approve Proposal
                              </button>
                              <button
                                  onClick={() => setShowRejectModal(true)}
                                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm cursor-pointer"
                              >
                                  ✗ Reject Proposal
                              </button>
                          </div>
                      )}

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
    <div className="bg-white rounded-lg w-full h-[90vh] max-w-6xl flex flex-col shadow-2xl">
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
      
      <div className="flex-1 bg-gray-100 p-4 overflow-auto">
        <Document
          file={previewUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          className="flex flex-col items-center gap-4"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              className="shadow-lg"
              width={800}
            />
          ))}
        </Document>
      </div>
      
      <div className="p-3 border-t bg-gray-50 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {numPages > 0 && `${numPages} pages`}
        </span>
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

      {/* {previewUrl && (
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
      )} */}

      {/* Approve Confirmation Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl">
            <h3 className="font-bold text-xl mb-4 text-green-700">Approve Proposal</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve this project proposal? The student will be able to proceed to Chapter One.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowApproveModal(false)}
                disabled={actionLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? "Approving..." : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal with Comment */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl">
            <h3 className="font-bold text-xl mb-4 text-red-700">Reject Proposal</h3>
            <p className="text-gray-600 mb-4">
              Please provide feedback to help the student improve their proposal.
            </p>
            <textarea
              value={rejectionComment}
              onChange={(e) => setRejectionComment(e.target.value)}
              placeholder="Enter your feedback here..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionComment("");
                }}
                disabled={actionLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentPage;
