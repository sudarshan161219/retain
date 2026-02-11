export const ProgressBar = ({
  used,
  total,
  compact = false,
}: {
  used: number;
  total: number;
  compact?: boolean;
}) => {
  const percentage = Math.min((used / total) * 100, 100);

  let colorClass = "bg-emerald-500";
  if (percentage > 75) colorClass = "bg-amber-500";
  if (percentage > 90) colorClass = "bg-red-500";

  return (
    <div className="w-full">
      <div
        className={`flex justify-between text-xs ${compact ? "mb-1" : "mb-2"}`}
      >
        <span className="font-medium text-gray-700">
          {used}h <span className="text-gray-400 font-normal">used</span>
        </span>
        <span className="text-gray-500">{total}h total</span>
      </div>
      <div
        className={`w-full bg-gray-100 rounded-full overflow-hidden ${compact ? "h-1.5" : "h-2"}`}
      >
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
