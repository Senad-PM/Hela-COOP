import { Bell, RotateCcw, Search } from 'lucide-react'
import React from 'react'

const Admin = () => {
  return (
    <>
        <section className='w-full min-h-screen bg-green-50 p-10'>
            <div className='flex items-start'>
                <div className='w-1/3'>
                  <h1 className='text-4xl font-bold' style={{ fontFamily: '"Antonio", serif' }}>Hela-COOP</h1>
                  <h2 className='text-lg font-semibold'>#Admin</h2>
                  <hr className='mr-10 mt-5 w-2/3 border-t-2 text-gray-400'/>
                  <div className='mt-20 text-2xl font-semibold space-y-10'>
                    <div>
                      <div></div>
                      <h1>Home</h1>
                    </div>
                    <div>
                      <div></div>
                      <h1>Members</h1>
                    </div>
                    <div>
                      <div></div>
                      <h1>Roles & Permission</h1>
                    </div>
                    <div>
                      <div></div>
                      <h1>Setting</h1>
                    </div>
                    <div>
                      <div></div>
                      <h1>Audit Log</h1>
                    </div>
                  </div>
                </div>
                <div className='w-2/3'>
                  <div className='bg-olive-200 p-2 rounded-2xl flex items-center justify-between'>
                    <h1>Welcome to Hela-COOP</h1>
                    <div className='flex items-center justify-center bg-gray-300 p-2 rounded-2xl gap-2'>
                      <input type='search' placeholder='Search here' className='rounded-xl' />
                      <Search />
                    </div>
                    <div className='flex gap-5'>
                      <Bell />
                      <RotateCcw />
                    </div>
                  </div>
                  <div className='bg-white w-full h-full'>

                  </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default Admin