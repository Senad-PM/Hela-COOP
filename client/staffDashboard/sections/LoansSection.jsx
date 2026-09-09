import React, { useEffect, useState } from 'react'
import { fetchLoanStats, fetchLoans } from '../../src/api/loansApi';
import { AlertTriangle, Clock, DollarSign, Landmark, Search, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { SkeletonStatGrid, SkeletonTable } from '../../components/Skeleton';


const currency = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;
const shortDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—");

const LoansSection = () => {

  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try{
        const [loanResult, statsResult] = await Promise.all([fetchLoans(), fetchLoanStats()]);
        if (!cancelled) {
          setLoans(loanResult.data || []);
          setStats(statsResult);
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || "Could not load loans.")
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled =true; }
  }, []);

  const filtered = loans.filter((l) => {
    const name = `${l.customer?.firstName || ""} ${l.customer?.lastName || ""}`.toLowerCase();
    return l.loanNumber.toLowerCase().includes(search.toLowerCase()) || name.includes(search.toLowerCase());
  });

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h1 className='text-xl font-bold text-gray-800'>Loans</h1>
        <p className='text-sm text-gray-500'>Active loans and applications</p>
      </div>

      {loading ? (
        <SkeletonStatGrid count={4} cols={4} />
      ) : (
        <div className='grid grid-cols-4 gap-4'>
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0 }}
          whileHover={{ y: -4 }}
          className='flex items-center bg-emerald-50 rounded-2xl p-4 gap-3 shadow-sm hover:shadow-md transition-shadow'
        >
          <div className='flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100'>
            <Landmark size={16} className='text-emerald-600' />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{stats?.activeLoansCount ?? "—"}</p>
            <p className='text-xs text-gray-600'>Active Loan</p>
          </div>
        </motion.div>
        <div className='flex items-center bg-sky-50 rounded-2xl p-4 gap-3'>
          <div className='flex items-center justify-center w-10 h-10 rounded-full bg-sky-100'>
            <DollarSign size={16} className='text-sky-600' />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{currency(stats?.totalLoanPortfolio)}</p>
            <p className='text-xs text-gray-600'>Total Portfolio</p>
          </div>
        </div>
        <div className='flex items-center bg-amber-50 rounded-2xl p-4 gap-3'>
          <div className='flex items-center justify-center w-10 h-10 rounded-full bg-amber-100'>
            <Clock size={16} className='text-amber-600' />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{stats?.pendingLoansCount ?? "—"}</p>
            <p className='text-xs text-gray-600'>Pending Review</p>
          </div>
        </div>
        <div className='flex items-center bg-red-50 rounded-2xl p-4 gap-3'>
          <div className='flex items-center justify-center w-10 h-10 rounded-full bg-red-100'>
            <AlertTriangle size={16} className='text-red-600' />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{stats?.overdueLoansCount ?? "—"}</p>
            <p className='text-xs text-gray-600'>Overdue</p>
          </div>
        </div>
      </div>
      )}
      
      <div className='bg-emerald-50 rounded-2xl p-5 '>
        <div className='flex items-center justify-between mb-4 flex-wrap gap-3'>
          <p className='font-bold text-gray-800'>Loan Application</p>
          <div className='flex items-center gap-2 border border-green-500 px-3 py-1.5 rounded-xl bg-white'>
            <input type="search" placeholder='Search loan ID or applicant'
              value={search} onChange={(e) => setSearch(e.target.value)}
              className='bg-transparent outline-none text-sm w-52 text-gray-700 placeholder:text-gray-400'
            />
            <Search size={14} className='text-gray-400' />
          </div>
        </div>

        <div className='grid grid-cols-6 px-4 py-2 text-xs font-semibold uppercase text-gray-500 bg-white/60 rounded-xl mb-1'>
          <span>Loan ID</span>
          <span className='col-span-2'>Applicant</span>
          <span>Amount (Rs.)</span>
          <span>Outstanding / Next Due</span>
        </div>

        <div className='max-h-96 overflow-y-auto space-y-1 pr-1'>
          {loading ? (
            <SkeletonTable rows={6} cols={6} />
          ) : error ? (
            <p className='text-center text-sm text-red-400 py-8'>{error}</p>
          ) : filtered.length === 0 ? (
            <p className='text-center text-sm text-gray-400 py-8'>No loans found</p>
          ) : (
            filtered.map((l, i) => (
              <div key={l._id} className={`grid grid-cols-6 px-4 py-3 rounded-xl items-center text-sm ${i % 2 === 0 ? "bg-white/70" : "bg-white/40"}`}>
                <span className='font-medium text-gray-800'>{l.loanNumber}</span>
                <span className='col-span-2 text-gray-700'>{l.customer?.firstName} {l.customer?.lastName}</span>
                <span className="text-gray-800">{currency(l.principalAmount)}</span>
                <span className='text-xs text-gray-600'>{currency(l.outstandingBalance)} outstanding · due {shortDate(l.nextDueDate)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default LoansSection