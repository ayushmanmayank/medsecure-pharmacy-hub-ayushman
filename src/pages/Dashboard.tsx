import { Pill, PackageCheck, TrendingUp, AlertTriangle, Activity, ArrowUpRight, Clock } from 'lucide-react';
import KPICard from '@/components/KPICard';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salesData = [
  { month: 'Jul', sales: 3200 },
  { month: 'Aug', sales: 4100 },
  { month: 'Sep', sales: 3800 },
  { month: 'Oct', sales: 5200 },
  { month: 'Nov', sales: 4700 },
  { month: 'Dec', sales: 6100 },
  { month: 'Jan', sales: 5400 },
];

const recentActivity = [
  { id: 1, action: 'New stock received', detail: 'Paracetamol 500mg — 2,000 units', time: '5 min ago', icon: PackageCheck },
  { id: 2, action: 'Low stock alert', detail: 'Amoxicillin 250mg — 12 units left', time: '22 min ago', icon: AlertTriangle },
  { id: 3, action: 'Verification completed', detail: 'Batch #MED-2026-0891 verified', time: '1 hr ago', icon: Activity },
  { id: 4, action: 'Order dispatched', detail: 'Order #ORD-4521 — In Transit', time: '3 hrs ago', icon: ArrowUpRight },
];

export default function Dashboard() {
  const { ref: chartRef, isVisible: chartVisible } = useScrollAnimation();
  const { ref: actRef, isVisible: actVisible } = useScrollAnimation();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">Welcome back to MedSecure Pharmacy Portal</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Medicines" value={1284} icon={Pill} trend="↑ 12% vs last month" trendUp color="blue" delay={0.1} />
        <KPICard title="Current Stock" value={8450} icon={PackageCheck} trend="↑ 5% vs last month" trendUp color="green" delay={0.2} />
        <KPICard title="Monthly Sales" value={6100} suffix="+" icon={TrendingUp} trend="↑ 18% growth" trendUp color="blue" delay={0.3} />
        <KPICard title="Low Stock Alerts" value={23} icon={AlertTriangle} trend="↓ 4 resolved today" trendUp={false} color="red" delay={0.4} />
      </div>

      {/* Chart */}
      <div
        ref={chartRef}
        className={`rounded-2xl border border-border bg-card p-6 shadow-card ${chartVisible ? 'animate-slide-up' : 'opacity-0'}`}
      >
        <h2 className="mb-4 text-lg font-semibold text-card-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          Monthly Sales
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="fill-muted-foreground" fontSize={12} />
              <YAxis className="fill-muted-foreground" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  color: 'hsl(var(--card-foreground))',
                  boxShadow: 'var(--shadow-card)',
                }}
              />
              <Bar
                dataKey="sales"
                fill="hsl(155 65% 38%)"
                radius={[8, 8, 0, 0]}
                animationDuration={1500}
                animationBegin={chartVisible ? 0 : 99999}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div
        ref={actRef}
        className={`rounded-2xl border border-border bg-card p-6 shadow-card ${actVisible ? 'animate-slide-up' : 'opacity-0'}`}
      >
        <h2 className="mb-4 text-lg font-semibold text-card-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-start gap-4 rounded-xl border border-border p-4 transition-all hover:bg-accent/50 ${
                actVisible ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${0.1 * (i + 1)}s` }}
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">{item.action}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {item.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
