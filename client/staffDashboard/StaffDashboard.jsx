import React, { useState } from 'react'
import { LayoutGrid, Users, ArrowLeftRight, Landmark, LineChart, Settings as SettingsIcon } from "lucide-react";
import OverviewSection from './sections/ OverviewSection';
import AccountsSection from "./sections/AccountsSection";
import TransactionsSection from "./sections/TransactionsSection";
import LoansSection from "./sections/LoansSection";
import ReportsSection from "./sections/ReportsSection";
import SettingsSection from "./sections/SettingsSection";

const NAV_ITEMS = [
    { key: "overview", label: "Overview", icon: LayoutGrid, Component: OverviewSection },
    {key: "accounts", label: "Accounts", icon: Users, Component: AccountsSection},
    {key: "transactions", label: "Transactions", icon: ArrowLeftRight, Component: TransactionsSection},
    {key: "loans", label: "Loans", icon: Landmark, Component: LoansSection},
    {key: "reports", label: "Reports", icon: LineChart, Component: ReportsSection},
    {key: "settings", label: "Settings", icon: SettingsIcon, Component: SettingsSection},
];

const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
    <div onClick={onClick}
        className={`flex items-center gap-3 cursor-pointer rounded-xl px-3 py-2.5 transition-all duration-200 ${
            isActive 
            ? "bg-emerald-800/60 text-emerald-300 border-l-4 border-emerald-400"
            : "text-gray-300 border-l-4 border-transparent hover:bg-emerald-900/40 hover:text-emerald-200"
        }`}
    >
        <Icon size={18} />
        <span className='font-medium'>{label}</span>
    </div>
);

const StaffDashboard = () => {

    const [activeSection, setActiveSection] = useState("overview");
    const role = localStorage.getItem("role");
    const roleLable = role ? role.charAt(0).toUpperCase() + role.slice(1) : "staff";
    const ActiveComponent = NAV_ITEMS.find((item) => item.key === activeSection)?.component ?? OverviewSection; 

  return (
    <section className='w-full h-screen bg-[#0d1f1a] p-6 overflow-hidden'>
        <div className='flex h-full gap-6'>

            <div className='flex flex-col w-64 flex-shrink-0 text-white'>
                <h1 className='text-3xl font-bold ' style={{ fontFamily: '"Antonio", serif' }}>
                    Hela <span className='text-emerald-400'>COOP</span>
                </h1>
                <span className='mt-2 w-fit text-xs font-semibold bg-emerald-800/70 text-emerald-300 px-3 py-1 rounded-full'>
                    {roleLable}
                </span>
                <hr className='mt-5 border-t border-gray-700' />

                <nav className='flex flex-col mt-6 gap-1'>
                    {NAV_ITEMS.map((item) => (
                        <NavItem 
                            key={item.key}
                            icon={item.icon}
                            label={item.label}
                            isActive={activeSection === item.key}
                            onClick={() => setActiveSection(item.key)}
                        />
                    ))}
                </nav>
            </div>

            <div className='flex-1 h-full rounded-2xl bg-[#f5f0e8] p-5 overflow-auto'>
                <ActiveComponent onNavigate={setActiveSection} />
            </div>

        </div>
    </section>
  )
}

export default StaffDashboard