const TYPE_CONFIG = {
  streak: { icon: "flame", color: "#FF5722" },
  achievement: { icon: "trophy", color: "#EAB308" },
  reminder: { icon: "sparkles", color: "#6366F1" },
  system: { icon: "shield-checkmark", color: "#10B981" },
  info: { icon: "information-circle", color: "#6366F1" },
  success: { icon: "checkmark-circle", color: "#10B981" },
  warning: { icon: "warning", color: "#EAB308" },
};

export function mapNotification(n) {
  const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    time: formatRelativeTime(n.createdAt),
    read: n.isRead,
    icon: config.icon,
    color: config.color,
  };
}

function formatRelativeTime(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}