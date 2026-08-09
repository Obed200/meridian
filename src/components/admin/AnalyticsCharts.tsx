"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const INK_PRIMARY = "#0b0b0b";
const INK_SECONDARY = "#52514e";
const INK_MUTED = "#898781";
const GRIDLINE = "#e1e0d9";
const SERIES_BLUE = "#2a78d6";

const CATEGORICAL = [
  "#2a78d6",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#e87ba4",
  "#008300",
  "#4a3aa7",
  "#e34948",
];

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-neutral-800">{title}</h3>
      {children}
    </div>
  );
}

function formatDay(day: string) {
  const d = new Date(`${day}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function ViewsOverTimeChart({
  data,
}: {
  data: Array<{ date: string; views: number }>;
}) {
  return (
    <ChartCard title="Views over time">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} stroke={GRIDLINE} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDay}
            tick={{ fill: INK_MUTED, fontSize: 12 }}
            axisLine={{ stroke: GRIDLINE }}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: INK_MUTED, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            labelFormatter={(label) => formatDay(String(label))}
            formatter={(value) => [value, "Views"]}
            contentStyle={{ borderRadius: 6, borderColor: GRIDLINE, fontSize: 13 }}
            labelStyle={{ color: INK_PRIMARY }}
          />
          <Line
            type="monotone"
            dataKey="views"
            stroke={SERIES_BLUE}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function TopPostsChart({
  data,
}: {
  data: Array<{ title: string; views: number }>;
}) {
  return (
    <ChartCard title="Top posts by views">
      <ResponsiveContainer width="100%" height={Math.max(160, data.length * 40)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
        >
          <CartesianGrid horizontal={false} stroke={GRIDLINE} />
          <XAxis type="number" allowDecimals={false} tick={{ fill: INK_MUTED, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="title"
            width={180}
            tick={{ fill: INK_SECONDARY, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: string) => (value.length > 28 ? `${value.slice(0, 28)}…` : value)}
          />
          <Tooltip
            formatter={(value) => [value, "Views"]}
            contentStyle={{ borderRadius: 6, borderColor: GRIDLINE, fontSize: 13 }}
          />
          <Bar dataKey="views" fill={SERIES_BLUE} radius={[0, 4, 4, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ViewsByCategoryChart({
  data,
}: {
  data: Array<{ category: string; views: number }>;
}) {
  return (
    <ChartCard title="Views by category">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} stroke={GRIDLINE} />
          <XAxis
            dataKey="category"
            tick={{ fill: INK_MUTED, fontSize: 12 }}
            axisLine={{ stroke: GRIDLINE }}
            tickLine={false}
          />
          <YAxis allowDecimals={false} tick={{ fill: INK_MUTED, fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
          <Tooltip
            formatter={(value) => [value, "Views"]}
            contentStyle={{ borderRadius: 6, borderColor: GRIDLINE, fontSize: 13 }}
          />
          <Bar dataKey="views" radius={[4, 4, 0, 0]} barSize={28}>
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={CATEGORICAL[index % CATEGORICAL.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
