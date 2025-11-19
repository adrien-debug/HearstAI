import dynamic from 'next/dynamic';
import Layout from '../components/Layout';

// Dynamically import cockpit (client-side only due to Chart.js)
const CockpitView = dynamic(() => import('../components/views/Cockpit'), {
  ssr: false,
  loading: () => (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Loading Cockpit...</p>
    </div>
  )
});

export default function Cockpit() {
  return (
    <Layout>
      <CockpitView />
    </Layout>
  );
}

