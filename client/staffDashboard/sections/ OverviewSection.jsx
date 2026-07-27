import React, { useEffect, useState } from 'react'
import {Chart as ChartJs, CategoryScale, Filler, LineElement, LinearScale, PointElement, Tooltip} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { motion } from "motion/react";
import { fetchStaffDashboard } from '../../src/api/DashboardApi';
import { AlertTriangle, Clock, FileClock, ListTodo, Loader2, PiggyBank, TrendingUp, User2, UserPlus, Volume } from 'lucide-react'

ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);
const currency = (n) => `Rs . ${Number(n || 0).toLocaleString()}`

const dayLabel = (isoDate) => 
  new Date(isoDate).toLocaleDateString(undefined, {weekday: "short"});

const timeAgo = (dateString) => {
  if (!dateString) return "";
  const diffDays = Math.floor((Date.now() - new Date(dateString)) / 86400000);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`; 
};

const buildTaskFeed = (toDoTasks) => {
  if (!toDoTasks) return [];
  const pending = (toDoTasks.pendingLoan || []).map((l) => ({
    id: `loan-pending-${l._id}`,
    color: "bg-amber-500",
    title: `Review Loan #${l.loanNumber}`,
    subtitle: `${l.customer?.firstName || ""} ${l.customer?.lastName || ""} · ${currency(l.principalAmount)} · applied ${timeAgo(l.createdAt)}`,
  }));
  const overdue = (toDoTasks.overDueLoan || []).map((l) => ({
    id: `loan-overdue-${l._id}`,
    color: "bg-red-500",
    title: `Overdue Loan #${l.loanNumber}`,
    subtitle: `${l.customer?.firstName || ""} ${l.customer?.lastName || ""} · ${currency(l.principalAmount)} · due ${new Date(l.nextDueDate).toLocaleDateString()}`,
  }));
  const maturing = (toDoTasks.maturingFdDeposits || []).map((s) => ({
    id: `fd-${s._id}`,
    color: `bg-emerald-500`,
    title: `FD Maturing · #${s.accountNumber}`,
    subtitle: `${s.customer?.firstName || ""} ${s.customer?.lastName || ""} · ${currency(s.balance)} · matures ${new Date(s.maturityDate).toLocaleDateString()}`,
  }));
  return [...overdue, ...pending, ...maturing];
};

const VolumeChart = ({points}) => {
  const data = {
    labels: points.map((p) => dayLabel(p._id)),
    datasets: [
      {
        label: "Transaction volume",
        data: points.map((p) => p.totalVolume),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.12)",
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: "#2563eb",
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800, easing: "easeOutQuart" },
    plugins: {legend: {display: false}},
    scales: {
      x: {grid: {display: false}},
      y: {grid: {color: "#e5e7eb"}, ticks: {callback: (value) => {
        return `Rs. ${Number(value).toLocaleString()}`
      }}},
    },
  };
  return(
    <div className='h-40'>
      <Line data={data} options={options} />
    </div>
  );
};

const  OverviewSection = ({ onNavigate }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try{
        const result = await fetchStaffDashboard();
        //alert("Dashboard loaded");
        console.log("Dashboard Data:", result);
        console.log("Daily Transaction Volume:", result.dailyTransactionVolume);
        if (!cancelled) setDashboard(result);
      } catch (err){
        if (!cancelled) setError(err.response?.data?.message || "Could not load dashboard data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }) ();
    return () => { cancelled = true; };
  }, []);

  if (loading){
    return(
      <div className='flex items-center justify-center gap-2 text-gray-400 py-20'>
        <Loader2 size={18} className='animate-spin' /> Loading overview...
      </div>
    );
  }

  if (error) {
    return <div className='text-center text-red-500 py-20'>{error}</div>
  }

  const {
    overview = {},
    todaySummary = {},
    dailyTransactionVolume = [],
    toDoTasks = {},
  } = dashboard || {};

  const stats = [
    {icon: User2, label: "Customers", value: overview.customerCount, bg: "bg-sky-50", iconBg: "bg-sky-100", iconColor: "text-sky-600"},
    {icon: Clock, label: "Pending Loans", value: overview.pendingLoansCount, bg: "bg-amber-50", iconBg: "bg-amber-100", iconColor: "text-amber-600"},
    {icon: AlertTriangle, label: "Overdue Loans", value: overview.overDueLoanCount, bg: "bg-red-50", iconBg: "bg-red-100", iconColor: "text-red-600"},
    {icon: PiggyBank, label: "Total Savings Balance", value: currency(overview.totalSavingBalance), bg: "bg-emerald-50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600"},
  ];

  const summary = [
    {label: "New Customers", value: todaySummary.newCustomersCount},
    {label: "Deposits", value: todaySummary.todaysDepositCount},
    {label: "Withdrawals", value: todaySummary.todaysWithdrawlsCount},
    {label: "Loan Repayments", value: todaySummary.todaysLoanRepaymentCount},
    {label: "Loan Disbursements", value: todaySummary.todaysLoanDisbursementCount}, 
  ];

  const tasks = buildTaskFeed(toDoTasks);

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <div>
          <h1 className='text-xl font-bold text-gray-800'>Welcome back to Hela-COOP</h1>
          <p className='text-sm text-gray-500'>
            {new Date().toLocaleDateString(undefined, {weekday: "long", year: "numeric", month: "long", day: "numeric"})}
          </p>
        </div>

        <div className='grid grid-cols-4 gap-4 mt-5'>
          {stats.map((stat, i) => (
            <motion.div key={stat.label} 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`flex flex-col ${stat.bg} rounded-2xl p-4 gap-2 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className={`flex items-center justify-center w-9 h-9 rounded-full ${stat.iconBg}`}>
                <stat.icon size={18} className={stat.iconColor} />
              </div>
              <p className='text-2xl font-bold text-gray-800'>{stat.value}</p>
              <p className='text-xs text-gray-600'>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className='grid grid-cols-3 gap-4 mt-5'>
          <div className='col-span-2 bg-blue-50 rounded-2xl p-5'>
            <div className='flex items-center gap-2 font-bold text-gray-800 mb-3'>
              <TrendingUp size={18} /> Daily transaction volume
            </div>
            {dailyTransactionVolume.length === 0 ? (
              <p className='text-sm text-gray-400 py-10 text-center'>No transaction in the last 7 days</p>
            ) : (
              <VolumeChart points={dailyTransactionVolume} />
            )}
          </div>

          <div className='flex flex-col bg-emerald-50 rounded-2xl p-5 gap-3'>
            <div className='flex items-center gap-2 font-bold text-gray-800'>
              <ListTodo size={18} /> To-Do
            </div>
            <div className='flex flex-col gap-2 max-h-56 overflow-y-auto pr-1'>
              {tasks.length === 0 ? (
                <p className='text-sm text-gray-400 py-4 text-center'>Nothing pending - you're all caugth up.</p>
              ) : (
                tasks.map((task, i) => (
                  <motion.div key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className='flex items-start bg-white rounded-xl px-4 py-3 gap-3 hover:bg-gray-50 transition-colors'
                  >
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${task.color}`} />
                    <div>
                      <p className='text-sm font-semibold text-gray-800'>{task.title}</p>
                      <p className='text-xs text-gray-500'>{task.subtitle}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-4 mt-5'>
          <div className='col-span-2 bg-emerald-50 rounded-2xl p-5'>
            <div className='flex items-center gap-2 font-bold text-gray-800 mb-4'>
              <FileClock size={18} /> Today's summary
            </div>
            <div className='grid grid-cols-5 gap-4'>
              {summary.map((item) => (
                <div key={item.label}>
                  <p className='text-xs text-gray-500 mb-1'>{item.label}</p>
                  <p className='text-xl font-bold text-gray-800'>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='flex flex-col bg-amber-50 rounded-2xl p-5 gap-3'>
            <p className='font-bold text-gray-800'>Quick Links</p>
            <button onClick={() => onNavigate?.("accounts")}
              className='flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-150 hover:scale-105 active:scale-95'
            >
              <UserPlus size={16} className='text-amber-600' /> New Account
            </button>
            <button onClick={() => onNavigate?.("reports")}
              className='flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50'
            >
              <FileClock size={16} className='text-amber-600' /> System Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default  OverviewSection