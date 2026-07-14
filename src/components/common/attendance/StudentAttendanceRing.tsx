import { RadialBarChart, PolarAngleAxis, RadialBar } from "recharts";

const AttendanceRing = ({ percentage }: { percentage: number }) => {
  const data = [{ value: percentage, fill: "#10b981" }];

  return (
    <div className="relative w-24 h-24 shrink-0">
      <RadialBarChart
        width={96}
        height={96}
        cx={48}
        cy={48}
        innerRadius={34}
        outerRadius={44}
        barSize={10}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background={{ fill: "#f1f5f9" }}
          dataKey="value"
          cornerRadius={999}
          angleAxisId={0}
        />
      </RadialBarChart>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-xl font-extrabold text-emerald-600">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default AttendanceRing;
