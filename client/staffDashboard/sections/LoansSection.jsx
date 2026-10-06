import React, { useEffect, useState } from 'react'
import { disburseLoan, fetchLoanStats, fetchLoans } from '../../src/api/loansApi';
import { AlertTriangle, Clock, DollarSign, Landmark, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SkeletonStatGrid, SkeletonTable } from '../../components/Skeleton';
import AddLoan from './AddLoan';
import LoanSchedule from './LoanSchedule';


const currency = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;
const shortDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—");

const money2 = (n) =>
  `Rs. ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const GRID = "grid-cols-[1fr_1.5fr_1fr_1fr_1.6fr_1fr_0.9fr]";

const LoansSection = () => {

  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showAddLoan, setShowAddLoan] = useState(false);
  const [disbursingLoan, setDisbursingLoan] = useState(null);
  const [disburseError, setDisburseError] = useState("");
  const [disburseNotice, setDisburseNotice] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);

  const refresh = async () => {
    const [loanResult, statsResult] = await Promise.all([fetchLoans(), fetchLoanStats()]);
    setLoans(loanResult.data || []);
    setStats(statsResult);
  };

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
    return () => { cancelled = true; }
  }, []);

  const handleDisburse = async (loanNumber) => {
    setDisbursingLoan(loanNumber);
    setDisburseError("");
    setDisburseNotice("");
    const loan = loans.find((l) => l.loanNumber === loanNumber);
    try {
      await disburseLoan(loanNumber);
      await refresh();
      setDisburseNotice(`${loanNumber} disbursed — ${currency(loan?.principalAmount)} credited to the customer's savings account.`);
    } catch (err) {
      setDisburseError(err?.response?.data?.message || `Could not disburse ${loanNumber}.`);
    } finally {
      setDisbursingLoan(null);
    }
  };

  const filtered = loans.filter((l) => {
    const name = `${l.customer?.firstName || ""} ${l.customer?.lastName || ""}`.toLowerCase();
    return l.loanNumber.toLowerCase().includes(search.toLowerCase()) || name.includes(search.toLowerCase());
  });

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-serif font-semibold text-gray-800'>Loans</h1>
          <p className='text-sm text-gray-500 mt-1'>Active loans and applications</p>
        </div>
        <button
          onClick={() => setShowAddLoan(true)}
          className='px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition'
        >
          + New Loan Application
        </button>
          <AnimatePresence>
            {showAddLoan && (
              <AddLoan
                onClose={() => setShowAddLoan(false)}
                onCreated={refresh}
              />
            )}
          </AnimatePresence>
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

        <div className='grid grid-cols-7 gap-x-4 px-4 py-2 text-xs font-semibold uppercase text-gray-500 bg-white/60 rounded-xl mb-1'>
          <span>Loan ID</span>
          <span>Applicant</span>
          <span>Amount (Rs.)</span>
          <span>Monthly Installment</span>
          <span>Outstanding / Next Due</span>
          <span>Status</span>
          <span></span>
        </div>
        {disburseError && (
          <p className='text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-1'>{disburseError}</p>
        )}
        {disburseNotice && (
          <p className='text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 mb-1'>{disburseNotice}</p>
        )}

        <div className='max-h-96 overflow-y-auto space-y-1 pr-1'>
          {loading ? (
            <SkeletonTable rows={6} cols={6} />
          ) : error ? (
            <p className='text-center text-sm text-red-400 py-8'>{error}</p>
          ) : filtered.length === 0 ? (
            <p className='text-center text-sm text-gray-400 py-8'>No loans found</p>
          ) : (
            filtered.map((l, i) => (
              <div
                key={l._id}
                onClick={() => setSelectedLoan(l)}
                className={`cursor-pointer hover:bg-emerald-100/60 transition grid grid-cols-7 gap-x-4 px-4 py-3 rounded-xl items-center text-sm ${i % 2 === 0 ? "bg-white/70" : "bg-white/40"}`}
              >
                <span className='font-medium text-gray-800'>{l.loanNumber}</span>
                <span className='col-span-1 text-gray-700'>{l.customer?.firstName} {l.customer?.lastName}</span>
                <span className="text-gray-800">{currency(l.principalAmount)}</span>
                <span className='text-gray-800'>{l.status === "rejected" ? "—" : money2(l.monthlyInstallment)}</span>
                <span className='text-xs text-gray-600'>
                  <span className='block'>{currency(l.outstandingBalance)} outstanding</span>
                  <span className='block text-gray-400'>due {shortDate(l.nextDueDate)}</span>
                </span>
                <span className={`w-fit text-xs font-semibold rounded-full px-2.5 py-1 ${
                  l.isOverdue ? "bg-red-100 text-red-700" :
                  l.status === "active" ? "bg-emerald-100 text-emerald-700" :
                  l.status === "approved" ? "bg-sky-100 text-sky-700" :
                  l.status === "pending" ? "bg-amber-100 text-amber-700" :
                  l.status === "closed" ? "bg-gray-100 text-gray-600" :
                  "bg-red-100 text-red-700"
                }`}>
                  {(l.isOverdue ? "overdue" : l.status || "").toUpperCase()}
                </span>
                <span>
                  {l.status === "approved" && (
                    disbursingLoan === l.loanNumber ? (
                      <Loader2 size={14} className='animate-spin text-gray-400' />
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDisburse(l.loanNumber); }}
                        className='text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full px-3 py-1.5 transition'
                      >
                        Disburse
                      </button>
                    )
                  )}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      <AnimatePresence>
        {selectedLoan && (
          <LoanSchedule loan={selectedLoan} onClose={() => setSelectedLoan(null)} />
        )}
</AnimatePresence>
    </div>
  )
}

export default LoansSection