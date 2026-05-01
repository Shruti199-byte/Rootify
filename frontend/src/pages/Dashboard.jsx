import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get("/api/applications/my");
        setApps(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  if (loading) return <p className="p-6 text-white">Loading...</p>;

  // ⭐ Portfolio logic
  const completed = apps.filter((a) => a.status === "completed");

  const totalHours = completed.reduce(
    (sum, a) => sum + (a.hours_contributed || 0),
    0
  );

  const ngosWorked = [
    ...new Set(completed.map((a) => a.ngo_name)),
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {user?.full_name || user?.email}
      </h1>

      {/* 🔥 PORTFOLIO */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded">
          <h3 className="text-sm text-gray-400">Completed Work</h3>
          <p className="text-xl font-bold">{completed.length}</p>
        </div>

        <div className="bg-slate-800 p-4 rounded">
          <h3 className="text-sm text-gray-400">Total Hours</h3>
          <p className="text-xl font-bold">{totalHours}</p>
        </div>

        <div className="bg-slate-800 p-4 rounded">
          <h3 className="text-sm text-gray-400">NGOs Worked</h3>
          <p className="text-xl font-bold">{ngosWorked.length}</p>
        </div>
      </div>

      {/* Applications list */}
      {apps.map((app) => (
        <div
          key={app.id}
          className="bg-slate-800 p-4 mb-3 rounded flex justify-between"
        >
          <div>
            <h3>{app.opportunity_title}</h3>
            <p className="text-sm text-gray-400">
              NGO: {app.ngo_name}
            </p>
          </div>

          <div>
            <span>{app.status}</span>
            {app.status === "completed" && (
              <p className="text-xs text-gray-400">
                {app.hours_contributed} hrs
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}