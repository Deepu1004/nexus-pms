import React, { useEffect, useState } from "react";
import useAppStore from "./appStore";
import { supabase } from "./supabase";
import {
  Users,
  DollarSign,
  BedDouble,
  TrendingUp,
  CalendarCheck,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "./utils";
import { startOfMonth, endOfMonth, format, subDays } from "date-fns";

const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
  <div className="glass-card p-6 rounded-xl border border-slate-800 bg-slate-900/50">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <div
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${
            trend > 0
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          }`}
        >
          {trend > 0 ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    <div>
      <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-display font-semibold text-white mt-1">
        {value}
      </p>
      <p className="text-xs text-slate-500 mt-1">{subtext}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { setPageTitle } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    revenue: 0,
    occupancy: 0,
    checkIns: 0,
    adr: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setPageTitle("Overview");
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const now = new Date();
    const start = startOfMonth(now).toISOString();
    const end = endOfMonth(now).toISOString();

    try {
      // 1. Revenue
      const { data: payments } = await supabase
        .from("payments")
        .select("amount")
        .gte("payment_date", start)
        .lte("payment_date", end);

      const revenue =
        payments?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

      // 2. Occupancy (Simplified snapshot)
      const { count: totalRooms } = await supabase
        .from("rooms")
        .select("*", { count: "exact", head: true });
      const { count: occupied } = await supabase
        .from("rooms")
        .select("*", { count: "exact", head: true })
        .eq("current_status", "occupied");

      const occupancy = totalRooms
        ? Math.round(((occupied || 0) / totalRooms) * 100)
        : 0;

      // 3. Today's Check-ins
      const todayStr = format(now, "yyyy-MM-dd");
      const { count: checkIns } = await supabase
        .from("reservations")
        .select("*", { count: "exact", head: true })
        .eq("check_in_date", todayStr)
        .eq("status", "confirmed");

      // 4. Chart Data (Mock trend for visualization based on revenue)
      const mockData = Array.from({ length: 7 }).map((_, i) => ({
        name: format(subDays(now, 6 - i), "MMM dd"),
        value: Math.floor(Math.random() * 50000) + 20000,
      }));
      setChartData(mockData);

      setMetrics({
        revenue,
        occupancy,
        checkIns: checkIns || 0,
        adr: 4500, // Mock ADR for demo
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(metrics.revenue)}
          subtext="Current Month"
          icon={DollarSign}
          trend={12.5}
        />
        <StatCard
          title="Occupancy Rate"
          value={`${metrics.occupancy}%`}
          subtext="Real-time availability"
          icon={BedDouble}
          trend={-2.4}
        />
        <StatCard
          title="Expected Arrivals"
          value={metrics.checkIns}
          subtext="Check-ins today"
          icon={CalendarCheck}
          trend={0}
        />
        <StatCard
          title="ADR"
          value={formatCurrency(metrics.adr)}
          subtext="Avg Daily Rate"
          icon={TrendingUp}
          trend={5.2}
        />
      </div>

      {/* Main Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-display font-semibold text-white mb-6">
            Revenue Performance
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#60a5fa" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Notices */}
        <div className="glass-card p-6 rounded-xl border border-slate-800 flex flex-col">
          <h3 className="text-lg font-display font-semibold text-white mb-4">
            System Notices
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
              <p className="text-xs text-rose-400 font-bold uppercase mb-1">
                Action Required
              </p>
              <p className="text-sm text-slate-300">
                Room 304 reported AC malfunction. Maintenance ticket created.
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-xs text-amber-400 font-bold uppercase mb-1">
                Housekeeping
              </p>
              <p className="text-sm text-slate-300">
                4 rooms pending turnover for 2:00 PM check-ins.
              </p>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <p className="text-xs text-emerald-400 font-bold uppercase mb-1">
                System
              </p>
              <p className="text-sm text-slate-300">
                Night audit completed successfully at 03:00 AM.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
