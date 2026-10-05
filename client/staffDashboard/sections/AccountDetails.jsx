import React, { useEffect } from 'react'
import { X, Wallet, TrendingUp, User } from 'lucide-react';
import { motion } from 'motion/react';

const currency = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "-";

const formatTerm = (months) => {
    if (!months) return "-";
    if (months % 12 === 0) return `${months / 12} year${months / 12 > 1 ? "s" : ""}`;
    return `${months} months`;
};

const Row = ({ label, value }) => (
    <div>
        <p className='text-[11px] text-gray-400'>{label}</p>
        <p className='text-sm font-semibold text-gray-800 break-words'>{value || "-"}</p>
    </div>
);

const Section = ({ title, icon: Icon, children }) => (
    <div className='rounded-2xl border-2 border-gray-100 overflow-hidden'>
        <div className='flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700'>
            <Icon size={13} /> {title}
        </div>
        <div className='grid grid-cols-2 gap-x-4 gap-y-3 p-4'>{children}</div>
    </div>
);

const AccountDetails = ({ account, onClose }) => {

    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    if (!account) return null;

    const c = account.customer || {};
    const isFixed = account.accountType === "fixed";
    const fullName = `${c.firstName || ""} ${c.lastName || ""}`.trim();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xl'
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className='relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-y-auto'
            >
                <button onClick={onClose} aria-label='Close'
                    className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:rotate-90 transition-transform'>
                    <X size={18} />
                </button>

                <div className='bg-green-900 text-white px-8 py-6 rounded-t-3xl'>
                    <p className='text-xs text-gray-400'>Account</p>
                    <h2 className='text-2xl font-bold mt-0.5'>{account.accountNumber}</h2>
                    <p className='text-sm text-gray-300 mt-1'>{fullName || "-"}</p>
                    <div className='flex items-center gap-2 mt-3'>
                        <span className='px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600 capitalize'>
                            {account.accountType}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${account.isActive ? "bg-emerald-100 text-emerald-600" : "bg-gray-200 text-gray-500"}`}>
                            {account.isActive ? "Active" : "Inactive"}
                        </span>
                        {isFixed && account.isMatured && (
                            <span className='px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700'>Matured</span>
                        )}
                    </div>
                </div>

                <div className='p-8 flex flex-col gap-4'>
                    <div className='rounded-2xl bg-emerald-50 px-5 py-4'>
                        <p className='text-[11px] text-gray-500'>Current balance</p>
                        <p className='text-3xl font-bold text-gray-800'>{currency(account.balance)}</p>
                    </div>

                    <Section title="Account Details" icon={Wallet}>
                        <Row label="Account number" value={account.accountNumber} />
                        <Row label="Account type" value={isFixed ? "Fixed Deposit" : "Regular"} />
                        <Row label="Interest rate" value={account.interestRate != null ? `${account.interestRate}%` : "-"} />
                        <Row label="Accrued interest" value={currency(account.accuredInterest)} />
                        <Row label="Opened on" value={formatDate(account.createdAt)} />
                        <Row label="Last interest applied" value={formatDate(account.lastInterestApplied)} />
                    </Section>

                    {isFixed && (
                        <Section title="Fixed Deposit Terms" icon={TrendingUp}>
                            <Row label="Term" value={formatTerm(account.durationMonths)} />
                            <Row label="Maturity date" value={formatDate(account.maturityDate)} />
                            <Row label="Matured" value={account.isMatured ? "Yes" : "No"} />
                        </Section>
                    )}

                    <Section title="Customer Details" icon={User}>
                        <Row label="Customer number" value={c.customerNumber} />
                        <Row label="Full name" value={fullName} />
                    </Section>

                    <div className='flex justify-end pt-2'>
                        <button onClick={onClose}
                            className='px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition'>
                            Close
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AccountDetails
