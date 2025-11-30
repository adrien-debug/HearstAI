'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the Swagger spec
    fetch('/api/swagger.json')
      .then((res) => res.json())
      .then((data) => {
        setSpec(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading Swagger spec:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading API documentation...</p>
      </div>
    );
  }

  if (!spec) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Error loading API documentation. Please try again later.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <div style={{ padding: '1rem', backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
          HearstAI API Documentation
        </h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
          Interactive API documentation for HearstAI Next.js API
        </p>
      </div>
      <div style={{ padding: '2rem' }}>
        <SwaggerUI spec={spec} />
      </div>
    </div>
  );
}
