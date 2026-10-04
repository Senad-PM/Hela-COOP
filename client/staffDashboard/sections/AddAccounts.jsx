import { AtSign, Briefcase, Calendar, Check, CheckCircle, ChevronLeft, CreditCard, Hash, Home, Loader2, MapPin, Phone, TrendingUp, TriangleAlert, User, UserPlus, Wallet, X } from 'lucide-react';
import React, { useState } from 'react'
import { addCustomer, findCustomerByNIC } from '../../../client/src/api/customerApi';
import { createSavingsAccount } from '../../src/api/accountsApi';
import { motion, AnimatePresence } from 'motion/react';

const emptyForm = {
    NIC: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    occupation: "",
    city: "",
    address: "",
    postalCode: "",
    dateOfBirth: "",
    accountType: "regular",
    durationMonths: "3",
    initailDeposits: "",
};

const STEP_COLORS = {
    indigo: {
        badge: "bg-indigo-50 text-indigo-600",
        activeCircle: "bg-indigo-600 text-white",
        activeLabel: "text-white",
        activeRail: "bg-indigo-500",
        button: "bg-indigo-600 hover:bg-indigo-700",
        progress: "bg-indigo-500",
        glow: "bg-indigo-500/20",
    },
    purple: {
        badge: "bg-purple-50 text-purple-600",
        activeCircle: "bg-purple-600 text-white",
        activeLabel: "text-white",
        activeRail: "bg-purple-500",
        button: "bg-purple-600 hover:bg-purple-700",
        progress: "bg-purple-500",
        glow: "bg-purple-500/20",
    },
    pink: {
        badge: "bg-pink-50 text-pink-600",
        activeCircle: "bg-pink-600 text-white",
        activeLabel: "text-white",
        activeRail: "bg-pink-500",
        button: "bg-pink-600 hover:bg-pink-700",
        progress: "bg-pink-500",
        glow: "bg-pink-500/20",
    },
    emerald: {
        badge: "bg-emerald-50 text-emerald-600",
        activeCircle: "bg-emerald-600 text-white",
        activeLabel: "text-white",
        activeRail: "bg-emerald-500",
        button: "bg-emerald-600 hover:bg-emerald-700",
        progress: "bg-emerald-500",
        glow: "bg-emerald-500/20",
    },
};

const STEPS = [
    { key: "personal", label: "Personal Details", badge: "Step 1 - Personal Details", heading: "Tell us about yourself", subtitle: "Basic personal information for your account", color: "indigo" },
    { key: "account", label: "Account Details", badge: "Step 2 - Account Info", heading: "Set up the account", subtitle: "Choose account type and opening deposit", color: "purple" },
    { key: "contact", label: "Address and Contact", badge: "Step 3 - Address & Contact", heading: "Where can we reach you?", subtitle: "Contact details and residential address", color: "pink" },
    { key: "review", label: "Review and Save", badge: "Step 1 - Review and Save", heading: "Almost there", subtitle: "Review the details before creating the account", color: "emerald" },
];

const Field = ({ label, icon: Icon, ...props}) => (
    <div className='flex flex-col gap-1'>
        <label className='flex items-center gap-1.5 text-xs font-semibold text-gray-600'>
            {Icon && <Icon size={13} className="text-gray-400" />}
            {label}
        </label>
        <input {...props} className='border-2 border-gray-300 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm outline-none bg-white transition-colors placeholder:text-gray-300' />
    </div>
);

const SummaryCard = ({ title, icon: Icon, color, rows }) => {
    const c = STEP_COLORS[color];
    return(
        <div className='rounded-2xl border-2 border-gray-100 overflow-hidden'>
            <div className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wide ${c.badge}`}>
                <Icon size={13} /> {title}
            </div>
            <div className='grid grid-cols-2 gap-x-4 gap-y-3 p-4'>
                {rows.map(([label, value]) => (
                    <div key={label}>
                        <p className='text-[11px] text-gray-400'>{label}</p>
                        <p className='text-sm font-semibold text-gray-800'>{value || "-"}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AddAccounts = ({ onClose, onCreated }) => {

    const [step, setStep] = useState(0);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [createdAccountNumber, setCreatedAccountNumber] = useState("")

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
    const current = STEPS[step];
    const colors = STEP_COLORS[current.color];

    const validateStep = () => {
        if (step === 0){
            if(!form.firstName || !form.lastName || !form.NIC || !form.dateOfBirth || !form.occupation){
                return "Please fill in all personal details.";
            }
        }
        if(step === 1){
            if(form.accountType === "fixed" && !form.durationMonths) return "Picked a term for the fixed deposit";
            if(!form.initailDeposits || Number(form.initailDeposits) <= 0) return "Initial deposit must be greater than 0.";
        }
        if(step === 2){
            if(!form.email || !form.phoneNumber || !form.city || !form.address || !form.postalCode){
                return "Please fill in all contact details.";
            }
        }
        return "";
    };

    const handleNext = () => {
        const msg = validateStep();
        if (msg) { setError(msg); return; }
        setError("");
        setStep((s) => Math.min(s + 1, STEPS.length - 1));
    };

    const handleBack = () => {
        setError("");
        setStep((s) => Math.max(s - 1, 0));
    };

    const handleSubmit = async () => {
        setError("");
        setSubmitting(true);
        
        try {
            let customer;
            try {
                customer = await addCustomer({
                    NIC: form.NIC,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    phoneNumber: form.phoneNumber,
                    occupation: form.occupation,
                    city: form.city,
                    address: form.address,
                    postalCode: form.postalCode,
                    dateOfBirth: form.dateOfBirth,
                });
            } catch (createErr) {
                const msg = createErr.response?.data?.message || "";
                if (msg.toLowerCase().includes("already exist")) {
                    customer = await findCustomerByNIC(form.NIC);
                if (!customer) throw createErr;
                } else {
                    throw createErr;
                }
            }

                const account = await createSavingsAccount({
                    customerNumber: customer.customerNumber,
                    accountType: form.accountType,
                    durationMonths: form.accountType === "fixed" ? Number(form.durationMonths) : undefined,
                    initialDeposit: Number(form.initailDeposits),
                });

            setCreatedAccountNumber(account?.accountNumber || customer.customerNumber || "");
            onCreated?.();
            setSuccess(true);
            setForm(emptyForm);
        } catch (err) {
            setError(err.response?.data?.message || "Could not create the customer/account. Check the fields and try again.");
        } finally {
           setSubmitting(false);
        }
    };

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xl'>
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut"}}
            className='relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex overflow-hidden'
        >
            <button onClick={onClose} className='absolute top-4 right-4 z-20 text-gray-400 hover:text-gray-600 hover:rotate-90 transition-transform'>
                <X size={18} />
            </button>

            {/* Sidebar */}
            <div className='relative w-64 flex-shrink-0 bg-[#0d1f1a] text-white p-6 overflow-hidden'>
                <div className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl ${colors.glow}`} />
                <div className='relative'>
                    <h1 className='text-2xl font-bold' style={{ fontFamily: '"Antonio", serif' }}>
                        Hela <span className='text-emerald-400'>COOP</span>
                    </h1>
                    <p className='text-[11px] text-gray-400 mt-1'>Simple Fast Secure Trusted</p>
                    <p className='text-[11px] font-bold text-gray-400 tracking-wide mt-8 mb-4 uppercase'>Your Progress</p>

                    <div className='flex flex-col'>
                        {STEPS.map((s, i) => {
                            const isDone = i < step || success;
                            const isActive = i === step && !success;
                            const c = STEP_COLORS[s.color];
                            return (
                                <div key={s.key} className='flex flex-col'>
                                    <div className={`flex items-center gap-3 rounded-xl px-2 py-2 transition-colors ${isActive ? c.activeCircle.split(" ")[0] + "/20" : ""}`}>

                                        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0 transition-colors ${
                                            isDone ? "bg-emerald-500 text-white" : isActive ? c.activeCircle : "border-2 border-gray-600 text-gray-500"
                                        }`}>
                                            {isDone ? <Check size={13} /> : i + 1}
                                        </div>
                                        <span className={`text-sm font-medium ${isDone || isActive ? "text-white" : "text-gray-500"}`}>
                                            {s.label}
                                        </span>

                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className={`w-0.5 h-5 ml-[1.55rem] ${isDone ? "bg-emerald-500" : "bg-gray-700"}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className='flex-1 flex flex-col p-8 overflow-y-auto'>
                <AnimatePresence mode='wait'>
                    {success ? (
                        <motion.div key={success}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className='flex-1 flex flex-col items-center justify-center text-center'
                        >

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 15}}
                            >
                                <div className='flex items-center justify-center w-16 h-16 rounded-full border-4 border-emerald-500 mb-4'>
                                    <Check size={28} className='text-emerald-500' />
                                </div>
                            </motion.div>
                            <h2 className='text-2xl font-bold text-gray-800'>Account Created.</h2>
                            <p className='text-sm text-gray-500 mt-2 max-w-xs'>
                                Your Hela-COOP account has been created successfully.
                            </p>
                            <div className='mt-6 border-2 border-indigo-200 rounded-xl px-6 py-3 text-center'>
                                <p className='text-[10px] font-bold text-gray-400 tracking-wide uppercase'>Member Number</p>
                                <p className='text-sm font-bold text-gray-800'>{createdAccountNumber || "-"}</p>
                            </div>
                            <button onClick={onClose} className='mt-8 px-6 py-2.5 rounded-xl border-2 border-red-200 text-red-500 text-sx font-semibold hover:bg-red-50 transition'>
                                Close
                            </button>

                        </motion.div>
                    ) : (
                        <motion.div key={step}
                            initial={{ opacity:0, x:12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -12 }}
                            transition={{ duration: 0.2 }}
                            className='flex flex-col flex-1'
                        >
                            <span className={`w-fit text-[11px] font-bold px-3 py-1 rounded-ful ${colors.badge}`}>
                                {current.badge}
                            </span>
                            <h2 className='text-2xl font-bold text-gray-800 mt-3'>{current.heading}</h2>
                            <p className='text-sm text-gray-400 mb-6'>{current.subtitle}</p>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className='flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5'
                                    >
                                        <TriangleAlert size={15} className='flex-shrink-0' /> {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className='flex-1'>
                                {step === 0 && (
                                    <div className='grid grid-cols-2 gap-4'>
                                        <Field icon={User} label="First name" value={form.firstName} onChange={set("firstName")} placeholder="Ex: Kamal" />
                                        <Field icon={User} label="Last name" value={form.lastName} onChange={set("lastName")} placeholder="Ex: Perera" />
                                        <Field icon={CreditCard} label="NIC number" value={form.NIC} onChange={set("NIC")} placeholder="Ex:  200345712643" />
                                        <Field icon={Calendar} label="Date of birth" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
                                        <div className='col-span-2'>
                                            <Field icon={Briefcase} label="Occupation" value={form.occupation} onChange={set("occupation")} placeholder="Ex: Teacher, Worker" />
                                        </div>
                                    </div>
                                )}

                                {step === 1 && (
                                    <div className='flex flex-col gap-5'>
                                        <div className='grid grid-cols-2 gap-3'>
                                            {[
                                                { key: "regular", label: "Regular", desc: "Everyday savings", icon: Wallet },
                                                { key: "fixed", label: "Fixed Deposit", desc: "Locked-term savings", icon: TrendingUp },
                                            ].map((opt) => (
                                                <button key={opt.key} type='button'
                                                    onClick={() => setForm({ ...form, accountType: opt.key })}
                                                    className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                                                        form.accountType === opt.key ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                                >
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${form.accountType === opt.key ? "bg-purple-100" : "bg-gray-100"}`}>
                                                        <opt.icon size={16} className={form.accountType === opt.key ? "text-purple-600" : "text-gray-400"} />
                                                    </div>
                                                    <div>
                                                        <p className='font-sm font-semibold text-gray-800'>{opt.label}</p>
                                                        <p className='font-xs text-gray-400'>{opt.desc}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        <AnimatePresence>
                                            {form.accountType === "fixed" && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className='flex flex-col gap-2 overflow-hidden'
                                                >
                                                    <label className='text-xs font-semibold text-gray-600'>Term</label>
                                                    <div className='flex gap-2'>
                                                        {[{ v: "1", l: "1 year" }, { v: "3", l: "3 years" }, { v: "5", l: "5 years" }].map((t) => (
                                                            <button key={t.v} type='button'
                                                                onClick={() => setForm({ ...form, durationMonths: t.v })}
                                                                className={`px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all ${
                                                                    form.durationMonths === t.v ? "border-purple-500 bg-purple-500 text-white" : "border-gray-200 text-gray-500 hover:border-gray-300"
                                                                }`}
                                                            >
                                                                {t.l}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className='flex flex-col gap-1'>
                                            <label className='flex items-center gap-1.5 text-xs font-semibold text-gray-600'>
                                                <Wallet size={13} className='text-gray-400' /> Initial Deposits
                                            </label>
                                            <div className='flex items-center border-2 border-gray-200 focus-within:border-purple-500 rounded-xl bg-white transition-colors overflow-hidden w-1/2'>
                                                <span className='px-3 text-sm font-semibold text-gray-400 border-r border-gray-200'>Rs.</span>
                                                <input type="number" min="1" value={form.initailDeposits} onChange={set("initailDeposits")} placeholder='5000'
                                                    className='flex-1 px-3 py-2.5 text-sm outline-none bg-transparent placeholder:text-gray-300'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className='grid grid-cols-2 gap-4'>
                                        <Field icon={Phone} label="Phone number" value={form.phoneNumber} onChange={set("phoneNumber")} placeholder="07X XXX XXXX" />
                                        <Field icon={AtSign} label="Email address" value={form.email} onChange={set("email")} placeholder="Ex: kamal@gmail.com" />
                                        <div className='col-span-2'>
                                            <Field icon={Home} label="Address" value={form.address} onChange={set("address")} placeholder="Ex: 12/b bazaar road" />
                                        </div>
                                        <Field icon={MapPin} label="City" value={form.city} onChange={set("city")} placeholder="Ex: Galle" />
                                        <Field icon={Hash} label="Postal code" value={form.postalCode} onChange={set("postalCode")} placeholder="Ex: 80000" />
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className='flex flex-col gap-4'>
                                        <SummaryCard title="Personal Details" icon={User} color="indigo" rows={[
                                            ["Full name", `${form.firstName} ${form.lastName}`],
                                            ["NIC", form.NIC],
                                            ["Date of Birth", form.dateOfBirth],
                                            ["Occupation", form.occupation],
                                        ]} />
                                        <SummaryCard title="Contact Details" icon={Phone} color="pink" rows={[
                                            ["Phone", form.phoneNumber],
                                            ["Email", form.email],
                                            ["Address", form.address],
                                            ["City / Postal", `${form.city} ${form.postalCode}`],
                                        ]} />
                                        <SummaryCard title="Account Info" icon={Wallet} color="purple" rows={[
                                            ["Account Type", form.accountType === "fixed" ? "Fixed Deposit" : "Regular"],
                                            ["Term", form.accountType === "fixed" ? `${form.durationMonths} year(s)` : "-"],
                                            ["Initial Deposit", `Rs. ${Number(form.initailDeposits || 0).toLocaleString()}`],
                                        ]} />
                                    </div>
                                )}
                            </div>

                            <div className='mt-6 pt-4 border-t border-gray-100 flex items-center gap-4'>
                                {step > 0 ? (
                                    <button type='button' onClick={handleBack}
                                        className='flex items-center gap-1 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition'
                                    >
                                        <ChevronLeft size={15} /> Back
                                    </button>
                                ) : <div /> }

                                <div className='flex-1 flex flex-col gap-1'>
                                    <div className='w-full h-1.5 bg-gray-100 rounded-full overflow-hidden'>
                                        <motion.div
                                            className={`h-full rounded-full ${colors.progress}`}
                                            initial={ false }
                                            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                    <p className='text-[11px] text-gray-400'>Step {step + 1} of {STEPS.length}</p>
                                </div>

                                {step < STEPS.length - 1 ? (
                                    <button type='button' onClick={handleNext}
                                        className={`px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${colors.button}`}
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button type='button' onClick={handleSubmit} disabled={submitting}
                                        className='flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100'
                                    >
                                        {submitting ? <Loader2 size={15} className='animate-spin' /> : null}
                                        {submitting ? "Creating..." : "Create Account"}
                                    </button>
                                )}
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </motion.div>
    </motion.div>
  )
};
export default AddAccounts