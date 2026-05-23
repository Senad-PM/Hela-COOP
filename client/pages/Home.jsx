import React, { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { SplitText, gsap }from 'gsap/all'
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Star } from 'lucide-react'

const Home = () => {

    const sectionRef = useRef(null)
    const sliderRef = useRef(null)

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
                    <img src="/public/HeroImg.png" alt="" className='w-full h-full object-cover' />
                    <div className='absolute inset-0 bg-black/40'></div>
                </div>
                <div className='relative text-white z-10 text-center'>
                    <div className='p-15'>
                        <div className='title' style={{clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",}}>
                            <h1 className='font-bold font-sans text-9xl' style={{ fontFamily: '"Antonio", serif' }}>Cooperative Finance, Simplified</h1>
                            <div className='flex items-center justify-center mt-5'>
                                <p className='font-semibold font-sans text-2xl mt-5'> Reliable, secure, and built for you.</p>
                            </div>
                        </div>
                        <div className='flex items-center justify-center mt-5'>
                            <button className='text-xl text-black font-semibold rounded-3xl bg-white hover:bg-emerald-400 hover:text-white hover:scale-105 p-3 transition-all duration-300'>Explore Tools</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className='relative min-h-screen pt-1 bg-green-50'>
            <div className='m-20 mb-0'>
                <div className='flex justify-between'>
                    <div className='block'>
                        <h2 className='font-semibold'>Modern finance,</h2>
                        <p>Simplified</p>
                    </div>
                    <div className='block'>
                        <h1 className='font-bold'>Why Choose us</h1>
                        <p>Banking made easy, secure and rewarding for you.</p>
                    </div>
                </div>
                <div className='flex items-center justify-between mt-20 gap-5'>
                    <div className='bg-amber-100 rounded-2xl hover:scale-105 transition-all duration-300'>
                        <div className='p-10'>
                            <div className='flex items-center justify-center'>
                                <div>
                                   <img src="/public/Images/Landing Page/1.png" alt="logo" className='w-37.5 h-33'/>
                                </div>
                            </div>
                            <div className='items-center justify-center text-center mt-5'>
                                <h1 className='font-bold'>Safe & secure</h1>
                                <p>Advanced encryption & multi-factor login.</p>
                            </div>
                        </div>
                    </div>
                    <div className='bg-slate-100 rounded-2xl hover:scale-105 transition-all duration-300'>
                        <div className='p-10'>
                            <div className='flex items-center justify-center'>
                                <div>
                                   <img src="/public/Images/Landing Page/2..png" alt="logo" className='w-37.5 h-33'/>
                                </div>
                            </div>
                            <div className='items-center justify-center text-center mt-5'>
                                <h1 className='font-bold'>Always On</h1>
                                <p>24/7 account access from anywhere.</p>
                            </div>
                        </div>
                    </div>
                    <div className='bg-cyan-100 rounded-2xl hover:scale-105 transition-all duration-300'>
                        <div className='p-10'>
                            <div className='flex items-center justify-center'>
                                <div>
                                   <img src="/public/Images/Landing Page/3.png" alt="logo" className='w-37.5 h-33'/>
                                </div>
                            </div>
                            <div className='items-center justify-center text-center mt-5'>
                                <h1 className='font-bold'>Rewarding</h1>
                                <p>Cashback, points & Partner discount.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-between mt-10 gap-5'>
                    <div className='bg-emerald-100 rounded-xl w-full h-40'>
                        <div className='flex items-center justify-center w-full h-20'>
                            <div>
                                <img src="/public/Images/Landing Page/4.png" alt="" className='w-10 h-10'/>
                            </div>
                        </div>
                        <div className='items-center justify-center text-center'>
                            <h1 className='text-3xl font-bold'>1K+</h1>
                            <p className='text-lg'>Active Users</p>
                        </div>
                    </div>
                    <div className='bg-emerald-100 rounded-xl w-full h-40'>
                        <div className='flex items-center justify-center w-full h-20'>
                            <div>
                                <img src="/public/Images/Landing Page/5.png" alt=""  className='w-10 h-10'/>
                            </div>
                        </div>
                        <div className='items-center justify-center text-center'>
                            <h1 className='text-2xl font-bold'>100%</h1>
                            <p>Secure & encrypted</p>
                        </div>
                    </div>
                    <div className='bg-emerald-100 rounded-xl w-full h-40'>
                        <div className='flex items-center justify-center w-full h-20'>
                            <div>
                                <img src="/public/Images/Landing Page/6.png" alt="" className='w-10 h-10'/>
                            </div>
                        </div>
                        <div className='items-center justify-center text-center'>
                            <h1 className='text-2xl font-bold'>24/7</h1>
                            <p>Up-time Guaranteed</p>
                        </div>
                    </div>
                    <div className='bg-emerald-100 rounded-xl w-full h-40'>
                        <div className='flex items-center justify-center w-full h-20'>
                            <div>
                                <img src="/public/Images/Landing Page/7.png" alt="" className='w-10 h-10'/>
                            </div>
                        </div>
                        <div className='items-center justify-center text-center'>
                            <h1 className='text-2xl font-bold flex items-center justify-center text-center gap-1'>4.9 <Star /></h1>
                            <p>Web-site store rating</p>
                        </div>
                    </div>
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
                        <img src="/public/Images/Landing Page/landing.png" alt="" className='w-full h-full object-cover rounded-3xl' />
                    </div>
                </div>
                <div className='space-y-5'>
                    <div className='flex items-center gap-5 border-b-2 border-b-gray-400'>
                        <div className='w-20 h-20 flex-shrink-0'>
                            <img src="/public/Images/Landing Page/w1-removebg-preview.png" alt="" className='w-full h-full object-contain' />
                        </div>
                        <div className='pb-2'>
                            <h1 className='font-semibold text-2xl'>Member Ledger</h1>
                            <p>Add credit/debit entries per member instantly</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 border-b-2 border-b-gray-400'>
                        <div className='w-20 h-20 flex-shrink-0'>
                            <img src="/public/Images/Landing Page/w2-removebg-preview.png" alt="" className='w-full h-full object-contain' />
                        </div>
                        <div className='pb-2'>
                            <h1 className='font-semibold text-2xl'>Savings Collection</h1>
                            <p>Track daily/weekly member savings.</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 border-b-2 border-b-gray-400'>
                        <div className='w-20 h-20 flex-shrink-0'>
                            <img src="/public/Images/Landing Page/w3-removebg-preview.png" alt="" className='w-full h-full object-contain' />
                        </div>
                        <div className='pb-2'>
                            <h1 className='font-semibold text-2xl'>Loan Management</h1>
                            <p>Monitor repayments & outstanding balance.</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 border-b-2 border-b-gray-400'>
                        <div className='w-20 h-20 flex-shrink-0'>
                            <img src="/public/Images/Landing Page/w4-removebg-preview.png" alt="" className='w-full h-full object-contain' />
                        </div>
                        <div className='pb-2'>
                            <h1 className='font-semibold text-2xl'>Cashbook Reports</h1>
                            <p>Print daily & monthly summaries for audit.</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 border-b-2 border-b-gray-400'>
                        <div className='w-20 h-20 flex-shrink-0'>
                            <img src="/public/Images/Landing Page/w5-removebg-preview.png" alt="" className='w-full h-full object-contain' />
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
                        <img src="/public/Images/Landing Page/w.7.png" alt="" className='rounded-3xl w-full h-full object-cover' />
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
    </>
  )
}

export default Home