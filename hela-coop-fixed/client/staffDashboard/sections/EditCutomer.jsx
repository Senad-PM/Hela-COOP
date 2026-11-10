import React, { useEffect, useState } from 'react'
import { X, User, MapPin, ToggleRight, Loader2, TriangleAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { updateCustomer } from '../../src/api/customerApi';

const STATUSES = [
    { key: "active", label: "Active", pill: "border-green-500 text-green-600" },
    { key: "dormant", label: "Dormant", pill: "border-gray-400 text-gray-500" },
    { key: "suspended", label: "Suspended", pill: "border-red-400 text-red-500" },
];

const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

const initials = (c) =>
    `${(c.firstName || "?")[0]}${(c.lastName || "")[0] || ""}`.toUpperCase();

const inputClass =
    "w-full border-2 border-green-300 focus:border-green-600 rounded-full px-4 py-2 text-sm text-gray-700 outline-none bg-transparent transition-colors placeholder:text-gray-400";

const Field = ({ label, children }) => (
    <div className='flex flex-col gap-1'>
        <label className='text-sm font-semibold text-gray-700'>{label}</label>
        {children}
    </div>
);

const SectionTitle = ({ icon: Icon, title, color }) => (
    <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide pb-2 border-b border-gray-400 ${color}`}>
        <Icon size={14} /> {title}
    </div>
);

const Toggle = ({ checked, onChange, label }) => (
    <button type='button' role='switch' aria-checked={checked} aria-label={label} onClick={onChange}
        className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-green-600" : "bg-gray-300"}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
);

const EditCustomer = ({ customer, onClose, onSaved }) => {
    const [form, setForm] = useState({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        NIC: customer.NIC || "",
        dateOfBirth: toDateInput(customer.dateOfBirth),
        occupation: customer.occupation || "",
        phoneNumber: customer.phoneNumber || "",
        email: customer.email || "",
        address: customer.address || "",
        city: customer.city || "",
        district: customer.district || "",
        postalCode: customer.postalCode || "",
        status: customer.status || "active",
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const validate = () => {
        if (!form.firstName.trim() || !form.lastName.trim()) return "First and last name are required.";
        if (!form.NIC.trim()) return "NIC number is required.";
        if (!form.phoneNumber.trim()) return "Phone number is required.";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email address.";
        return "";
    };

    const handleSave = async () => {
        const msg = validate();
        if (msg) { setError(msg); return; }
        setError("");
        setSaving(true);
        try {
            const payload = {
                ...form,
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                NIC: form.NIC.trim(),
                email: form.email.trim(),
                phoneNumber: form.phoneNumber.trim(),
            };
            await updateCustomer(customer.customerNumber, payload);
            onSaved({ ...customer, ...payload });
        } catch (err) {
            setError(err.response?.data?.message || "Could not save changes. Try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xl'
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className='bg-[#e8e6da] rounded-3xl w-full max-w-3xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col'
            >
                {/* Header */}
                <div className='flex items-center justify-between bg-green-600 text-white px-8 py-4 flex-shrink-0'>
                    <div className='flex items-center gap-3'>
                        <User size={28} />
                        <div>
                            <h2 className='text-xl font-bold leading-tight'>Edit Customer</h2>
                            <p className='text-xs text-green-100'>Update member information below</p>
                        </div>
                    </div>
                    <button onClick={onClose} aria-label='Close'
                        className='border border-white/70 rounded-md p-0.5 hover:bg-white/20 transition'>
                        <X size={18} />
                    </button>
                </div>

                <div className='overflow-y-auto px-8 py-6 flex flex-col gap-6'>
                    {/* Member card */}
                    <div className='flex items-center gap-4 bg-[#d0cfdf] rounded-2xl px-5 py-4'>
                        <div className='w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold'>
                            {initials(customer)}
                        </div>
                        <div>
                            <p className='font-bold text-gray-900 text-lg'>{customer.firstName} {customer.lastName}</p>
                            <p className='text-xs text-gray-600'>{customer.customerNumber || "-"}</p>
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className='flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3'>
                                <TriangleAlert size={15} className='flex-shrink-0' /> {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Personal */}
                    <div className='flex flex-col gap-4'>
                        <SectionTitle icon={User} title="Personal information" color="text-indigo-500" />
                        <div className='grid grid-cols-2 gap-x-6 gap-y-3'>
                            <Field label="First name"><input className={inputClass} value={form.firstName} onChange={set("firstName")} /></Field>
                            <Field label="Last name"><input className={inputClass} value={form.lastName} onChange={set("lastName")} /></Field>
                            <Field label="NIC number"><input className={inputClass} value={form.NIC} onChange={set("NIC")} /></Field>
                            <Field label="Date of birth"><input type="date" className={inputClass} value={form.dateOfBirth} onChange={set("dateOfBirth")} /></Field>
                            <div className='col-span-2'>
                                <Field label="Occupation"><input className={inputClass} value={form.occupation} onChange={set("occupation")} /></Field>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className='flex flex-col gap-4'>
                        <SectionTitle icon={MapPin} title="Contact and address" color="text-pink-500" />
                        <div className='grid grid-cols-2 gap-x-6 gap-y-3'>
                            <Field label="Phone number"><input className={inputClass} value={form.phoneNumber} onChange={set("phoneNumber")} /></Field>
                            <Field label="Email address"><input type="email" className={inputClass} value={form.email} onChange={set("email")} /></Field>
                            <div className='col-span-2'>
                                <Field label="Address line"><input className={inputClass} value={form.address} onChange={set("address")} /></Field>
                            </div>
                        </div>
                        <div className='grid grid-cols-3 gap-x-6'>
                            <Field label="City"><input className={inputClass} value={form.city} onChange={set("city")} /></Field>
                            <Field label="District"><input className={inputClass} value={form.district} onChange={set("district")} /></Field>
                            <Field label="Postal code"><input className={inputClass} value={form.postalCode} onChange={set("postalCode")} /></Field>
                        </div>
                    </div>

                    {/* Status */}
                    <div className='flex flex-col gap-4'>
                        <SectionTitle icon={ToggleRight} title="Account status" color="text-purple-500" />
                        <div className='flex flex-col gap-3'>
                            {STATUSES.map((s) => (
                                <div key={s.key} className='flex items-center gap-10'>
                                    <span className={`w-28 text-center text-xs font-semibold border rounded-lg py-1.5 ${s.pill}`}>{s.label}</span>
                                    <Toggle checked={form.status === s.key} label={s.label}
                                        onChange={() => setForm({ ...form, status: s.key })} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='flex justify-end gap-3 pt-2'>
                        <button type='button' onClick={onClose}
                            className='px-6 py-2 rounded-lg border-2 border-gray-300 text-sm font-semibold text-gray-500 hover:bg-white/50 transition'>
                            Cancel
                        </button>
                        <button type='button' onClick={handleSave} disabled={saving}
                            className='flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50'>
                            {saving && <Loader2 size={14} className='animate-spin' />}
                            {saving ? "Saving..." : "Save change"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EditCustomer
