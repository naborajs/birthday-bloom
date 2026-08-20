import React, { Component } from 'react';
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

class GlobalErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) { console.error("Global Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#222', color: '#ff6b6b', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2>Something went wrong.</h2>
          {import.meta.env.DEV ? (
            <>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error?.toString()}</pre>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error?.stack}</pre>
            </>
          ) : (
            <p style={{ color: '#ccc' }}>An unexpected error occurred. Please refresh the page.</p>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>
);
