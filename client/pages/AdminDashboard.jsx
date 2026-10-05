import {useState, useEffect, useCallback} from 'react'
import { Home, UserPlus, UserRound, Settings, ClipboardList, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUsers, deactivateUser, activateUser } from '../src/api/userApi';
import { fetchActivityLogs, clearActivityLogs, fetchSettings, updateSettings } from "../src/api/adminApi";
import HomeSection from '../adminDashboard/sections/HomeSection';
import UserRegistrationSection from '../adminDashboard/sections/UserRegistrationSection';
import UsersSection from '../adminDashboard/sections/UsersSection';
import SettingSection from '../adminDashboard/sections/SettingSection';
import ActivityLogSection from '../adminDashboard/sections/ActivityLogSection';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState("home");
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [usersError, setUsersError] = useState("");
    const role = localStorage.getItem("role");
    const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "Admin";

    const navigate = useNavigate();
    const handleLogOut = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      navigate("/");
  };
  
    const loadUsers = useCallback(async () => {
      setUsersLoading(true);
      setUsersError("");
      try{
        const result = await fetchUsers();
        setUsers(result.data);
      }catch(err){
        setUsersError(err.response?.data?.message || "Could not load users.")
      }finally{
        setUsersLoading(false);
      }
    }, []);
    
    useEffect(() => {
      loadUsers();
    }, [loadUsers]);

    const handleToggleActive = async (user) => {
      if (user.isActive && !window.confirm(`Deactivate ${user.userName}?`)) return;
      try {
        const updated = user.isActive
          ? await deactivateUser(user._id)
          : await activateUser(user._id);
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, isActive: updated.isActive } : u))
        );
      } catch (err) {
        alert(err.response?.data?.message || "Could not update user");
      }
    };
  
    const NAV_ITEMS = [
      { key: "home", label: "Home", icon: Home },
      { key: "userRegistration", label: "User Registration", icon: UserPlus },
      { key: "users", label: "Users", icon: UserRound },
      { key: "setting", label: "Setting", icon: Settings },
      { key: "activity", label: "Activity Log", icon: ClipboardList },
    ];
  
    const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
      <div onClick={onClick}
        className={`relative group flex items-center gap-3 cursor-pointer rounded-xl px-3 py-2.5 transition-colors duration-200 ease-out hover:translate-x-1 ${
          isActive ? "bg-lime-300" : "text-gray-300 hover:text-lime-200"
        }`}
      >
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-emerald-800/60 border-l-4 border-emerald-400 rounded-xl shadow-[0_0_14px_rgba(16,185,129,0.18)]"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        )}
        <div className="relative flex items-center gap-3">
          <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
          <span className='font-medium'>{label}</span>
        </div>
      </div>
    );
  
    return (
      <>
        <section className="w-full h-screen bg-[#0d1f1a] p-6 overflow-hidden">
          <div className="flex h-full gap-6">
            <div className="flex flex-col w-64 flex-shrink-0 text-white animate-[fadeIn_0.5s_ease-out]">
              <h1
                className="text-3xl font-bold w-fit transition-transform duration-300 hover:scale-105" style={{ fontFamily: '"Antonio", serif' }}
              >
                Hela <span className="text-lime-400">COOP</span>
              </h1>
              <span className="mt-2 w-fit text-xs font-semibold bg-lime-800/70 text-lime-300 px-3 py-1 rounded-full">
                {roleLabel}
              </span>
              <hr className="mt-5 border-t border-gray-700" />
              <nav className="flex flex-col mt-6 gap-1">
                {NAV_ITEMS.map((item) => (
                  <NavItem
                    key={item.key}
                    icon={item.icon}
                    label={item.label}
                    isActive={activeSection === item.key}
                    onClick={() => setActiveSection(item.key)}
                  />
                ))}
              </nav>
              <div className='mt-auto flex items-center gap-3 pt-5 border-t border-gray-700'>
                    <div className='flex items-center justify-center w-9 h-9 rounded-full bg-lime-400 text-black font-semibold text-sm flex-shrink-0'>
                        A
                    </div>
                    <div className='flex flex-col leading-tight overflow-hidden flex-1 min-w-0'>
                        <span className='text-sm font-semibold truncate'>Admin</span>
                        <span className='text-xs text-gray-400 truncate'>Hela COOP</span>
                    </div>
                    <button
                        onClick={handleLogOut}
                        title='Logout'
                        aria-label='Logout'
                        className='flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer'
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
            <div className="flex-1 h-full rounded-2xl bg-[#f5f0e8] p-5 overflow-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  {activeSection === "userRegistration" && (
                    <UserRegistrationSection onRegistered={() => {
                      loadUsers();
                      setActiveSection("users");
                    }}
                    />
                  )}
                  {activeSection === "users" && <UsersSection users={users} loading={usersLoading} error={usersError} />}
                  {activeSection === "setting" && <SettingSection />}
                  {activeSection === "activity" && <ActivityLogSection />}
                  {activeSection === "home" && <HomeSection users={users} loading={usersLoading} error={usersError} onToggleActive={handleToggleActive} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
      </>
    );
}

export default AdminDashboard