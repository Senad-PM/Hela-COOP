import { Home, Briefcase, GraduationCap, Sprout, User, X, Check, TriangleAlert, Hash, Wallet, AtSign, ShieldCheck, Calendar, Phone, CreditCard, Mail, MapPin, ChevronLeft, Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { findCustomerByNIC } from '../../../client/src/api/customerApi';
import { applyForLoan } from '../../src/api/loansApi';
import { AnimatePresence, motion } from 'framer-motion' 

const emptyForm = {
    loanType: "housing",
    loanAmmount: 1000,
    loanTerm: 36,
    interestRateType: "fixed",
    purpose: "",

    accountNumber: "",
    accountType: "saving",
    userName: "",
    status: "active",
    repaymentMethod: "auto",
    repaymentDate: "",

    firstName: "",
    lastName: "",
    phoneNumber: "",
    NIC: "",
    dateOfBirth: "",
    email: "",
    addressLine: "",
    city: "",
    district: "",
    postalCode: "",

    agreed: false,
};

const Loan_Types = [
    {key: "housing", label: "Housing", limit: "Up to 500K", max: 500000, icon: Home },
    {key: "business", label: "Business", limit: "Up to 250K", max: 250000, icon: Briefcase },
    {key: "personal", label: "Personal", limit: "Up to 50K", max: 50000, icon: User },
    {key: "education", label: "Education", limit: "Up to 80K", max: 80000, icon: GraduationCap },
    {key: "agriculture", label: "Agriculture", limit: "Up to 100K", max: 100000, icon: Sprout },
];

const STEP_COLORS = {
    indigo: {
        badge:"bg-indigo-50 text-indigo-600",
        activeCircle:"bg-indigo-600 text-white",
        button:"bg-indigo-600 hover:bg-indigo-700",
        progress:"bg-indigo-500",
        glow:"bg-indigo-500/20",
    },
    purple: {
        badge:"bg-purple-50 text-purple-600",
        activeCircle:"bg-purple-600 text-white",
        button:"bg-purple-600 hover:bg-purple-700",
        progress:"bg-purple-500",
        glow:"bg-purple-500/20",
    },
    pink: {
        badge:"bg-pink-50 text-pink-600",
        activeCircle:"bg-pink-600 text-white",
        button:"bg-pink-600 hover:bg-pink-700",
        progress:"bg-pink-500",
        glow:"bg-pink-500/20",
    },
    emerald: {
        badge:"bg-emerald-50 text-emerald-600",
        activeCircle:"bg-emerald-600 text-white",
        button:"bg-emerald-600 hover:bg-emerald-700",
        progress:"bg-emerald-500",
        glow:"bg-emerald-500/20",
    },
};

const STEPS = [
    {key: "loan", label: "Loan Details", badge: "Step 1 - Loan Details", heading: "Choose your loan", subtitle: "Select a loan type and set your preferred amount and term.", color: "indigo"},
    {key: "account", label: "Account Setup", badge: "Step 2 - Account Setup", heading: "Set up your account", subtitle: "Link an existing account or create repayment details.", color: "purple"},
    {key: "personal", label: "Personal Info", badge: "Step 3 - Personal Info", heading: "Where can we reach you?", subtitle: "Personal details and address for the application.", color: "pink"},
    {key: "review", label: "Review and Save", badge: "Step 4 - Review & Save", heading: "Almost there!", subtitle: "Review your application before submitting.", color: "emerald"},
];

const Field = ({ label, icon: Icon, ...props }) => (
    <div className='flex flex-col gap-1'>
        <label className='flex items-center gap-1.5 text-xs font-semibold text-gray-600'>
            {Icon && <Icon size={13} className='text-gray-400' />}
            {label}
        </label>
        <input {...props} className='border-2 border-gray-300 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm outline-none bg-white transition-colors placeholder:text-gray-300' />
    </div>
);

const Select = ({ label, icon: Icon, children, ...props }) => (
    <div className='flex flex-col gap-1'>
        <label className='flex items-center gap-1.5 text-xs font-semibold text-gray-600'>
            {Icon && <Icon size={13} className='text-gray-400' />}
            {label}
        </label>
        <select {...props} className='border-2 border-gray-300 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm outline-none bg-white transition-colors'>
            {children}
        </select>
    </div>
);

const SummaryCard = ({ title, icon: Icon, color, rows }) => {
    const c = STEP_COLORS[color];
    return (
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

const AddLoan = ({ onClose, onCreated }) => {

    const [step, setStep] = useState(0);
    const [form, setForm] = useState(emptyForm);
    const [foundCustomer, setFoundCustomer] = useState(null);
    const [searching, setSearching] = useState(false);
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [referenceNumber, setReferenceNumber] = useState("");

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
    const current = STEPS[step];
    const colors = STEP_COLORS[current.color];
    const selectedType = Loan_Types.find((t) => t.key === form.loanType) || Loan_Types[0];

    const validateStep = () => {
        if (step === 0) {
            if (!form.loanType || !form.loanAmmount || Number(form.loanAmmount) <= 0){
                return "Please select a loan type and a valid amount."
            }
        }
        if (step === 1) {
            if (!form.accountNumber || !form.userName) {
                return "Please fill in the account details."
            }
        }
        if (step === 2) {
            if(!form.firstName || !form.lastName || !form.NIC || !form.phoneNumber || !form.email || !form.addressLine || !form.city) {
                return "Please fill in all personal details."
            }
        }
        if (step === 3) {
            if (!form.agreed) return "Please confirm the terms before submitting."
        }
        return "";
    };

    const handleSearchMember = async () => {
        if (!form.memberSearch.trim()) {
            setError("Enter a NIC or customer number to search.");
            return;
        }
        setError("");
        setSearching(true);
        setFoundCustomer(null);
        try {
            const customer = await findCustomerByNIC(form.memberSearch.trim());
            if (!customer) {
                setError("No member found matching that NIC or customer number.");
                return;
            }
            if (customer.isActive === false) {
                setError("This member's account is inactive and cannot apply for a loan.");
                return;
            }
            setFoundCustomer(customer);
        } catch (err) {
            setError(err.response?.data?.message || "Could not find a member with that NIC or customer number.");
        } finally {
            setSearching(false);
        }
    };

    const handleNext = () => {
        const msg = validateStep();
        if (msg) { setError(msg); return; }
        setError("");
        setStep((s) => Math.min(s + 1, STEPS.length -1));
    };

    const handleBack = () => {
        setError("");
        setStep((s) => Math.max(s - 1, 0));
    };

    const handleSubmit = async () => {
        const msg = validateStep();
        if (msg) { setError(msg); return; }
        setError("");
        setSubmitting(true);

        try{
            const application = await applyForLoan({
                loanType: form.loanType,
                loanAmmount: Number(form.loanAmmount),
                loanTerm: Number(form.loanTerm),
                interestRateType: form.interestRateType,
                purpose: form.purpose,
                accountNumber: form.accountNumber,
                accountType: form.accountType,
                userName: form.userName,
                status: form.status,
                repaymentMethod: form.repaymentMethod,
                repaymentDate: form.repaymentDate,
                firstName: form.firstName,
                lastName: form.lastName,
                phoneNumber: form.phoneNumber,
                NIC: form.NIC,
                dateOfBirth: form.dateOfBirth,
                email: form.email,
                addressLine: form.addressLine,
                city: form.city,
                district: form.district,
                postalCode: form.postalCode,
            });

            setReferenceNumber(application?.referenceNumber || `LN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`);
            onCreated?.();
            setSuccess(true);
            setForm(emptyForm);
        } catch (err) {
            setError(err.response?.data?.message || "Could not submit the loan application. Check the fields and try again.")
        } finally {
            setSubmitting(false);
        }
    };

  return (
    <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xl'
    >
        <motion.div
            initial={{opacity: 0, scale: 0.95, y: 10}}
            animate={{opacity: 1, scale: 1, y: 0}}
            transition={{duration: 0.2, ease: 'easeOut'}}
            className='relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex overflow-hidden'
        >
            <button onClick={onClose} className='absolute top-4 right-4 z-20 target-gray-400 hover:text-gray-600 hover:rotate-90 transition-transform'>
                <X size={18} />
            </button>

            <div className='relative w-64 flex-shrink-0 bg-[#0d1f1a] text-white p-6 overflow-hidden'>
                <div className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl ${colors.glow}`} />
                <div className='relative'>
                    <h1 className='text-2xl font-bold' style={{ fontFamily: '"Antonio", serif' }}>
                        Hela<span className='text-emerald-400'>-COOP</span>
                    </h1>
                    <p className='text-[11px] text-gray-400 mt-1'>Simple Fast Secure Trusted</p>
                    <p className='text-[1px] font-bold text-gray-400 tracking-wide mt-8 mb-4 uppercase'>Your Progress</p>

                    <div className='flex flex-col'>
                        {STEPS.map((s, i) => {
                            const isDone = i < step || success;
                            const isActive = i === step && !success;
                            const c = STEP_COLORS[s.color];
                            return (
                                <div key={s.key} className='flex flex-col'>
                                    <div className='flex items-center gap-3 rounded-xl px-2 py-2 transition-colors'>
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
                                        <div className={`w-0.5 h-5 ml-[1.55rem] ${isDone ? "bg-emerald-500" : "bg-gray-700"}`}></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className='flex-1 flex flex-col p-8 overflow-y-auto'>
                <AnimatePresence mode='wait'>
                    {success ? (
                        <motion.div key={success}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            className='flex-1 flex flex-col items-center justify-center text-center'
                        >
                            <motion.div
                                initial={{scale: 0}}
                                animate={{scale: 1}}
                                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            >
                                <div className='flex items-center justify-center w-16 h-16 rounded-full border-4 border-emerald-500 mb-4'>
                                    <Check size={28} className='text-emerald-500' />
                                </div>
                            </motion.div>
                            <h2 className='text-2xl font-bold text-gray-800'>Application Submitted...</h2>
                            <p className='text-sm text-gray-500 mt-2 max-w-xs'>
                                Your loan application has been received. Our team will review it within 2-3 business days.
                            </p>
                            <div className='mt-6 border-2 border-indigo-200 rounded-xl px-3 py-3 text-center'>
                                <p className='text-[10px] font-bold text-gray-400 tracking-wide uppercase'>Reference Number</p>
                                <p className='text-sm font-bold text-gray-800'>{referenceNumber || "-"}</p>
                            </div>
                            <button onClick={onClose} className='mt-8 px-6 py-2.5 rounded-xl border-2 border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition'>
                                Close
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div key={step}
                            initial={{opacity: 0, x: 12}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: -12}}
                            transition={{duration: 0.2}}
                            className='flex flex-col flex-1'
                        >
                            <span className={`w-fit text-[11px] font-bold px-3 py-1 rounded-full ${colors.badge}`}>
                                {current.badge}
                            </span>
                            <h2 className='text-2xl font-bold text-gray-800 mt-3'>{current.heading}</h2>
                            <p className='text-sm text-gray-400 mb-6'>{current.subtitle}</p>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{opacity: 0, y: -8}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0}}
                                        className='flex items-center gap-2 bg-red-50 border border-red-200 text-red-600text-sm rounded-xl px-4 py-3 mb-5'
                                    >
                                        <TriangleAlert size={15} className='flex-shrink-0' /> {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className='flex-1'>
                                {step === 0 && (
                                    <div className='flex flex-col gap-5'>
                                        <div>
                                            <label className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Loan Type</label>
                                            <div className='grid grid-cols-5 gap-2 mt-2'>
                                                {Loan_Types.map((t) => (
                                                    <button key={t.key} type='button'
                                                        onClick={() => setForm({ ...form, loanType: t.key, loanAmmount: Math.min(Number(form.loanAmmount) || 1000, t.max) })}
                                                        className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-center transition-all ${
                                                                form.loanType === t.key ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}
                                                    >
                                                        <t.icon size={18} className={form.loanType === t.key ? "text-indigo-600" : "text-gray-400"} />
                                                        <span className='text-xs font-semibold text-gray-700'>{t.label}</span>
                                                        <span className='text-[10px] text-gray-400'>{t.limit}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Loan Amount</label>
                                            <p className='text-2xl font-bold text-emerald-600 mt-1'>Rs.{Number(form.loanAmmount || 0).toLocaleString()}</p>
                                            <input type="range"
                                                min={1000}
                                                max={selectedType.max}
                                                step={1000}
                                                value={form.loanAmmount}
                                                onChange={(e) => setForm({ ...form, loanAmmount: e.target.value })}
                                                className='w-full accent-indigo-600 mt-2' 
                                            />
                                            <div className='flex justify-between text-[11px] text-gray-400'>
                                                <span>1000</span>
                                                <span>{selectedType.max.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className='grid grid-cols-2 gap-4'>
                                            <Select label="Loan Term" value={form.loanTerm} onChange={set("loanTerm")}>
                                                <option value="12">12 months</option>
                                                <option value="24">24 months</option>
                                                <option value="36">36 months</option>
                                                <option value="48">48 months</option>
                                                <option value="60">60 months</option>
                                            </Select>
                                            <Select label="Interest Rate Type" value={form.interestRateType} onChange={set("interestRateType")}>
                                                <option value="fixed">Fixed Rate</option>
                                                <option value="variable">Variable Rate</option>
                                            </Select>
                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <label className='text-xs font-semibold text-gray-600'>Purpose / Description</label>
                                            <textarea 
                                                value={form.purpose}
                                                onChange={set("purpose")}
                                                placeholder='Briefly describe the purpose of this loan...'
                                                rows={3}
                                                className='border-2 border-gray-300 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm outline-none bg-white transition-colors placeholder:text-gray-300 resize-none'
                                            />
                                        </div>
                                    </div>
                                )}

                                {step === 1 && (
                                    <div className='flex flex-col gap-5'>
                                        <div>
                                            <p className='text-xs font-bold text-gray-500 uppercase tracking-wide mb-3'>Account Information</p>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <Field icon={Hash} label={"Account Number"} value={form.accountNumber} onChange={set("accountNumber")} placeholder="Ex: 160-xxx-xxx-xxxx" />
                                                <Select icon={Wallet} label={"Account Type"} value={form.accountType} onChange={set("accountType")} >
                                                    <option value="saving">Saving</option>
                                                    <option value="fixed">Fixed deposit</option>
                                                </Select>
                                                <Field icon={AtSign} label={"User Name / Member ID"} value={form.userName} onChange={set("userName")} placeholder="Kamal" />
                                                <Select icon={ShieldCheck} label={"Status"} value={form.status} onChange={set("status")} >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </Select>
                                            </div>
                                        </div>
                                        <div>
                                            <p className='text-xs font-bold text-gray-500 uppercase tracking-wide mb-3'>Repayment Information</p>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <Select label="Repayment Method" value={form.repaymentMethod} onChange={set("repaymentMethod")}>
                                                    <option value="auto">Auto Debit</option>
                                                    <option value="manual">Manual</option>
                                                </Select>
                                                <Field icon={Calendar} label="Repayment Date" type="date" value={form.repaymentDate} onChange={set("repaymentDate")} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className='flex flex-col gap-5'>
                                        <div className='grid grid-cols-3 gap-4'>
                                            <Field icon={User} label="First name" value={form.firstName} onChange={set("firstName")} placeholder="Malith" />
                                            <Field icon={User} label="Last name" value={form.lastName} onChange={set("lastName")} placeholder="Senad" />
                                            <Field icon={Phone} label="Phone Number" value={form.phoneNumber} onChange={set("phoneNumber")} placeholder="077 xxx xxxx" />
                                            <Field icon={CreditCard} label="NIC number" value={form.NIC} onChange={set("NIC")} placeholder="200345315560" />
                                            <Field icon={Calendar} label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
                                            <Field icon={Mail} label="Email Address" value={form.email} onChange={set("email")} placeholder="example@gmail.com" />
                                        </div>
                                        <div>
                                            <p className='text-xs font-bold text-gray-500 uppercase tracking-wide mb-3'>Address & Contact</p>
                                            <div className='flex flex-col gap-4'>
                                                <Field icon={Home} label="Address Line" value={form.addressLine} onChange={set("addressLine")} placeholder="Peradeniya, Kandy" />
                                                <div className='grid grid-cols-3 gap-4'>
                                                    <Field icon={MapPin} label="City" value={form.city} onChange={set("city")} placeholder="Kandy" />
                                                    <Field label="District" value={form.district} onChange={set("district")} placeholder="Kandy" />
                                                    <Field icon={Hash} label="Postal Code" value={form.postalCode} onChange={set("postalCode")} placeholder="EX: 80000" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className='flex flex-col gap-4'>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <SummaryCard title="Loan Details" icon={Wallet} color="indigo" rows={[
                                                ["Loan Type", Loan_Types.find((t) => t.key === form.loanType)?.label],
                                                ["Loan Amount", Number(form.loanAmmount || 0).toLocaleString()],
                                                ["Term", `${form.loanTerm} months`],
                                                ["Rate Type", form.interestRateType === "fixed" ? "Fixed Rate" : "Variable Rate"],
                                            ]} />
                                            <SummaryCard title="Account Details" icon={CreditCard} color="purple" rows={[
                                                ["Account Number", form.accountNumber],
                                                ["Account Type", form.accountType === "fixed" ? "Fixed Deposit" : "Savings"],
                                                ["Repayment", form.repaymentMethod === "auto" ? "Auto Debit" : "Manual"],
                                                ["Repayment Date", form.repaymentDate],
                                            ]} />
                                        </div>
                                        <SummaryCard title="Personal Info" icon={User} color="pink" rows={[
                                            ["Full Name", `${form.firstName} ${form.lastName}`],
                                            ["NIC", form.NIC],
                                            ["Address", `${form.addressLine}, ${form.city}`],
                                            ["Phone", form.phoneNumber],
                                            ["Email", form.email],
                                        ]} />

                                        <label className='flex items-start gap-2 rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-gray-700 cursor-pointer'>
                                            <input type="checkbox" checked={form.agreed} onChange={(e) => setForm({ ...form, agreed: e.target.checked })} className='mt-0.5 accent-emerald-600' />
                                            I confirm that all information provided is accurate and I agree to Hela-COOP's Loan Term & Conditions and Privacy Policy.
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className='mt-6 pt-4 border-t border-gray-100 flex items-center gap-4'>
                                {step > 0 ? (
                                    <button type='button' onClick={handleBack} className='flex items-center gap-1 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition'>
                                        <ChevronLeft size={15} /> Back
                                    </button>
                                ) : <div />}

                                <div className='flex-1 flex flex-col gap-1'>
                                    <div className='w-full h-1.5 bg-gray-100 rounded-full overflow-hidden'>
                                        <motion.div
                                            className={`h-full rounded-full ${colors.progress}`}
                                            initial={false}
                                            animate={{width: `${((step +1) / STEPS.length) * 100}%`}}
                                            transition={{duration: 0.3}}
                                        />
                                    </div>
                                    <p className='text-[11px] text-gray-400'>Step {step + 1} of {STEPS.length}</p>
                                </div>

                                {step < STEPS.length - 1 ? (
                                    <button type='button' onClick={handleNext} className={`px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${colors.button}`}>
                                        Next
                                    </button>
                                ) : (
                                    <button type='button' onClick={handleSubmit} disabled={submitting} className='flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100'>
                                        {submitting ? <Loader2 size={15} className='animate-spin' /> : null}
                                        {submitting ? "Submitting..." : "Submit Application"}
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
}

export default AddLoan;