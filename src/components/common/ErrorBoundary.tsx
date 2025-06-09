import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Log l'erreur si besoin
    // console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
          <h2 className="text-2xl font-bold mb-4 text-hive-black">Oups, une erreur est survenue…</h2>
          <p className="text-hive-black/80 mb-4">La page a rencontré un problème. Essayez de recharger ou contactez le support si le problème persiste.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 