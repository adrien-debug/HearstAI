import { useState } from 'react';
import dynamic from 'next/dynamic';
import Home from '../sections/electricity/Home';
import Mining from '../sections/electricity/Mining';
import Contracts from '../sections/electricity/Contracts';
import Analytics from '../sections/electricity/Analytics';

// Dynamically import ElectricitySection (client-side only due to Chart.js)
const ElectricitySection = dynamic(() => import('../sections/electricity/Electricity'), {
  ssr: false
});

export default function Electricity() {
  const [activeSection, setActiveSection] = useState('home');

  const sections = [
    { id: 'home', title: 'Home', subtitle: 'Dashboard overview', component: Home },
    { id: 'mining', title: 'Mining', subtitle: 'Mining operations', component: Mining },
    { id: 'electricity', title: 'Electricity', subtitle: 'Provider summary', component: ElectricitySection },
    { id: 'contracts', title: 'Contracts', subtitle: 'Contracts management', component: Contracts },
    { id: 'analytics', title: 'Analytics', subtitle: 'Analytics dashboard', component: Analytics }
  ];

  const activeSectionData = sections.find(s => s.id === activeSection);
  const SectionComponent = activeSectionData?.component || Home;

  return (
    <div className="electricity-view">
      <div className="electricity-content">
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
        <div id="electricity-sections-container">
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

