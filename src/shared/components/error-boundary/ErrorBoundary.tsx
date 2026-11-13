import { Component, type ReactNode } from 'react';

type Props = { fallback: ReactNode; children: ReactNode };

// React has no hook for catching render errors, so this is the one class component in the codebase.
class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default ErrorBoundary;
