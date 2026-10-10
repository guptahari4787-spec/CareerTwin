import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CareerTwin Component Exception caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env?.DEV ?? true;
      const title = this.props.fallbackTitle || 'This section could not be rendered';

      return (
        <div className="p-8 my-8 rounded-xl bg-surface border border-tomato-dark/60 text-cream max-w-3xl mx-auto shadow-card">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-tomato-soft border border-tomato-dark shrink-0">
              <AlertTriangle className="w-6 h-6 text-tomato" />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-tomato-300 bg-tomato-soft px-2 py-0.5 rounded border border-tomato-dark">
                  Render Recovery Guard
                </span>
                <h2 className="text-xl font-bold text-cream-heading mt-1.5">{title}</h2>
                <p className="text-xs text-cream-muted mt-1 leading-relaxed">
                  An unexpected data format or rendering condition occurred in this analytical view. The CareerTwin application shell and other sections remain fully operational.
                </p>
              </div>

              {isDev && this.state.error && (
                <div className="p-3 rounded bg-soil-800 border border-border text-[11px] font-mono text-tomato-300 overflow-x-auto space-y-1">
                  <div className="font-bold text-cream">Technical Error Details (Dev Mode):</div>
                  <div>{this.state.error.name}: {this.state.error.message}</div>
                  {this.state.errorInfo?.componentStack && (
                    <div className="text-[10px] text-cream-muted whitespace-pre-wrap mt-2 max-h-40 overflow-y-auto">
                      {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-basil hover:bg-basil-bright text-soil-900 font-semibold text-xs transition-colors shadow-sm"
                >
                  <RefreshCw size={14} />
                  <span>Retry Rendering</span>
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-subtle hover:bg-surface-elevated text-cream font-medium text-xs border border-border transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Return to Executive Overview</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
