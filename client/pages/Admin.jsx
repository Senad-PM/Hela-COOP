import {Bell, RotateCcw, Search, Users, MoveUp, User, CircleCheckBig, CircleSlash2} from "lucide-react";
import React, { useState } from "react";

const Admin = () => {
  const [activeSection, setActiveSection] = useState("home");

  const HomeSection = () => (
    <div className="flex items-center justify-center gap-5 pt-10">
      <div className="bg-white w-full h-full rounded-2xl space-y-5 p-3">
        <div className="flex items-center justify-center gap-3 font-bold text-2xl">
          <Users />
          <h1>Total Users</h1>
        </div>
        <div className="flex items-center justify-center font-bold text-2xl">
          <h1>100</h1>
        </div>
        <div className="flex items-center justify-center gap-3 font-bold text-green-500">
          <MoveUp />
          <p>1 in this month</p>
        </div>
      </div>
      <div className="bg-white w-full h-full rounded-2xl space-y-5 p-3">
        <div className="flex items-center justify-center gap-3 font-bold text-2xl">
          <User />
          <h1>Users</h1>
        </div>
        <div className="flex items-center justify-center font-bold text-2xl">
          <h1>03</h1>
        </div>
        <div className="flex items-center justify-center gap-3 font-bold text-green-500">
          <MoveUp />
          <p>2 in this month</p>
        </div>
      </div>
      <div className="bg-white w-full h-full rounded-2xl space-y-5 p-3">
        <div className="flex items-center justify-center gap-3 font-bold text-2xl">
          <CircleCheckBig />
          <h1>Active</h1>
        </div>
        <div className="flex items-center justify-center font-bold text-2xl">
          <h1>102</h1>
        </div>
        <div className="flex items-center justify-center gap-3 font-bold">
          <p>During this month</p>
        </div>
      </div>
      <div className="bg-white w-full h-full rounded-2xl space-y-5 p-3">
        <div className="flex items-center justify-center gap-3 font-bold text-2xl">
          <CircleSlash2 />
          <h1>Inactive</h1>
        </div>
        <div className="flex items-center justify-center font-bold text-2xl">
          <h1>01</h1>
        </div>
        <div className="flex items-center justify-center gap-3 font-bold">
          <MoveUp />
          <p className="text-red-500">needs review</p>
        </div>
      </div>
    </div>
  );

  const MemberSection = () => (
    <div></div>
  );

  const RoleSection = () => (
    <div></div>
  );

  const AuditSection = () => (
    <div></div>
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
                onClick={() => setActiveSection("members")}
                className="cursor-pointer rounded-2xl w-2/3 hover:bg-emerald-100 hover:text-black hover:scale-105 transition-all duration-400 p-3"
              >
                <div></div>
                <h1>Members</h1>
              </div>
              <div
                onClick={() => setActiveSection("roles")}
                className="cursor-pointer rounded-2xl w-2/3 hover:bg-emerald-100 hover:text-black hover:scale-105 transition-all duration-400 p-3"
              >
                <div></div>
                <h1>Roles & Permission</h1>
              </div>
              <div
                onClick={() => setActiveSection("setting")}
                className="cursor-pointer rounded-2xl w-2/3 hover:bg-emerald-100 hover:text-black hover:scale-105 transition-all duration-400 p-3"
              >
                <div></div>
                <h1>Setting</h1>
              </div>
              <div
                onClick={() => setActiveSection("audit")}
                className="cursor-pointer rounded-2xl w-2/3 hover:bg-emerald-100 hover:text-black hover:scale-105 transition-all duration-400 p-3"
              >
                <div></div>
                <h1>Audit Log</h1>
              </div>
            </div>
          </div>
          <div className="w-2/3 h-full rounded-2xl bg-emerald-900 p-5">
            <div>
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
              {activeSection === 'home' && <HomeSection />}
              <div className="w-full h-full bg-white/90 rounded-2xl mt-10">
                <div className="flex items-center justify-between p-2">
                  <div className="flex gap-3">
                    <Users />
                    <h1>Staff & Managers</h1>
                  </div>
                  <div className="flex items-center justify-center bg-emerald-100/80 p-2 rounded-2xl space-x-2">
                    <input
                      type="search"
                      placeholder="Search here"
                      className="rounded-xl"
                    />
                    <Search />
                  </div>
                  <div>
                    <select>
                      <option>Select role</option>
                      <option>Manager</option>
                      <option>Staff</option>
                    </select>
                  </div>
                </div>

                <div className="pt-5 pb-5 p-2">
                  <div className="w-full h-full rounded-xl pl-5 pr-5 p-2 font-semibold flex items-center justify-between bg-[#0d1f1a] text-white">
                    <h1>User</h1>
                    <h1>Role</h1>
                    <h1>Status</h1>
                    <h1>Last Active</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Admin;
