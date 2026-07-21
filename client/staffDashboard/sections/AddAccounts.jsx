import { CheckCircle, Loader2, TriangleAlert, UserPlus, X } from 'lucide-react';
import React, { useState } from 'react'
import { addCustomer, findCustomerByNIC } from '../../../client/src/api/customerApi';
import { createSavingsAccount } from '../../src/api/accountsApi';

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

const Field = ({ label, ...props}) => (
    <div className='flex flex-col gap-1'>
        <label className='text-xs font-semibold text-gray-600'>{label}</label>
        <input {...props} className='border-2 border-gray-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none bg-white transition' />
    </div>
);

const AddAccounts = ({ onClose, onCreated }) => {

    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if(form.accountType === "fixed" && !form.durationMonths){
            setError("Pick a term for the fixed deposit");
            return;
        }
        if(!form.initailDeposits || Number(form.initailDeposits) <= 0){
            setError("Initial deposit must be greater than 0");
            return;
        }
        
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

            await createSavingsAccount({
                customerNumber: customer.customerNumber,
                accountType: form.accountType,
                durationMonths: form.accountType === "fixed" ? Number(form.durationMonths) : undefined,
                initialDeposit: Number(form.initailDeposits),
             });

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
    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
        <div className='bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            {success ? (
                <div className='p-10 flex flex-col items-center text-center'>
                    <CheckCircle size={70} className='text-emerald-600 mb-4' />
                    <h2 className='text-2xl font-bold'>Success</h2>
                    <p className='text-gray-600 mb-2'>Member & account created successfully</p>
                    <button onClick={() => {
                        onClose();
                    }} className='mt-6 bg-emerald-600 text-white px-6 py-2 rounded-xl'
                    >
                        Ok
                    </button>
                </div>
            ) : (
                <>
                    <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white'> 
                        <div className='flex items-center gap-2 font-bold text-gray-800'>
                            <UserPlus size={18} className='text-emerald-600' /> New member & account
                        </div>
                        <button onClick={onClose} className='text-gray-400 hover:text-gray-600'>
                            <X size={18} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className='flex flex-col gap-5 px-6 py-5'>
                        {error && (
                            <div className='flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3'>
                                <TriangleAlert size={15} className='flex-shrink-0' /> {error} 
                            </div>
                        )}

                        <div>
                            <p className='text-sm font-bold text-gray-700 mb-3'>Member details</p>
                            <div className='grid grid-cols-2 gap-3'>
                                <Field label="First name" value={form.firstName} onChange={set("firstName")} placeholder="Nimal" required />
                                <Field label="Last name" value={form.lastName} onChange={set("lastName")} placeholder="Perera" required />
                                <Field label="NIC" value={form.NIC} onChange={set("NIC")} placeholder="200345712643" required />
                                <Field label="Date of birth" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} required />
                                <Field label="Email" type="email" value={form.email} onChange={set("email")} placeholder="name@gmail.com" required />
                                <Field label="Phone number" value={form.phoneNumber} onChange={set("phoneNumber")} placeholder="07x xxxx xxx" required />
                                <Field label="Occupation" value={form.occupation} onChange={set("occupation")} placeholder="Worker" required />
                                <Field label="City" value={form.city} onChange={set("city")} placeholder="Galle" required />
                                <Field label="Postal code" value={form.postalCode} onChange={set("postalCode")} placeholder="80130" required />
                                <div className='col-span-2'>
                                    <Field label="address" value={form.address} onChange={set("address")} placeholder="12/b bazaar road" required />
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className='text-sm font-bold text-gray-700 mb-3'>Account details</p>
                            <div className='grid grid-cols-2 gap-3'>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-xs font-semibold text-gray-600 '> Account type </label>
                                    <select 
                                        value={form.accountType}
                                        onChange={set("accountType")}
                                        className='border-2 border-gray-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none bg-transition transition'
                                    >
                                        <option value='regular'>Regular</option>
                                        <option value='fixed'>Fixed deposit</option>
                                    </select>
                                </div>

                                {form.accountType === "fixed" && (
                                    <div className='flex flex-col gap-1'>
                                        <label className='text-xs font-semibold text-gray-600'>Term (months)</label>
                                        <select 
                                            value={form.durationMonths}
                                            onChange={set("durationMonths")}
                                            className='border-2 border-gray-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none bg-white transition'
                                        >
                                            <option value="1">1 year</option>
                                            <option value="3">3 year</option>
                                            <option value="5">5 year</option>
                                        </select>
                                    </div>
                                )}

                                <Field label='Initial deposit (Rs.)' type='number' min='1' value={form.initailDeposits} onChange={set("initailDeposits")} placeholder='50000' required />
                            </div>
                        </div>

                        <div className='flex justify-end gap-3 pt-2 border-t border-gray-100'>
                            <button type='button' onClick={onClose} className='px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition'>
                                Cancel
                            </button>
                            <button type='submit' disabled={submitting} className='flex items-center gap-3 px-6 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#245a41] transition disabled:opacity-50'>
                                {submitting ? <Loader2 size={15} className='animate-spin' /> : null}
                                {submitting ? "Creating..." : "Create member & account"}
                            </button>
                        </div>
                    </form>
                </>
            )}
            
        </div>
    </div>
  )
};
export default AddAccounts