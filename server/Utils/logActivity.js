const ActivityLog = require("../Models/activity");

const logActivity = async ({ performedBy, action, actionType, ref }) => {
  try {
    await ActivityLog.create({
      activityNumber: `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      performedBy,
      action,
      entityType: actionType || "system",
      targetLabel: ref,
      description: ref ? `${action}: ${ref}` : action,
    });
  } catch (error) {
    console.error("Failed to write activity log:", error.message);
  }
};

module.exports = logActivity;