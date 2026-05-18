import React from 'react'

const Home = () => {
  return (
    <>
        <section className='relative min-h-screen flex items-center justify-center pt-16 sm:pt-20 bg-green-50'>
            <div>
                <div className='absolute inset-0 m-20 rounded-3xl overflow-hidden'>
                    <img src="/public/HeroImg.png" alt="" className='w-full h-full object-cover' />
                    <div className='absolute inset-0 bg-black/40'></div>
                </div>
                <div className='relative text-white z-10 text-center'>
                    <div className='p-15'>
                        <h1 className='font-bold font-sans text-8xl'>Cooperative Finance, Simplified</h1>
                        <div className='flex items-center justify-center mt-5'>
                            <p className='font-semibold font-sans text-2xl'> Reliable, secure, and built for you.</p>
                        </div>
                        <div className='flex items-center justify-center mt-10'>
                            <button className='text-xl text-black font-semibold rounded-3xl bg-white hover:bg-lime-400 hover:text-white hover:scale-105 p-3 transition-all duration-300'>Explore Tools</button>
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
                <div className='flex items-center justify-between mt-20'>
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