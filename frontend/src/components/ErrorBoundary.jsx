import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
          <div className="glass p-8 rounded-2xl text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold mb-4 gradient-text">Oops! Something went wrong</h1>
            <p className="text-gray-400 mb-6">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="btn-primary w-full"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
