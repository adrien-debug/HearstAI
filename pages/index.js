import dynamic from 'next/dynamic';
import Layout from '../components/Layout';

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
  return (
    <Layout>
      <DashboardView />
    </Layout>
  );
}

