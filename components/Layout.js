import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';

export default function Layout({ children }) {
  const router = useRouter();
  const [currentView, setCurrentView] = useState('dashboard');
  
  useEffect(() => {
    // Sync router path with current view
    const path = router.pathname;
    if (path === '/') {
      setCurrentView('dashboard');
    } else {
      setCurrentView(path.replace('/', ''));
    }
  }, [router.pathname]);
  
  return (
    <div className="cockpit-layout">
      <Sidebar currentView={currentView} />
      <div className="main-content">
        <Header currentView={currentView} />
        <main className="content-area-wrapper">
          {children}
        </main>
      </div>
      <div id="modal-container"></div>
    </div>
  );
}

