// Error reporter - sends errors to Syntic parent window
// Note: Runtime and unhandled errors are handled in main.tsx
// This module provides the errorReporter for React ErrorBoundary

interface SynticError {
  type: 'runtime' | 'render' | 'build' | 'unhandled';
  message: string;
  stack?: string;
  componentStack?: string;
  source?: string;
  line?: number;
  column?: number;
  timestamp: number;
}

export function reportError(error: SynticError) {
  console.error('[Syntic]', error.type, error.message);

  // Send to parent (Syntic frontend)
  if (typeof window !== 'undefined' && window.parent) {
    window.parent.postMessage({ type: 'SYNTIC_ERROR', payload: error }, '*');
  }
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
