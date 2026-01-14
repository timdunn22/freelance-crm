import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leads } from '../api/client';
import Layout from '../components/Layout';

const statusConfig = {
  new: { label: 'New', color: 'bg-gray-200' },
  contacted: { label: 'Contacted', color: 'bg-blue-200' },
  qualified: { label: 'Qualified', color: 'bg-yellow-200' },
  proposal: { label: 'Proposal', color: 'bg-purple-200' },
  negotiation: { label: 'Negotiation', color: 'bg-orange-200' },
  won: { label: 'Won', color: 'bg-green-200' },
  lost: { label: 'Lost', color: 'bg-red-200' }
};

export default function Kanban() {
  const [columns, setColumns] = useState({});
  const [loading, setLoading] = useState(true);
  const [draggedLead, setDraggedLead] = useState(null);

  useEffect(() => {
    leads.kanban().then((r) => setColumns(r.data)).finally(() => setLoading(false));
  }, []);

  const handleDragStart = (lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (status) => {
    if (draggedLead && draggedLead.status !== status) {
      await leads.updateStatus(draggedLead.id, status);
      leads.kanban().then((r) => setColumns(r.data));
    }
    setDraggedLead(null);
  };

  if (loading) return <Layout><div className="text-center py-8">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div
              key={status}
              className={`flex-shrink-0 w-72 ${config.color} rounded-lg p-4`}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status)}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-800">{config.label}</h2>
                <span className="text-sm text-gray-600">{columns[status]?.length || 0}</span>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {columns[status]?.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead)}
                    className="bg-white p-4 rounded-lg shadow cursor-move hover:shadow-md transition-shadow"
                  >
                    <Link to={`/leads/${lead.id}`} className="font-medium text-gray-900 hover:text-indigo-600">{lead.name}</Link>
                    {lead.company && <p className="text-sm text-gray-500">{lead.company}</p>}
                    {lead.estimated_value && (
                      <p className="text-sm font-medium text-green-600 mt-2">${lead.estimated_value.toLocaleString()}</p>
                    )}
                    {lead.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {lead.tags.map((tag) => (
                          <span key={tag.id} className="px-2 py-0.5 text-xs rounded" style={{ backgroundColor: tag.color || '#E5E7EB' }}>{tag.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
