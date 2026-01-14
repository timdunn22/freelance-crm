import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tasks } from '../api/client';
import Layout from '../components/Layout';

export default function Tasks() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', due_date: '', priority: 'medium' });

  const loadTasks = () => {
    const params = filter !== 'all' ? { status: filter } : {};
    tasks.list(params).then((r) => setList(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { loadTasks(); }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await tasks.create(form);
    setShowForm(false);
    setForm({ title: '', description: '', due_date: '', priority: 'medium' });
    loadTasks();
  };

  const handleToggle = async (id) => {
    await tasks.toggle(id);
    loadTasks();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      await tasks.delete(id);
      loadTasks();
    }
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-gray-100 text-gray-800'
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Task</button>
        </div>

        <div className="flex gap-2">
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md capitalize ${filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" required placeholder="Task title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              <div className="grid gap-4 md:grid-cols-2">
                <input type="datetime-local" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-md" />
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-md">
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3} />
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Create</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? <div className="text-center py-8">Loading...</div> : (
          <div className="space-y-3">
            {list.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No tasks found</div>
            ) : (
              list.map((task) => (
                <div key={task.id} className={`bg-white p-4 rounded-lg shadow flex items-start gap-4 ${task.overdue ? 'border-l-4 border-red-500' : ''}`}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(task.id)}
                    className="mt-1 w-5 h-5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>{task.title}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded ${priorityColors[task.priority] || priorityColors.medium}`}>{task.priority}</span>
                      {task.overdue && <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded">Overdue</span>}
                    </div>
                    {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      {task.due_date && <span>Due: {new Date(task.due_date).toLocaleString()}</span>}
                      {task.lead && <Link to={`/leads/${task.lead.id}`} className="text-indigo-600 hover:underline">Lead: {task.lead.name}</Link>}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
