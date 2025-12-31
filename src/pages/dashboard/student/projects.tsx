import React, { useEffect, useState } from "react";
import api from "../../../lib/api";
import { X } from "lucide-react";

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

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  is_approved: boolean;
  student: number;
  supervisor: number;
  created_at: string;
}

const ProjectDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Projects for logged-in student
        const projectRes = await api.get("/api/projects/");
        setProjects(projectRes.data);

        // Submissions for logged-in student
        const submissionRes = await api.get("/api/submissions/");
        setSubmissions(submissionRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (projects.length === 0) {
    return (
      <div className="max-w-5xl mx-auto pt-20 text-center">
        <p className="text-gray-600 text-lg">
          You haven’t submitted any projects yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pt-20 relative">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-lg shadow p-6 border border-green-500"
        >
          <h2 className="text-2xl font-bold text-green-700">{project.title}</h2>
          <p className="text-gray-700 mt-2">{project.description}</p>
          {!project.is_approved && (
            <span className="inline-block mt-2 px-3 py-1 text-sm text-white bg-yellow-500 rounded-full">
              Awaiting Approval
            </span>
          )}

          {/* Submissions for this project */}
          <div className="mt-4 space-y-3">
             <h3 className="font-semibold text-lg border-b pb-1">Submissions</h3>
            {submissions
              .filter((s) => s.project === project.id)
              .map((submission) => (
                <div
                  key={submission.id}
                  className="p-3 border border-gray-200 rounded-md bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                        <span className="text-sm font-semibold text-gray-600 capitalize block">
                        {submission.milestone.replace('_', ' ')} (v{submission.version})
                        </span>
                        <span className="text-xs text-gray-400">
                        {new Date(submission.submitted_at).toLocaleString()}
                        </span>
                    </div>
                     <button
                        onClick={() => setPreviewUrl(submission.file_url)}
                        className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm transition-colors"
                    >
                        View Document
                    </button>
                  </div>
                 
                </div>
              ))}
              {submissions.filter(s => s.project === project.id).length === 0 && (
                  <p className="text-gray-500 italic text-sm">No files submitted yet.</p>
              )}
          </div>
        </div>
      ))}

      {/* File Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full h-[85vh] max-w-6xl flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg">Document Preview</h3>
              <button
                onClick={() => setPreviewUrl(null)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 bg-gray-100 p-2 overflow-hidden">
                {/* 
                  Using iframe for PDF/general web view. 
                  Note: Some external sites (like Cloudinary) might set X-Frame-Options: DENY, 
                  but usually for assets it works. If it fails, we fall back to a download link.
                */}
              <iframe
                src={previewUrl}
                className="w-full h-full border-none bg-white"
                title="Document Preview"
              />
            </div>
            <div className="p-3 border-t bg-gray-50 flex justify-end">
                 <a 
                    href={previewUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                 >
                    Open in new tab
                 </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;
