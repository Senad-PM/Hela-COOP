import {useState} from 'react'
import { Search, Settings, AtSign, TriangleAlert } from 'lucide-react';

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
        <div className="flex flex-col gap-5 pt-4 px-2">
          
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
    
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3">
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
}

export default SettingSection