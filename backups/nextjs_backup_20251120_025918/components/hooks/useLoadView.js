import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export function useLoadView(viewName) {
  const router = useRouter();
  const contentAreaRef = useRef(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && contentAreaRef.current) {
      const loadView = () => {
        // Ensure contentArea is set in app.js
        if (window.app && window.app.contentArea !== contentAreaRef.current) {
          window.app.contentArea = contentAreaRef.current;
        }
        
        if (window.app && typeof window.app.loadView === 'function') {
          // Double check contentArea exists
          if (window.app.contentArea || document.getElementById('content-area')) {
            window.app.loadView(viewName);
          }
        }
      };
      
      // Try immediately
      if (window.app && typeof window.app.loadView === 'function') {
        loadView();
      } else {
        // Wait for app to initialize
        const checkApp = setInterval(() => {
          if (window.app && typeof window.app.loadView === 'function') {
            loadView();
            clearInterval(checkApp);
          }
        }, 100);
        
        return () => clearInterval(checkApp);
      }
    }
  }, [router.pathname, viewName]);
  
  return contentAreaRef;
}

