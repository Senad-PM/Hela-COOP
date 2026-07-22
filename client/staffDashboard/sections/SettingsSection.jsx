import { Bell, Info, Lock, LogOut, SlidersHorizontal, User } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Toggle = ({ checked, onchange }) => (
  <button onClick={() => onchange(!checked)}
    className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-emerald-500" : "bg-gray-300"}`}
  >
    <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "transale-x-5" : "translate-x-0.5"}`}/>
  </button>
);

const SettingsSection = () => {

  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "staff";

  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "" });
  const [notifications, setNotifications] = useState({
    emailAlerts: true, smsNotifications: true, pendingApprovalAlerts: false, dailyReportSummary: true,
  });
  const [preferences, setPreferences] = useState({darkMode: false, compactView: false, autoLogout: true  })
  const [notice, setNotice] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("isAdmin");
    navigate("/");
  }

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h1 className='text-xl font-bold text-gray-800'>Settings</h1>
        <p className='text-sm text-gray-500'>System and account preferences</p>
      </div>

      {notice && (
        <div className='flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-700 text-sm rounded-2xl px-4 py-3'>
          <Info size={15}/> {notice}
        </div>
      )}

      <div className='grid grid-cols-2 gap-4'>
        <div className='bg-emerald-50 rounded-2xl p-5 flex flex-col gap-3'>
          <div className='flex items-center gap-2 font-bold text-gray-800'>
            <User size={18} /> Profile
          </div>
          <label className='text-xs text-gray-500'>First Name</label>
          <input value={profile.firstName} onChange={(e) => setProfile({...profile, firstName: e.target.value})} 
            className='border-2 border-gray-400 rounded-xl px-3 py-2 text-sm outline-none bg-white'
          />
          <label className='text-xs text-gray-500'>Last Name</label>
          <input value={profile.lastName} onChange={(e) => setProfile({...profile, lastName: e.target.value})} 
            className='border-2 border-gray-400 rounded-xl px-3 py-2 text-sm outline-none bg-white'
          />
          <label className='text-xs text-gray-500'>Email</label>
          <input type='email' value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} 
            className='border-2 border-gray-400 rounded-xl px-3 py-2 text-sm outline-none bg-white'
          />
        </div>

        <div className='bg-emerald-50 rounded-2xl p-5 flex flex-col gap-3'>
          <div className='flex items-center gap-2 font-bold text-gray-800'>
            <Bell size={18} /> Notifications
          </div>
          {[
            ["emailAlerts", "Email Alters", "Recieve alterts via email"],
            ["smsNotificatios", "SMS Notifications", "Transaction and approval SMS"],
            ["pendingApprovalAlerts, Pending Approval Alerts", "Alerts when items need action"],
            ["dailyReportSummary", "Daily Report Summary", "Get EOD Summary email"],
          ].map(([key, label, desc]) => (
            <div key={key} className='flex items-center justify-between gap-3'>
              <div>
                <p className='text-sm font-medium text-gray-800'>{label}</p>
                <p className='text-xs text-gray-500'>{desc}</p>
              </div>
              <Toggle checked={notifications[key]} onchange={(v) => setNotifications({...notifications, [key]: v})} />
            </div>
          ))}
        </div>

        <div className='bg-emerald-50 rounded-2xl p-5 flex flex-col gap-3'>
          <div className='flex items-center gap-2 font-bold text-gray-800'>
            <SlidersHorizontal size={18} /> Preferences
          </div>
          {[
            ["darkMode", "Dark Mode", "Use dark interface theme"],
            ["compactView", "Compact View", "Denser table rows"],
            ["autoLogout", "Auto Logout", "Session security timeout"],
          ].map(([key, label, desc]) => (
            <div key={key} className='flex items-center justify-between gap-3'>
              <div>
                <p className='text-sm font-medium text-gray-800'>{label}</p>
                <p className='text-xs text-gray-500'>{desc}</p>
              </div>
              <Toggle checked={preferences[key]} onchange={(v) => setPreferences({...notifications, [key]: v})} />
            </div>
          ))}
        </div>

        <div className="bg-emerald-50 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 font-bold text-gray-800"><Lock size={18} /> Security</div>
          <p className="text-xs text-gray-500 -mt-2">Changing your password here isn't connected to the backend yet — ask an admin to resend a setup link if you need to reset it.</p>
          <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3">
            <User size={18} className="text-emerald-600" />
            <div>
              <p className="font-semibold text-gray-800 capitalize">{role} account</p>
              <p className="text-xs text-gray-500">Signed in via Hela-COOP staff login</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </div>
 
      <div className="flex justify-end">
        <button
          onClick={() => setNotice("Settings aren't saved to the server yet — there's no update-profile endpoint on the backend.")}
          className="px-6 py-2.5 rounded-2xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#245a41] transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsSection