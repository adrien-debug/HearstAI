import { useState } from 'react';
import Dashboard from '../sections/cockpit/Dashboard';
import Production from '../sections/cockpit/Production';
import Energy from '../sections/cockpit/Energy';
import Incidents from '../sections/cockpit/Incidents';
import Clients from '../sections/cockpit/Clients';
import MiningAccounts from '../sections/cockpit/MiningAccounts';
import Workers from '../sections/cockpit/Workers';
import Miners from '../sections/cockpit/Miners';
import Reports from '../sections/cockpit/Reports';
import Hosters from '../sections/cockpit/Hosters';

export default function Cockpit() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const sections = [
    { id: 'dashboard', title: 'Dashboard', subtitle: 'Real-time mining operations overview', component: Dashboard },
    { id: 'production', title: 'Production', subtitle: 'Mining production metrics', component: Production },
    { id: 'energy', title: 'Energy', subtitle: 'Energy consumption and efficiency', component: Energy },
    { id: 'incidents', title: 'Incidents', subtitle: 'System incidents and alerts', component: Incidents },
    { id: 'clients', title: 'Clients', subtitle: 'Client management', component: Clients },
    { id: 'mining-accounts', title: 'Mining Accounts', subtitle: 'Mining account management', component: MiningAccounts },
    { id: 'workers', title: 'Workers', subtitle: 'Worker management', component: Workers },
    { id: 'miners', title: 'Miners', subtitle: 'Miner hardware management', component: Miners },
    { id: 'reports', title: 'Reports', subtitle: 'System reports', component: Reports },
    { id: 'hosters', title: 'Hosters', subtitle: 'Hosting provider management', component: Hosters }
  ];

  const activeSectionData = sections.find(s => s.id === activeSection);
  const SectionComponent = activeSectionData?.component || Dashboard;

  return (
    <div className="cockpit-view">
      <div className="cockpit-content">
        {/* Navigation Tabs */}
        <div className="admin-panel-nav" style={{ 
          display: 'flex', 
          gap: 'var(--space-2)', 
          marginBottom: 'var(--space-6)',
          overflowX: 'auto',
          paddingBottom: 'var(--space-2)'
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
        <div id="cockpit-sections-container">
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
