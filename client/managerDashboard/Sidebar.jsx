import React from 'react'
import { LayoutGrid, Users, ArrowLeftRight, Landmark, LineChart, Settings as SettingsIcon } from "lucide-react";
import { motion } from "motion/react";

export const NAV_ITEMS = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "accounts", label: "Accounts", icon: Users },
    { key: "transactions", label: "Transactions", icon: ArrowLeftRight },
    { key: "loans", label: "Loans", icon: Landmark },
    { key: "reports", label: "Reports", icon: LineChart },
    { key: "settings", label: "Settings", icon: SettingsIcon },
];

const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
    <div onClick={onClick}
        className={`relative group flex items-center gap-3 cursor-pointer rounded-xl px-3 py-2.5 transition-colors duration-200 hover:translate-x-1 ${
            isActive ? "bg-lime-300" : "text-gray-300 hover:text-lime-200"
        }`}
    >
        {isActive && (
            <motion.div
                layoutId='managerActiveNavPill'
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

const Sidebar = ({ activeSection, onSelect, user }) => {

    const role = localStorage.getItem("role");
    const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "Manager";
    const displayName = user?.name || "Manager";
    const displayTitle = user?.title || "Branch Manager";
    const initials = displayName
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className='flex flex-col w-64 flex-shrink-0 text-white h-full'>
            <h1 className='text-3xl font-bold' style={{ fontFamily: '"Antonio", serif' }}>
                Hela <span className='text-lime-400'>COOP</span>
            </h1>
            <span className='mt-2 w-fit text-xs font-semibold bg-lime-800/70 text-lime-300 px-3 py-1 rounded-full'>
                {roleLabel}
            </span>
            <hr className='mt-5 border-t border-gray-700' />

            <nav className='flex flex-col mt-6 gap-1'>
                {NAV_ITEMS.map((item) => (
                    <NavItem
                        key={item.key}
                        icon={item.icon}
                        label={item.label}
                        isActive={activeSection === item.key}
                        onClick={() => onSelect(item.key)}
                    />
                ))}
            </nav>

            <div className='mt-auto flex items-center gap-3 pt-5 border-t border-gray-700'>
                <div className='flex items-center justify-center w-9 h-9 rounded-full bg-lime-400 text-black font-semibold text-sm flex-shrink-0'>
                    {initials || "M"}
                </div>
                <div className='flex flex-col leading-tight overflow-hidden'>
                    <span className='text-sm font-semibold truncate'>{displayName}</span>
                    <span className='text-xs text-gray-400 truncate'>{displayTitle}</span>
                </div>
            </div>
        </div>
    )
}

export default Sidebar