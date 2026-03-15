"use client";

interface DonutChartProps {
  paid: number;
  unpaid: number;
}

export default function DonutChart({ paid, unpaid }: DonutChartProps) {
  const total = paid + unpaid;
  const paidPct = paid / total;
  const radius = 50;
  const cx = 70;
  const cy = 70;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const paidDash = circumference * paidPct;
  const unpaidDash = circumference * (1 - paidPct);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="140" height="140" viewBox="0 0 140 140">
          {/* Background circle */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#f0f0f0"
            strokeWidth={strokeWidth}
          />
          {/* Unpaid arc (gray/red) */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#ff6b9d"
            strokeWidth={strokeWidth}
            strokeDasharray={`${unpaidDash} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dasharray 0.8s ease" }}
          />
          {/* Paid arc (cyan) */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#00d4e8"
            strokeWidth={strokeWidth}
            strokeDasharray={`${paidDash} ${circumference}`}
            strokeDashoffset={-unpaidDash}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dasharray 0.8s ease" }}
          />
        </svg>
        {/* Center labels */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-[#00d4e8] font-bold text-base leading-none">{paid}</span>
          <span className="text-[#ff6b9d] font-bold text-base leading-none">{unpaid}</span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-col gap-1 text-xs" dir="rtl">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#00d4e8] inline-block" />
          <span className="text-gray-600">مدفوع</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#ff6b9d] inline-block" />
          <span className="text-gray-600">غير مدفوع</span>
        </div>
      </div>
    </div>
  );
}