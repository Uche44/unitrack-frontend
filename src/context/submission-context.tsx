// import { create } from "zustand";

// export type SubmissionStage = "proposal" | "chapter1" | "chapter2" | "final";

// interface SubmissionState {
//   currentStage: SubmissionStage;
//   advanceStage: () => void;
//   resetStage: () => void;
//   buttonLabel: () => string;
// }

// const stageOrder: SubmissionStage[] = [
//   "proposal",
//   "chapter1",
//   "chapter2",
//   "final",
// ];

// export const useSubmissionStore = create<SubmissionState>((set, get) => ({
//   currentStage: "proposal",

//   advanceStage: () => {
//     const current = get().currentStage;
//     const index = stageOrder.indexOf(current);
//     if (index < stageOrder.length - 1) {
//       set({ currentStage: stageOrder[index + 1] });
//     }
//   },

//   resetStage: () => set({ currentStage: "proposal" }),

//   buttonLabel: () => {
//     const stage = get().currentStage;
//     switch (stage) {
//       case "proposal":
//         return "Submit Project Proposal";
//       case "chapter1":
//         return "Submit Chapter One";
//       case "chapter2":
//         return "Submit Chapter Two";
//       case "final":
//         return "Submit Final Project";
//       default:
//         return "Submit";
//     }
//   },
// }));

import { create } from "zustand";

type Milestone = "proposal" | "chapter_one" | "chapter_two" | "final_report";

interface SubmissionState {
  projectId: number | null;
  currentStage: Milestone;

  setProjectId: (id: number) => void;
  setCurrentStage: (stage: Milestone) => void;
  advanceStage: () => void;
  buttonLabel: () => string;
}

export const useSubmissionStore = create<SubmissionState>((set, get) => ({
  projectId: null,
  currentStage: "proposal",

  setProjectId: (id) => set({ projectId: id }),

  setCurrentStage: (stage) => set({ currentStage: stage }),

  advanceStage: () => {
    const order: Milestone[] = [
      "proposal",
      "chapter_one",
      "chapter_two",
      "final_report",
    ];

    const index = order.indexOf(get().currentStage);
    if (index < order.length - 1) {
      set({ currentStage: order[index + 1] });
    }
  },

  buttonLabel: () => {
    const stage = get().currentStage;
    if (stage === "proposal") return "Create Project";
    return `Submit ${stage.replace("_", " ")}`;
  },
}));
