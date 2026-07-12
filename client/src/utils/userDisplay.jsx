const AVATAR_COLORS = [
    "bg-emerald-700", "bg-violet-700", "bg-blue-700", "bg-pink-700",
    "bg-cyan-700", "bg-green-700", "bg-teal-700", "bg-amber-700",
    "bg-indigo-700", "bg-rose-700",
  ];
  
  export const getInitials = (userName = "") => {
    const parts = userName.trim().split(/[\s._-]+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };
  
  // Deterministic color per user so the same person always gets the same
  // avatar color, without needing to store a color in the database.
  export const getAvatarColor = (seed = "") => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  };
  
  // The backend doesn't track a real "last login" timestamp yet, so this
  // approximates it from updatedAt/createdAt.
  export const formatLastActive = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (isToday) return `Today at ${time}`;
    return `${date.toLocaleDateString()} at ${time}`;
  };