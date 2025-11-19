import { useState } from 'react';
import { Icons } from '../../lib/icons';

export default function Prompts() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const prompts = [
    { id: 'P001', name: 'Code Review Template', category: 'code-review', description: 'Comprehensive code review with security checks', usage: 45, variables: 3 },
    { id: 'P002', name: 'Refactor Assistant', category: 'refactor', description: 'Help refactor code for better performance', usage: 32, variables: 2 },
    { id: 'P003', name: 'Debug Helper', category: 'debug', description: 'Debug and fix common issues', usage: 28, variables: 4 },
    { id: 'P004', name: 'Test Generator', category: 'test', description: 'Generate unit tests for your code', usage: 19, variables: 2 },
    { id: 'P005', name: 'Documentation Writer', category: 'documentation', description: 'Create comprehensive documentation', usage: 15, variables: 1 },
    { id: 'P006', name: 'Security Audit', category: 'security', description: 'Security vulnerability scanning', usage: 12, variables: 3 }
  ];

  const categories = ['all', 'code-review', 'refactor', 'debug', 'test', 'documentation', 'security'];

  const filteredPrompts = prompts.filter(prompt => {
    const matchesCategory = categoryFilter === 'all' || prompt.category === categoryFilter;
    const matchesSearch = !searchTerm || 
      prompt.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = {
    total: prompts.length,
    totalUsage: prompts.reduce((sum, p) => sum + p.usage, 0),
    categories: new Set(prompts.map(p => p.category)).size
  };

  return (
    <div className="prompts-view">
      <div className="prompts-content">
        <div className="section-header-home">
          <div>
            <h2 className="page-title-home">Prompts</h2>
            <p className="page-subtitle">Manage and reuse prompt templates</p>
          </div>
          <button className="btn btn-primary">+ Create Prompt</button>
        </div>

        <div className="stats-grid" style={{ marginTop: 'var(--space-6)' }}>
          <div className="stat-card">
            <div className="stat-label">Total Prompts</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-change">Templates available</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Usage</div>
            <div className="stat-value green">{stats.totalUsage}</div>
            <div className="stat-change">Times used</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Categories</div>
            <div className="stat-value">{stats.categories}</div>
            <div className="stat-change">Different types</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Avg Usage</div>
            <div className="stat-value green">{Math.round(stats.totalUsage / stats.total)}</div>
            <div className="stat-change">Per template</div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 'var(--space-6)' }}>
          <div className="section-header">
            <h3 className="card-title">Prompt Templates</h3>
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: 'var(--primary-grey)',
                  border: '1px solid var(--grey-100)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  minWidth: '200px'
                }}
              />
              <select
                className="filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: 'var(--primary-grey)',
                  border: '1px solid var(--grey-100)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)'
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
            {filteredPrompts.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                <p>No prompts found</p>
              </div>
            ) : (
              filteredPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#C5FFA7';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--grey-100)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                      <div>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
                          {prompt.name}
                        </h3>
                        <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                          {prompt.category.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)', lineHeight: 1.6 }}>
                      {prompt.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--grey-100)' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        Used {prompt.usage} times · {prompt.variables} variables
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button className="btn btn-sm btn-ghost">View</button>
                        <button className="btn btn-sm btn-ghost">Use</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
