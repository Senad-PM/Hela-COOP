import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { SplitText, gsap }from 'gsap/all'
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Star, UserPlus, ChevronRight, AtSign, Landmark, MapPin, Stars, Users, Sparkles, Clock, ShieldCheck, Lock, KeyRound, Radar, BellRing, CheckCircle2, Gift } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import CountUp from '../components/CountUp'

const Home = () => {

    const sectionRef = useRef(null)
    const sliderRef = useRef(null)

    const heroRoles = ['Members', 'Treasurers', 'Staff', 'Everyone']
    const [roleIndex, setRoleIndex] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => {
            setRoleIndex((i) => (i + 1) % heroRoles.length)
        }, 2200)
        return () => clearInterval(interval)
    }, [])

    useGSAP(() => {

        gsap.registerPlugin(SplitText, ScrollTrigger)

        gsap.to(".title", {
          duration: 5,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: 'power4.out',
        });

        const m1Split = SplitText.create(".m1", {
            type: "words",
        });
        const m2Split = SplitText.create(".m2", {
            type: "words",
        });
        const m3Split = SplitText.create(".m3", {
            type: "words",
        });

        const t1 = gsap.timeline({
            scrollTrigger: {
                trigger: ".splitContent",
                start: "top 80%",
                end: "bottom 50%",
                scrub: true,
                pin: false,
            },
        });
        t1.to(m1Split.words, {
            color: "#10b981",
            stagger: 0.1,
            ease: "power1.in",
        })
        .to(m2Split.words, {
            color: "#10b981",
            stagger: 0.1,
            ease: "power1.in",
        })
        .to(m3Split.words, {
            color: "#10b981",
            stagger: 0.1,
            ease: "power1.in",
        })

        const slider = sliderRef.current
        const section = sectionRef.current

        if(slider && section) {
            const totalWidth = slider.scrollWidth - window.innerWidth

            gsap.to(slider, {
                x: -totalWidth,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: () => `+=${totalWidth}`,
                    scrub: 1,
                    pin: true,
                },
            });
        }
        return() => {
            ScrollTrigger.getAll().forEach(t => t.kill())
        }
    })

    const testimonials = [
        {
            id: 1,
            name: "Ravindra Silva",
            role: "CEO Hela-COOP",
            message: "HelaCOOP was my dream. I wanted to give everyone a simple, fair banking experience with nothing hidden. Today, that dream is real. I use it every day.",
        },
        {
            id: 2,
            name: "Nihal Jayawardena",
            role: "Board Member, HelaCOOP",
            message: "I've worked in banking for 20 years. HelaCOOP is the simplest and most trustworthy digital banking experience I've seen. Not as a CEO, but as an ordinary customer — I recommend this.",
        },
        {
            id: 3,
            name: "Shanika Perera",
            role: "Secretary, Hela-COOP",
            message: "No time to make banking complicated with piles of papers and fees. With HelaCOOP, everything is simple. As a secretary, I transact every day. Never had a single issue.",
        },
        {
            id: 4,
            name: "Kamal Dissanayake",
            role: "Treasurer, Hela-COOP",
            message: "Managing cooperative funds used to mean hours of manual cashbook entries. HelaCOOP cut that work in half. Every rupee is accounted for, and our audits have never been cleaner.",
        },
        {
            id: 5,
            name: "Priya Rathnayake",
            role: "Branch Coordinator, Hela-COOP",
            message: "Our members — most of them not very tech-savvy — picked it up within minutes. When your members trust the system, your whole cooperative runs better. That's what HelaCOOP gave us.",
        },
    ]

  return (
    <>
        <section className='relative min-h-screen flex items-center justify-center pt-16 sm:pt-20 bg-green-50'>
            <div>
                <div className='absolute top-10 left-4 sm:left-5 w-48 sm:w-72 h-48 sm:h-72 bg-lime-400/50 rounded-full blur-3xl animate-pulse'></div>
                <div className='absolute bottom-5 right-3 sm:right-2 w-64 sm:w-96 h-64 sm:h-96 bg-lime-400/50 rounded-full blur-3xl animate-pulse delay-1000'></div>
                <div className='absolute inset-0 m-20 rounded-3xl overflow-hidden'>
                    <img src="/HeroImg.png" alt="" className='w-full h-full object-cover' />
                    <div className='absolute inset-0 bg-black/40'></div>
                </div>
                <div className='relative text-white z-10 text-center'>
                    <div className='p-15'>
                        <div className='title' style={{clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",}}>
                            <h1 className='font-bold font-sans text-9xl' style={{ fontFamily: '"Antonio", serif' }}>Cooperative Finance, Simplified</h1>
                            <div className='flex items-center justify-center mt-5'>
                                <p className='font-semibold font-sans text-2xl mt-5 flex items-center gap-2'> Reliable, secure, and built for 
                                    <AnimatePresence mode='wait'>
                                        <motion.span
                                            key={heroRoles[roleIndex]}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.35, ease: 'easeOut' }}
                                            className='inline-block text-green-300 min-w-[110px] text-left'
                                        >
                                            {heroRoles[roleIndex]}.
                                        </motion.span>
                                    </AnimatePresence>
                                </p>
                            </div>
                        </div>
                        <div className='flex items-center justify-center mt-5'>
                            <button className='text-xl text-black font-semibold rounded-3xl bg-white hover:bg-emerald-400 hover:text-white hover:scale-105 p-3 transition-all duration-300'>Explore Tools</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className='relative bg-green-50 px-8 sm:px-20 z-20'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-6 sm:p-10'>
                {[
                    {icon: Users, value: 10000, suffix: '+', label: "Active members"},
                    {icon: Landmark, value: 450, suffix: 'M+', prefix: 'Rs.', label: "Loans Disbursed"},
                    {icon: MapPin, value: 28, suffix: '+', label: "Branches Served"},
                    {icon: Star, value: 15, suffix: '+', label: "Years of Trust"},
                ].map((stat,i) => (
                    <motion.div key={stat.label}
                        initial={{opacity: 0, y: 24}}
                        animate={{opacity:1, y: 0}}
                        viewport={{once: true, margin: '-40px'}}
                        transition={{duration: 0.45, delay: i * 0.1, ease: 'easeOut'}}
                        className='flex flex-col items-center text-center gap-2 py-2'
                    >
                        <div className='flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50'>
                            <stat.icon size={22} className='text-emerald-600' />
                        </div>
                        <CountUp 
                            value={stat.value}
                            prefix={stat.prefix}
                            suffix={stat.suffix}
                            className='text-3xl sm-text-4xl font-bold text-gray-900'
                            duration={2}
                        />
                        <p className='text-sm text-gray-500 font-medium'>{stat.label}</p>
                    </motion.div>
                ))}
            </div>
        </section>
        <section className='relative pt-1 pb-20 bg-green-50 overflow-hidden'>
            <div className='absolute top-40 -left-20 w-72 h-72 bg-lime-300/30 rounded-full blur-3xl' /> 
            <div className='absolute bottom-10 -right-10 w-80 h-80 bg-emerald-300/30 rounded-full blur-3xl' />

            <div className='relative m-20 mb-0'>
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true, margin: '-60px'}}
                    transition={{duration: 0.5}}
                    className='flex justify-between items-end'
                >
                    <div className='block'>
                        <span className='inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full mb-3'>
                            <Sparkles size={12} /> Modern Finance, Simplified
                        </span>
                        <h2 className='font-bold text-4xl text-gray-900' style={{ fontFamily: '"Antonio", serif' }}>Why choose us?</h2>
                    </div>
                    <div className='block text-right max-w-sm'>
                        <p className='text-gray-500'>Banking made easy, secure & rewarding for you</p>
                    </div>
                </motion.div>

                <div className='grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-5 mt-14'>
                    <motion.div
                        initial={{opacity:0, y: 24}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true, margin: '-60px'}}
                        transition={{duration: 0.5, delay: 0}}
                        whileHover={{y: -6}}
                        className='relative md:col-span-2 md:row-span-2 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_50px_rgba(0,0,0,0.1)] transition-shadow duration-300 p-10 flex flex-col overflow-hidden'
                    >
                        <div className='absolute -top-16 -right-16 w-56 h-56 bg-amber-300/30 rounded-full blur-3xl'></div>
                        <div className='relative flex flex-col lg:flex-row lg:items-center gap-10 flex-1'>
                            <div className='flex flex-col justify-between h-full lg:max-w-[45%]'>
                                <div>
                                    <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-sm'>
                                        <ShieldCheck size={28} className='text-amber-700' />
                                    </div>
                                    <h1 className='font-bold text-2xl text-gray-900 mt-6'>Safe & Secure</h1>
                                    <p className='text-gray-800 mt-2'>We protect every account behind the scenes, so your members can bank with total confidence - no technical know-how required.</p>
                                </div>
                                <div className='flex items-center gap-2 text-sm font-semibold text-amber-700 mt-8'>
                                    Bank-grade Protection <ChevronRight size={16} />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1'> 
                                {[
                                    { icon: Lock, label: 'Your money stays yours' },
                                    { icon: KeyRound, label: 'Only you can log in' },
                                    { icon: Radar, label: 'We watch for anything unusual' },
                                    { icon: BellRing, label: "You're notify right away" },
                                ].map((item) => (
                                    <div key={item.label} className='flex items-center gap-3 bg-white/70 border border-white/70 rounded-2xl px-4 py-3'>
                                        <div className='w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0'>
                                            <item.icon size={15} className='text-amber-700' />
                                        </div>
                                        <span className='text-sm font-medium text-gray-700'>{item.label}</span>
                                        <CheckCircle2 size={14} className='text-emerald-500 ml-auto flex-shrink-0' />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 24}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true, margin: '-60px'}}
                        transition={{duration: 0.5, delay: 0.12}}
                        whileHover={{y: -6}}
                        className='relative rounded-3xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_50px_rgba(0,0,0,0.1)] transition-shadow duration-300 p-7 flex items-center gap-4 overflow-hidden'
                    >
                        <div className='absolute -bottom-10 -right-10 w-32 h-32 bg-sky-300/30 rounded-full blur-3xl'></div>
                        <div className='relative w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center shadow-sm'>
                            <Clock size={24} className='text-sky-700' />
                        </div>
                        <div className='relative'>
                            <h1 className='font-bold text-lg text-gray-900'>Always on</h1>
                            <p className='text-gray-500 text-sm'>24/7 account access from anywhere</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y:24}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true, margin: '-60px'}}
                        transition={{ duration: 0.5, delay: 0.24}}
                        whileHover={{y: -6}}
                        className='relative rounded-3xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_50px_rgba(0,0,0,0.1)] transition-shadow duration-300 p-7 flex items-center gap-4 overflow-hidden'
                    >
                        <div className='absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-300/30 rounded-full blur-3xl'></div>
                        <div className='relative w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center shadow-sm'>
                            <Gift size={24} className='text-cyan-700' />
                        </div>
                        <div className='relative'>
                            <h1 className='font-bold text-lg text-gray-900'>Rewarding</h1>
                            <p className='text-gray-500 text-sm'>Cashback, points & Partner discount</p>
                        </div>
                    </motion.div>

                </div>

            </div>
        </section>
        <section className='splitContent relative min-h-screen flex items-center justify-center bg-[#0d1f1a]'>
            <div className='items-center justify-center text-center text-9xl font-bold p-20 space-y-3 text-[#17161610]' style={{ fontFamily: '"Antonio", serif'}}>
                <h1 className='m1'>Your money. Your community. Your future.</h1>
                <h1 className='m2'>Cooperative finance isn't just a service -</h1>
                <h1 className='m3'>it's a promise we keep together.</h1>
            </div>
        </section>
        <section className='w-full min-h-screen bg-emerald-50 flex flex-col justify-center'>
            <div className='p-20 flex justify-between items-center gap-20'>
                <div className='space-y-5 w-2/3'>
                    <div>
                        <h1 className='text-5xl font-bold'>Your Money.</h1>
                        <h1 className='text-5xl font-bold mt-3'>Your Tools.</h1>
                    </div>
                    <div>
                        <p className='text-lg mt-3'>Safe, Simple, and smart digital banking - all in one place.</p>
                    </div>
                    <div className='w-3/4 mt-10'>
                        <img src="/Images/Landing Page/landing.png" alt="" className='w-full h-full object-cover rounded-3xl' />
                    </div>
                </div>
                <div className='space-y-5'>
                    <div className='flex items-center gap-5 border-b-2 border-b-gray-400'>
                        <div className='w-20 h-20 flex-shrink-0'>
                            <img src="/Images/Landing Page/w1-removebg-preview.png" alt="" className='w-full h-full object-contain' />
                        </div>
                        <div className='pb-2'>
                            <h1 className='font-semibold text-2xl'>Member Ledger</h1>
                            <p>Add credit/debit entries per member instantly</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 border-b-2 border-b-gray-400'>
                        <div className='w-20 h-20 flex-shrink-0'>
                            <img src="/Images/Landing Page/w2-removebg-preview.png" alt="" className='w-full h-full object-contain' />
                        </div>
                        <div className='pb-2'>
                            <h1 className='font-semibold text-2xl'>Savings Collection</h1>
                            <p>Track daily/weekly member savings.</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 border-b-2 border-b-gray-400'>
                        <div className='w-20 h-20 flex-shrink-0'>
                            <img src="/Images/Landing Page/w3-removebg-preview.png" alt="" className='w-full h-full object-contain' />
                        </div>
                        <div className='pb-2'>
                            <h1 className='font-semibold text-2xl'>Loan Management</h1>
                            <p>Monitor repayments & outstanding balance.</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 border-b-2 border-b-gray-400'>
                        <div className='w-20 h-20 flex-shrink-0'>
                            <img src="/Images/Landing Page/w4-removebg-preview.png" alt="" className='w-full h-full object-contain' />
                        </div>
                        <div className='pb-2'>
                            <h1 className='font-semibold text-2xl'>Cashbook Reports</h1>
                            <p>Print daily & monthly summaries for audit.</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 border-b-2 border-b-gray-400'>
                        <div className='w-20 h-20 flex-shrink-0'>
                            <img src="/Images/Landing Page/w5-removebg-preview.png" alt="" className='w-full h-full object-contain' />
                        </div>
                        <div className='pb-2'>
                            <h1 className='font-semibold text-2xl'>Member Ledger</h1>
                            <p>Members check their own balance & history only.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className='w-full min-h-screen bg-emerald-50'>
            <div className='p-20'>
                <div>
                    <h1 className='text-4xl font-bold'>Achieve Your Goals in Three Simple Steps</h1>
                    <p className='w-1/2 mt-3 text-lg'>Open your account, set your goals, and start tracking your finances with ease. Our tools make it simple,fast, and secure.</p>
                    <p className='w-1/2 border-b-2 border-b-gray-500 mt-3'></p>
                </div>
                <div className='flex justify-between items-center mt-20 gap-10'>
                    <div className='space-y-10 w-1/2'>
                        <div className='relative group'>
                            <h1 className='font-semibold text-2xl text-gray-500 hover:text-black transition-all duration-300'><span className='text-2xl'>01.</span> Add Member</h1>
                            <p className='max-h-0 overflow-hidden opacity-0 group-hover:max-h-40 group-hover:opacity-100 ml-5 transition-all duration-500 ease-in-out delay-100 text-gray-600 text-sm mt-1'>
                                Enroll new cooperative members with their personal details, account type, and <br />opening balance - building your member registry securely from day one.
                            </p>
                        </div>
                        <div className='relative group'>
                            <h1 className='font-semibold text-2xl text-gray-500 hover:text-black transition-all duration-300'><span className='text-2xl'>02.</span> Add savings or loan payment to ledger</h1>
                            <p className='max-h-0 overflow-hidden opacity-0 group-hover:max-h-40 group-hover:opacity-100 ml-5 transition-all duration-500 ease-in-out delay-100 text-gray-600 text-sm mt-1'>
                                Post savings deposits or loan repayments directly to the member ledger - balances <br />update instantly, keeping every account accurate and audit-ready.
                            </p>
                        </div>
                        <div className='relative group'>
                            <h1 className='font-semibold text-2xl text-gray-500 hover:text-black transition-all duration-300'><span className='text-2xl'>03.</span> Print cashbook or member balance sheet</h1>
                            <p className='max-h-0 overflow-hidden opacity-0 group-hover:max-h-40 group-hover:opacity-100 ml-5 transition-all duration-500 ease-in-out delay-100 text-gray-600 text-sm mt-1'>
                                Export end-of-day cashbook totals or individual member passbook statements - ready for branch audits, committee reviews, and regulatory compliance.
                            </p>
                        </div>
                    </div>
                    <div className='w-1/2'>
                        <img src="/Images/Landing Page/w.7.png" alt="" className='rounded-3xl w-full h-full object-cover' />
                    </div>
                </div>
            </div>
        </section>
        <section ref={ sectionRef } className='w-full min-h-screen bg-[#0d1f1a] flex flex-col justify-center overflow-hidden relative'>
            <div className='absolute top-10 left-4 sm:left-5 w-48 sm:w-72 h-48 sm:h-72 bg-emerald-400/10 rounded-full blur-3xl animate-pulse'></div>
            <div className='absolute bottom-5 right-3 sm:right-2 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000 z-0'></div>
            <h1 className='text-7xl font-bold text-center mb-30 text-emerald-100' style={{ fontFamily: '"Antonio", serif' }}>What our team say!</h1>
            <div ref={ sliderRef } className='flex gap-6 px-20 w-max z-10' style={{ paddingLeft: 'calc(50vw - 225px)'}}>
                {testimonials.map((item) => (
                    <div key={ item.id } className='bg-green-200 rounded-2xl p-8 items-center w-[450px] min-h-[280px] flex-shrink-0 overflow-hidden'>
                        <span className='text-4xl text-green-400'>"</span>
                        <p className='text-gray-600 mt-2'>{ item.message }</p>
                        <hr className='my-4 border-gray-300'/>
                        <div className='flex items-center gap-3'>
                            <div>
                                <div>
                                    <h3 className='font-semibold'>{ item.name }</h3>
                                    <p className='text-sm text-gray-500'>{ item.role }</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
        <section className='w-full bg-emerald-50'>
            <div className='pb-10 px-20 pt-20'>
                <div className='relative'>
                    <img src="/Images/Landing Page/footer.png" alt="" className='w-full h-[340px] object-cover rounded-2xl' />
                    <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
                        <h1 className='text-5xl font-bold text-white'>Apply for a <br /> <span className='text-emerald-400'>Hela-COOP</span> account</h1>
                        <button className='mt-5 border-2 text-white font-semibold p-3 rounded-2xl items-center justify-center flex gap-3 mx-auto cursor-pointer hover:text-white hover:bg-emerald-500 transition-all duration-300 hover:scale-105'><UserPlus />Join Us as a Client</button>
                    </div>
                </div>
                <div className='mt-20 flex justify-between gap-10'>
                    <div>
                        <h1 className='text-3xl font-bold'>Hela-COOP</h1>
                        <p className='text-gray-600'>Simple. Fast. Secure. Trusted.</p>
                    </div>
                    <div className=''>
                        <h1 className='font-bold text-xl'>Features</h1>
                        <div className='space-y-7 text-gray-600 text-sm'>
                            <p className='mt-5 flex items-center cursor-pointer'> <ChevronRight className='w-4 h-4' /> Member Ledger</p>
                            <p className='mt-5 flex items-center cursor-pointer'> <ChevronRight className='w-4 h-4' /> Saving Collection</p>
                            <p className='mt-5 flex items-center cursor-pointer'> <ChevronRight className='w-4 h-4' /> Loan Management</p>
                            <p className='mt-5 flex items-center cursor-pointer'> <ChevronRight className='w-4 h-4' /> Report & Audit</p>
                        </div>
                    </div>
                    <div>
                        <h1 className='font-bold text-xl'>Resources</h1>
                        <div className='space-y-7 text-gray-600 text-sm'>
                            <p className='mt-5 flex items-center cursor-pointer'> <ChevronRight className='w-4 h-4' /> Staff Guide</p>
                            <p className='mt-5 flex items-center cursor-pointer'> <ChevronRight className='w-4 h-4' /> Tranning Videos</p>
                            <p className='mt-5 flex items-center cursor-pointer'> <ChevronRight className='w-4 h-4' /> FAQs</p>
                            <p className='mt-5 flex items-center cursor-pointer'> <ChevronRight className='w-4 h-4' /> Documentation</p>
                        </div>
                    </div>
                    <div>
                        <h1 className='font-bold text-xl'>Company</h1>
                        <div className='space-y-7 text-gray-600 text-sm'>
                            <p className='mt-5 flex items-center cursor-pointer'> <ChevronRight className='w-4 h-4' /> About Hela-COOP</p>
                            <p className='mt-5 flex items-center cursor-pointer'> <ChevronRight className='w-4 h-4' /> Our Cooperatives</p>
                            <p className='mt-5 flex items-center cursor-pointer'> <ChevronRight className='w-4 h-4' /> Contact Support</p>
                        </div>
                    </div>
                </div>
                <hr className='mt-10'/>
                <div className='flex items-center justify-center'>
                    <h1 className='text-sm text-gray-700 flex items-center justify-center gap-1 mt-5'><AtSign className='w-3 h-3' /> 2026 HelaCOOP. All Right Reserved.</h1>
                </div>
                <div className='flex items-center justify-center mt-2 text-sm text-gray-700'>
                    <p className=''>Terms Privacy Cookies</p>
                </div>
            </div>
        </section>
    </>
  )
}

export default Home