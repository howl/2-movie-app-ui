import { Component } from 'react';
import './ErrorBoundary.scss';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      const message = this.state.error?.message || 'Ha ocurrido un error inesperado';
      return <div className="error-boundary"><p>{message}</p></div>;
    }

    return this.props.children;
  }
}
