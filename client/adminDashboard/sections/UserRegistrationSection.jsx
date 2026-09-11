import {useState} from 'react'
import { TriangleAlertIcon, CheckCircleIcon, User, KeyRound, Shield, RotateCcw, CreditCard, Calendar,AtSign } from 'lucide-react';
import { registerUser } from '../../src/api/userApi';
import Field from '../components/Field';

const UserRegistrationSection = ( onRegistered ) => {
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
        <div className="flex flex-col gap-5 pt-4 px-2">
    
          <div className="bg-[#f5f0e8] rounded-2xl px-6 py-4">
            <h1 className="text-xl font-bold text-gray-800">User Registration</h1>
            <p className="text-sm text-gray-500 mt-0.5">Create a new Staff or Manager account</p>
          </div>
          
          {formError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-5 py-3 animate-[fadeInUp_0.3s_ease-out]">
              <TriangleAlertIcon size={15} /> {formError}
            </div>
          )}
          {formSuccess && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-2xl px-5 py-3 animate-[fadeInUp_0.3s_ease-out]">
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
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl border-2 border-gray-300 text-green-400 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 transition-all duration-150 hover:scale-105 active:scale-95"
            >
              <RotateCcw size={15} /> Reset
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl border-2 border-gray-300 text-green-400 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 transition-all duration-150 hover:scale-105 active:scale-95"
            >
              {submitting ? <Loader2 size={15} className="animate-spin" /> : null}
              {submitting ? "Registering..." : "Register"}
            </button>
          </div>
    
        </div>
      );
}

export default UserRegistrationSection