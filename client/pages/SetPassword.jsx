import React, { useState } from 'react'
import { Eye, EyeOff, KeyRound, Loader2, TriangleAlert } from 'lucide-react'


const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

const SetPassword = () => {
  const { token  } = useParams();
  const navigate = useNavigate();

  const [password, SetPasswordValue] = useState("");


  return(
    <section className='flex items-center justify-center w-full min-h-screen p-6 bg-[#0d1f1a]'>
        <div className='bg-white rounded-2xl overflow-hiddenmax-w-md w-full'>
            <div className='bg-[#f5f0e8] px-8 py-4'>
                <h1 className='text-4xl font-bold text-[#0d1f1a]' style={{ fontFamily: '"Antonio", serif' }}>
                    Hela-COOP
                </h1>
                <p className='text-sm text-gray-600 mt-2'>Set a password for your staff account to finish setting it up</p>
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4 p-8'>
                {error && (
                    <div className='flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3'>
                        <TriangleAlert size={15} className='flex-shrink-0'/> {error}
                    </div>
                )}

                <div className='flex flex-col gap-1'>
                    <label className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
                        <KeyRound size={15} className='text-indigo-500' /> New password
                    </label>
                    <input type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => SetPasswordValue(e.target.value)}
                        placeholder='Ex: **********'
                        className='w-full border-2 border-green-400 rounded-2xl px-4 py-2.5 pr-10 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 placeholder:text-gray-300 transition'
                    />
                    <button type='button' onClick={() => setShowPassword((s) => !s)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                    >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                </div>

                <div className='flex flex-col gap-1'>
                    <label className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
                        <KeyRound size={15} className='text-indigo-500' /> Confirm password
                    </label>
                    <input type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => SetConfirmPasswordValue(e.target.value)}
                        placeholder='Ex: **********'
                        className='w-full border-2 border-green-400 rounded-2xl px-4 py-2.5 pr-10 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 placeholder:text-gray-300 transition'
                    />
                </div>
                <button type='submit' disabled={submitting}
                    className='flex items-center justify-center gap-2 mt-2 px-6 py-2.5 rounded-2xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#245a41] transition disabled:opacity-50'
                >
                    {submitting ? <Loader2 size={15} className='animate-spin' /> : null }
                    {submitting ? "Setting password..." : "Set password"}
                </button>
            </form>
        </div>
    </section>
  );
};

export default SetPassword