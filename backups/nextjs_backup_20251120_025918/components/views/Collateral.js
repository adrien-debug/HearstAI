import { useState } from 'react';
import CollateralDashboard from '../sections/collateral/Dashboard';
import CollateralSection from '../sections/collateral/Collateral';
import Customers from '../sections/collateral/Customers';
import APIManagement from '../sections/collateral/APIManagement';

export default function Collateral() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const sections = [
    { id: 'dashboard', title: 'Customer Collateral Management', subtitle: 'Overview & KPIs', component: CollateralDashboard },
    { id: 'collateral', title: 'Collateral Management', subtitle: 'Manage client positions and collateral', component: CollateralSection },
    { id: 'customers', title: 'Customer Management', subtitle: 'All customers', component: Customers },
    { id: 'api-management', title: 'API Management', subtitle: 'DeFi Protocol APIs', component: APIManagement }
  ];

  const activeSectionData = sections.find(s => s.id === activeSection);
  const SectionComponent = activeSectionData?.component || CollateralDashboard;

  return (
    <div className="collateral-view">
      <div className="collateral-content">
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
        <div id="collateral-sections-container">
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

