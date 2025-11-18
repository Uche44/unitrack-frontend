import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";
import StudentForm from "./pages/studentform";
import SupervisorForm from "./pages/supervisorform";
import LoginForm from "./pages/login";
import AdminDashboardLayout from "./dashboard-layout/admin-layout";
import Admin from "./pages/dashboard/admin";
import Students from "./pages/dashboard/students";
import Supervisor from "./pages/dashboard/supervisor";
import SupervisorDashboardLayout from "./dashboard-layout/supervisor-layout";

// import NotFound from "./components/NotFound";
// import { Toaster } from "./components/ui/sonner";

const router = createBrowserRouter([
  // 🔹 Public Routes
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

  // 🔹 Example Protected (Admin/User) Routes
  // {
  //   path: "/dashboard",
  //   element: (
  //     <ProtectedRoutes>
  //       <Dashboard />
  //     </ProtectedRoutes>
  //   ),
  //   children: [
  //     { index: true, element: <DashboardIndex /> },
  //     { path: "register-class", element: <RegisterClass /> },
  //     { path: "lesson/:id", element: <LessonPage /> },
  //   ],
  // },

  // 🔹 Example Auth Route
  // { path: "/register", element: <Register /> },

  // 🔹 Fallback 404
  // { path: "*", element: <NotFound /> },
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
