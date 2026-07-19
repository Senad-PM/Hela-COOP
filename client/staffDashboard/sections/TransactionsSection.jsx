import React, { useEffect, useState } from 'react'
import { fetchTransactions } from '../../src/api/transactionsApi';
import { ArrowDownCircle, ArrowLeftRight, ArrowUpCircle, Search, Loader2, Wallet } from 'lucide-react';

const currency = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;
const dateTime = (d) => new Date(d).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
const isToday = (d) => new Date(d).toDateString() === new Date().toDateString();

const TYPE_STYLES = {
  deposit: "bg-emerald-100 text-emerald-600",
  withdraw: "bg-amber-100 text-amber-600",
  interest: "bg-sky-100 text-sky-600",
  loanDistribute: "bg-purple-100 text-purple-600",
  loanAccountOpening: "bg-purple-100 text-purple-600",
  loanRepayment: "bg-teal-100 text-teal-600",
};

const TransactionsSection = () => {

  const [transactions, setTransaction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");

  useEffect(() => {
    let cancelled = false;
    (async() => {
      setLoading(true);
      setError("");
      try{
        const result = await fetchTransactions();
        if (!cancelled) setTransaction(result.data || []);
      } catch (err){
        if (!cancelled) setError(err.response?.data?.message || "Could not load transactions.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return() => { cancelled = true; };
  }, []);

  const todaysCount = transactions.filter((t) => isToday(t.createdAt)).length;
  const totalVolume = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const depositCount = transactions.filter((t) => t.transactionType === "deposit").length;
  const withdrawCount = transactions.filter((t) => t.transactionType === "withdraw").length;

  const typeOptions = ["All types", ...new Set(transactions.map((t) => t.transactionType))];

  const filtered = transactions.filter((t) => {
    const matchSearch = t.transactionNumber.toLowerCase().includes(search.toLowerCase()) || t.accountNumber.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All types" || t.transactionType === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h1 className='text-xl font-bold text-gray-800'>Transactions</h1>
        <p className='text-sm text-gray-500'>All Transaction History (most recent 200)</p>
      </div>

      <div className='grid grid-cols-4 gap-4'>
        <div className='flex items-center bg-sky-50 rounded-2xl p-4 gap-3'>
          <div className='flex items-center justify-center w-10 h-10 rounded-full bg-sky-100'>
            <ArrowLeftRight size={18} className='text-sky-600' />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{todaysCount}</p>
            <p className='text-xs text-gray-600'>Today's Transactions</p>
          </div>
        </div>
        <div className='flex items-center bg-blue-50 rounded-2xl p-4 gap-3'>
          <div className='flex items-center justify-center w-10 h-10 rounded-full bg-blue-100'>
            <Wallet size={18} className='text-blue-600' />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{currency(totalVolume)}</p>
            <p className='text-xs text-gray-600'>Total Volume</p>
          </div>
        </div>
        <div className='flex items-center bg-emerald-50 rounded-2xl p-4 gap-3'>
          <div className='flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100'>
            <ArrowDownCircle size={18} className='text-emerald-600' />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{depositCount}</p>
            <p className='text-xs text-gray-600'>Deposits</p>
          </div>
        </div>
        <div className='flex items-center bg-amber-50 rounded-2xl p-4 gap-3'>
          <div className='flex items-center justify-center w-10 h-10 rounded-full bg-amber-100'>
            <ArrowUpCircle size={18} className='text-amber-600' />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{withdrawCount}</p>
            <p className='text-xs text-gray-600'>Withdrawals</p>
          </div>
        </div>
      </div>

      <div className='bg-emerald-50 rounded-2xl p-5'>
        <div className='flex items-center justify-between mb-4 flex-wrap gap-3'>
          <p className='font-bold text-gray-800'>Recent Activities</p>
          <div className='flex items-center gap-2 flex-wrap'>
            <div className='flex items-center gap-2 border border-gray-500 px-3 py-1.5 rounded-xl bg-white'>
              <input type="search" value={search} placeholder='Search reference or accounts'
                onChange={(e) => setSearch(e.target.value)}
                className='bg-transparent outline-none text-sm w-48 text-gray-700 placeholder:text-gray-400'
              /><Search size={14} className='text-gray-400' />
            </div>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className='border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none bg-white text-gray-600 capitalize'
            >
              {typeOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div className='grid grid-cols-6 px-4 py-2 text-xs font-semibold uppercase text-gray-500 bg-white/60 rounded-xl mb-1'>
          <span>Time</span>
          <span>Reference Number</span>
          <span>Type</span>
          <span>Account</span>
          <span>Ammount (Rs.)</span>
          <span>Performed By</span>
        </div>

        <div className='max-h-96 overflow-y-auto space-y-1 pr-1'>
          {loading ? (
            <p className='flex items-center justify-center gap-2 text-sm text-gray-400 py-8'>
              <Loader2 size={16} className='animate-spin' /> Loading transactions...
            </p>
          ) : error ? (
            <p className='text-center text-sm text-red-400 py-8'>{error}</p>
          ) : filtered.length === 0 ? (
            <p className='text-center text-sm text-gray-400 py-8'>No transactions found</p>
          ) : (
            filtered.map((t, i) => (
              <div key={t._id} className={`grid grid-cols-6 px-4 py-3 rounded-xl items-center text-sm ${i % 2 === 0 ? "bg-white/70" : "bg-white/40"}`}>
                <span className='font-medium text-gray-800'>{dateTime(t.createdAt)}</span>
                <span className='col-span-2 text-gray-700'>{t.transactionNumber}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit capitalize ${TYPE_STYLES[t.transactionType] || "bg-gray-100 text-gray-600"}`}>{t.transactionType}</span>
                <span className='text-gray-600'>{t.accountNumber}</span>
                <span className='text-gray-800'>{currency(t.amount)}</span>
                <span className='text-gray-600'>{t.performedBy?.userName || "—"}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default TransactionsSection