import React, { useEffect, useState } from "react";
import AdminLayout from "./adminLayout";
import { getActivityLog } from "../../api/adminAPI";
import { useSearchParams } from "react-router-dom";
import { FaHistory } from "react-icons/fa";

function Activity() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getActivityLog(token);
        console.log(res);
        setActivity(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get badge color based on action type
//   const getActionBadgeColor = (action) => {
//     if (action.includes("created") || action.includes("Created"))
//       return "bg-green-500/20 text-green-400 border-green-500/30";
//     if (action.includes("deleted") || action.includes("Deleted"))
//       return "bg-red-500/20 text-red-400 border-red-500/30";
//     if (action.includes("updated") || action.includes("Updated"))
//       return "bg-blue-500/20 text-blue-400 border-blue-500/30";
//     if (action.includes("approved") || action.includes("Approved"))
//       return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
//     if (action.includes("rejected") || action.includes("Rejected"))
//       return "bg-red-500/20 text-red-400 border-red-500/30";
//     return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
//   };

  // Format timestamp
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <AdminLayout activeTab="activity">
      <div className="p-8 space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
              <FaHistory className="text-indigo-400 text-lg" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              System Audit Log
            </h1>
          </div>
          <p className="text-slate-400 text-sm ml-11">
            Comprehensive chronological record of security actions and platform
            operations.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white  border border-black rounded-xl p-4">
            <p className="text-xs text-black uppercase tracking-wider">
              Total Events
            </p>
            <h3 className="text-2xl font-bold text-black mt-1">
              {activity.length}
            </h3>
          </div>

        </div>

        {/* Activity Log Container */}
        <div className="bg-[#F5F5F5] from-slate-900/50 to-slate-800/50 border  border-slate-700/50 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Activity Timeline
              </h2>
              <span className="ml-auto text-xs text-slate-500">
                {activity.length} events
              </span>
            </div>
          </div>

          {/* Activity List */}
          <div className="px-15 py-10 text-black space-y-0 max-h-[calc(100vh-400px)] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block">
                    <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-black text-sm mt-3">Loading activity...</p>
                </div>
              </div>
            ) : activity.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-2">
                  <p className="text-slate-400 text-sm font-medium">
                    No activity logged yet
                  </p>
                  <p className="text-slate-500 text-xs">
                    System activity will appear here
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                {activity.map((log, index) => (
                  <div
                    key={index}
                    className="group  relative py-4 border-l-2 border-slate-700/50  transition-all -ml-6 pl-6 pr-6"
                  >
                    {/* Dot marker on timeline */}
                    <div className="absolute left-0 top-5 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-700 border-2 border-slate-800  transition-all"></div>

                    {/* Main Log Entry */}
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        {/* Action Title */}
                        <p className="text-sm leading-relaxed text-slate-200">
                          <span className="font-semibold text-black">
                            {log.full_name || "System"}
                          </span>
                          <span className="text-green-500 mx-2">•</span>
                          <span className="text-black">
                            {log.action}
                          </span>
                        </p>

                        {/* Target Badge */}
                        {log.target_type && (
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border `}
                            >
                              <span className="opacity-70">
                                {log.target_type}
                              </span>
                              <span className="font-mono font-semibold">
                                #{log.target_id}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs font-medium text-indigo-400">
                          {formatTime(log.created_at)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(log.created_at).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Activity;