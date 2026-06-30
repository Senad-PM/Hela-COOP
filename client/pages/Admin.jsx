import {
  Bell, RotateCcw, Search, Users, MoveUp, User,
  CircleCheckBig, CircleSlash2,
  CreditCard, Calendar, AtSign, Shield, KeyRound, CheckCircle, X,
  Settings
} from "lucide-react";
import React, { useState } from "react";

const UserRegistrationSection = () => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "",
    nic: "", dob: "",
    username: "", role: "",
    password: "", confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({
      firstName: "", lastName: "",
      nic: "", dob: "",
      username: "", role: "",
      password: "", confirmPassword: "",
    });
  };

  const handleSubmit = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registering user:", formData);
    // TODO: call your API here
  };

  const Field = ({ icon: Icon, label, name, type = "text", placeholder }) => (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Icon size={15} className="text-indigo-500" />
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="border-2 border-green-400 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 placeholder:text-gray-300 transition"
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-4 pt-4 max-w-4xl">

      {/* Page header */}
      <div className="bg-[#f5f0e8] rounded-2xl px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">User Registration</h1>
        <p className="text-sm text-gray-500 mt-0.5">Create a new Staff or Manager account</p>
      </div>

      {/* ── Personal Information ── */}
      <div className="bg-white rounded-2xl border border-indigo-100 overflow-hidden">
        {/* Section header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-indigo-100 bg-indigo-50/40">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <User size={16} className="text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Personal Information</p>
            <p className="text-xs text-indigo-400">Basic identity details for the user account</p>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-5 px-6 py-5">
          <Field icon={User}     label="First name"  name="firstName" placeholder="Ex: Kamal" />
          <Field icon={User}     label="Last name"   name="lastName"  placeholder="Ex: Perera" />
          <Field icon={CreditCard} label="NIC number" name="nic"      placeholder="Ex: 123456789V" />
          <Field icon={Calendar} label="Date of birth" name="dob"     type="date" placeholder="mm/dd/yyyy" />
        </div>
      </div>

      {/* ── Account Credentials ── */}
      <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
        {/* Section header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-purple-100 bg-purple-50/40">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <KeyRound size={16} className="text-purple-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Account credentials</p>
            <p className="text-xs text-purple-400">Login username and password</p>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-5 px-6 py-5">
          <Field icon={AtSign}    label="User Name"        name="username"        placeholder="kamal_p" />

          {/* Role dropdown — custom to match design */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Shield size={15} className="text-indigo-500" />
              User Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border-2 border-green-400 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-gray-500 transition appearance-none bg-white"
            >
              <option value="" disabled>Ex: Manager</option>
              <option value="Manager">Manager</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <Field icon={KeyRound}     label="Password"         name="password"        type="password" placeholder="Ex: ************" />
          <Field icon={CheckCircle}  label="Confirm Password" name="confirmPassword"  type="password" placeholder="Ex: ************" />
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex justify-end gap-3 pb-4">
        <button
          onClick={() => handleReset()}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl border-2 border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
        >
          <X size={15} /> Cancel
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl border-2 border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
        >
          <RotateCcw size={15} /> Reset
        </button>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#245a41] transition"
        >
          Register
        </button>
      </div>

    </div>
  );
};

const UsersSection = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");

  const users = [
    { initials: "CK", name: "Chamod Janith",    role: "Manager", status: "Active",   time: "Today at 12:04", color: "bg-emerald-700" },
    { initials: "BD", name: "Buddhika Dilini",  role: "Staff",   status: "Active",   time: "Today at 12:04", color: "bg-violet-700"  },
    { initials: "JK", name: "Janith Kushara",   role: "Staff",   status: "Active",   time: "Today at 12:04", color: "bg-emerald-800" },
    { initials: "BC", name: "Buddhika Chatura", role: "Staff",   status: "Active",   time: "Today at 12:04", color: "bg-blue-700"    },
    { initials: "CK", name: "Chatura Kumara",   role: "Manager", status: "Active",   time: "Today at 12:04", color: "bg-emerald-700" },
    { initials: "PN", name: "Piumi Nikeshala",  role: "Staff",   status: "Active",   time: "Today at 12:04", color: "bg-pink-700"    },
    { initials: "CD", name: "Chatumi Dilhara",  role: "Staff",   status: "Active",   time: "Today at 12:04", color: "bg-cyan-700"    },
    { initials: "WA", name: "Wenu Adhikari",    role: "Staff",   status: "Active",   time: "Today at 12:04", color: "bg-green-700"   },
    { initials: "TK", name: "Tharushi Kaushika",role: "Staff",   status: "Active",   time: "Today at 12:04", color: "bg-teal-700"    },
    { initials: "PM", name: "Praveen Manahara", role: "Staff",   status: "Inactive", time: "Today at 12:04", color: "bg-gray-600"    },
  ];

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLocaleLowerCase());
    const matchRole = roleFilter === "All roles" || u.role.roleFilter;
    return matchSearch && matchRole;
  });
  return(
    <div className="flex flex-col gap-4 pt-2 px-2">
      
      {/* Page header */}
      <div className="bg-[#f5f0e8] rounded-2xl px-6 py-4 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">User Registration</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create a new Staff or Manager account</p>
        </div>
        <div className="flex items-center gap-3 text-gray-500 pt-1">
          <Bell size={20} className="cursor-pointer hover:text-gray-700 transition" />
          <RotateCcw size={20} className="cursor-pointer hover:text-gray-700 transition" />
        </div>
      </div>

      {/* Table header */}
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

        <div className="grid grid-cols-4 px-4 py-2 text-sm font-semibold uppercase text-gray-500 bg-gray-100/80 rounded-xl mb-1">
          <span>Username</span>
          <span>Role</span>
          <span>Status</span>
          <span>Last active</span>
        </div>
        <div className="max-h-96 overflow-y-auto pr-1 space-y-1">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">No user found</p>
          ) : (
            filtered.map((user, i) => (
              <div key={i}
                className={`grid grid-cols-4 px-4 py-3 rounded-xl items-center text-sm ${i % 2 === 0 ? "bg-amber-50/60" : "bg-stone-100/40"}`}
              >
                
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${user.color} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                    {user.initials}
                  </div>
                  <span className="font-medium text-gray-800">{user.name}</span>
                </div>
                
                <span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === "Manager" ? "bg-purple-100 text-purple-600" : "bg-sky-100 text-sky-600"
                  }`}
                  >
                    {user.role}
                  </span>
                </span>
                
                <span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === "Active" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                  }`}
                  >
                    {user.status}
                  </span>
                </span>

                <span className="text-xs text-gray-500 bg-amber-50 px-3 py-1 rounded-full w-fit">
                  Last seen {user.time}
                </span>

              </div>
            ))
          )}
        </div>

      </div>

    </div>
  )
};

const SettingSection = () => {
  const [settings, setSettings] = useState({
    cooperativeName: "",
    cooperativeCode: "",
    fiscalYearStart: "January",
    defaultCurrency: "LKR - Sri Lankan Rupee",
    contactEmail: "",
    contactPhone: "",
    address: "",
    dateFormat: "mm/dd/yyyy",
    defaultLanguage: "English",
    itemsPerPage: "10"
  });

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const SettingField = ({label, name, placeholder, type = "text"}) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-medium"> {label} </label>
      <input type={text} 
        name={name}
        value={settings[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="border-2 border-green-400 rounded-2xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-100 placeholder:text-gray-400 bg-white transition"
      />
    </div>
  );

  const SelectSetting =({ label, name, option }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-medium"> {label} </label>
      <select name={name}
        value={settings[name]}
        onChange={handleChange}
        className="border-2 border-green-400 rounded-2xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-100 text-gray-400 bg-white transition"
      >
        {option.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  return(
    <div className="flex flex-col gap-4 pt-4 px-2">
      
      {/* Page header */}
      <div className="bg-[#f5f0e8] rounded-2xl px-6 py-4 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Hela-COOP Setting</h1>
          <p className="text-sm text-gray-500 mt-0.5">General, contact system preferences</p>
        </div>
        <div className="flex items-center gap-3 text-gray-500 pt-1">
          <Search size={18} className="cursor-pointer hover:text-gray-700 transition"/>
          <Settings size={18} className="cursor-pointer hover:text-gray-700 transition" />
        </div>
      </div>

      <div className="max-h-[calc(100vh-220px)] overflow-y-auto space-y-4 pr-1">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100 bg-orange-50/40">
            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
              <Settings size={14} className="text-orange-500" />
            </div>
            <p className="text-sm font-semibold text-gray-800">General setting</p>
          </div>
          <div className="grid grid-cols-2 gap-5 px-6 py-5">
            <SettingField label="Cooperative Name" name="cooperativeName" placeholder="Ex: Hela-COOP Kandy branch" />
            <SettingField label="Cooperative Code" name="cooperativeCode" placeholder="Ex: HCK001" />
            <SettingField label="Fiscal Year Start" name="fiscalYearStart" 
              options = {["January","February","March","April","May","June","July","August","September","October","November","December"]}
            />
            <SettingField label="Default Currency" name="defaultCurrency" placeholder="LKR - Sri Lankan Rupee" />
          </div>
        </div>
      </div>

    </div>
  )
};

const activityLogSection = () => (
  <div></div>
);

const Admin = () => {
  const [activeSection, setActiveSection] = useState("home");

const HomeSection = () => (
  <div className="flex flex-col gap-5 pt-10 px-5">
    <div className="flex gap-5">
      <div className="bg-white w-full rounded-2xl space-y-5 p-4">
        <div className="flex items-center justify-center gap-3 font-bold text-xl">
          <Users /> <h1>Total Users</h1>
        </div>
        <div className="flex items-center justify-center font-bold text-3xl">
          <h1>100</h1>
        </div>
        <div className="flex items-center justify-center gap-2 text-green-500 font-semibold">
          <MoveUp size={16} /> <p>1 this month</p>
        </div>
      </div>

      <div className="bg-white w-full rounded-2xl space-y-5 p-4">
        <div className="flex items-center justify-center gap-3 font-bold text-xl">
          <User /> <h1>Users</h1>
        </div>
        <div className="flex items-center justify-center font-bold text-3xl">
          <h1>03</h1>
        </div>
        <div className="flex items-center justify-center gap-2 text-green-500 font-semibold">
          <MoveUp size={16} /> <p>2 this month</p>
        </div>
      </div>

      <div className="bg-white w-full rounded-2xl space-y-5 p-4">
        <div className="flex items-center justify-center gap-3 font-bold text-xl">
          <CircleCheckBig /> <h1>Active</h1>
        </div>
        <div className="flex items-center justify-center font-bold text-3xl">
          <h1>102</h1>
        </div>
        <div className="flex items-center justify-center font-semibold text-gray-500">
          <p>of 3 users</p>
        </div>
      </div>

      <div className="bg-white w-full rounded-2xl space-y-5 p-4">
        <div className="flex items-center justify-center gap-3 font-bold text-xl">
          <CircleSlash2 /> <h1>Inactive</h1>
        </div>
        <div className="flex items-center justify-center font-bold text-3xl">
          <h1>01</h1>
        </div>
        <div className="flex items-center justify-center font-semibold">
          <p className="text-red-500">needs review</p>
        </div>
      </div>
    </div>

    <div className="bg-white/90 rounded-2xl p-4">

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 font-bold text-lg">
          <Users />
          <h1>Staff &amp; Managers</h1>
        </div>
        <div className="flex items-center gap-2 bg-emerald-100/80 px-3 py-2 rounded-2xl">
          <input
            type="search"
            placeholder="Search here"
            className="bg-transparent outline-none text-sm"
          />
          <Search size={16} />
        </div>
        <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
          <option>Select role</option>
          <option>Manager</option>
          <option>Staff</option>
        </select>
      </div>

      <div className="grid grid-cols-4 rounded-xl px-5 py-2 font-semibold text-white bg-[#0d1f1a] mb-2">
        <span>USERNAME</span>
        <span>ROLE</span>
        <span>STATUS</span>
        <span>LAST ACTIVE</span>
      </div>
    </div>

  </div>
);

  return (
    <>
      <section className="w-full min-h-screen bg-[#0d1f1a] p-10">
        <div className="flex items-start">
          <div className="w-1/3 text-[#10b981]">
            <h1
              className="text-4xl font-bold"
              style={{ fontFamily: '"Antonio", serif' }}
            >
              Hela-COOP
            </h1>
            <h2 className="text-lg font-semibold">#Admin</h2>
            <hr className="mr-10 mt-5 w-2/3 border-t-2 text-gray-400" />
            <div className="mt-20 text-2xl font-semibold space-y-5">
              <div
                onClick={() => setActiveSection("home")}
                className="cursor-pointer rounded-2xl w-2/3 hover:bg-emerald-100 hover:text-black hover:scale-105 transition-all duration-400 p-3"
              >
                <div></div>
                <h1>Home</h1>
              </div>
              <div
                onClick={() => setActiveSection("userRegistration")}
                className="cursor-pointer rounded-2xl w-2/3 hover:bg-emerald-100 hover:text-black hover:scale-105 transition-all duration-400 p-3"
              >
                <div></div>
                <h1>User Registration</h1>
              </div>
              <div
                onClick={() => setActiveSection("users")}
                className="cursor-pointer rounded-2xl w-2/3 hover:bg-emerald-100 hover:text-black hover:scale-105 transition-all duration-400 p-3"
              >
                <div></div>
                <h1>Users</h1>
              </div>
              <div
                onClick={() => setActiveSection("setting")}
                className="cursor-pointer rounded-2xl w-2/3 hover:bg-emerald-100 hover:text-black hover:scale-105 transition-all duration-400 p-3"
              >
                <div></div>
                <h1>Setting</h1>
              </div>
              <div
                onClick={() => setActiveSection("activity")}
                className="cursor-pointer rounded-2xl w-2/3 hover:bg-emerald-100 hover:text-black hover:scale-105 transition-all duration-400 p-3"
              >
                <div></div>
                <h1>Activity Log</h1>
              </div>
            </div>
          </div>
          <div className="w-2/3 h-full rounded-2xl bg-emerald-900 p-5">
          {activeSection === 'home' && (
            <>
              <div className="bg-white/90 border border-emerald-100 p-2 rounded-2xl flex items-center justify-between">
                <h1>Welcome to Hela-COOP</h1>
                <div className="flex items-center justify-center bg-emerald-100/80 p-2 rounded-2xl gap-2">
                  <input
                    type="search"
                    placeholder="Search here"
                    className="rounded-xl"
                  />
                  <Search />
                </div>
                <div className="flex gap-5">
                  <Bell />
                  <RotateCcw />
                </div>
              </div>
              <HomeSection />
            </>
          )}
          {activeSection === "userRegistration" && <UserRegistrationSection />}
          {activeSection === "users" && <UsersSection />}
          {activeSection === "setting" && <SettingSection />}
          </div>
        </div>
      </section>
    </>
  );
};

export default Admin;
