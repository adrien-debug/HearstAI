import dynamic from 'next/dynamic';
import Layout from '../components/Layout';

// Dynamically import projects (client-side only)
const ProjectsView = dynamic(() => import('../components/views/Projects'), {
  ssr: false,
  loading: () => (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Loading Projects...</p>
    </div>
  )
});

export default function Projects() {
  return (
    <Layout>
      <ProjectsView />
    </Layout>
  );
}

