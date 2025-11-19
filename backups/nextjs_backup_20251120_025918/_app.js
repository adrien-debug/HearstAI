import { useEffect } from 'react';
import Script from 'next/script';
import { NotificationProvider } from '../components/common/Notification';
import '../frontend/css/design-tokens.css';
import '../frontend/css/main.css';
import '../frontend/css/components.css';
import '../frontend/css/cockpit.css';
import '../frontend/css/projections.css';
import '../frontend/css/override-cockpit.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize theme
    if (typeof window !== 'undefined' && !localStorage.getItem('hearstai-theme')) {
      localStorage.setItem('hearstai-theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Error handler for unhandled errors
    const handleError = (event) => {
      if (!event.error && !event.message) {
        return;
      }
      
      const errorMessage = event.error?.message || event.message || 'Unknown error';
      
      if (errorMessage !== 'null' && errorMessage !== 'undefined') {
        console.error('❌ Global error:', event.error || errorMessage);
      }
    };
    
    // Handle unhandled promise rejections
    const handleRejection = (event) => {
      console.error('❌ Unhandled promise rejection:', event.reason);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleRejection);
      
      return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleRejection);
      };
    }
  }, []);
  
  return (
    <>
      {/* Load external scripts */}
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
        strategy="beforeInteractive"
        crossOrigin="anonymous"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
        strategy="beforeInteractive"
        crossOrigin="anonymous"
      />
      
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </>
  );
}

export default MyApp;
