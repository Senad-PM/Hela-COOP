import {
  Bell, RotateCcw, Search, Users, MoveUp, User,
  CircleCheckBig, CircleSlash2,
  CreditCard, Calendar, AtSign, Shield, KeyRound, CheckCircle, X,
  Settings, TriangleAlert, ChevronRight, ChevronLeft, Download, Trash2,
  Home,
  UserPlus,
  UserRound,
  ClipboardList,
  Loader2,
  TriangleAlertIcon,
  CheckCircleIcon
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { fetchUsers, registerUser } from "../src/api/userApi";
import { getInitials, getAvatarColor, formatLastActive } from "../src/utils/userDisplay";

const UserTable = ({users=[], loading, error}) => (
  <>
    <div className="grid grid-cols-4 px-4 py-2 text-sm font-semibold uppercase text-gray-500 bg-gray-100/80 rounded-xl mb-1">
      <span>Username</span>
      <span>Role</span>
      <span>Status</span>
      <span>Last active</span>
    </div>
    <div className="max-h-96 overflow-y-auto pr-1 space-y-1">
      {loading ? (
        <p className="flex items-center justify-center gap-2 text-sm text-gray-400 py-8">
          <Loader2 size={14} className="animate-spin"/> Loading users...
        </p>
      ) : error ? (
        <p className="text-center text-sm text-red-400 px-8"> {error} </p>
      ) : users.length === 0 ? (
        <p className="text-center text-sm text-gray-400 px-8"> No user found</p>
      ) : (
        users.map((user, i) => {
          const role = (user.role || "").toLowerCase();
          return(
            <div key={user._id || i} className={`grid grid-cols-4 px-4 py-3 rounded-xl items-center text-sm ${i % 2 === 0 ? "bg-amber-50/60" : "bg-stone-100/40"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${getAvatarColor(user.userName)} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                  {getInitials(user.userName)}
                </div>
                  <span className="font-medium text-gray-800"> {user.userName} </span>
              </div>

              <span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${role === "manager" ? "bg-purple-100 text-purple-600"
                  : role === "admin" ? "bg-amber-100 text-amber-700"
                  : "bg-sky-100 text-sky-600"
                }`}>
                  {user.role}
                </span>
              </span>

              <span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.isActive ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </span>

              <span className="text-xs text-gray-500 bg-amber-50 px-3 py-1 rounded-full w-fit">
                Last seen {formatLastActive(user.updatedAt || user.createdAt)}
              </span>

            </div>
          );
        })
      )}
    </div>
  </>
);

const useFilteredUsers = (users, search, roleFilter) => {
  return users.filter((u) => {
    const matchSearch = (u.userName || "").toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All roles" || (u.role || "").toLowerCase() === roleFilter.toLowerCase();
    return matchSearch && matchRole;
  });
};

const HomeSection = ({ users = [], loading, error }) => {

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");

  const filtered = useFilteredUsers(users, search, roleFilter)

  const total = users.length;
  const managers = users.filter((u) => (u.role || "").toLowerCase() === "manager").length;
  const active = users.filter((u) => u.isActive).length;
  const inactive = total - active

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
        <div className="bg-white w-full rounded-2xl space-y-5 p-4">
          <div className="flex items-center justify-center gap-3 font-bold text-xl">
            <Users /> <h1>Total Users</h1>
          </div>
          <div className="flex items-center justify-center font-bold text-3xl">
            <h1> {total} </h1>
          </div>
          <div className="flex items-center justify-center gap-2 text-green-500 font-semibold">
            <MoveUp size={16} /> <p>1 this month</p>
          </div>
        </div>

        <div className="bg-white w-full rounded-2xl space-y-5 p-4">
          <div className="flex items-center justify-center gap-3 font-bold text-xl">
            <User /> <h1>Managers</h1>
          </div>
          <div className="flex items-center justify-center font-bold text-3xl">
            <h1> {managers} </h1>
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
            <h1> {active} </h1>
          </div>
          <div className="flex items-center justify-center font-semibold text-gray-500">
            <p>of {total} users</p>
          </div>
        </div>

        <div className="bg-white w-full rounded-2xl space-y-5 p-4">
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
};

const Field = ({ icon: Icon, label, name, type = "text", placeholder,value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
      <Icon size={15} className="text-indigo-500" />
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border-2 border-green-400 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 placeholder:text-gray-300 transition"
    />
  </div>
);

const UserRegistrationSection = ({ onRegistered }) => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "",
    nic: "", dob: "",
    username: "", email: "", role: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFromSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({
      firstName: "", lastName: "",
      nic: "", dob: "",
      username: "", email: "", role: "",
    });
    setFormError("");
    setFromSuccess("");
  };
      

  const handleSubmit = async () => {
    setFormError("");
    setFromSuccess("");

    if (!formData.username || !formData.email || !formData.role){
      setFormError("Username, email and role required.");
      return;
    }
    setSubmitting(true);
    try{
      const result = await registerUser({
        userName: formData.username,
        email: formData.email,
        role: formData.role,
      });
      setFromSuccess(`${result.userName} was created. A setup emailwas sent to ${result.email}.`);
      handleReset();
      onRegistered?.();
    }catch (err) {
      setFormError(err.response?.data?.message || "Registration failed. Please try again.");
    }finally{
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 pt-4 px-2 max-w-4xl">

      <div className="bg-[#f5f0e8] rounded-2xl px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">User Registration</h1>
        <p className="text-sm text-gray-500 mt-0.5">Create a new Staff or Manager account</p>
      </div>
      
      {formError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-5 py-3">
          <TriangleAlertIcon size={15} /> {formError}
        </div>
      )}
      {formSuccess && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-2xl px-5 py-3">
          <CheckCircleIcon size={15} /> {formSuccess}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-indigo-100 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-indigo-100 bg-indigo-50/40">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <User size={16} className="text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Personal Information</p>
            <p className="text-xs text-indigo-400">Basic identity details for the user account</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 px-6 py-5">
          <Field icon={User} label="First name" name="firstName" placeholder="Ex: Kamal" value={formData.firstName} onChange={handleChange} />
          <Field icon={User} label="Last name" name="lastName" placeholder="Ex: Perera" value={formData.lastName} onChange={handleChange} />
          <Field icon={CreditCard} label="NIC number" name="nic" placeholder="Ex: 123456789V" value={formData.nic} onChange={handleChange} />
          <Field icon={Calendar} label="Date of birth" name="dob" type="date" placeholder="mm/dd/yyyy" value={formData.dob} onChange={handleChange} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-purple-100 bg-purple-50/40">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <KeyRound size={16} className="text-purple-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Account credentials</p>
            <p className="text-xs text-purple-400">Login username and password</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 px-6 py-5">
          <Field icon={AtSign} label="User Name" name="username" placeholder="kamal_p" value={formData.username} onChange={handleChange} />
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
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <Field icon={AtSign} label="Email" name="email" type="email" placeholder="kamal@example.com" value={formData.email} onChange={handleChange} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pb-4">
        <button
          onClick={handleReset}
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl border-2 border-gray-300 text-green-400 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 transition"
        >
          <RotateCcw size={15} /> Reset
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl border-2 border-gray-300 text-green-400 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 transition"
        >
          {submitting ? <Loader2 size={15} className="animate-spin" /> : null}
          {submitting ? "Registering..." : "Register"}
        </button>
      </div>

    </div>
  );
};

const UsersSection = ({users = [], loading, error}) => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");

  const filtered = useFilteredUsers(users, search, roleFilter)

  return(
    <div className="flex flex-col gap-4 pt-4 px-2">
      
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
      <input type={type} 
        name={name}
        value={settings[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="border-2 border-green-400 rounded-2xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-100 placeholder:text-gray-400 bg-white transition"
      />
    </div>
  );

  const SettingSelect =({ label, name, options }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-medium"> {label} </label>
      <select name={name}
        value={settings[name]}
        onChange={handleChange}
        className="border-2 border-green-400 rounded-2xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-100 text-gray-400 bg-white transition"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  return(
    <div className="flex flex-col gap-4 pt-4 px-2">
      
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
            <SettingSelect label="Fiscal Year Start" name="fiscalYearStart" 
              options = {["January","February","March","April","May","June","July","August","September","October","November","December"]}
            />
            <SettingField label="Default Currency" name="defaultCurrency" placeholder="LKR - Sri Lankan Rupee" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100 bg-blue-50/40">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100">
              <AtSign size={14} className="text-blue-500" />
            </div>
            <p className="text-sm font-semibold text-gray-800">Contact Information</p>
          </div>
          <div className="grid grid-cols-2 gap-5 px-6 py-5">
            <SettingField label="Contact Email" name="contactEmail" placeholder="admin01@gmail.com" type="email" />
            <SettingField label="Contact Phone" name="contactPhone" placeholder="+94 xx xxx xxxx" />
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Address</label>
              <input name="address"
                value={settings.address}
                onChange={handleChange}
                placeholder="Ex: lane 01, Kandy"
                className="border-2 border-green-400 rounded-2xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-100 placeholder:text-gray-300 transition bg-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100 bg-blue-50/40">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100">
              <Settings size={14} className="text-blue-500" />
            </div>
            <p className="text-sm font-semibold text-gray-800">System Preferences</p>
          </div>
          <div className="grid grid-cols-2 gap-5 px-6 py-5">
            <SettingSelect label="Date Format" name="dateFormat" options={["mm/dd/yyyy", "dd/mm/yyyy", "yyyy/mm/dd"]} />
            <SettingSelect label="Default Language" name="defaultLanguage" options={["English", "Sinhala", "Tamil"]} />
            <SettingSelect label="Items Per Page" name="itemsPerPage" options={["10", "25" ,"50", "100"]} />
          </div>
        </div>

        <div className="flex items-center gap-3 bg-amber-50 boder border-amber-200 rounded-2xl px-5 py-3">
          <TriangleAlert size="14" className="text-amber-500" />
          <p className="text-xs text-amber-700">Bank details and payment gateways are not included - HelaCOOP does not support bank transfers.</p>
        </div>
        <div className="flex justify-end pb-4">
          <button className="px-6 py-2.5 rounded-2xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#245a41] transition">
            Save Setting
          </button>
        </div>
      </div>

    </div>
  )
};

const ActivityLogSection = () => {
  
  const[search, setSearch] = useState("");
  const[userFilter, setUserFilter] = useState("All users");
  const[actionFilter, setActionFilter] = useState("All actions");
  const[timeFilter, setTimeFilter] = useState("All time");
  const[currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  const logs = [
    { date: "2024-05-13 10:30", initials: "KA", color: "bg-emerald-700", user: "admin_kamal", action: "Added manager", actionColor: "text-emerald-600", ref: "nimal_s"  },
    { date: "2024-05-13 09:15", initials: "NS", color: "bg-violet-700", user: "Nimal_Shantha", action: "Approve loan", actionColor: "text-blue-600", ref: "L - 001"  },
    { date: "2024-05-13 08:45", initials: "AJ", color: "bg-amber-600", user: "Amali_Jayawardhana", action: "Added savings", actionColor: "text-emerald-600", ref: "M - 001"  },
    { date: "2024-05-12 16:30", initials: "KA", color: "bg-emerald-700", user: "admin_kamal", action: "Changed Permission", actionColor: "text-orange-500", ref: "amali_j"  },
    { date: "2024-05-12 14:20", initials: "KA", color: "bg-emerald-700", user: "admin_kamal", action: "Added staff", actionColor: "text-emerald-600", ref: "S - 001"  },
    { date: "2024-05-12 11:05", initials: "AJ", color: "bg-amber-600", user: "Amali_Jayawardhana", action: "Added loan payment", actionColor: "text-blue-600", ref: "nimal_s"  },
    { date: "2024-05-11 09:00", initials: "KA", color: "bg-emerald-700", user: "admin_kamal", action: "Delete staff", actionColor: "text-red-500", ref: "sarath_k" },
  ];

  const filtered = logs.filter((l) => {
    const matchSearch = l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase());
    const matchUser = userFilter === "All users" || l.user === userFilter;
    const matchAction = actionFilter === "All actions" || l.action === actionFilter;
    return matchSearch && matchUser && matchAction;
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="flex flex-col gap-4 pt-4 px-2">

      <div className="bg-[#f5f0e8] flex items-start justify-between rounded-2xl px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Activity Log</h1>
          <p className="text-sm text-gray-500 mt-0.5">Full System Activity History</p>
        </div>
        <div className="flex items-center gap-3 text-gray-500 pt-1">
          <Search size={14} className="cursor-pointer hover:text-gray-700 transition" />
          <Settings size={14} className="cursor-pointer hover:text-gray-700 transition" />
        </div>
      </div>

      <div className="bg-white/90 rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 font-bold text-gray-800">
            <span>🗒</span> System activity log
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={userFilter} onChange={(e) => {setUserFilter(e.target.value); setCurrentPage(1);}}
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none bg-white text-gray-600"  
            >
              <option>All users</option>
              <option>admin_kamal</option>
              <option>Nimal_Shantha</option>
              <option>Amali_Jayawardhana</option>
            </select>
            <select value={actionFilter} onChange={(e) => {setActionFilter(e.target.value); setCurrentPage(1);}}
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none bg-white text-gray-600"  
            >
              <option>All actions</option>
              <option>Added manager</option>
              <option>Approve loan</option>
              <option>Added savings</option>
              <option>Changed permission</option>
              <option>Added staff</option>
              <option>Added loan payment</option>
              <option>Delete staff</option>
            </select>
            <select value={timeFilter} onChange={(e) => {setTimeFilter(e.target.value)}}
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none bg-white text-gray-600"  
            >
              <option>All time</option>
              <option>Today</option>
              <option>This week</option>
              <option>This month</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          {paginated.map((logs, i) => (
            <div key={i} className={`grid grid-cols-4 px-4 py-3 rounded-xl items-center text-sm ${i % 2 == 0 ? "bg-amber-50/60" : "bg-stone-100/40}"}`}>
              <span className="text-xs text-gray-500">{logs.date}</span>
              <div className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full ${logs.color} text-white text-xs font-bold flex-shrink-0`}>
                  {logs.initials}
                </div>
                <span className="text-xs font-medium text-gray-700">{logs.user}</span>
              </div>
              <span className={`text-xs font-semibold ${logs.actionColor}`}>{logs.action}</span>
              <span className="tex-xs text-gray-500">{logs.ref}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
          <p className="text-xs text-gray-500">
            Showing {Math.min((currentPage - 1) * rowsPerPage + 1, filtered.length)}–{Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length} entries
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 text-xs disabled:opacity-40 hover:bg-gray-50"  
            >
              <ChevronLeft />
            </button>
            {Array.from({length: totalPages}, (_, i) => (
              <button key={i} onChange={() => setCurrentPage(i + 1)}
                className={`flex items-center justify-center w-7 h-7 rounded-lg border text-xs transition ${
                  currentPage === i + 1 ? "bg-[#0d1f1a] text-white border-[#0d1f1a]" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}  
              className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 text-xs disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronRight />
            </button>
            <button className="flex items-center gap-1 ml-2 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-600 hover:text-gray-50 hover:bg-black transition">
              <Download /> CSV
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-2xl px-5 py-3 mt-1">
          <div className="flex items-center gap-2">
            <TriangleAlert size="14" className="text-red-500" />
            <div>
              <p className="text-xs font-semibold text-red-600">Danger zone</p>
              <p className="text-xs text-red-400">Clear all logs - cannot be undone</p>
            </div>
          </div>
          <button className="flex items-center gap-1 text-xs text-red-500 border border-red-300 px-3 py-1.5 rounded-xl hover:bg-red-100 transition">
            <Trash2 /> Clear all logs
          </button>
        </div>

      </div>

    </div>
  );

};

const Admin = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const role = localStorage.getItem("role");
  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "Admin";

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

  const NAV_ITEMS = [
    { key: "home", label: "Home", icon: Home },
    { key: "userRegistration", label: "User Registration", icon: UserPlus },
    { key: "users", label: "Users", icon: UserRound },
    { key: "setting", label: "Setting", icon: Settings },
    { key: "activity", label: "Activity Log", icon: ClipboardList },
  ];

  const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
    <div onClick={onClick}
      className={`flex items-center gap-3 cursor-pointer rounded-xl px-3 py-2.5 transition-all duration-200 ${
        isActive
          ? "bg-emerald-800/60 text-emerald-300 border-l-4 border-emerald-400"
          : "text-gray-300 border-l-4 border-transparent hover:bg-emerald-900/40 hover:text-emerald-200"
      }`}
    >
      <Icon size={18} />
      <span className='font-medium'>{label}</span>
      </div>
  );

  return (
    <>
      <section className="w-full h-screen bg-[#0d1f1a] p-6 overflow-hidden">
        <div className="flex h-full gap-6">
          <div className="flex flex-col w-64 flex-shrink-0 text-white">
            <h1
              className="text-3xl font-bold" style={{ fontFamily: '"Antonio", serif' }}
            >
              Hela <span className="text-emerald-400">COOP</span>
            </h1>
            <span className="mt-2 w-fit text-xs font-semibold bg-emerald-800/70 text-emerald-300 px-3 py-1 rounded-full">
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
          </div>
          <div className="flex-1 h-full rounded-2xl bg-[#f5f0e8] p-5 overflow-auto">

          {activeSection === "userRegistration" && (
            <UserRegistrationSection onRegistered={() => {
              loadUsers(),
              setActiveSection("users");
              }}
            />
          )}
          {activeSection === "users" && <UsersSection users={users} loading={usersLoading} error={usersError} />}
          {activeSection === "setting" && <SettingSection />}
          {activeSection === "activity" && <ActivityLogSection />}
          {activeSection === "home" && <HomeSection users={users} loading={usersLoading} error={usersError} />}
          </div>
        </div>
      </section>
    </>
  );
};

export default Admin;
