import React, { useState } from 'react'
import { AnimatePresence, motion } from "motion/react";
import Sidebar, { NAV_ITEMS } from './Sidebar';

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
                            {/* TODO: swap for the real section components as each one is built */}
                            <h2 className='text-2xl font-semibold'>{activeLabel}</h2>
                            <p className='text-gray-500 mt-2'>{activeLabel} section coming soon.</p>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    )
}

export default ManagerDashboard
