import React, { useState } from 'react'
import { X, Menu, XIcon} from 'lucide-react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom' 

const Navbar = () => {

    const [mobileMenu, SetMobileMenu] = useState(false)
    const toggleMenu = () => SetMobileMenu(!mobileMenu)

    const [formISOpen, SetFormIsOpen] = useState(false)
    const [isRegister, SetIsRegister] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const openForm = () => SetFormIsOpen(true)
    const closeForm = () => {
        SetFormIsOpen(false)
        SetIsRegister(false)
        setError('')
        setEmail('')
        setPassword('')
    }

    // Login handler
    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password
            })
            console.log('Login success:', response.data)
            closeForm()
            
            localStorage.setItem('accessToken', response.data.accessToken)
            localStorage.setItem('refreshToken', response,data.refreshToken)
            localStorage.setItem('role', response.data.role)

            if (response.data.role == 'admin'){
                localStorage.setItem('isAdmin', 'true')
                navigate('/admin')
            }else if (response.data.role === 'manager' || response.data.role === 'staff'){
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
    <header className='w-full top-0 fixed z-50 backdrop-blur-sm bg-lime-500/20'>
        <div className='flex items-center justify-between p-5 h-15'>
            <div>
                <h1 className='font-serif font-semibold text-2xl'>Hela-COOP</h1>
            </div>
            <ul className='gap-3 font-semibold md:flex hidden cursor-pointer rounded-2xl bg-white/30'>
                <li className='px-4 py-1.5 rounded-full transition-all duration-300 hover:bg-emerald-400 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] hover:text-white hover:scale-105'>Feature</li>
                <li className='px-4 py-1.5 rounded-full transition-all duration-300 hover:bg-emerald-400 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] hover:text-white hover:scale-105'> Benefits & Tools</li>
                <li className='px-4 py-1.5 rounded-full transition-all duration-300 hover:bg-emerald-400 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] hover:text-white hover:scale-105'>About Us</li>
                <li className='px-4 py-1.5 rounded-full transition-all duration-300 hover:bg-emerald-400 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] hover:text-white hover:scale-105'>Contact</li>
            </ul>
            <div onClick={openForm} className='gap-5 md:flex hidden'>
                <button className='bg-white rounded-2xl pr-5 pl-5 p-2 font-semibold hover:bg-emerald-400 hover:text-white hover:scale-105 duration-300 ease-in-out transition-all'>Log in</button>
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
        {formISOpen && (
            <div className='fixed top-0 left-0 w-screen h-screen bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                <motion.div
                    initial={{opacity: 0, y: -100}}
                    animate={{opacity: 1, y: 0}}
                    transition={{
                        type:'spring',
                        stiffness:100,
                        damping:25,
                        delay:0.3,
                        duration:1.2,
                    }}
                className='bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-8'>
                    <div className='flex justify-between items-center'>
                        <h1 className='font-bold text-xl'>Log in</h1>
                        <XIcon className='font-bold cursor-pointer' onClick={closeForm} />
                    </div>
                    {/* Show error message */}
                    {error && (
                        <p className='mt-3 text-red-500 text-sm font-medium'>{error}</p>
                    )}
                    <form onSubmit={handleLogin}>
                        <div className='mt-5'>
                            <label htmlFor="email" className='text-base font-semibold block'>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder='Enter your email here'
                                className='w-full text-black bg-gray-200 border-2 border-lime-500 px-6 py-2 rounded-lg mt-3'
                            />
                        </div>
                        <div className='mt-5'>
                            <label htmlFor="Password" className='text-base font-semibold block'>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder='Enter the password'
                                className='w-full text-black bg-gray-200 border-2 border-lime-500 px-6 py-2 rounded-lg mt-3'
                            />
                            <h4 className='mt-2 text-base text-blue-800 cursor-pointer'>Forgot password?</h4>
                        </div>
                        <div className='mt-5'>
                            <button
                                type="submit"
                                disabled={loading}
                                className='w-full rounded-lg bg-white p-2 font-semibold text-xl cursor-pointer hover:bg-emerald-400 hover:text-white transition-colors duration-300 disabled:opacity-50'
                            >
                                {loading ? 'Logging in...' : 'Log in'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
    </header>
  )
}

export default Navbar