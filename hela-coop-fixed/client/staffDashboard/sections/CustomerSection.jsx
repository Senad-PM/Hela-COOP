import React, { useEffect, useMemo, useState } from 'react'
import { Search, Pencil, TableProperties, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { fetchCustomers } from '../../src/api/customerApi';
import { SkeletonTable } from '../../components/Skeleton';
import EditCustomer from './EditCutomer';

const PAGE_SIZE = 6;

const STATUS_STYLE = {
  active: "border-green-500 text-green-600",
  dormant: "border-gray-400 text-gray-500",
  suspended: "border-red-400 text-red-500",
};

const formatJoined = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : "-";

const pageList = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("...");
    out.push(p);
  });
  return out;
};

const COLS = "grid-cols-[1fr_1.6fr_1.2fr_1.2fr_1fr_1.2fr_0.8fr]";

const CustomerSection = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");

  const loadCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchCustomers();
      setCustomers(Array.isArray(result) ? result : result.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCustomers(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase().includes(q) ||
      (c.NIC || "").toLowerCase().includes(q) ||
      (c.customerNumber || "").toLowerCase().includes(q) ||
      (c.phoneNumber || "").includes(q)
    );
  }, [customers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSaved = (updated) => {
    setCustomers((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
    setEditing(null);
    setToast("Customer details updated.");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h1 className='text-2xl font-serif font-semibold text-gray-800'>Customers</h1>
        <p className='text-sm text-gray-500 mt-1'>View and update member details</p>
      </div>

      {toast && (
        <div className='flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3'>
          <CheckCircle size={15} /> {toast}
        </div>
      )}

      <div className='bg-emerald-50 rounded-2xl p-5 border border-green-200'>
        <div className='flex items-center justify-between mb-4 flex-wrap gap-3'>
          <div className='flex items-center gap-2 font-bold text-gray-800'>
            <TableProperties size={18} /> Customer Directory
          </div>
          <div className='flex items-center gap-2 border border-green-500 px-3 py-1.5 rounded-xl bg-white'>
            <input type="search" placeholder='Search name, NIC or ID'
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className='bg-transparent outline-none text-sm w-48 text-gray-700 placeholder:text-gray-400' />
            <Search size={14} className='text-gray-400' />
          </div>
        </div>

        <div className={`grid ${COLS} px-4 py-2 text-xs font-bold uppercase text-gray-700 border-b-2 border-green-600`}>
          <span>Member ID</span>
          <span>Name</span>
          <span>NIC</span>
          <span>Phone</span>
          <span>Joined</span>
          <span>Status</span>
          <span />
        </div>

        <div>
          {loading ? (
            <SkeletonTable rows={6} cols={7} />
          ) : error ? (
            <p className='text-center text-sm text-red-400 py-8'>{error}</p>
          ) : visible.length === 0 ? (
            <p className='text-center text-sm text-gray-400 py-8'>No customers found</p>
          ) : (
            visible.map((c) => {
              const status = c.status || "active";
              return (
                <div key={c._id}
                  className={`grid ${COLS} px-4 py-4 items-center text-sm text-gray-700 border-b border-green-600/40 hover:bg-white/40 transition-colors`}>
                  <span>{c.customerNumber || "-"}</span>
                  <span className='font-medium'>{c.firstName} {c.lastName}</span>
                  <span>{c.NIC || "-"}</span>
                  <span>{c.phoneNumber || "-"}</span>
                  <span>{formatJoined(c.createdAt)}</span>
                  <span>
                    <span className={`inline-block w-24 text-center text-xs font-semibold border rounded-lg py-1 capitalize ${STATUS_STYLE[status] || STATUS_STYLE.active}`}>
                      {status}
                    </span>
                  </span>
                  <button onClick={() => setEditing(c)}
                    className='flex items-center justify-center gap-1 w-fit px-4 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold hover:bg-indigo-200 transition'>
                    <Pencil size={11} /> Edit
                  </button>
                </div>
              );
            })
          )}
        </div>

        {!loading && !error && filtered.length > 0 && (
          <div className='flex items-center justify-center gap-2 mt-5'>
            <button onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
              aria-label='Previous page' className='p-1 text-gray-500 disabled:opacity-30'>
              <ChevronLeft size={16} />
            </button>
            {pageList(currentPage, totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`gap-${i}`} className='text-gray-400 px-1'>...</span>
              ) : (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg border text-xs font-semibold transition ${
                    p === currentPage ? "border-green-600 text-green-700 bg-white" : "border-gray-300 text-gray-400 hover:border-green-400"
                  }`}>
                  {p}
                </button>
              )
            )}
            <button onClick={() => setPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
              aria-label='Next page' className='p-1 text-gray-500 disabled:opacity-30'>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <EditCustomer customer={editing} onClose={() => setEditing(null)} onSaved={handleSaved} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default CustomerSection