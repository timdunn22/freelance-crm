import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboard, tasks } from '../api/client';
import Layout from '../components/Layout';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboard.stats(),
      tasks.upcoming(),
      tasks.overdue()
    ]).then(([statsRes, upcomingRes, overdueRes]) => {
      setStats(statsRes.data);
      setUpcomingTasks(upcomingRes.data);
      setOverdueTasks(overdueRes.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><div className="text-center py-8">Loading...</div></Layout>;

  const statCards = [
    { label: 'Total Leads', value: stats.total_leads, color: 'bg-blue-500' },
    { label: 'Pipeline Value', value: `$${(stats.total_value || 0).toLocaleString()}`, color: 'bg-green-500' },
    { label: 'Won Value', value: `$${(stats.won_value || 0).toLocaleString()}`, color: 'bg-indigo-500' },
    { label: 'Pending Tasks', value: stats.tasks_pending, color: 'bg-yellow-500' },
    { label: 'Overdue Tasks', value: stats.tasks_overdue, color: 'bg-red-500' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white p-4 rounded-lg shadow">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-2`}>
                <span className="text-white font-bold">{typeof card.value === 'number' ? card.value : ''}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Leads by Status</h2>
            <div className="space-y-2">
              {Object.entries(stats.leads_by_status || {}).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="capitalize text-gray-600">{status}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
              <Link to="/tasks" className="text-indigo-600 text-sm hover:underline">View all</Link>
            </div>
            {upcomingTasks.length === 0 ? (
              <p className="text-gray-500 text-sm">No upcoming tasks</p>
            ) : (
              <ul className="space-y-2">
                {upcomingTasks.slice(0, 5).map((task) => (
                  <li key={task.id} className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm">{task.title}</span>
                    <span className="text-xs text-gray-500">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {overdueTasks.length > 0 && (
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h2 className="text-lg font-semibold text-red-800 mb-4">Overdue Tasks</h2>
            <ul className="space-y-2">
              {overdueTasks.map((task) => (
                <li key={task.id} className="flex justify-between items-center py-2 border-b border-red-200">
                  <span className="text-sm text-red-800">{task.title}</span>
                  <span className="text-xs text-red-600">
                    Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}
