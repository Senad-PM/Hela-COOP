import React, { useCallback, useEffect, useState } from 'react'
import { approveLoan, fetchLoanStats, fetchLoans, rejectLoan } from '../../src/api/loansApi';
import { fetchManagerDashboard } from '../../src/api/DashboardApi';
import { Chart as ChartJs, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, } from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import { Loader2, Check, X as XIcon } from 'lucide-react';

ChartJs.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const currency = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

const fullName = (person) => `${person?.firstName || ""} ${person?.lastName || ""}`.trim() || "Unknown";
const initials = (person) => {
    const name = fullName(person);
    return name === "Unknown" ? "?" : name.split(" ").map((p) => p[0]).join("").toUpperCase();
};

const displayStatus = (loan) => (loan.isOverdue ? "overdue" : loan.status);

const statusStyle = {
    pending: "bg-amber-100 text-amber-700",
    active: "bg-emerald-100 text-emerald-700",
    overdue: "bg-red-100 text-red-700",
    closed: "bg-gray-100 text-gray-600",
    approved: "bg-sky-100 text-sky-700",
    rejected: "bg-red-100 text-red-700",
};

const LoansSection = () => {

    const [loans, setLoans] = useState([]);
    const [stats, setStats] = useState({});
    const [monthly, setMonthly] = useState({ disbursements: [], repayments: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tab, setTab] = useState("all");
    const [search, setSearch] = useState("");
    const [actioningLoan, setActioningLoan] = useState(null);
    const [actionError, setActionError] = useState("");

    const load = useCallback(async () => {
        setError("");
        try{
            const [loansResult, statsResult, dashboardResult] = await Promise.all([
                fetchLoans(), fetchLoanStats(), fetchManagerDashboard(),
            ]);
            setLoans(loansResult.data || []);
            setStats(statsResult || {});
            setMonthly({
                disbursements: dashboardResult?.monthlyChart?.monthlyLoanDisbursementVolume || [],
                repayments: dashboardResult?.monthlyChart?.monthlyLoanRepaymentVolume || [],
            });
        } catch  (err){
            setError(err.response?.data?.message || "Could not load loans.");
        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => { load() }, [load]);

    const handleDecision = async (loanNumber, decision) => {
        setActioningLoan(loanNumber);
        setActionError("");
        try{
            if (decision === "approve") await approveLoan(loanNumber);
            else await rejectLoan(loanNumber);
            await load();
        } catch (err){
            setActionError(err.response?.data?.message || `Could not ${decision} loan ${loanNumber}.`);
        } finally {
            setActioningLoan(null);
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center gap-2 text-gray-400 py-20'>
                <Loader2 size={18} className='animate-spin' /> Loading loans...
            </div>
        );
    }

    if (error) {
        return <div className='text-center text-red-500 py-20'>{error}</div>;
    }

    const overviewCards = [
        { label: "Pending Loans", value: stats.pendingLoansCount, dot: "bg-amber-500" },
        { label: "Active Loans", value: stats.activeLoansCount, dot: "bg-emerald-500" },
        { label: "Closed Loans", value: stats.closedLoansCount, dot: "bg-gray-400" },
        { label: "Overdue Loans", value: stats.overdueLoansCount, dot: "bg-red-500" },
        { label: "Outstanding Balance", value: currency(stats.totalLoanOutstandingBalance), dot: "bg-blue-500" },
    ];

    const monthLabel = (ym) => new Date(`${ym}-01`).toLocaleDateString(undefined, { month: "short" });
    const chartLabels = monthly.disbursements.map((m) => monthLabel(m.month));
    const chartData = {
        labels: chartLabels,
        datasets: [
            { label: "Disbursements", data: monthly.disbursements.map((m) => m.totalVolume), borderColor: "#b45309", backgroundColor: "rgba(180,83,9,0.10)", fill: true, tension: 0.35, pointRadius: 3 },
            { label: "Repayments", data: monthly.repayments.map((m) => m.totalVolume), borderColor: "#2563eb", backgroundColor: "rgba(37,99,235,0.08)", fill: true, tension: 0.35, pointRadius: 3 },
        ],
    };

    const doughnutData = {
        labels: ["Active", "Closed", "Pending", "Overdue"],
        datasets: [{
            data: [stats.activeLoansCount, stats.closedLoansCount, stats.pendingLoansCount, stats.overdueLoansCount],
            backgroundColor: ["#4d7c0f", "#9ca3af", "#b45309", "#b91c1c"],
            borderWidth: 0,
        }],
    };

    const doughnutRows = [
        { label: "Active", value: stats.activeLoansCount, dot: "bg-[#4d7c0f]" },
        { label: "Closed", value: stats.closedLoansCount, dot: "bg-[#9ca3af]" },
        { label: "Pending", value: stats.pendingLoansCount, dot: "bg-[#b45309]" },
        { label: "Overdue", value: stats.overdueLoansCount, dot: "bg-[#b91c1c]" },
    ];

    const tabs = [["all", "All"], ["pending", "Pending"], ["active", "Active"], ["overdue", "Overdue"], ["closed", "Closed"]];

    const visibleLoans = loans
        .filter((loan) => tab === "all" || displayStatus(loan) === tab)
        .filter((loan) => {
            const term = search.trim().toLowerCase();
            if (!term) return true;
            return loan.loanNumber.toLowerCase().includes(term) || fullName(loan.customer).toLowerCase().includes(term);
        });

  return (
    <div className='flex flex-col gap-5'>

        <div>
            <h1 className='text-2xl font-serif font-semibold text-gray-800'>Loans</h1>
            <p className='text-sm text-gray-500 mt-1'>Full loan book - approvals, active loans & recoveries</p>
        </div>

        <div>
            <h2 className='font-serif font-semibold text-lg text-gray-800 mb-3'>Loan Overview</h2>
            <div className='grid grid-cols-5 gap-4'>
                {overviewCards.map((c) => (
                    <div key={c.label} className='bg-white rounded-2xl p-4 shadow-sm'>
                        <span className={`inline-block w-2 h-2 rounded-full ${c.dot} mb-2`} />
                        <p className='text-xl font-bold text-gray-800'>{c.value ?? 0}</p>
                        <p className='text-xs text-gray-500 mt-0.5'>{c.label}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
            <div className='bg-white rounded-2xl p-5 shadow-sm'>
                <p className='font-semibold text-gray-800 mb-2'>Disbursements vs Repayments</p>
                <div className='h-56'>
                    <Line data={chartData} options={{
                        responsive: true, maintainAspectRatio: false,
                        plugins: { legend: { position: "top", align: "end" } },
                        scales: { x: { grid: { display: false } }, y: { grid: { color: "#eef0ea" } } },
                    }} />
                </div>
            </div>
            <div className='bg-white rounded-2xl p-5 shadow-sm flex items-center gap-6'>
                <div className='w-40 h-40 flex-shrink-0'>
                    <Doughnut data={doughnutData} options={{ plugins: { legend: { display: false } }, cutout: "70%" }} />
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-semibold text-gray-800 mb-1'>Loan Status Distribution</p>
                    {doughnutRows.map((row) => (
                        <div key={row.label} className='flex items-center gap-2 text-sm'>
                            <span className={`w-2.5 h-2.5 rounded-full ${row.dot}`} /> {row.label}
                            <span className='ml-auto font-semibold'>{row.value ?? 0}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {actionError && (
            <p className='text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2'>{actionError}</p>
        )}

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
                    placeholder='Search by name or loan no.'
                    className='text-sm border border-gray-200 rounded-full px-4 py-1.5 outline-none focus:border-lime-400 w-64'
                />
            </div>

            <table className='w-full text-sm'>
                <thead>
                    <tr className='text-left text-gray-400 text-xs'>
                        <th className='font-medium pb-2'>Loan No</th>
                        <th className='font-medium pb-2'>Customer</th>
                        <th className='font-medium pb-2'>Principal</th>
                        <th className='font-medium pb-2'>Outstanding</th>
                        <th className='font-medium pb-2'>Status</th>
                        <th className='font-medium pb-2'>Next Due</th>
                        <th className='font-medium pb-2'></th>
                    </tr>
                </thead>
                <tbody>
                    {visibleLoans.map((loan) => {
                        const status = displayStatus(loan);
                        const isPending = loan.status === "pending";
                        return (
                            <tr key={loan._id} className='border-t border-gray-100'>
                                <td className='py-2.5 font-medium text-gray-700'>{loan.loanNumber}</td>
                                <td className='py-2.5'>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-6 h-6 flex items-center justify-center rounded-full bg-lime-50 text-lime-700 text-[10px] font-semibold'>
                                            {initials(loan.customer)}
                                        </span>
                                        {fullName(loan.customer)}
                                    </div>
                                </td>
                                <td className='py-2.5 font-medium text-gray-800'>{currency(loan.principalAmount)}</td>
                                <td className='py-2.5 text-gray-600'>{isPending ? "—" : currency(loan.outstandingBalance)}</td>
                                <td className='py-2.5'>
                                    <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${statusStyle[status] || "bg-gray-100 text-gray-600"}`}>
                                        {status.toUpperCase()}
                                    </span>
                                </td>
                                <td className='py-2.5 text-gray-500'>
                                    {loan.nextDueDate ? new Date(loan.nextDueDate).toLocaleDateString(undefined, { day: "2-digit", month: "short" }) : "—"}
                                </td>
                                <td className='py-2.5'>
                                    {isPending && (
                                        actioningLoan === loan.loanNumber ? (
                                            <Loader2 size={14} className='animate-spin text-gray-400' />
                                        ) : (
                                            <div className='flex items-center gap-2'>
                                                <button onClick={() => handleDecision(loan.loanNumber, "approve")}
                                                className='flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-full px-2.5 py-1'>
                                                <Check size={12} /> Approve
                                            </button>
                                            <button onClick={() => handleDecision(loan.loanNumber, "reject")}
                                                className='flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-full px-2.5 py-1'>
                                                <XIcon size={12} /> Reject
                                            </button>
                                        </div>
                                        )
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {visibleLoans.length === 0 && (
                <p className='text-sm text-gray-400 text-center py-8'>No loans match this filter.</p>
            )}
        </div>

    </div>
  );
};

export default LoansSection