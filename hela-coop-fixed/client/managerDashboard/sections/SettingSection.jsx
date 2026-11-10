import React, { useState } from 'react'
import { Info, Users } from 'lucide-react'

const Field = ({ label, defaultValue }) => (
    <div>
        <label className='text-xs font-medium text-gray-400 uppercase tracking-wide'>{label}</label>
        <input
            defaultValue={defaultValue}
            className='w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-lime-400'
        />
    </div>
);

const Toggle = ({ label, desc, defaultOn }) => {
    const [on, setOn] = useState(defaultOn);
    return (
        <div className='flex items-center justify-between py-3 border-b border-gray-100 last:border-0'>
            <div>
                <p className='text-sm font-semibold text-gray-800'>{label}</p>
                <p className='text-xs text-gray-500 mt-0.5'>{desc}</p>
            </div>
            <button
                onClick={() => setOn(!on)}
                className={`w-11 h-6 rounded-full flex-shrink-0 flex items-center px-0.5 transition-colors ${on ? "bg-lime-500 justify-end" : "bg-gray-200 justify-start"}`}
            >
                <span className='w-5 h-5 bg-white rounded-full shadow' />
            </button>
        </div>
    );
};

const SettingSection = () => {
    const [notice, setNotice] = useState("");

    const notConnected = (what) => setNotice(`${what} isn't connected to a backend yet.`);

    return (
        <div className='flex flex-col gap-5'>

            <div>
                <h1 className='text-2xl font-serif font-semibold text-gray-800'>Settings</h1>
                <p className='text-sm text-gray-500 mt-1'>Branch profile, staff access & notification preferences</p>
            </div>

            {notice && (
                <div className='flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-700 text-sm rounded-xl px-4 py-3'>
                    <Info size={15} className='flex-shrink-0' /> {notice}
                </div>
            )}

            <div className='grid grid-cols-2 gap-4 items-start'>

                <div className='flex flex-col gap-5'>
                    <div className='bg-white rounded-2xl p-5 shadow-sm'>
                        <p className='font-semibold text-gray-800'>Branch Profile</p>
                        <p className='text-xs text-gray-500 mb-4'>Basic information shown across statements and reports.</p>
                        <div className='grid grid-cols-2 gap-3'>
                            <Field label='Branch Name' defaultValue='' />
                            <Field label='Branch Code' defaultValue='' />
                            <div className='col-span-2'><Field label='Address' defaultValue='' /></div>
                            <Field label='Contact Phone' defaultValue='' />
                            <Field label='Branch Manager' defaultValue='' />
                        </div>
                        <button
                            onClick={() => notConnected("Saving branch profile changes")}
                            className='mt-4 bg-lime-400 hover:bg-lime-500 rounded-full px-5 py-2 text-sm font-semibold transition-colors'
                        >
                            Save Changes
                        </button>
                    </div>

                    <div className='bg-white rounded-2xl p-5 shadow-sm'>
                        <p className='font-semibold text-gray-800'>Staff & Access</p>
                        <p className='text-xs text-gray-500 mb-4'>Manage who can access this dashboard.</p>
                        <div className='flex flex-col items-center gap-2 text-center py-8'>
                            <Users size={22} className='text-gray-300' />
                            <p className='text-sm text-gray-400'>Staff list can't be loaded here — the backend's staff-listing endpoint is restricted to the admin role, not manager.</p>
                        </div>
                        <button
                            onClick={() => notConnected("Adding a staff member")}
                            className='bg-lime-400 hover:bg-lime-500 rounded-full px-5 py-2 text-sm font-semibold transition-colors'
                        >
                            + Add Staff Member
                        </button>
                    </div>
                </div>

                <div className='flex flex-col gap-5'>
                    <div className='bg-white rounded-2xl p-5 shadow-sm'>
                        <p className='font-semibold text-gray-800'>Notification Preferences</p>
                        <p className='text-xs text-gray-500 mb-2'>Choose what you get alerted about. (Toggles here are visual only — nothing is saved yet.)</p>
                        <Toggle label='Overdue loan alerts' desc='Email when a loan becomes overdue' defaultOn={true} />
                        <Toggle label='Large transaction alerts' desc='SMS for transactions above Rs. 500,000' defaultOn={true} />
                        <Toggle label='Daily summary report' desc='Emailed every day at 6:00 PM' defaultOn={false} />
                        <Toggle label='Maturing fixed deposit reminders' desc='3 days before maturity' defaultOn={true} />
                    </div>

                    <div className='bg-white rounded-2xl p-5 shadow-sm'>
                        <p className='font-semibold text-gray-800'>Security</p>
                        <p className='text-xs text-gray-500 mb-2'>Keep this account and its data protected. (Toggles here are visual only — nothing is saved yet.)</p>
                        <Toggle label='Two-factor authentication' desc='Require OTP at every login' defaultOn={false} />
                        <Toggle label='Auto-lock inactive session' desc='Log out after 15 minutes idle' defaultOn={false} />
                        <button
                            onClick={() => notConnected("Self-service password change")}
                            className='mt-3 rounded-full px-5 py-2 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors'
                        >
                            Change Password
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default SettingSection
