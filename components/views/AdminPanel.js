import { useState } from 'react';
import AdminDashboard from '../sections/admin-panel/Dashboard';
import Structure from '../sections/admin-panel/Structure';
import Health from '../sections/admin-panel/Health';
import Teams from '../sections/admin-panel/Teams';
import Actions from '../sections/admin-panel/Actions';
import Finances from '../sections/admin-panel/Finances';
import Documents from '../sections/admin-panel/Documents';
import Reports from '../sections/admin-panel/Reports';
import Compliance from '../sections/admin-panel/Compliance';

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const sections = [
    { id: 'dashboard', title: 'Executive Dashboard', subtitle: 'Overview & KPIs', component: AdminDashboard },
    { id: 'structure', title: 'Structure Organisationnelle', subtitle: 'Organigramme & Départements', component: Structure },
    { id: 'health', title: 'Health Control', subtitle: 'État des Systèmes', component: Health },
    { id: 'teams', title: 'Gestion des Équipes', subtitle: 'Équipes & Performance', component: Teams },
    { id: 'actions', title: 'Actions Prioritaires', subtitle: 'Kanban & Actions', component: Actions },
    { id: 'finances', title: 'Vue Financière', subtitle: 'Revenus & Dépenses', component: Finances },
    { id: 'documents', title: 'Documents', subtitle: 'Gestion documentaire', component: Documents },
    { id: 'reports', title: 'Reports', subtitle: 'Rapports automatisés', component: Reports },
    { id: 'compliance', title: 'Compliance Scan', subtitle: 'Audit de conformité', component: Compliance }
  ];

  const activeSectionData = sections.find(s => s.id === activeSection);
  const SectionComponent = activeSectionData?.component || AdminDashboard;

  return (
    <div className="admin-panel-view">
      <div className="admin-panel-content">
        {/* Navigation Tabs */}
        <div className="admin-panel-nav" style={{ 
          display: 'flex', 
          gap: 'var(--space-2)', 
          marginBottom: 'var(--space-6)',
          overflowX: 'auto',
          paddingBottom: 'var(--space-2)',
          position: 'relative',
          zIndex: 10
        }}>
          {sections.map(section => (
            <button
              key={section.id}
              className={`admin-panel-nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                background: activeSection === section.id ? 'rgba(197, 255, 167, 0.1)' : 'transparent',
                border: `1px solid ${activeSection === section.id ? '#C5FFA7' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: 'var(--radius-md)',
                color: activeSection === section.id ? '#C5FFA7' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--duration-fast)',
                whiteSpace: 'nowrap'
              }}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Section Content */}
        <div id="admin-panel-sections-container">
          <div className="section-header-home">
            <div>
              <h2 className="page-title-home">{activeSectionData?.title}</h2>
              <p className="page-subtitle">{activeSectionData?.subtitle}</p>
            </div>
          </div>
          <SectionComponent />
        </div>
      </div>
    </div>
  );
}

