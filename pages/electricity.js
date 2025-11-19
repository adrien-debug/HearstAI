import dynamic from 'next/dynamic';
import Layout from '../components/Layout';

// Dynamically import electricity view (client-side only due to Chart.js)
const ElectricityView = dynamic(() => import('../components/views/Electricity'), {
  ssr: false,
  loading: () => (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Loading Electricity Dashboard...</p>
    </div>
  )
});

export default function Electricity() {
  return (
    <Layout>
      <ElectricityView />
    </Layout>
  );
}

