import React from 'react'

const Field = ({ icon: Icon, label, name, type = "text", placeholder, value, onChange }) => (
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

export default Field;