import React, { useEffect, useState } from 'react'
import { Loader2, TriangleAlert, CheckCircle, Wallet, Banknote } from 'lucide-react';
import { fetchSavingsAccounts, depositMoney, withdrawMoney } from '../../src/api/accountsApi';
import deposit from '/public/Images/deposit.png'
import withdraw from '/public/Images/withdraw.png'

const MIN_BALANCE = 1000;

const currency = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

const CONFIG = {
  deposit: {
    title: "Deposit",
    subtitle: "Add money to a member's regular savings account",
    button: "Deposit",
    busy: "Depositing...",
    done: "Deposited",
    icon: Wallet,
    action: depositMoney,
    image: deposit,
    btnClass: "bg-[#2d6a4f] hover:bg-[#245a41]",
  },
  withdraw: {
    title: "Withdraw",
    subtitle: "Withdraw money from a member's regular savings account",
    button: "Withdraw",
    busy: "Withdrawing...",
    done: "Withdrew",
    icon: Banknote,
    action: withdrawMoney,
    image: withdraw,
    btnClass: "bg-amber-600 hover:bg-amber-700",
  },
};

const MoneyForm = ({ mode }) => {
  const cfg = CONFIG[mode];
  const Icon = cfg.icon;

  const [accounts, setAccounts] = useState([]);
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAccounts = async () => {
    try {
      const result = await fetchSavingsAccounts();
      setAccounts(result.data || []);
    } catch {

    }
  };

  useEffect(() => { loadAccounts(); }, []);

  const account = accounts.find((a) => a.accountNumber === accountNumber.trim());
  const maxWithdraw = account ? Math.max(0, account.balance - MIN_BALANCE) : 0;

  const validate = () => {
    const num = Number(amount);
    if (!accountNumber.trim()) return "Enter the account number.";
    if (!amount || !Number.isFinite(num) || num <= 0) return "Enter an amount greater than 0.";
    if (account) {
      if (!account.isActive) return "This account is not active.";
      if (account.accountType !== "regular") return "Only regular savings accounts can be used here.";
      if (mode === "withdraw" && account.balance - num < MIN_BALANCE) {
        return `Insufficient balance. You can withdraw up to ${currency(maxWithdraw)}.`;
      }
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    const msg = validate();
    if (msg) { setError(msg); return; }
    setError("");
    setSubmitting(true);
    try {
      const data = await cfg.action({ accountNumber: accountNumber.trim(), amount: Number(amount) });
      const newBalance = typeof data === "number" ? data : data?.balance;
      setSuccess(
        `${cfg.done} ${currency(amount)} successfully.` +
        (newBalance !== undefined ? ` New balance: ${currency(newBalance)}` : "")
      );
      setAmount("");
      loadAccounts();
    } catch (err) {
      setError(err.response?.data?.message || "Transaction failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='relative rounded-2xl overflow-hidden min-h-[85vh] p-6 bg-cover bg-center'
        style={{ backgroundImage: `url(${cfg.image})` }}
    >
      <div>
        <h1 className='text-2xl font-serif font-semibold text-gray-800'>{cfg.title}</h1>
        <p className='text-sm text-gray-500 mt-1'>{cfg.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className='bg-emerald-50 rounded-2xl p-6 max-w-xl flex flex-col gap-5 mt-5'>
        {error && (
          <div className='flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3'>
            <TriangleAlert size={15} className='flex-shrink-0' /> {error}
          </div>
        )}
        {success && (
          <div className='flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3'>
            <CheckCircle size={15} className='flex-shrink-0' /> {success}
          </div>
        )}

        <div className='flex flex-col gap-1'>
          <label className='text-xs font-semibold text-gray-600'>Account number</label>
          <input
            value={accountNumber}
            onChange={(e) => { setAccountNumber(e.target.value.toUpperCase()); setError(""); setSuccess(""); }}
            placeholder='Ex: REG-0001'
            className='border-2 border-gray-300 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm outline-none bg-white transition-colors placeholder:text-gray-300'
          />
        </div>

        {account && (
          <div className='bg-white rounded-xl border border-emerald-100 px-4 py-3 flex items-center justify-between'>
            <div>
              <p className='text-sm font-semibold text-gray-800'>
                {account.customer?.firstName} {account.customer?.lastName}
              </p>
              <p className='text-xs text-gray-500 capitalize'>
                {account.accountType} account · {account.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <div className='text-right'>
              <p className='text-[11px] text-gray-400'>Balance</p>
              <p className='text-sm font-bold text-gray-800'>{currency(account.balance)}</p>
            </div>
          </div>
        )}

        <div className='flex flex-col gap-1'>
          <label className='text-xs font-semibold text-gray-600'>Amount</label>
          <div className='flex items-center border-2 border-gray-300 focus-within:border-emerald-500 rounded-xl bg-white transition-colors overflow-hidden'>
            <span className='px-3 text-sm font-semibold text-gray-400 border-r border-gray-200'>Rs.</span>
            <input
              type="number" min="1" value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(""); setSuccess(""); }}
              placeholder='5000'
              className='flex-1 px-3 py-2.5 text-sm outline-none bg-transparent placeholder:text-gray-300'
            />
          </div>
          {mode === "withdraw" && (
            <p className='text-[11px] text-gray-400'>
              A minimum balance of {currency(MIN_BALANCE)} must remain in the account.
            </p>
          )}
        </div>

        <button type='submit' disabled={submitting}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition disabled:opacity-50 ${cfg.btnClass}`}>
          {submitting ? <Loader2 size={15} className='animate-spin' /> : <Icon size={15} />}
          {submitting ? cfg.busy : cfg.button}
        </button>
      </form>
    </div>
  );
};

export default MoneyForm