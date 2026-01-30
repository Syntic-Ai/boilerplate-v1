// Error reporter - sends errors to Syntic parent window
interface SynticError {
  type: 'runtime' | 'render' | 'build' | 'unhandled';
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: number;
}

const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

export function reportError(error: SynticError) {
  console.error('[Syntic]', error.type, error.message);

  // Send to parent (Syntic frontend)
  if (isInIframe && window.parent) {
    window.parent.postMessage({ type: 'SYNTIC_ERROR', payload: error }, '*');
  }
}

// Global error handlers
if (typeof window !== 'undefined') {
  window.onerror = (message, source, line, col, error) => {
    reportError({
      type: 'runtime',
      message: String(message),
      stack: error?.stack,
      timestamp: Date.now(),
    });
    return false;
  };

  window.onunhandledrejection = (event) => {
    reportError({
      type: 'unhandled',
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack,
      timestamp: Date.now(),
    });
  };
}

export const errorReporter = {
  reportRenderError(error: Error, componentStack: string) {
    reportError({
      type: 'render',
      message: error.message,
      stack: error.stack,
      componentStack,
      timestamp: Date.now(),
    });
  },
};

export type { SynticError };
