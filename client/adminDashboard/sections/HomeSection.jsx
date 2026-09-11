import {useState} from 'react'
import { User, Users, Search, Bell, RotateCcw, MoveUp, CircleCheckBig, CircleSlash2 } from 'lucide-react';
import UserTable, { useFilteredUsers } from '../components/UserTable';

const HomeSection = ({ users = [], loading, error }) => {

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All roles");
  
    const filtered = useFilteredUsers(users, search, roleFilter)
  
    const total = users.length;
    const managers = users.filter((u) => (u.role || "").toLowerCase() === "manager").length;
    const active = users.filter((u) => u.isActive).length;
    const inactive = total - active
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newThisMonth = users.filter((u) => new Date(u.createdAt) >= startOfMonth).length;
  
    return (
      <div className="flex flex-col gap-5 pt-4 px-2 h-full">
  
        <div className="bg-white/90 border border-emerald-100 p-2 rounded-2xl flex items-center justify-between shrink-0">
          <h1>Welcome to Hela-COOP</h1>
          <div className="flex items-center justify-center bg-emerald-100/80 p-2 rounded-2xl gap-2">
            <input
              type="search"
              placeholder="Search here"
              className="rounded-xl"
            />
            <Search size={18} className="cursor-pointer text-gray-500 hover:text-gray-700 transition" />
          </div>
          <div className="flex gap-5">
            <Bell size={18} className="cursor-pointer text-gray-500 hover:text-gray-700 transition" />
            <RotateCcw size={18} className="cursor-pointer text-gray-500 hover:text-gray-700 transition" />
          </div>
        </div>
  
        <div className="flex gap-5 shrink-0">
          <div className="bg-white w-full rounded-2xl space-y-5 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-[fadeInUp_0.4s_ease-out]" style={{ animationDelay: '0ms'}}>
            <div className="flex items-center justify-center gap-3 font-bold text-xl">
              <Users /> <h1>Total Users</h1>
            </div>
            <div className="flex items-center justify-center font-bold text-3xl">
              <h1> {total} </h1>
            </div>
            <div className="flex items-center justify-center gap-2 text-green-500 font-semibold">
              <MoveUp size={16} /> <p>{newThisMonth} this month</p>
            </div>
          </div>
  
          <div className="bg-white w-full rounded-2xl space-y-5 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-[fadeInUp_0.4s_ease-out]" style={{ animationDelay: '0ms'}}>
            <div className="flex items-center justify-center gap-3 font-bold text-xl">
              <User /> <h1>Managers</h1>
            </div>
            <div className="flex items-center justify-center font-bold text-3xl">
              <h1> {managers} </h1>
            </div>
            <div className="flex items-center justify-center gap-2 text-green-500 font-semibold">
              <MoveUp size={16} /> <p>{newThisMonth} this month</p>
            </div>
          </div>
  
          <div className="bg-white w-full rounded-2xl space-y-5 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-[fadeInUp_0.4s_ease-out]" style={{ animationDelay: '0ms'}}>
            <div className="flex items-center justify-center gap-3 font-bold text-xl">
              <CircleCheckBig /> <h1>Active</h1>
            </div>
            <div className="flex items-center justify-center font-bold text-3xl">
              <h1> {active} </h1>
            </div>
            <div className="flex items-center justify-center font-semibold text-gray-500">
              <p>of {total} users</p>
            </div>
          </div>
  
          <div className="bg-white w-full rounded-2xl space-y-5 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-[fadeInUp_0.4s_ease-out]" style={{ animationDelay: '0ms'}}>
            <div className="flex items-center justify-center gap-3 font-bold text-xl">
              <CircleSlash2 /> <h1>Inactive</h1>
            </div>
            <div className="flex items-center justify-center font-bold text-3xl">
              <h1> {inactive} </h1>
            </div>
            {inactive > 0 && (
              <div className="flex items-center justify-center font-semibold">
                <p className="text-red-500">needs review</p>
              </div>
            )}
          </div>
        </div>
  
        <div className="bg-white/90 rounded-2xl p-5 flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between mb-4 shrink-0">
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
  
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            <UserTable users = {filtered} loading = {loading} error = {error} />
          </div>
        
        </div>
  
      </div>
    )
}

export default HomeSection