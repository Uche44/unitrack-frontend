import Overview from "../../components/admin-overview";
import PendingSupervisorsList from "../../components/supervisor-list";
import ApprovedSupervisorsList from "../../components/approved-supervisors";
const Admin: React.FC = () => {
  return (
    <section className=" p-1  w-full min-h-screen">
      <h1 className="mt-12 text-3xl font-bold text-green-700">
        Welcome Admin!
      </h1>

      {/* overview */}
      <Overview />
      <PendingSupervisorsList />
      <ApprovedSupervisorsList />
    </section>
  );
};

export default Admin;
