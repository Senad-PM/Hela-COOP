import React from 'react'
import { Loader2 } from 'lucide-react';
import { getInitials, getAvatarColor, formatLastActive } from '../../src/utils/userDisplay';

export const useFilteredUsers = (users, search, roleFilter) => {
    return users.filter((u) => {
      const matchSearch = (u.userName || "").toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "All roles" || (u.role || "").toLowerCase() === roleFilter.toLowerCase();
      return matchSearch && matchRole;
    });
};

const UserTable = ({ users=[], loading, error }) => {
  return(
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
                <div key={user._id || i} className={`grid grid-cols-4 px-4 py-3 rounded-xl items-center text-sm transition-colors duration-200 hover:bg-emerald-50 ${i % 2 === 0 ? "bg-amber-50/60" : "bg-stone-100/40"}`}>
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
  )
}

export default UserTable