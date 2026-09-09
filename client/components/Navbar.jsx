import React, { useEffect, useState } from 'react'
import { X, Menu, XIcon, UserRound, ShieldCheck, Mail, Lock, EyeOff, Eye, ArrowRight, Loader2} from 'lucide-react'
import axios from 'axios'
import { AnimatePresence, animate, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom' 

const Navbar = () => {

    const [mobileMenu, SetMobileMenu] = useState(false)
    const toggleMenu = () => SetMobileMenu(!mobileMenu)

    const [formISOpen, SetFormIsOpen] = useState(false)
    const [isRegister, SetIsRegister] = useState(false)

    const [portal, setPortal] = useState('staff')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const [scrolled, setScrolled] = useState(false)
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const openForm = () => SetFormIsOpen(true)
    const closeForm = () => {
        SetFormIsOpen(false)
        SetIsRegister(false)
        setError('')
        setEmail('')
        setPassword('')
        setShowPassword(false)
        setPortal('staff')
    }

    // Login handler
    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password,
                portal
            })
            console.log('Login success:', response.data)
            const role = response.data.role
            const isStaffRole = role === 'manager' || role === 'staff'
            closeForm()
            
            localStorage.setItem('accessToken', response.data.accessToken)
            localStorage.setItem('refreshToken', response.data.refreshToken)
            localStorage.setItem('role', role)

            if (role === 'admin'){
                localStorage.setItem('isAdmin', 'true')
                closeForm()
                navigate('/admin')
            }else if (isStaffRole){
                closeForm()
                navigate('/staff')
            }else{
                setError('Unrecognized role for this account.')
            }

        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || 'Login failed. Check your credentials.')
        } finally {
            setLoading(false)
        }
    }

  return (
    <header className={`w-full top-0 fixed z-50 transition-all duration-300 ease-out ${
        scrolled ? 
        "bg-white/85 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.08)]" :
        "bg-lime-500/20 backdrop-blur-sm shadow-none"
    }`}>
        <div className='flex items-center justify-between p-5 h-15'>
            <div>
                <h1 className='font-serif font-semibold text-2xl'>Hela-COOP</h1>
            </div>
            <ul className='gap-3 font-semibold md:flex hidden cursor-pointer rounded-2xl bg-white/30 shadow-2xl'>
                <li className='px-4 py-1.5 rounded-full transition-all duration-300 hover:bg-emerald-400 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] hover:text-white hover:scale-105'>Feature</li>
                <li className='px-4 py-1.5 rounded-full transition-all duration-300 hover:bg-emerald-400 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] hover:text-white hover:scale-105'> Benefits & Tools</li>
                <li className='px-4 py-1.5 rounded-full transition-all duration-300 hover:bg-emerald-400 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] hover:text-white hover:scale-105'>About Us</li>
                <li className='px-4 py-1.5 rounded-full transition-all duration-300 hover:bg-emerald-400 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] hover:text-white hover:scale-105'>Contact</li>
            </ul>
            <div onClick={openForm} className='gap-5 md:flex hidden'>
                <button className='bg-white rounded-2xl pr-5 pl-5 p-2 font-semibold hover:bg-emerald-400 hover:text-white hover:scale-105 duration-300 ease-in-out transition-all shadow-2xl'>Log in</button>
            </div>
            <div className='md:hidden'>
                <button onClick={ toggleMenu }>
                    {mobileMenu ? <X className='w-5 h-5'/> : <Menu className='w-5 h-5'/>}
                </button>
            </div>
        </div>
        {mobileMenu && (
            <div className='w-full md:hidden text-lg font-semibold border-t'>
                <ul className='flex flex-col items-center text-center mt-3 mb-3 space-y-3'>
                    <li className='px-3 py-1 rounded-full hover:bg-emerald-400 hover:text-white transition-colors duration-300 cursor-pointer'>Feature</li>
                    <li className='px-3 py-1 rounded-full hover:bg-emerald-400 hover:text-white transition-colors duration-300 cursor-pointer'>Benefits & Tools</li>
                    <li className='px-3 py-1 rounded-full hover:bg-emerald-400 hover:text-white transition-colors duration-300 cursor-pointer'>About Us</li>
                    <li className='px-3 py-1 rounded-full hover:bg-emerald-400 hover:text-white transition-colors duration-300 cursor-pointer'>Contact</li>
                    <button onClick={openForm} className='bg-white rounded-2xl pr-5 pl-5 p-2 font-semibold hover:bg-lime-400 hover:text-white duration-300 ease-in-out transition-all'>Log in</button>
                </ul>
            </div>
        )}
        <AnimatePresence>
        {formISOpen && (
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                className='flex items-center justify-center p-4 fixed top-0 left-0 w-screen h-screen bg-black/80 backdrop-blur-md z-50'
            >
                <motion.div
                    initial={{opacity: 0, y: 24, scale: 0.97}}
                    animate={{opacity: 1, y: 0, scale: 1}}
                    exit={{opacity: 0, y: 12, scale: 0.98}}
                    transition={{type: "spring", stiffness: 220, damping: 26}}
                    className='relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_8px_60px_rgba(0,0,0,0.6)] overflow-hidden'
                >

                    <div className={`pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-30 transition-colors duration-500 ${portal === 'admin' ? 'bg-amber-400' : 'bg-lime-400'}`} />
                    <div className='relative p-8'>
                        
                        <div className='flex justify-between items-start'>
                            <div>
                                <h1 className='font-serif font-semibold text-2xl text-white'>Welcome Back</h1>
                                <p className='text-white/50 text-sm mt-1'>Sign in to your Hela-COOP portal</p>
                            </div>
                            <button
                                onClick={closeForm}
                                className='text-white/60 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors duration-200 cursor-pointer'
                                aria-label='Close'
                            >
                                <XIcon className='w-5 h-5' />
                            </button>
                        </div>

                        <div className='relative mt-6 grid grid-cols-2 gap-1 p-1 rounded-full bg-white/5 border border-white/10'>
                            <span className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-out ${portal === 'admin' ? 'translate-x-[calc(100%+4px)] bg-amber-400' : 'translate-x-0 bg-lime-400'}`} />
                            <button
                                type='button'
                                onClick={() => { setPortal('staff'); setError('') }}
                                className={`relative z-10 flex items-center justify-center gap-1.5 py-2 rounded-full text-sm font-semibold transition-colors duration-300 cursor-pointer ${portal === 'staff' ? 'text-black' : 'text-white/60 hover:text-white'}`}
                            >
                                <UserRound className='w-4 h-4' /> Staff
                            </button>
                            <button
                                type='button'
                                onClick={() => { setPortal('admin'); setError('') }}
                                className={`relative z-10 flex items-center justify-center gap-1.5 py-2 rounded-full text-sm font-semibold transition-colors duration-300 cursor-pointer ${portal === 'admin' ? 'text-black' : 'text-white/60 hover:text-white'}`}
                            >
                                <ShieldCheck className='w-4 h-4' /> Admin
                            </button>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{opacity: 0, height: 0}}
                                    animate={{opacity: 1, height:"auto"}}
                                    exit={{opacity: 0, height: 0}}
                                    className='mt-4 text-red-400 text-sm font-medium bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2'
                                >
                                    {error}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleLogin}>
                            <div className='mt-6'>
                                <label htmlFor="email" className='text-sm font-medium text-white/70 block mb-2'>Email</label>
                                <div className='relative'>
                                    <Mail className='absolute left-4 top-1/3 -transale-y-1/2 w-4.5 h-4.5 text-white/40 pointer-events-none' />
                                    <input type="email" id='email' value={email }
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder='you@gmail.com'
                                        className='w-full text-white placeholder-white/30 bg-white/5 border border-white/10 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-lime-400/60 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20 transition-all duration-200'
                                    />
                                </div>
                            </div>
                            <div className='mt-4'>
                                <label htmlFor="password" className='text-sm font-medium text-white/70 block mb-2'>Password</label>
                                <div className='relative'>
                                    <Lock className='absolute left-4 top-1/3 -transale-y-1/2 w-4.5 h-4.5 text-white/40 pointer-events-none' />
                                    <input
                                        id='password'
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder='Enter you password here..'
                                        className='w-full text-white placeholder-white/30 bg-white/5 border border-white/10 pl-11 pr-11 py-3 rounded-xl outline-none focus:border-lime-400/60 focus:bg-white/10 focus:ring-2 focus:ring-lime-400/20 transition-all duration-200'
                                    />
                                    <button 
                                        type='button'
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors duration-200 cursor-pointer'
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <Eye className='w-4.5 h-4.5' /> : <EyeOff className='w-4.5 h-4.5' />}
                                    </button>
                                </div>
                                <div className='mt-6'>
                                   <button
                                    type='submit'
                                    disabled={loading}
                                    className='group w-full flex items-center justify-center gap-2 rounded-xl bg-white p-3 font-semibold text-base cursor-pointer hover:bg-lime-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                                   >
                                        {loading ? (
                                            <><Loader2 className='w-4.5 h-4.5 animate-spin' /> Signing in...</>
                                        ) : (
                                            <>Log in to {portal === 'admin' ? 'Admin' : 'Staff'} portal <ArrowRight className='w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200' /></>
                                        )}
                                   </button>
                                </div>
                            </div>
                        </form>

                    </div>

                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    </header>
  )
}

export default Navbar