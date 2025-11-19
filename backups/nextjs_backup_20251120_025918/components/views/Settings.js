import { useState } from 'react';
import General from '../sections/settings/General';
import Theme from '../sections/settings/Theme';
import API from '../sections/settings/API';
import Notifications from '../sections/settings/Notifications';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', title: 'General', subtitle: 'General application settings', component: General },
    { id: 'theme', title: 'Theme', subtitle: 'Appearance and theme settings', component: Theme },
    { id: 'api', title: 'API', subtitle: 'API configuration and keys', component: API },
    { id: 'notifications', title: 'Notifications', subtitle: 'Notification preferences', component: Notifications }
  ];

  const activeSectionData = sections.find(s => s.id === activeSection);
  const SectionComponent = activeSectionData?.component || General;

  return (
    <div className="settings-view">
      <div className="settings-content">
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
        <div id="settings-sections-container">
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
