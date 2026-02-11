export const StatusBadge = ({ status }: { status: string }) => {
  const styles =
    status === "ACTIVE"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
      : "bg-gray-50 text-gray-600 ring-gray-500/10";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
};
