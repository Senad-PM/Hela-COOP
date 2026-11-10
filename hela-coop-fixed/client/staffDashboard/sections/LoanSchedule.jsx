import { useEffect } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";

const money = (n) =>
  `Rs. ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const date = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—";

const statusStyle = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  overdue: "bg-red-100 text-red-700",
};

const LoanSchedule = ({ loan, onClose }) => {

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const installments = [...(loan.installments || [])].sort(
    (a, b) => a.installmentNo - b.installmentNo
  );
  const paidCount = installments.filter((i) => i.status === "paid").length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-xl"
      >

        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-serif font-semibold text-gray-800">
              Loan Schedule — {loan.loanNumber}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {loan.customer?.firstName} {loan.customer?.lastName}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5 text-xs">
          <div className="bg-sky-50 rounded-xl p-3">
            <p className="text-gray-500">Principal</p>
            <p className="font-bold text-gray-800 text-sm">{money(loan.principalAmount)}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3">
            <p className="text-gray-500">Interest rate</p>
            <p className="font-bold text-gray-800 text-sm">{loan.interestRate}%</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3">
            <p className="text-gray-500">Duration</p>
            <p className="font-bold text-gray-800 text-sm">{loan.durationMonths} months</p>
          </div>
          <div className="bg-stone-100 rounded-xl p-3">
            <p className="text-gray-500">Paid</p>
            <p className="font-bold text-gray-800 text-sm">
              {paidCount} / {installments.length}
            </p>
          </div>
        </div>

        <div className="px-5 pb-5 overflow-auto">
          {installments.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-10">
              No schedule yet. It is created after the loan is approved.
            </p>
          ) : (
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-white">
                <tr className="text-left uppercase text-gray-500">
                  <th className="py-2 pr-3">#</th>
                  <th className="py-2 pr-3">Due date</th>
                  <th className="py-2 pr-3">EMI</th>
                  <th className="py-2 pr-3">Principal</th>
                  <th className="py-2 pr-3">Interest</th>
                  <th className="py-2 pr-3">Balance</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Paid on</th>
                </tr>
              </thead>
              <tbody>
                {installments.map((i, idx) => (
                  <tr key={i._id || i.installmentNo} className={idx % 2 === 0 ? "bg-stone-50" : ""}>
                    <td className="py-2 pr-3 pl-2 font-medium text-gray-700">{i.installmentNo}</td>
                    <td className="py-2 pr-3 text-gray-600">{date(i.dueDate)}</td>
                    <td className="py-2 pr-3 text-gray-800">{money(i.emi)}</td>
                    <td className="py-2 pr-3 text-gray-600">{money(i.principalAmount)}</td>
                    <td className="py-2 pr-3 text-gray-600">{money(i.interestAmount)}</td>
                    <td className="py-2 pr-3 text-gray-600">{money(i.remainingBalance)}</td>
                    <td className="py-2 pr-3">
                      <span className={`font-semibold rounded-full px-2 py-0.5 ${statusStyle[i.status] || statusStyle.pending}`}>
                        {(i.status || "pending").toUpperCase()}
                        {i.status === "overdue" && i.overDueDays ? ` · ${i.overDueDays}d` : ""}
                      </span>
                    </td>
                    <td className="py-2 text-gray-500">{date(i.paidDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoanSchedule;