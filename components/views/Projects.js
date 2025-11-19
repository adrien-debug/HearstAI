import { useState } from 'react';
import Overview from '../sections/projects/Overview';
import Calculator from '../sections/projects/Calculator';
import Results from '../sections/projects/Results';
import Charts from '../sections/projects/Charts';
import MonteCarlo from '../sections/projects/MonteCarlo';
import ProjectsList from '../sections/projects/ProjectsList';
import Hardware from '../sections/projects/Hardware';
import Energy from '../sections/projects/Energy';
import Infrastructure from '../sections/projects/Infrastructure';

export default function Projects() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', subtitle: 'Latest projections and history', component: Overview },
    { id: 'calculator', title: 'Projections', subtitle: 'Mining profitability calculator', component: Calculator },
    { id: 'results', title: 'Results', subtitle: 'Analysis results and financial metrics', component: Results },
    { id: 'charts', title: 'Charts', subtitle: 'Financial visualizations and projections', component: Charts },
    { id: 'monte-carlo', title: 'Monte Carlo', subtitle: 'Probabilistic risk analysis', component: MonteCarlo },
    { id: 'projects', title: 'Projects', subtitle: 'Manage and compare mining scenarios', component: ProjectsList },
    { id: 'hardware', title: 'Hardware', subtitle: 'ASIC fleet configuration and optimization', component: Hardware },
    { id: 'energy', title: 'Energy', subtitle: 'Renewable energy integration and optimization', component: Energy },
    { id: 'infrastructure', title: 'Infrastructure', subtitle: 'Facility design and cooling systems', component: Infrastructure }
  ];

  const activeSectionData = sections.find(s => s.id === activeSection);
  const SectionComponent = activeSectionData?.component || Overview;

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        {/* Navigation Tabs - Same style as Admin Panel */}
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

        {/* Section Content - Same structure as Dashboard */}
        <div className="wallet-section">
          <div className="section-header-home">
            <div>
              <h2 className="page-title-home">{activeSectionData?.title}</h2>
              <p className="page-subtitle">{activeSectionData?.subtitle}</p>
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-6)' }}>
            <SectionComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
