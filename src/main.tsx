import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Error forwarding to parent window (Syntic App Builder)
if (typeof window !== 'undefined') {
  // Forward runtime errors
  window.onerror = (message, source, line, column, error) => {
    window.parent.postMessage({
      type: 'SYNTIC_ERROR',
      payload: {
        type: 'runtime',
        message: String(message),
        stack: error?.stack,
        source,
        line,
        column,
        timestamp: Date.now(),
      }
    }, '*');
    return false; // Let default handler also run
  };

  // Forward unhandled promise rejections
  window.onunhandledrejection = (event) => {
    window.parent.postMessage({
      type: 'SYNTIC_ERROR',
      payload: {
        type: 'unhandled',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        timestamp: Date.now(),
      }
    }, '*');
  };

  // Forward Vite HMR errors (build/compilation errors)
  if (import.meta.hot) {
    import.meta.hot.on('vite:error', (payload) => {
      window.parent.postMessage({
        type: 'SYNTIC_ERROR',
        payload: {
          type: 'build',
          message: payload.err?.message || 'Build error',
          stack: payload.err?.stack,
          source: payload.err?.loc?.file || payload.err?.id,
          line: payload.err?.loc?.line,
          column: payload.err?.loc?.column,
          timestamp: Date.now(),
        }
      }, '*');
    });

    // Notify parent when app is ready (error cleared)
    import.meta.hot.on('vite:afterUpdate', () => {
      window.parent.postMessage({ type: 'SYNTIC_READY' }, '*');
    });
  }

  // Notify parent when app loads successfully
  window.addEventListener('load', () => {
    window.parent.postMessage({ type: 'SYNTIC_READY' }, '*');
  });
}

createRoot(document.getElementById("root")!).render(<App />);
