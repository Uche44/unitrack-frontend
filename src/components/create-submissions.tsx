import React, { useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/api";
import { useSubmissionStore } from "../context/submission-context";
// import { useUserStore } from "../context/user-context";
import { FileUpload } from "./file-upload";



const CreateSubmissions: React.FC = () => {
  // const user = useUserStore((state) => state.user);
  const { currentStage, projectId, setProjectId, advanceStage, buttonLabel } =
    useSubmissionStore();

  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [openSubmissionModal, setOpenSubmissionModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
  });

  const [file, setFile] = useState<File | null>(null);

  

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/projects/create/", {
        title: projectData.title,
        description: projectData.description,
      });

      const createdProjectId = res.data.project.id;

      setProjectId(createdProjectId);
      toast.success("Project created successfully");

      setOpenProjectModal(false);
      setOpenSubmissionModal(true);
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        "Project creation failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

 

  const submitProposal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !projectId) {
      toast.error("Please select a file before submitting");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("project", String(projectId));
    formData.append("milestone", "proposal");
    formData.append("file", file);

    try {
      await api.post("/api/submissions/create/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Proposal submitted successfully");
      advanceStage();
      setOpenSubmissionModal(false);
      setFile(null);
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        "Submission failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <>
      {/* ACTION BUTTON */}
      <section className="mt-10 flex flex-col items-end">
        <button
          onClick={() =>
            currentStage === "proposal"
              ? setOpenProjectModal(true)
              : setOpenSubmissionModal(true)
          }
          className="py-3 px-4 bg-green-700 hover:bg-green-800 text-white rounded-lg font-semibold shadow flex gap-2"
        >
          <Plus />
          {buttonLabel()}
        </button>

        <p className="text-gray-600 mt-4">
          {currentStage === "proposal"
            ? "Start your project by submitting a proposal"
            : `Submit your ${currentStage} to your supervisor`}
        </p>
      </section>

      {/* PROJECT MODAL */}
      {openProjectModal && (
        <Modal onClose={() => setOpenProjectModal(false)}>
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Create Project
          </h2>

          <form
            onSubmit={createProject}
            className="space-y-4"
          >
            <input
              required
              placeholder="Project Title"
              className="w-full border border-green-500 rounded-md px-3 py-2"
              onChange={(e) =>
                setProjectData({ ...projectData, title: e.target.value })
              }
            />

            <textarea
              required
              placeholder="Project Description"
              rows={4}
              className="w-full border border-green-500 rounded-md px-3 py-2"
              onChange={(e) =>
                setProjectData({
                  ...projectData,
                  description: e.target.value,
                })
              }
            />

            <button
              disabled={loading}
              className="w-full bg-green-700 text-white py-2 rounded-md disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </form>
        </Modal>
      )}

      {/* SUBMISSION MODAL */}
      {openSubmissionModal && (
        <Modal onClose={() => setOpenSubmissionModal(false)}>
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Submit Proposal
          </h2>

          <form
            onSubmit={submitProposal}
            className="space-y-4"
          >
            <FileUpload
              file={file}
              setFile={setFile}
            />

            <button
              disabled={loading}
              className="w-full bg-green-700 text-white py-2 rounded-md disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Proposal"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default CreateSubmissions;

/* Modal Wrapper */

const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({
  onClose,
  children,
}) => (
  <div
    className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg"
    >
      {children}
    </div>
  </div>
);
