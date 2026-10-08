import React, { useCallback, useEffect, useState } from 'react'
import {
    Chart as ChartJs,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Filler,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { motion } from "motion/react";
import { DollarSign, Briefcase, Users, Landmark, Bell, RefreshCw,Loader2, Check, X as XIcon } from 'lucide-react'
import { fetchManagerDashboard } from '../../src/api/DashboardApi';
import { approveLoan, rejectLoan } from '../../src/api/loansApi';

ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler);

const currency = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

const compactCurrency = (n) => {
  const value = Number(n || 0);
  if (value >= 1_000_000) return `Rs. ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `Rs. ${(value / 1_000).toFixed(1)}K`;
  return `Rs. ${value.toLocaleString()}`;
};

const monthLabel = (ym) => new Date(`${ym}-01`).toLocaleDateString(undefined, { month: "short" });

const initials = (person) => {
  const name = `${person?.firstName || ""} ${person?.lastName || ""}`.trim();
  if (!name) return "?";
  return name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
};

const fullName = (person) => `${person?.firstName || ""} ${person?.lastName || ""}`.trim() || "Unknown";

const txCustomer = (tx) => tx?.savingsAccount?.customer || tx?.loanAccount?.customer || null;

const TREND_TYPES = {
  deposit: { label: "DEPOSIT", className: "bg-emerald-100 text-emerald-700" },
  withdraw: { label: "WITHDRAWAL", className: "bg-red-100 text-red-700" },
  loanDistribute: { label: "LOAN DISB.", className: "bg-amber-100 text-amber-700" },
  loanRepayment: { label: "REPAYMENT", className: "bg-sky-100 text-sky-700" },
  interest: { label: "INTEREST", className: "bg-gray-100 text-gray-700" },
  loanAccountOpening: { label: "ACCOUNT OPEN", className: "bg-gray-100 text-gray-700" },
};

const MonthlyChart = ({ type, points, color, fillColor }) => {
  const data = {
    labels: points.map((p) => monthLabel(p.month)),
    datasets: [{
      data: points.map((p) => p.totalVolume),
      borderColor: color,
      backgroundColor: fillColor,
      fill: type === "line",
      tension: 0.35,
      pointRadius: type === "line" ? 3 : 0,
      pointBackgroundColor: color,
      borderRadius: type === "bar" ? 4 : 0,
    }],
  };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: "easeOutQuart" },
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: "#eef0ea" }, ticks: { callback: (v) => compactCurrency(v) } },
      },
    };
    return (
      <div className='h-52'>
        {type === "bar"
          ? <Bar data={data} options={options} />
          : <Line data={data} options={options} />}
      </div>
    );
};

const OverviewSection = ({ onNavigate }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [actioningLoan, setActionningLoan] = useState(null);
  const [actionError, setActionError] = useState("");

  const load = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const result = await fetchManagerDashboard();
      setDashboard(result);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load dashboard data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleLoanDecision = async (loanNumber, decision) => {
    setActionningLoan(loanNumber);
    setActionError("");
    try {
      if (decision === "approve") await approveLoan(loanNumber);
      else await rejectLoan(loanNumber);
      await load({ silent: true });
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          `Could not ${decision} loan ${loanNumber}.`
      );
    } finally {
      setActionningLoan(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 text-gray-400 py-20">
        <Loader2 size={18} className="animate-spin" /> Loading overview...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

  const {
    overview = {},
    monthlyChart = {},
    loanStatics = {},
    Ques = {},
    highValueTransaction = {},
  } = dashboard || {};

  const loanStats = loanStatics.completeLoanStatistics || {};
  const pendingLoanQue = Ques.pendingLoanQue || [];
  const overDueLoansQues = Ques.overDueLoansQues || [];
  const maturingFDQUe = Ques.maturingFDQUe || [];
  const highValueTransactions =
    highValueTransaction.highValueTransactions || [];

  const kpiCards = [
    {
      icon: DollarSign,
      label: "Total Savings Portfolio",
      value: compactCurrency(overview.totalSavingBalance),
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      icon: Briefcase,
      label: "Total Loan Portfolio",
      value: compactCurrency(overview.totalLoanPortfolio),
      bg: "bg-sky-50",
      iconColor: "text-sky-600",
    },
    {
      icon: Users,
      label: "Active Customers",
      value: Number(overview.customerCount || 0).toLocaleString(),
      bg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    {
      icon: Landmark,
      label: "Active Loans",
      value: Number(loanStats.activeLoansCount || 0).toLocaleString(),
      bg: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  const loanOverviewCards = [
    {
      label: "Pending Loans",
      value: loanStats.pendingLoansCount,
      dot: "bg-amber-500",
    },
    {
      label: "Active Loans",
      value: loanStats.activeLoansCount,
      dot: "bg-emerald-500",
    },
    {
      label: "Closed Loans",
      value: loanStats.closedLoansCount,
      dot: "bg-gray-400",
    },
    {
      label: "Overdue Loans",
      value: loanStats.overdueLoansCount,
      dot: "bg-red-500",
    },
    {
      label: "Outstanding Balance",
      value: currency(loanStats.totalLoanOutstandingBalance),
      dot: "bg-blue-500",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-gray-800">
            Manager Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of savings, loans & daily activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm bg-white rounded-full px-4 py-2 shadow-sm text-gray-600">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <button className="bg-white rounded-full p-2 shadow-sm text-gray-500 hover:text-gray-700">
            <Bell size={16} />
          </button>
          <button
            onClick={() => load({ silent: true })}
            disabled={refreshing}
            className="flex items-center gap-2 bg-lime-400 hover:bg-lime-500 disabled:opacity-60 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />{" "}
            Refresh data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="flex flex-col bg-white rounded-2xl p-4 gap-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-full ${card.bg}`}
            >
              <card.icon size={18} className={card.iconColor} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {card.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="font-serif font-semibold text-lg text-gray-800 mb-3">
          Financial Performance
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="font-semibold text-gray-800 mb-2">Monthly Deposits</p>
            <MonthlyChart
              type="line"
              points={monthlyChart.monthlyDepositVolume || []}
              color="#16a34a"
              fillColor="rgba(22,163,74,0.12)"
            />
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="font-semibold text-gray-800 mb-2">
              Monthly Withdrawals
            </p>
            <MonthlyChart
              type="line"
              points={monthlyChart.monthlyWithdrawVolume || []}
              color="#dc2626"
              fillColor="rgba(220,38,38,0.12)"
            />
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="font-semibold text-gray-800 mb-2">
              Monthly Loan Disbursements
            </p>
            <MonthlyChart
              type="bar"
              points={monthlyChart.monthlyLoanDisbursementVolume || []}
              color="#b45309"
              fillColor="#d97706"
            />
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="font-semibold text-gray-800 mb-2">
              Monthly Loan Repayments
            </p>
            <MonthlyChart
              type="line"
              points={monthlyChart.monthlyLoanRepaymentVolume || []}
              color="#2563eb"
              fillColor="rgba(37,99,235,0.12)"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-serif font-semibold text-lg text-gray-800 mb-3">
          Loan Overview
        </h2>
        <div className="grid grid-cols-5 gap-4">
          {loanOverviewCards.map((c) => (
            <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm">
              <span
                className={`inline-block w-2 h-2 rounded-full ${c.dot} mb-2`}
              />
              <p className="text-xl font-bold text-gray-800">{c.value ?? 0}</p>
              <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
            </div>
          ))}
        </div>
      </div>

      {actionError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {actionError}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-gray-800">Loan Approval Queue</p>
            <button
              onClick={() => onNavigate?.("loans")}
              className="text-sm text-emerald-600 hover:underline"
            >
              View All
            </button>
          </div>
          {pendingLoanQue.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">
              No loans awaiting approval.
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {pendingLoanQue.map((loan) => (
                <div
                  key={loan._id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold flex-shrink-0">
                      {initials(loan.customer)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {loan.loanNumber} · {fullName(loan.customer)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currency(loan.principalAmount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {actioningLoan === loan.loanNumber ? (
                      <Loader2
                        size={14}
                        className="animate-spin text-gray-400"
                      />
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            handleLoanDecision(loan.loanNumber, "approve")
                          }
                          className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-full px-2.5 py-1"
                        >
                          <Check size={12} /> Approve
                        </button>
                        <button
                          onClick={() =>
                            handleLoanDecision(loan.loanNumber, "reject")
                          }
                          className="flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-full px-2.5 py-1"
                        >
                          <XIcon size={12} /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-gray-800">Overdue Loans</p>
            <button
              onClick={() => onNavigate?.("loans")}
              className="text-sm text-emerald-600 hover:underline"
            >
              View All
            </button>
          </div>
          {overDueLoansQues.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">
              No overdue loans.
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {overDueLoansQues.map((loan) => (
                <div
                  key={loan._id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-700 text-xs font-semibold flex-shrink-0">
                      {initials(loan.customer)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {loan.loanNumber} · {fullName(loan.customer)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currency(loan.principalAmount)} outstanding
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold bg-red-50 text-red-600 rounded-full px-2.5 py-1 flex-shrink-0">
                    {new Date(loan.nextDueDate)
                      .toLocaleDateString(undefined, {
                        day: "2-digit",
                        month: "short",
                      })
                      .toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-gray-800">
              Maturing Fixed Deposits
            </p>
            <p className="text-xs text-gray-400">Maturing within 3 days</p>
          </div>
          <button
            onClick={() => onNavigate?.("accounts")}
            className="text-sm text-emerald-600 hover:underline"
          >
            View All
          </button>
        </div>
        {maturingFDQUe.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">
            No fixed deposits maturing soon.
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {maturingFDQUe.map((fd) => (
              <div
                key={fd._id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-amber-50 text-amber-700 text-xs font-semibold flex-shrink-0">
                    {initials(fd.customer)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {fd.accountNumber} · {fullName(fd.customer)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currency(fd.balance)}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-amber-50 text-amber-600 rounded-full px-2.5 py-1 flex-shrink-0">
                  {new Date(fd.maturityDate)
                    .toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "short",
                    })
                    .toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <p className="font-semibold text-gray-800 mb-1">
          Recent High-Value Transactions
        </p>
        <p className="text-xs text-gray-400 mb-3">Above Rs. 100,000</p>
        {highValueTransactions.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">
            No high-value transactions yet.
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {highValueTransactions.map((tx) => {
              const meta = TREND_TYPES[tx.transactionType] || {
                label: tx.transactionType,
                className: "bg-gray-100 text-gray-700",
              };
              const customer = txCustomer(tx);
              return (
                <div
                  key={tx._id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-gray-400 w-16 flex-shrink-0">
                      {new Date(tx.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span
                      className={`text-[10px] font-semibold rounded-full px-2 py-1 flex-shrink-0 ${meta.className}`}
                    >
                      {meta.label}
                    </span>
                    <span className="text-sm text-gray-800 truncate">
                      {customer
                        ? fullName(customer)
                        : `Acct ${tx.accountNumber}`}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 flex-shrink-0">
                    {currency(tx.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewSection;
