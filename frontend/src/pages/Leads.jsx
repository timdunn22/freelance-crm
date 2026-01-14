import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leads, tags as tagsApi } from '../api/client';
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

export default function Leads() {
  const [list, setList] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', company: '', status: 'new', phone: '', website: '', estimated_value: '', notes: '', tag_ids: [] });

  const loadData = () => {
    Promise.all([leads.list(), tagsApi.list()])
      .then(([leadsRes, tagsRes]) => {
        setList(leadsRes.data);
        setTags(tagsRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, estimated_value: form.estimated_value ? parseFloat(form.estimated_value) : null };
    if (editingLead) {
      await leads.update(editingLead.id, data);
    } else {
      await leads.create(data);
    }
    setShowForm(false);
    setEditingLead(null);
    setForm({ name: '', email: '', company: '', status: 'new', phone: '', website: '', estimated_value: '', notes: '', tag_ids: [] });
    loadData();
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setForm({
      name: lead.name || '',
      email: lead.email || '',
      company: lead.company || '',
      status: lead.status || 'new',
      phone: lead.phone || '',
      website: lead.website || '',
      estimated_value: lead.estimated_value || '',
      notes: lead.notes || '',
      tag_ids: lead.tags?.map(t => t.id) || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await leads.delete(id);
      loadData();
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <button onClick={() => { setShowForm(true); setEditingLead(null); setForm({ name: '', email: '', company: '', status: 'new', phone: '', website: '', estimated_value: '', notes: '', tag_ids: [] }); }} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Lead</button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">{editingLead ? 'Edit Lead' : 'New Lead'}</h2>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <input type="text" required placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-md" />
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-md" />
              <input type="text" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-md" />
              <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-md" />
              <input type="url" placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-md" />
              <input type="number" placeholder="Estimated Value ($)" value={form.estimated_value} onChange={(e) => setForm({ ...form, estimated_value: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-md" />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-md">
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <label key={tag.id} className="flex items-center gap-1">
                      <input type="checkbox" checked={form.tag_ids.includes(tag.id)} onChange={(e) => {
                        const newTags = e.target.checked ? [...form.tag_ids, tag.id] : form.tag_ids.filter(id => id !== tag.id);
                        setForm({ ...form, tag_ids: newTags });
                      }} />
                      <span className="text-sm" style={{ color: tag.color || '#6B7280' }}>{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md" rows={3} />
              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{editingLead ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingLead(null); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? <div className="text-center py-8">Loading...</div> : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {list.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/leads/${lead.id}`} className="text-indigo-600 hover:underline font-medium">{lead.name}</Link>
                      {lead.email && <p className="text-sm text-gray-500">{lead.email}</p>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.company || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[lead.status] || statusColors.new}`}>
                        {lead.status || 'new'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.estimated_value ? `$${lead.estimated_value.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {lead.tags?.map((tag) => (
                          <span key={tag.id} className="px-2 py-1 text-xs rounded" style={{ backgroundColor: tag.color || '#E5E7EB', color: '#1F2937' }}>{tag.name}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button onClick={() => handleEdit(lead)} className="text-indigo-600 hover:underline mr-3">Edit</button>
                      <button onClick={() => handleDelete(lead.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
