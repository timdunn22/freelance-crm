import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { leads, interactions, tasks as tasksApi } from '../api/client';
import Layout from '../components/Layout';

const statusColors = {
  new: 'bg-gray-100 text-gray-800',
  contacted: 'bg-blue-100 text-blue-800',
  qualified: 'bg-yellow-100 text-yellow-800',
  proposal: 'bg-purple-100 text-purple-800',
  negotiation: 'bg-orange-100 text-orange-800',
  won: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800'
};

export default function LeadDetail() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [interactionForm, setInteractionForm] = useState({ interaction_type: 'email', notes: '', interaction_date: new Date().toISOString().slice(0, 16) });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', due_date: '', priority: 'medium' });

  const loadLead = () => {
    leads.get(id).then((r) => setLead(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { loadLead(); }, [id]);

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    await interactions.create(id, interactionForm);
    setShowInteractionForm(false);
    setInteractionForm({ interaction_type: 'email', notes: '', interaction_date: new Date().toISOString().slice(0, 16) });
    loadLead();
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    await tasksApi.create({ ...taskForm, lead_id: id });
    setShowTaskForm(false);
    setTaskForm({ title: '', description: '', due_date: '', priority: 'medium' });
    loadLead();
  };

  const handleToggleTask = async (taskId) => {
    await tasksApi.toggle(taskId);
    loadLead();
  };

  const handleDeleteInteraction = async (interactionId) => {
    await interactions.delete(id, interactionId);
    loadLead();
  };

  if (loading) return <Layout><div className="text-center py-8">Loading...</div></Layout>;
  if (!lead) return <Layout><div className="text-center py-8">Lead not found</div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/leads" className="text-indigo-600 hover:underline">&larr; Back to Leads</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
              {lead.company && <p className="text-lg text-gray-600">{lead.company}</p>}
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[lead.status] || statusColors.new}`}>
              {lead.status || 'new'}
            </span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {lead.email && <p><span className="font-medium">Email:</span> <a href={`mailto:${lead.email}`} className="text-indigo-600">{lead.email}</a></p>}
            {lead.phone && <p><span className="font-medium">Phone:</span> <a href={`tel:${lead.phone}`} className="text-indigo-600">{lead.phone}</a></p>}
            {lead.website && <p><span className="font-medium">Website:</span> <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600">{lead.website}</a></p>}
            {lead.estimated_value && <p><span className="font-medium">Estimated Value:</span> ${lead.estimated_value.toLocaleString()}</p>}
          </div>
          {lead.notes && (
            <div className="mt-4">
              <h3 className="font-medium">Notes:</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{lead.notes}</p>
            </div>
          )}
          {lead.tags?.length > 0 && (
            <div className="mt-4 flex gap-2">
              {lead.tags.map((tag) => (
                <span key={tag.id} className="px-2 py-1 text-xs rounded" style={{ backgroundColor: tag.color || '#E5E7EB' }}>{tag.name}</span>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Interactions</h2>
              <button onClick={() => setShowInteractionForm(true)} className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add</button>
            </div>
            {showInteractionForm && (
              <form onSubmit={handleAddInteraction} className="mb-4 p-4 bg-gray-50 rounded">
                <div className="space-y-3">
                  <select value={interactionForm.interaction_type} onChange={(e) => setInteractionForm({ ...interactionForm, interaction_type: e.target.value })} className="w-full px-3 py-2 border rounded">
                    <option value="email">Email</option>
                    <option value="call">Call</option>
                    <option value="meeting">Meeting</option>
                    <option value="note">Note</option>
                    <option value="other">Other</option>
                  </select>
                  <input type="datetime-local" value={interactionForm.interaction_date} onChange={(e) => setInteractionForm({ ...interactionForm, interaction_date: e.target.value })} className="w-full px-3 py-2 border rounded" />
                  <textarea placeholder="Notes" value={interactionForm.notes} onChange={(e) => setInteractionForm({ ...interactionForm, notes: e.target.value })} className="w-full px-3 py-2 border rounded" rows={2} />
                  <div className="flex gap-2">
                    <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded">Save</button>
                    <button type="button" onClick={() => setShowInteractionForm(false)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
                  </div>
                </div>
              </form>
            )}
            {lead.interactions?.length === 0 ? (
              <p className="text-gray-500 text-sm">No interactions yet</p>
            ) : (
              <ul className="space-y-3">
                {lead.interactions?.map((interaction) => (
                  <li key={interaction.id} className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between">
                      <span className="font-medium capitalize">{interaction.interaction_type}</span>
                      <button onClick={() => handleDeleteInteraction(interaction.id)} className="text-red-600 text-sm hover:underline">Delete</button>
                    </div>
                    <p className="text-sm text-gray-500">{new Date(interaction.interaction_date).toLocaleString()}</p>
                    {interaction.notes && <p className="mt-1 text-sm">{interaction.notes}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <button onClick={() => setShowTaskForm(true)} className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add</button>
            </div>
            {showTaskForm && (
              <form onSubmit={handleAddTask} className="mb-4 p-4 bg-gray-50 rounded">
                <div className="space-y-3">
                  <input type="text" required placeholder="Task title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} className="w-full px-3 py-2 border rounded" />
                  <input type="datetime-local" value={taskForm.due_date} onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })} className="w-full px-3 py-2 border rounded" />
                  <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} className="w-full px-3 py-2 border rounded">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <textarea placeholder="Description" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} className="w-full px-3 py-2 border rounded" rows={2} />
                  <div className="flex gap-2">
                    <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded">Save</button>
                    <button type="button" onClick={() => setShowTaskForm(false)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
                  </div>
                </div>
              </form>
            )}
            {lead.tasks?.length === 0 ? (
              <p className="text-gray-500 text-sm">No tasks yet</p>
            ) : (
              <ul className="space-y-2">
                {lead.tasks?.map((task) => (
                  <li key={task.id} className={`p-3 rounded flex items-start gap-3 ${task.completed ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <input type="checkbox" checked={task.completed} onChange={() => handleToggleTask(task.id)} className="mt-1" />
                    <div className="flex-1">
                      <p className={task.completed ? 'line-through text-gray-500' : ''}>{task.title}</p>
                      {task.due_date && <p className="text-xs text-gray-500">{new Date(task.due_date).toLocaleString()}</p>}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${task.priority === 'high' ? 'bg-red-100' : task.priority === 'low' ? 'bg-gray-100' : 'bg-yellow-100'}`}>{task.priority}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
