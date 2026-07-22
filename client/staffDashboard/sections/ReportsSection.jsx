import { ArrowLeftRight, FileBarChart2, Info, Landmark, PieChart, ShieldCheck, User, User2, Users } from 'lucide-react';
import React, { useState } from 'react'


const REPORT_TYPES = [
  { icon: FileBarChart2, title: "Financial Summary", desc: "Monthly income, expenses, net position" },
  { icon: Landmark, title: "Loan Portfolio", desc: "Active loans, defaults, repayment rates" },
  { icon: User, title: "Member Report", desc: "New members, churn, KYC status" },
  { icon: ArrowLeftRight, title: "Transaction Log", desc: "All transactions with audit trail" },
  { icon: PieChart, title: "Branch Performance", desc: "Volume and efficiency by branch" },
  { icon: ShieldCheck, title: "Compliance Report", desc: "Regulatory filings and risk flags" },
];

const ReportsSection = () => {

  const [notice, setNotice] = useState("");

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h1 className='text-xl font-bold text-gray-800'>Reports</h1>
        <p className='text-sm text-gray-500'>Generate and download reports</p>
      </div>

      {notice && (
        <div className='flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-700 text-sm rounded-2xl px-4 py-3'>
          <Info size={15} /> {notice}
        </div>
      )}

      <div className='grid grid-cols-3 gap-4'>
        {REPORT_TYPES.map((r) => (
          <button key={r.title} onClick={() => setNotice(`"${r.title}" isn't connected to a backend yet — no report-generation endpoint exists.`)}
            className='bg-emerald-50 rounded-2xl p-4 flex flex-col gap-2 text-left hover:bg-emerald-100/70 transition'
          >
            <div className='flex items-center justify-center w-9 h-9 rounded-lg bg-white'>
              <r.icon size={18} className='text-emerald-600' />
            </div>
            <p className='font-semibold text-gray-800 text-sm'>{r.title}</p>
            <p className='text-xs text-gray-500'>{r.desc}</p>
          </button>
        ))}
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-2 bg-emerald-50 rounded-2xl p-5'>
          <p className='font-bold text-gray-800 mb-3'>Recent Generated Reports</p>
          <p className='text-sm text-gray-400 text-center py-10'>No reports have been generated yet</p>
        </div>

        <div className='flex flex-col bg-amber-50 rounded-2xl p-5 gap-3'>
          <p className='font-bold text-gray-800'>Quick Links</p>
          <button 
            onClick={() => onNavigate?.("accounts")}
            className='flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition'
          >
            <Users size={16} className='text-amber-600' /> New account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsSection