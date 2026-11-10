import { useEffect } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { getInitials, getAvatarColor } from "../../src/utils/userDisplay";

const fullDate = (d) =>
  new Date(d).toLocaleString(undefined, {
    year: "numeric", month: "long", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

const Field = ({ label, value, mono }) => (
  <div className="bg-stone-50 rounded-xl p-3">
    <p className="text-[11px] uppercase text-gray-400 font-semibold">{label}</p>
    <p className={`text-sm text-gray-800 mt-0.5 break-all ${mono ? "font-mono text-xs" : ""}`}>
      {value || "—"}
    </p>
  </div>
);

const ActivityDetails = ({ activity, actionClass, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl"
      >

        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400">{activity.activityNumber}</p>
            <h2 className={`text-lg font-serif font-semibold ${actionClass}`}>
              {activity.action}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-3">

          <div className="flex items-center gap-3 bg-stone-50 rounded-xl p-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getAvatarColor(activity.user)} text-white text-sm font-bold`}>
              {getInitials(activity.user)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{activity.user}</p>
              <p className="text-xs text-gray-500 capitalize">{activity.role || "system"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date & time" value={fullDate(activity.date)} />
            <Field label="Type" value={activity.entityType} />
            <Field label="Reference" value={activity.ref} />
            <Field label="Record ID" value={activity.entityId} mono />
          </div>

          <Field label="Description" value={activity.description} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ActivityDetails;