import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { useEffect } from 'react';

// Dynamically import dashboard (client-side only due to Chart.js)
const DashboardView = dynamic(() => import('../components/views/Dashboard'), {
  ssr: false,
  loading: () => (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Loading Dashboard...</p>
    </div>
  )
});

export default function Home() {
  useEffect(() => {
    // Set page title
    document.title = 'Dashboard - HearstAI';
    
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="home-page">
        <div className="home-page-header">
          <div className="home-page-title-section">
            <h1 className="page-title-home">Dashboard</h1>
            <p className="page-subtitle">Vue d'ensemble de votre activité et de vos transactions</p>
          </div>
        </div>
        <DashboardView />
      </div>
    </Layout>
  );
}

