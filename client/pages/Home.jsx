import React from 'react'
import { useGSAP } from '@gsap/react'
import { gsap }from 'gsap/all'

const Home = () => {

    useGSAP(() => {
        gsap.to(".title", {
          duration: 5,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: 'power4.out',
        })
    })

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
            <div className='m-20'>
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
                    <div className='bg-amber-100 rounded-2xl'>
                        <div className='p-10'>
                            <div className='flex items-center justify-center'>
                                <div>
                                   <img src="" alt="logo" />
                                </div>
                            </div>
                            <div className='items-center justify-center text-center mt-5'>
                                <h1 className='font-bold'>Safe & secure</h1>
                                <p>Advanced encryption & multi-factor login.</p>
                            </div>
                        </div>
                    </div>
                    <div className='bg-slate-100 rounded-2xl'>
                        <div className='p-10'>
                            <div className='flex items-center justify-center'>
                                <div>
                                   <img src="" alt="logo" />
                                </div>
                            </div>
                            <div className='items-center justify-center text-center mt-5'>
                                <h1 className='font-bold'>Always On</h1>
                                <p>24/7 account access from anywhere.</p>
                            </div>
                        </div>
                    </div>
                    <div className='bg-cyan-100 rounded-2xl'>
                        <div className='p-10'>
                            <div className='flex items-center justify-center'>
                                <div>
                                   <img src="" alt="logo" />
                                </div>
                            </div>
                            <div className='items-center justify-center text-center mt-5'>
                                <h1 className='font-bold'>Rewarding</h1>
                                <p>Cashback, points & Partner discount.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default Home