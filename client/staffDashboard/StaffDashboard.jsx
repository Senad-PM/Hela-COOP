import React, { useState } from 'react'
import { LayoutGrid, Users, ArrowLeftRight, Landmark, LineChart, Settings as SettingsIcon, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import OverviewSection from './sections/OverviewSection';
import AccountsSection from "./sections/AccountsSection";
import TransactionsSection from "./sections/TransactionsSection";
import LoansSection from "./sections/LoansSection";
import ReportsSection from "./sections/ReportsSection";
import SettingsSection from "./sections/SettingsSection";
import { useNavigate } from 'react-router-dom';
import CustomerSection from './sections/CustomerSection';

const NAV_ITEMS = [
    { key: "overview", label: "Overview", icon: LayoutGrid, Component: OverviewSection },
    { key: "accounts", label: "Accounts", icon: Users, Component: AccountsSection },
    { key: "customer", label: "Customer", icon: User, Component: CustomerSection },
    { key: "transactions", label: "Transactions", icon: ArrowLeftRight, Component: TransactionsSection },
    { key: "loans", label: "Loans", icon: Landmark, Component: LoansSection },
    { key: "reports", label: "Reports", icon: LineChart, Component: ReportsSection },
    { key: "settings", label: "Settings", icon: SettingsIcon, Component: SettingsSection },
];

const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
    <div onClick={onClick}
        className={`relative group flex items-center gap-3 cursor-pointer rounded-xl px-3 py-2.5 transition-colors duration-200 hover:translate-x-1 ${
            isActive ? "bg-lime-300" : "text-gray-300 hover:text-lime-200"
        }`}
    >
        {isActive && (
            <motion.div 
                layoutId='staffActiveNavPill'
                className='absolute inset-0 bg-lime-800/60 border-l-4 border-lime-400 rounded-xl'
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
        )}
        <div className='relative flex items-center gap-3'>
            <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
            <span className='font-medium'>{label}</span>
        </div>
    </div>
);

const StaffDashboard = () => {

    const [activeSection, setActiveSection] = useState("overview");
    const role = localStorage.getItem("role");
    const rolelable = role ? role.charAt(0).toUpperCase() + role.slice(1) : "staff";
    const ActiveComponent = NAV_ITEMS.find((item) => item.key === activeSection)?.Component ?? OverviewSection; 

    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        navigate("/");
    };


  return (
    <section className='w-full h-screen bg-[#0d1f1a] p-6 overflow-hidden'>
        <div className='flex h-full gap-6'>

            <div className='flex flex-col w-64 flex-shrink-0 text-white'>
                <h1 className='text-3xl font-bold ' style={{ fontFamily: '"Antonio", serif' }}>
                    Hela <span className='text-lime-400'>COOP</span>
                </h1>
                <span className='mt-2 w-fit text-xs font-semibold bg-lime-800/70 text-lime-300 px-3 py-1 rounded-full'>
                    {rolelable}
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
                <div className='mt-auto flex items-center gap-3 pt-5 border-t border-gray-700'>
                    <div className='flex items-center justify-center w-9 h-9 rounded-full bg-lime-400 text-black font-semibold text-sm flex-shrink-0'>
                        {rolelable.charAt(0)}
                    </div>
                    <div className='flex flex-col leading-tight overflow-hidden flex-1 min-w-0'>
                        <span className='text-sm font-semibold truncate'>{rolelable}</span>
                        <span className='text-xs text-gray-400 truncate'>Hela COOP</span>
                    </div>
                    <button
                        onClick={handleLogOut}
                        title='Logout'
                        aria-label='Logout'
                        className='flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer'
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

            <div className='flex-1 h-full rounded-2xl bg-[#f5f0e8] p-5 overflow-auto'>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                        <ActiveComponent onNavigate={setActiveSection} />
                    </motion.div>
                </AnimatePresence>
            </div>

        </div>
    </section>
  )
}

export default StaffDashboard