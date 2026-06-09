import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="card card-body text-center py-12 animate-fade-in">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="font-display text-xl mb-2">Something went wrong</h3>
          <p className="text-secondary text-sm mb-6">
            An unexpected error occurred. Please try again.
          </p>
          <button
            className="btn btn-primary mx-auto"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}