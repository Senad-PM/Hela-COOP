import React, { useState } from 'react'
import { AnimatePresence, motion } from "motion/react";
import Sidebar, { NAV_ITEMS } from './Sidebar';
import OverviewSection from './sections/OverviewSection';
import AccountsSection from './sections/AccountsSection';
import TransactionSection from './sections/TransactionSection';
import LoansSection from './sections/LoansSection';
import ReportsSection from './sections/ReportsSection';
import SettingSection from './sections/SettingSection';

const ManagerDashboard = () => {

    const [activeSection, setActiveSection] = useState("overview");
    const activeLabel = NAV_ITEMS.find((item) => item.key === activeSection)?.label ?? "Overview";

    return (
        <section className='w-full h-screen bg-[#0d1f1a] p-6 overflow-hidden'>
            <div className='flex h-full gap-6'>

                <Sidebar activeSection={activeSection} onSelect={setActiveSection} />

                <div className='flex-1 h-full rounded-2xl bg-[#f5f0e8] p-5 overflow-auto'>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                            {activeSection === 'overview' ? (
                                <OverviewSection onNavigate={setActiveSection} />
                            ) : activeSection === 'accounts' ? (
                                <AccountsSection />
                            ) : activeSection === 'transactions' ? (
                                <TransactionSection />
                            ) : activeSection === 'loans' ? (
                                <LoansSection />
                            ) : activeSection === 'reports' ? (
                                <ReportsSection />
                            ) : (
                                <SettingSection />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    )
}

export default ManagerDashboard
