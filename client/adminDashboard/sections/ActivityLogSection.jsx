import {useState} from 'react'
import { Search, Settings, ChevronLeft, ChevronRight, Download, TriangleAlert, Trash2 } from 'lucide-react';

const ActivityLogSection = () => {
    const[search, setSearch] = useState("");
    const[userFilter, setUserFilter] = useState("All users");
    const[actionFilter, setActionFilter] = useState("All actions");
    const[timeFilter, setTimeFilter] = useState("All time");
    const[currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 7;
  
    const logs = [
      { date: "2024-05-13 10:30", initials: "KA", color: "bg-emerald-700", user: "admin_kamal", action: "Added manager", actionColor: "text-emerald-600", ref: "nimal_s"  },
      { date: "2024-05-13 09:15", initials: "NS", color: "bg-violet-700", user: "Nimal_Shantha", action: "Approve loan", actionColor: "text-blue-600", ref: "L - 001"  },
      { date: "2024-05-13 08:45", initials: "AJ", color: "bg-amber-600", user: "Amali_Jayawardhana", action: "Added savings", actionColor: "text-emerald-600", ref: "M - 001"  },
      { date: "2024-05-12 16:30", initials: "KA", color: "bg-emerald-700", user: "admin_kamal", action: "Changed Permission", actionColor: "text-orange-500", ref: "amali_j"  },
      { date: "2024-05-12 14:20", initials: "KA", color: "bg-emerald-700", user: "admin_kamal", action: "Added staff", actionColor: "text-emerald-600", ref: "S - 001"  },
      { date: "2024-05-12 11:05", initials: "AJ", color: "bg-amber-600", user: "Amali_Jayawardhana", action: "Added loan payment", actionColor: "text-blue-600", ref: "nimal_s"  },
      { date: "2024-05-11 09:00", initials: "KA", color: "bg-emerald-700", user: "admin_kamal", action: "Delete staff", actionColor: "text-red-500", ref: "sarath_k" },
    ];
  
    const filtered = logs.filter((l) => {
      const matchSearch = l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase());
      const matchUser = userFilter === "All users" || l.user === userFilter;
      const matchAction = actionFilter === "All actions" || l.action === actionFilter;
      return matchSearch && matchUser && matchAction;
    });
  
    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  
    return (
      <div className="flex flex-col gap-5 pt-4 px-2">
  
        <div className="bg-[#f5f0e8] flex items-start justify-between rounded-2xl px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Activity Log</h1>
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
              <select value={userFilter} onChange={(e) => {setUserFilter(e.target.value); setCurrentPage(1);}}
                className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none bg-white text-gray-600"  
              >
                <option>All users</option>
                <option>admin_kamal</option>
                <option>Nimal_Shantha</option>
                <option>Amali_Jayawardhana</option>
              </select>
              <select value={actionFilter} onChange={(e) => {setActionFilter(e.target.value); setCurrentPage(1);}}
                className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none bg-white text-gray-600"  
              >
                <option>All actions</option>
                <option>Added manager</option>
                <option>Approve loan</option>
                <option>Added savings</option>
                <option>Changed permission</option>
                <option>Added staff</option>
                <option>Added loan payment</option>
                <option>Delete staff</option>
              </select>
              <select value={timeFilter} onChange={(e) => {setTimeFilter(e.target.value)}}
                className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none bg-white text-gray-600"  
              >
                <option>All time</option>
                <option>Today</option>
                <option>This week</option>
                <option>This month</option>
              </select>
            </div>
          </div>
  
          <div className="space-y-1">
            {paginated.map((logs, i) => (
              <div key={i} className={`grid grid-cols-4 px-4 py-3 rounded-xl items-center text-sm transition-colors duration-200 hover:bg-emerald-50 ${i % 2 == 0 ? "bg-amber-50/60" : "bg-stone-100/40}"}`}>
                <span className="text-xs text-gray-500">{logs.date}</span>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-7 h-7 rounded-full ${logs.color} text-white text-xs font-bold flex-shrink-0`}>
                    {logs.initials}
                  </div>
                  <span className="text-xs font-medium text-gray-700">{logs.user}</span>
                </div>
                <span className={`text-xs font-semibold ${logs.actionColor}`}>{logs.action}</span>
                <span className="tex-xs text-gray-500">{logs.ref}</span>
              </div>
            ))}
          </div>
  
          <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
            <p className="text-xs text-gray-500">
              Showing {Math.min((currentPage - 1) * rowsPerPage + 1, filtered.length)}–{Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length} entries
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 text-xs disabled:opacity-40 hover:bg-gray-50"  
              >
                <ChevronLeft />
              </button>
              {Array.from({length: totalPages}, (_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)}
                  className={`flex items-center justify-center w-7 h-7 rounded-lg border text-xs transition ${
                    currentPage === i + 1 ? "bg-[#0d1f1a] text-white border-[#0d1f1a]" : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}  
                className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 text-xs disabled:opacity-40 hover:bg-gray-50"
              >
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
  
      </div>
    );
}

export default ActivityLogSection