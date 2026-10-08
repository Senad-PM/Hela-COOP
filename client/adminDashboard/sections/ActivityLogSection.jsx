import { useEffect, useMemo, useState } from 'react'
import { Search, Settings, ChevronLeft, ChevronRight, Download, TriangleAlert, Trash2, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { fetchActivityLogs } from '../../src/api/adminApi';
import { getInitials, getAvatarColor } from '../../src/utils/userDisplay';
import ActivityDetails from './ActivityDetails';

const rowsPerPage = 7;

const formatDate = (d) =>
  new Date(d).toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });

const actionColor = (action = "") => {
  const a = action.toLowerCase();
  if (/(delet|deactivat|reject|clear)/.test(a)) return "text-red-500";
  if (/(chang|updat|edit)/.test(a)) return "text-orange-500";
  if (/(approv|loan|disburs|repay)/.test(a)) return "text-blue-600";
  return "text-emerald-600";
};

const inTimeRange = (date, filter) => {
  if (filter === "All time") return true;
  const created = new Date(date);
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (filter === "Today") return created >= startOfDay;
  if (filter === "This week") {
    const start = new Date(startOfDay);
    start.setDate(start.getDate() - start.getDay());
    return created >= start;
  }
  if (filter === "This month") return created >= new Date(now.getFullYear(), now.getMonth(), 1);
  return true;
};

const ActivityLogSection = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [userFilter, setUserFilter] = useState("All users");
    const [actionFilter, setActionFilter] = useState("All actions");
    const [timeFilter, setTimeFilter] = useState("All time");
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
      fetchActivityLogs()
        .then((result) => {
          console.log("activity response:", result);
          if (!result || typeof result !== "object") {
            throw new Error("Unexpected response from /activity");
          }
          setLogs(Array.isArray(result) ? result : result.data || []);
        })
        .catch((err) =>
          setError(err.response?.data?.message || err.message || "Could not load the activity log.")
        )
        .finally(() => setLoading(false));
    }, []);

    const rows = useMemo(
      () =>
        logs
          .map((l) => ({
            id: l._id,
            date: l.createdAt,
            user: l.performedBy?.userName || "System",
            action: l.action || "-",
            ref: l.targetLabel || "-",
            activityNumber: l.activityNumber,
            entityType: l.entityType,
            entityId: l.entityId,
            description: l.description,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date)),
      [logs]
    );

    const userOptions = useMemo(() => [...new Set(rows.map((r) => r.user))].sort(), [rows]);
    const actionOptions = useMemo(() => [...new Set(rows.map((r) => r.action))].sort(), [rows]);

    const term = search.trim().toLowerCase();
    const filtered = rows.filter((r) =>
      (!term || r.user.toLowerCase().includes(term) || r.action.toLowerCase().includes(term) || r.ref.toLowerCase().includes(term)) &&
      (userFilter === "All users" || r.user === userFilter) &&
      (actionFilter === "All actions" || r.action === actionFilter) &&
      inTimeRange(r.date, timeFilter)
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const page = Math.min(currentPage, totalPages);
    const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    const from = filtered.length === 0 ? 0 : (page - 1) * rowsPerPage + 1;
    const to = Math.min(page * rowsPerPage, filtered.length);

    const firstPage = Math.max(1, Math.min(page - 2, totalPages - 4));
    const pageButtons = Array.from({ length: Math.min(5, totalPages) }, (_, i) => firstPage + i);

    const selectClass = "border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none bg-white text-gray-600";

    return (
      <div className="flex flex-col gap-5">

        <div className="bg-[#f5f0e8] flex items-start justify-between rounded-2xl px-6 py-4">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-gray-800">Activity Log</h1>
            <p className="text-sm text-gray-500 mt-0.5">Full System Activity History</p>
          </div>
          <div className="flex items-center gap-3 text-gray-500 pt-1">
            <Search size={14} className="cursor-pointer hover:text-gray-700 transition" />
            <Settings size={14} className="cursor-pointer hover:text-gray-700 transition" />
          </div>
        </div>

        <div className="bg-white/90 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 font-bold text-gray-800">
              <span>🗒</span> System activity log
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 border border-green-500 px-3 py-1.5 rounded-xl bg-white">
                <input type="search" placeholder="Search user, action or ref"
                  value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="bg-transparent outline-none text-xs w-40 text-gray-700 placeholder:text-gray-400" />
                <Search size={13} className="text-gray-400" />
              </div>
              <select value={userFilter} onChange={(e) => { setUserFilter(e.target.value); setCurrentPage(1); }} className={selectClass}>
                <option>All users</option>
                {userOptions.map((u) => <option key={u}>{u}</option>)}
              </select>
              <select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1); }} className={selectClass}>
                <option>All actions</option>
                {actionOptions.map((a) => <option key={a}>{a}</option>)}
              </select>
              <select value={timeFilter} onChange={(e) => { setTimeFilter(e.target.value); setCurrentPage(1); }} className={selectClass}>
                <option>All time</option>
                <option>Today</option>
                <option>This week</option>
                <option>This month</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            {loading ? (
              <p className="flex items-center justify-center gap-2 text-sm text-gray-400 py-8">
                <Loader2 size={14} className="animate-spin" /> Loading activity...
              </p>
            ) : error ? (
              <p className="text-center text-sm text-red-400 py-8">{error}</p>
            ) : paginated.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">No activity found</p>
            ) : (
              paginated.map((r, i) => (
                <div
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={`cursor-pointer grid grid-cols-4 px-4 py-3 rounded-xl items-center text-sm transition-colors duration-200 hover:bg-emerald-50 ${i % 2 === 0 ? "bg-amber-50/60" : "bg-stone-100/40"}`}
                >
                  <span className="text-xs text-gray-500">{formatDate(r.date)}</span>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full ${getAvatarColor(r.user)} text-white text-xs font-bold flex-shrink-0`}>
                      {getInitials(r.user)}
                    </div>
                    <span className="text-xs font-medium text-gray-700">{r.user}</span>
                  </div>
                  <span className={`text-xs font-semibold ${actionColor(r.action)}`}>{r.action}</span>
                  <span className="text-xs text-gray-500">{r.ref}</span>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
            <p className="text-xs text-gray-500">
              Showing {from}–{to} of {filtered.length} entries
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(Math.max(page - 1, 1))}
                disabled={page === 1}
                className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 text-xs disabled:opacity-40 hover:bg-gray-50">
                <ChevronLeft />
              </button>
              {pageButtons.map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={`flex items-center justify-center w-7 h-7 rounded-lg border text-xs transition ${
                    page === p ? "bg-[#0d1f1a] text-white border-[#0d1f1a]" : "border-gray-200 hover:bg-gray-50"
                  }`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setCurrentPage(Math.min(page + 1, totalPages))}
                disabled={page === totalPages}
                className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 text-xs disabled:opacity-40 hover:bg-gray-50">
                <ChevronRight />
              </button>
              <button className="flex items-center gap-1 ml-2 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-600 hover:text-gray-50 hover:bg-black transition">
                <Download /> CSV
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-2xl px-5 py-3 mt-1">
            <div className="flex items-center gap-2">
              <TriangleAlert size="14" className="text-red-500" />
              <div>
                <p className="text-xs font-semibold text-red-600">Danger zone</p>
                <p className="text-xs text-red-400">Clear all logs - cannot be undone</p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-xs text-red-500 border border-red-300 px-3 py-1.5 rounded-xl hover:bg-red-100 transition">
              <Trash2 /> Clear all logs
            </button>
          </div>

        </div>

        <AnimatePresence>
          {selected && (
            <ActivityDetails
              activity={selected}
              actionClass={actionColor(selected.action)}
              onClose={() => setSelected(null)}
            />
          )}
        </AnimatePresence>

      </div>
    );
}

export default ActivityLogSection