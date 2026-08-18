'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center border border-red-100 rounded-2xl bg-red-50/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-3">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Something went wrong
          </h3>
          <p className="text-sm text-gray-600 max-w-md mb-4">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <Button
            variant="outline"
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
