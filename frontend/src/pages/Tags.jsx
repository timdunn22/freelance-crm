import { useState, useEffect } from 'react';
import { tags } from '../api/client';
import Layout from '../components/Layout';

const colorOptions = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E', '#14B8A6',
  '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280', '#1F2937'
];

export default function Tags() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [form, setForm] = useState({ name: '', color: '#3B82F6' });

  const loadTags = () => {
    tags.list().then((r) => setList(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { loadTags(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTag) {
      await tags.update(editingTag.id, form);
    } else {
      await tags.create(form);
    }
    setShowForm(false);
    setEditingTag(null);
    setForm({ name: '', color: '#3B82F6' });
    loadTags();
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setForm({ name: tag.name, color: tag.color || '#3B82F6' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this tag?')) {
      await tags.delete(id);
      loadTags();
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
          <button onClick={() => { setShowForm(true); setEditingTag(null); setForm({ name: '', color: '#3B82F6' }); }} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Tag</button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">{editingTag ? 'Edit Tag' : 'New Tag'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" required placeholder="Tag name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm({ ...form, color })}
                      className={`w-8 h-8 rounded-full ${form.color === color ? 'ring-2 ring-offset-2 ring-gray-900' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span>Preview:</span>
                <span className="px-3 py-1 rounded text-white" style={{ backgroundColor: form.color }}>{form.name || 'Tag name'}</span>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{editingTag ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingTag(null); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? <div className="text-center py-8">Loading...</div> : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.length === 0 ? (
              <div className="text-center py-8 text-gray-500 col-span-full">No tags yet. Create one to get started!</div>
            ) : (
              list.map((tag) => (
                <div key={tag.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.color || '#6B7280' }} />
                    <div>
                      <h3 className="font-medium text-gray-900">{tag.name}</h3>
                      <p className="text-sm text-gray-500">{tag.leads_count} lead{tag.leads_count !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(tag)} className="text-indigo-600 hover:underline text-sm">Edit</button>
                    <button onClick={() => handleDelete(tag.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
