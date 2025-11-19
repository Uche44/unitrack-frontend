import { useUserStore } from "../../../context/user-context";
import Overview from "../../../components/overview";
import { FolderCheck, GraduationCap, FolderKanban } from "lucide-react";

const Supervisor: React.FC = () => {
  const user = useUserStore((state) => state.user);

  const supervisorOverviewData = [
    {
      label: "Assigned Students",
      value: 15,
      icon: GraduationCap,
      bg: "bg-green-100 dark:bg-green-900",
      circleBg: "bg-green-200 dark:bg-green-800",
    },
    {
      label: "Projects",
      value: 15,
      icon: FolderKanban,
      bg: "bg-yellow-100 dark:bg-yellow-900",
      circleBg: "bg-yellow-200 dark:bg-yellow-800",
    },
    {
      label: "Projects Completed",
      value: 5,
      icon: FolderCheck,
      bg: "bg-blue-100 dark:bg-blue-900",
      circleBg: "bg-blue-200 dark:bg-blue-800",
    },
  ];

  return (
    <section className="w-full min-h-screen">
      <h1 className="mt-12 text-3xl font-bold text-green-700">
        Welcome Sp. {user?.fullname}!
      </h1>
      <Overview data={supervisorOverviewData} />
    </section>
  );
};

export default Supervisor;
