import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'W1', value: 4000 },
  { name: 'W2', value: 3000 },
  { name: 'W3', value: 5000 },
  { name: 'W4', value: 8780 },
  { name: 'W5', value: 6890 },
  { name: 'W6', value: 9390 },
  { name: 'W7', value: 12500 },
];

const StatCard = ({ title, value, trend, trendUp, icon, colorClass }: any) => (
  <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
        <span className={`material-symbols-outlined ${colorClass.replace('bg-', 'text-')}`}>{icon}</span>
      </div>
      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${trendUp ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>
        <span className="material-symbols-outlined text-[14px]">{trendUp ? 'trending_up' : 'trending_down'}</span>
        {trend}
      </div>
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Prompts" 
          value="1,240" 
          trend="5%" 
          trendUp={true} 
          icon="view_list"
          colorClass="bg-blue-500" 
        />
        <StatCard 
          title="Total Tools" 
          value="850" 
          trend="12%" 
          trendUp={true} 
          icon="construction"
          colorClass="bg-purple-500" 
        />
        <StatCard 
          title="Total Users" 
          value="3,420" 
          trend="8%" 
          trendUp={true} 
          icon="group"
          colorClass="bg-orange-500" 
        />
         <StatCard 
          title="Pending Review" 
          value="15" 
          trend="Action" 
          trendUp={false} 
          icon="pending_actions"
          colorClass="bg-red-500" 
        />
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Active Users</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">User growth over time</p>
            </div>
            <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm px-3 py-2 text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a2230', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Progress */}
        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Top Categories</h3>
          <div className="space-y-6">
            {[
              { label: 'Generative Art', value: 45, color: 'bg-blue-500' },
              { label: 'Copywriting', value: 30, color: 'bg-purple-500' },
              { label: 'Coding', value: 25, color: 'bg-orange-500' },
            ].map((cat) => (
              <div key={cat.label} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-700 dark:text-slate-300">{cat.label}</span>
                  <span className="text-slate-900 dark:text-white">{cat.value}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-dark-border">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
        </div>
        <div>
            {[
                { title: 'New Tool "CodeWizard"', sub: 'Submitted by @alexj', time: '2m ago', icon: 'add_circle', color: 'text-green-500', bg: 'bg-green-500/10' },
                { title: 'Approved "Midjourney V5 Guide"', sub: 'Action by System Admin', time: '1h ago', icon: 'verified', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { title: 'New User Registration', sub: 'Sarah K. joined from Google', time: '3h ago', icon: 'person_add', color: 'text-purple-500', bg: 'bg-purple-500/10' },
            ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b last:border-0 border-slate-100 dark:border-dark-border">
                    <div className={`size-10 rounded-full flex items-center justify-center ${item.bg} ${item.color}`}>
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.sub}</p>
                    </div>
                    <span className="text-xs text-slate-400">{item.time}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
