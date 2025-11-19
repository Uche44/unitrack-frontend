import Overview from "../../../components/overview";
import PendingSupervisorsList from "../../../components/supervisor-list";
import ApprovedSupervisorsList from "../../../components/approved-supervisors";
import { Users, GraduationCap, FolderKanban } from "lucide-react";
const Admin: React.FC = () => {
  const overviewData = [
    {
      label: "Supervisors",
      value: 230,
      icon: Users,
      bg: "bg-blue-100 dark:bg-blue-900",
      circleBg: "bg-blue-200 dark:bg-blue-800",
    },
    {
      label: "Students",
      value: 2300,
      icon: GraduationCap,
      bg: "bg-green-100 dark:bg-green-900",
      circleBg: "bg-green-200 dark:bg-green-800",
    },
    {
      label: "Projects",
      value: 2300,
      icon: FolderKanban,
      bg: "bg-yellow-100 dark:bg-yellow-900",
      circleBg: "bg-yellow-200 dark:bg-yellow-800",
    },
  ];

  return (
    <section className=" p-1  w-full min-h-screen">
      <h1 className="mt-12 text-3xl font-bold text-green-700">
        Welcome Admin!
      </h1>

      {/* overview */}
      <Overview data={overviewData} />
      <PendingSupervisorsList />
      <ApprovedSupervisorsList />
    </section>
  );
};

export default Admin;
