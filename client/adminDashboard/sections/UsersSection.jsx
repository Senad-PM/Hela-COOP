import { useState } from 'react';
import UserTable, { useFilteredUsers } from '../components/UserTable';
import { Bell, RotateCcw, User, Search } from 'lucide-react';

const UsersSection = ({users = [], loading, error}) => {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All roles");
  
    const filtered = useFilteredUsers(users, search, roleFilter)
  
    return(
      <div className="flex flex-col gap-5 pt-4 px-2">
        
        <div className="bg-[#f5f0e8] rounded-2xl px-6 py-4 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">User</h1>
            <p className="text-sm text-gray-500 mt-0.5">All Managers and Staff accounts</p>
          </div>
          <div className="flex items-center gap-3 text-gray-500 pt-1">
            <Bell size={20} className="cursor-pointer hover:text-gray-700 transition" />
            <RotateCcw size={20} className="cursor-pointer hover:text-gray-700 transition" />
          </div>
        </div>
  
        <div className="bg-white/90 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 font-bold text-lg text-gray-700">
              <User size={22} />
              <h1>Managers & Staff</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border border-green-500 px-3 py-2 rounded-2xl bg-white">
                <input type="search" placeholder="Search user..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm w-40 text-gray-700 placeholder:text-gray-400"
                />
                <Search size={15} className="text-gray-400" />
              </div>
              <select value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-gray-200 rounded-2xl px-4 py-2 text-sm outline-none bg-white text-gray-600"
              >
                <option>All roles</option>
                <option>Manager</option>
                <option>Staff</option>
              </select>
            </div>
          </div>
          <UserTable users={filtered} loading={loading} error={error} />
        </div>
  
      </div>
    )
}

export default UsersSection