import { Component, ErrorInfo, ReactNode } from 'react';
import { errorReporter } from '@/lib/error-reporter';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    errorReporter.reportRenderError(error, errorInfo.componentStack || '');
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[200px] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-destructive/5 border border-destructive/20 rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-destructive mb-1">
                  Something went wrong
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  An error occurred while rendering this component.
                </p>
                {this.state.error && (
                  <pre className="bg-muted/50 border rounded p-3 text-xs overflow-auto max-h-32 mb-4">
                    {this.state.error.message}
                  </pre>
                )}
                <Button onClick={this.handleRetry} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try again
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
