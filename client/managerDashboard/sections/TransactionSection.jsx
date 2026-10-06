import { ArrowUpRight, DollarSign, Loader2, Repeat, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Chart as ChartJS, CategoryScale, Filler, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { fetchTransactions } from '../../src/api/transactionsApi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const currency = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

const compactCurrency = (n) => {
    const value = Number(n || 0);
    if (value >= 1_000_000) return `Rs. ${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `Rs. ${(value / 1_000).toFixed(1)}K`;
    return `Rs. ${value.toLocaleString()}`;
};

const fullName = (person) => `${person?.firstName || ""} ${person?.lastName || ""}`.trim() || "Unknown";
const initials = (person) => {
    const name = fullName(person);
    return name === "Unknown" ? "?" : name.split(" ").map((p) => p[0]).join("").toUpperCase();
};

const txCustomer = (tx) => tx?.savingsAccount?.customer || tx?.loanAccount?.customer || null;

const Type = {
    deposit: { label: "DEPOSIT", tab: "deposit", className: "bg-emerald-100 text-emerald-700"},
    withdraw: { label: "WITHDRAWAL", tab: "withdraw", className: "bg-red-100 text-red-700"},
    LoanDistribute: { label: "DISBURSEMENT", tab: "loanDistribute", className: "bg-amber-100 text-amber-700"},
    loanRepayment: { label: "REPAYMENT", tab: "loanRepayment", className: "bg-sky-100 text-sky-700"},
    interest: { label: "INTEREST", tab: "interest", className: "bg-gray-100 text-gray-700"},
    loanAccountOpening: { label: "ACCOUNT OPEN", tab: "loanAccountOpening", className: "bg-gray-100 text-gray-700"},
};

const getMonthlyCashFlow = (transactions) => {
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString(undefined, { month: "short" }), deposits: 0, withdrawals: 0 });
    }
    transactions.forEach((tx) => {
        const created = new Date(tx.createdAt);
        const key = `${created.getFullYear()}-${created.getMonth()}`;
        const month = months.find((m) => m.key === key);
        if (!month) return;
        if (tx.transactionType === "deposit") month.deposits += tx.amount;
        if (tx.transactionType === 'withdraw') month.withdrawals += tx.amount;
    });
    return months;
}

const TransactionSection = () => {

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tab, setTab] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchTransactions()
            .then((result) => setTransactions(result.data || []))
            .catch((err) => setError(err.response?.data?.message || "Could not load transactions."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className='flex items-center justify-center gap-2 text-gray-400 py-20'>
                <Loader2 size={18} className='animate-spin' /> Loading transactions...
            </div>
        );
    }

    if (error) {
        return <div className='text-center text-red-500 py-20'>{error}</div>;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const todaysTransactions = transactions.filter((t) => new Date(t.createdAt) >= today).length;

    const sumThisMonth = (type) => transactions
        .filter((t) => t.transactionType === type && new Date(t.createdAt) >= startOfMonth)
        .reduce((sum, t) => sum + t.amount, 0);
    
    const depositsMTD = sumThisMonth("deposit");
    const withdrawalsMTD = sumThisMonth("withdraw");
    const netCashFlow = depositsMTD - withdrawalsMTD;

    const cards = [
        { icon: Repeat, label: "Todays Transactions", value: todaysTransactions.toLocaleString() },
        { icon: DollarSign, label: "Deposits (MTD)", value: compactCurrency(depositsMTD) },
        { icon: ArrowUpRight, label: "Withdrawals (MTD)", value: compactCurrency(withdrawalsMTD)  },
        { icon: TrendingUp, label: "Net Cash Flow", value: `${netCashFlow >= 0 ? "+" : ""}${compactCurrency(netCashFlow)}` },
    ];

    const monthly = getMonthlyCashFlow(transactions);
    const chartData = {
        labels: monthly.map((m) => m.label),
        datasets: [
            { label: "Deposits", data: monthly.map((m) => m.deposits), boderColor: "#16a34a", backgroundColor: "rgba(22,163,74,0.12)", fill: true, tension: 0.35, pointRadius: 3 },
            { label: "Withdrawals", data: monthly.map((m) => m.withdrawals), borderColor: "#b91c1c", backgroundColor: "rgba(185,28,28,0.10)", fill: true, tension: 0.35, pointRadius: 3 },
        ],
    };

    const tabs = [
        ["all", "All"], ["deposit", "Deposits"], ["withdraw", "Withdrawals"],
        ["loanRepayment", "Repayments"], ["loanDistribute", "Disbursements"],
    ];

    const visibleTransactions = transactions
        .filter((t) => tab === "all" || t.transactionType === tab)
        .filter((t) => {
            const term = search.trim().toLowerCase();
            if (!term) return true;
            return t.transactionNumber.toLowerCase().includes(term) || fullName(txCustomer(t)).toLowerCase().includes(term);
        });

  return (
    <div className='flex flex-col gap-5'>
        
        <div>
            <h1 className='text-2xl font-serif font-semibold text-gray-800'>Transactions</h1>
            <p className='text-sm text-gray-500 mt-1'>Track deposits, withdrawals & transfers across the branch</p>
        </div>

        <div className='grid grid-cols-4 gap-4'>
            {cards.map((card) => (
                <div key={card.label} className='bg-white rounded-2xl p-4 shadow-sm'>
                    <div className='flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 mb-3'>
                        <card.icon size={18} className='text-gray-600' />
                    </div>
                    <p className='text-xs text-gray-500'>{card.label}</p>
                    <p className='text-2xl font-bold text-gray-800 mt-1'>{card.value}</p>
                </div>
            ))}
        </div>

        <div>
            <h2 className='font-serif font-semibold text-lg text-gray-800 mb-3'>Cash Flow Trend</h2>
            <div className='bg-white rounded-2xl p-5 shadow-sm'>
                <p className='font-semibold text-gray-800 mb-2'>Deposits vs Withdrawals</p>
                <div className='h-64'>
                    <Line data={chartData} options={{
                        responsive: true, maintainAspectRatio: false,
                        plugins: { legend: { position: "top", align: "end" } },
                        scales: { x: { grid: { display: false } }, y: { grid: { color: "#eef0ea" }, ticks: { callback: (v) => compactCurrency(v) } } },
                    }} />
                </div>
            </div>
        </div>

        <div className='bg-white rounded-2xl p-5 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
                <div className='flex gap-2'>
                    {tabs.map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)}
                            className={`text-sm font-semibold px-4 py-1.5 rounded-full ${tab === key ? "bg-lime-500 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                            {label}
                        </button>
                    ))}
                </div>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Search by name or txn no.'
                    className='text-sm border border-gray-200 rounded-full px-4 py-1.5 outline-none focus:border-lime-400 w-64'
                />
            </div>

            <table className='w-full text-sm'>
                <thead>
                    <tr className='text-left text-gray-400 text-xs'>
                        <th className='font-medium pb-2'>Time</th>
                        <th className='font-medium pb-2'>Txn No</th>
                        <th className='font-medium pb-2'>Type</th>
                        <th className='font-medium pb-2'>Customer</th>
                        <th className='font-medium pb-2'>Account</th>
                        <th className='font-medium pb-2'>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {visibleTransactions.map((tx) => {
                        const meta = Type[tx.transactionType] || { label: tx.transactionType, className: "bg-gray-100 text-gray-700" };
                        const customer = txCustomer(tx);
                        return (
                            <tr key={tx._id} className='border-t border-gray-100'>
                                <td className='py-2.5 text-gray-500'>
                                    {new Date(tx.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                                </td>
                                <td className='py-2.5 font-medium text-gray-700'>{tx.transactionNumber}</td>
                                <td className='py-2.5'>
                                    <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${meta.className}`}>{meta.label}</span>
                                </td>
                                <td className='py-2.5'>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-6 h-6 flex items-center justify-center rounded-full bg-lime-50 text-lime-700 text-[10px] font-semibold'>
                                            {initials(customer)}
                                        </span>
                                        {fullName(customer)}
                                    </div>
                                </td>
                                <td className='py-2.5 text-gray-500'>{tx.accountNumber}</td>
                                <td className='py-2.5 font-semibold text-gray-800'>{currency(tx.amount)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {visibleTransactions.length === 0 && (
                <p className='text-sm text-gray-400 text-center py-8'>No transactions match this filter.</p>
            )}
        </div>

    </div>
  )
}

export default TransactionSection