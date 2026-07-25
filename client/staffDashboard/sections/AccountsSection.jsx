import React, { useEffect, useState } from 'react'
import { fetchSavingsAccounts } from '../../src/api/accountsApi';
import { Loader2, Search, User, UserCheck, UserPlus, UserX } from 'lucide-react';
import AddAccounts from './AddAccounts';


const currency = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;
const shortDate = (d) => new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short" });

const AccountsSection = () => {

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [showAddModal, setShowAddModal] = useState(false);

  const loadAccounts = async () => {
    setLoading(true);
    setError("");
    try{
      const result = await fetchSavingsAccounts();
      setAccounts(result.data || []);
    } catch (err){
      setError(err.response?.data?.message || "Could not load accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const total = accounts.length;
  const active = accounts.filter((a) => a.isActive).length;
  const inactive = total - active;

  const filtered = accounts.filter((a) => {
    const name = `${a.customer?.firstName || ""} ${a.customer?.lastName || ""}`.toLowerCase();
    const matchSearch = a.accountNumber.toLowerCase().includes(search.toLowerCase()) || name.includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Status" || (statusFilter === "Active" ? a.isActive : !a.isActive);
    const matchType = typeFilter === "All Types" || a.accountType === typeFilter.toLowerCase();
    return matchSearch && matchStatus && matchType;
  });

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-bold text-gray-800'>Accounts</h1>
            <p className='text-sm text-gray-500'>Manage all members savings accounts</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className='flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#245a41] transition'>
            <UserPlus size={15} />New Account
          </button>
        </div>
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <div className='flex items-center bg-emerald-50 rounded-2xl p-4 gap-3'>
          <div className='w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center'>
            <User size={18} className='text-emerald-600' />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{total}</p>
            <p className='text-xs text-gray-600'>Total Accounts</p>
          </div>
        </div>
        <div className='flex items-center bg-sky-50 rounded-2xl p-5 gap-3'>
          <div className='w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center'>
            <UserCheck size={18} className='text-sky-600' />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{active}</p>
            <p className='text-xs text-gray-600'>Active</p>
          </div>
        </div>
        <div className='flex items-center bg-red-50 rounded-2xl p-5 gap-3'>
          <div className='w-10 h-10 rounded-full bg-red-100 flex items-center justify-center'>
            <UserX size={18} className='text-red-600' />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{inactive}</p>
            <p className='text-xs text-gray-600'>Inactive</p>
          </div>
        </div>
      </div>

      <div className='bg-emerald-50 rounded-2xl p-5'>
        <div className='flex items-center justify-between mb-4 flex-wrap gap-3'>
          <p className='font-bold text-gray-800'>Account List</p>
          <div className='flex items-center gap-2 flex-wrap'>
            <div className='flex items-center gap-2 border border-green-500 px-3 py-1.5 rounded-xl bg-white'>
              <input type="search" placeholder='Search Name or Account ID'
                value={search} onChange={(e) => setSearch(e.target.value)}
                className='bg-transparent outline-none text-sm w-44 text-gray-700 placeholder:text-gray-400'
              />
              <Search size={14} className='text-gray-400' />
            </div>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className='border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none bg-white text-gray-600'>
                <option>All Types</option>
                <option>Regular</option>
                <option>Fixed</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className='border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none bg-white text-gray-600'>
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className='grid grid-cols-6 px-4 py-2 text-xs font-semibold uppercase text-gray-500 bg-white/60 rounded-xl mb-1'>
          <span>Account ID</span>
          <span className='col-span-2'>Member Name</span>
          <span>Type</span>
          <span>Balance (Rs.)</span>
          <span>Status</span>
        </div>

        <div className='max-h-96 overflow-y-auto space-y-1 pr-1'>
          {loading ? (
            <p className='flex items-center justify-center gap-2 text-sm text-gray-400 py-8'>
              <Loader2 size={16} className='animate-spin' /> Loading accounts...
            </p>
          ) : error ? (
            <p className='text-center text-sm text-red-400 py-8'>{error}</p>
          ) : filtered.length === 0 ? (
            <p className='text-center text-sm text-gray-400 py-8'>No accounts found</p>
          ) : (
            filtered.map((a, i) => (
              <div key={a._id} className={`grid grid-cols-6 px-4 py-3 rounded-xl items-center text-sm ${i % 2 === 0 ? "bg-white/70" : "bg-white/40"}`}>
                <span className='font-medium text-gray-800'>{a.accountNumber}</span>
                <span className='col-span-2 text-gray-700'>{a.customer?.firstName} {a.customer?.lastName}</span>
                <span className='capitalize text-gray-600'>{a.accountType}</span>
                <span className='text-gray-800'>{currency(a.balance)}</span>
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium w-fit ${a.isActive ? "bg-emerald-100 text-emerald-600" : "bg-gray-200 text-gray-500"}`}>
                  {a.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddModal && (
        <AddAccounts onClose={() => setShowAddModal(false)}
          onCreated={loadAccounts}
        />
      )}
    </div>
  )
}

export default AccountsSection