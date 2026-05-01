import { useEffect, useState } from "react";
import api from "../utils/api";

export default function ManageApplications() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApps = async () => {
        try {
            const res = await api.get("/api/applications/ngo");
            setApps(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApps();
    }, []);

    const updateStatus = async (id, status, hours = 0) => {
        try {
            await api.put(`/api/applications/${id}`, {
                status,
                hours_contributed: Number(hours) || 0,
            });

            fetchApps();
        } catch (err) {
            alert("Failed to update");
        }
    };

    if (loading) return <p className="p-6 text-white">Loading...</p>;

    return (
        <div className="max-w-5xl mx-auto p-6 text-white">
            <h1 className="text-2xl font-bold mb-6">Manage Applications</h1>

            {apps.length === 0 ? (
                <p>No applications yet.</p>
            ) : (
                apps.map((app) => (
                    <div
                        key={app.id}
                        className="bg-slate-800 p-4 mb-4 rounded-lg flex justify-between"
                    >
                        <div>
                            <h3 className="font-semibold">{app.opportunity_title}</h3>
                            <p className="text-sm text-gray-400">
                                {app.user_name} ({app.user_email})
                            </p>
                            <p className="text-xs text-gray-500">
                                NGO: {app.ngo_name}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm">{app.status}</span>

                            {/* PENDING → Accept/Reject */}
                            {app.status === "pending" && (
                                <>
                                    <button
                                        onClick={() => updateStatus(app.id, "accepted")}
                                        className="bg-green-600 px-3 py-1 rounded"
                                    >
                                        Accept
                                    </button>

                                    <button
                                        onClick={() => updateStatus(app.id, "rejected")}
                                        className="bg-red-600 px-3 py-1 rounded"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}

                            {/* ACCEPTED → Complete */}
                            {app.status === "accepted" && (
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Hours"
                                        className="w-20 text-black px-2"
                                        onChange={(e) =>
                                            (app.tempHours = e.target.value)
                                        }
                                    />

                                    <button
                                        onClick={() =>
                                            updateStatus(app.id, "completed", app.tempHours)
                                        }
                                        className="bg-blue-600 px-3 py-1 rounded"
                                    >
                                        Complete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}