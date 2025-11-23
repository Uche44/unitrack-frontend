import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";
import StudentForm from "./pages/studentform";
import SupervisorForm from "./pages/supervisorform";
import LoginForm from "./pages/login";
import AdminDashboardLayout from "./dashboard-layout/admin-layout";
import Admin from "./pages/dashboard/admin/admin";
import Students from "./pages/dashboard/student/students";
import Supervisor from "./pages/dashboard/supervisor/supervisor";
import SupervisorDashboardLayout from "./dashboard-layout/supervisor-layout";
import AssignSupervisor from "./pages/dashboard/admin/assign-supervisor";

// import NotFound from "./components/NotFound";
// import { Toaster } from "./components/ui/sonner";

const router = createBrowserRouter([
  
  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/auth/students",
    element: <StudentForm />,
  },
  {
    path: "/auth/supervisors",
    element: <SupervisorForm />,
  },
  {
    path: "/auth/login",
    element: <LoginForm />,
  },

  {
    path: "/admin-dashboard",
    element: (
      // <ProtectedRoutes>
      <AdminDashboardLayout />
      // </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <Admin />,
      },
      {
        path: "assign-supervisors",
        element: <AssignSupervisor />,
      },
    ],
  },

  {
    path: "/supervisor-dashboard",
    element: (
      // <ProtectedRoutes>
      <SupervisorDashboardLayout />
      // </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <Supervisor />,
      },
    ],
  },

  {
    path: "/student-dashboard",
    element: <Students />,
  },


]);

const App: React.FC = () => {
  return (
    <>
      {/* <Toaster /> */}
      <RouterProvider router={router} />
    </>
  );
};

export default App;
