import React, { useEffect, useState } from 'react'
import { fetchSavingsAccounts } from '../../src/api/accountsApi';
import { CreditCard, DollarSign, Loader2, TrendingUp, User } from 'lucide-react';
import { Chart as ChartJs, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJs.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip);

const currency = (n) => `Rs. ${Number (n || 0).toLocaleString()}`;

const initials = (person) => {
  const name = `${person?.firstName || ""} ${person?.lastName || ""}`.trim();
  return name ? name.split(" ").map((p) => p[0]).join("").toUpperCase() : "?";
};

const fullName = (person) => `${person?.firstName || ""} ${person?.lastName || ""}`.trim() || "Unknown";

const getStatus = (account) => {
  if (!account.isActive) return "Dormant";
  if (account.accountType === "fixed" && !account.isMatured && account.maturityDate) {
    const daysLeft = (new Date(account.maturityDate) - new Date()) / (1000 * 60 * 60 * 24);
    if (daysLeft <= 30) return "Maturing"
  }
  return "Active";
};

const statusStyle = {
  Active: "bg-emerald-100 text-emerald-700",
  Maturing: "bg-amber-100 text-amber-700",
  Dormant: "bg-red-100 text-red-700",
};

const getMonthlyNewAccounts = (accounts) => {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString(undefined, { month: "short" }), count: 0 });
  }
  accounts.forEach((accounts) => {
    const created = new Date(accounts.createdAt);
    const key = `${created.getFullYear()}-${created.getMonth()}`;
    const month = months.find((m) => m.key === key);
    if (month) month.count += 1;
  });
  return months;
}

const AccountsSection = () => {

  const [accounts, setAccounts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSavingsAccounts()
      .then((result) => {
        setAccounts(result.data || []);
        setTotal(result.total || 0);
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load accounts."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return(
      <div className='flex items-center justify-center gap-2 text-gray-400 py-20'>
        <Loader2 size={18} className='animate-spin' /> Loading accounts...
      </div>
    );
  }

  if (error) {
    return <div className='text-center text-red-500 py-20'>{error}</div>
  }

  const savingsAccount = accounts.filter((a) => a.accountType === "regular");
  const fixedAccount = accounts.filter((a) => a.accountType === "fixed");

  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const newThisMonth = accounts.filter((a) => new Date(a.createdAt) >= startOfMonth).length;

  const kpiCards = [
    {icon: User, label: "Total Accounts", value: total},
    {icon: DollarSign, label: "Saving Accounts", value: savingsAccount.length},
    {icon: CreditCard, label: "Fixed Deposit Accounts", value: fixedAccount.length},
    {icon: TrendingUp, label: "New Accounts This Month", value: newThisMonth},
  ];

  const doughnutData = {
    labels: ["Savings", "Fixed Deposit"],
    datasets: [{
      data: [savingsAccount.length, fixedAccount.length],
      backgroundColor: ["#4d7c0f", "#b45309"],
      borderWidth: 0,
    }],
  };

  const monthlyNew = getMonthlyNewAccounts(accounts);
  const barData = {
    labels: monthlyNew.map((m) => m.label),
    datasets: [{
      data: monthlyNew.map((m) => m.count),
      backgroundColor: "#a3e635",
      borderWidth: 4,
    }],
  };

  const visibleAccounts = accounts
  .filter((a) => tab === "all" || a.accountType === tab)
  .filter((a) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return a.accountNumber.toLowerCase().includes(term) || fullName(a.customer).toLowerCase().includes(term);
  });

  return (
    <div className='flex flex-col gap-5'>

      <div>
        <h1 className='text-2xl font-serif font-semibold text-gray-800'>Accounts</h1>
        <p className='text-sm text-gray-500 mt-1'>Manage Savings, fixed deposit, & current accounts</p>
      </div>

      <div className='grid grid-cols-4 gap-4'>
        {kpiCards.map((card) => (
          <div key={card.label} className='bg-white rounded-2xl p-4 shadow-sm'>
            <div className='flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 mb-3'>
              <card.icon size={18} className='text-gray-600' />
            </div>
            <p className='text-xs text-gray-500'>{card.label}</p>
            <p className='text-2xl font-bold text-gray-800 mt-1'>{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className='font-serif font-semibold text-lg text-gray-800 mb-3'>Account Insights</h2>
        <div className='grid grid-cols-2 gap-4'>
          <div className='bg-white rounded-2xl p-5 shadow-sm flex items-center gap-6'>
            <div className='w-40 h-40 flex-shrink-0'>
              <Doughnut data = {doughnutData} options={{ plugins: { legend: { display: false } }, cutout: "70%"}} />
            </div>
            <div className='flex flex-col gap-2'>
              <p className='font-semibold text-gray-800 mb-1'>Account Type Split</p>
              <div className='flex items-center gap-2 text-sm'>
                <span className='w-2.5 h-2.5 rounded-full bg-[#4d7c0f]' /> Savings
                <span className='ml-auto font-semibold'>{savingsAccount.length}</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <span className='w-2.5 h-2.5 rounded-full bg-[#b45309]' /> Fixed Deposit
                <span className='ml-auto font-semibold'>{fixedAccount.length}</span>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-2xl p-5 shadow-sm'>
            <p className='font-semibold text-gray-800 mb-2'>New Accounts Opened</p>
            <div className='h-44'>
              <Bar data={barData} options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { grid: { display: false } }, y: { grid: { color: "#eef0ea" } } },
              }} />
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-2xl p-5 shadow-sm'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex gap-2'>
            {[["all", "All"], ["regular", "Savings"], ["fixed", "Fixed Deposit"]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`text-sm font-semibold px-4 py-1.5 rounded-full ${tab === key ? "bg-lime-500 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                {label}
              </button>
            ))}
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search by name or account no.'
              className='text-sm border border-gray-200 rounded-full px-4 py-1.5 outline-none focus:border-lime-400 w-64'
            />
        </div>

        <table className='w-full text-sm'>
          <thead>
              <tr className='text-left text-gray-400 text-xs'>
                  <th className='font-medium pb-2'>Account No</th>
                  <th className='font-medium pb-2'>Customer</th>
                  <th className='font-medium pb-2'>Type</th>
                  <th className='font-medium pb-2'>Balance</th>
                  <th className='font-medium pb-2'>Status</th>
                  <th className='font-medium pb-2'>Opened</th>
              </tr>
          </thead>
          <tbody>
            {visibleAccounts.map((account) => {
              const status = getStatus(account);
              return (
                <tr key={account._id} className='border-t border-gray-100'>
                  <td className='py-2.5 font-medium text-gray-700'>{account.accountNumber}</td>
                  <td className='py-2.5'>
                    <div className='flex items-center gap-2'>
                      <span className='w-6 h-6 flex items-center justify-center rounded-full bg-lime-50 text-lime-700 text-[10px] font-semibold'>
                        {initials(account.customer)}
                      </span>
                      {fullName(account.customer)}
                    </div>
                  </td>
                  <td className='py-2.5 text-gray-600'>{account.accountType === "fixed" ? "Fixed Deposit" : "Savings"}</td>
                  <td className='py-2.5 font-medium text-gray-800'>{currency(account.balance)}</td>
                  <td className='py-2.5'>
                    <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${statusStyle[status]}`}>{status.toUpperCase()}</span>
                  </td>
                  <td className='py-2.5 text-gray-500'>
                    {new Date(account.createdAt).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visibleAccounts.length === 0 && (
          <p className='text-sm text-gray-400 text-center py-8'>No accounts match this filter.</p>
        )}

      </div>

    </div>
  )
}

export default AccountsSection