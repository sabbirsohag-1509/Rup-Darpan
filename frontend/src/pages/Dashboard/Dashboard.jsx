import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-[70vh] py-8">
      <div className="rounded-2xl border border-primary/15 bg-base-100 p-6 shadow-sm">
        <h1 className="font-playfair text-3xl font-semibold">
          Welcome, {user?.name} 👋
        </h1>

        <p className="mt-2 text-base-content/70">
          Welcome to your Rup Darpon dashboard.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;