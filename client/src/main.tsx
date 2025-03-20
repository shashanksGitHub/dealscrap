import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Error tracking for React rendering
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { 
    hasError: false, 
    error: null 
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Es tut uns leid, etwas ist schief gelaufen.</h1>
          <p>Die Anwendung wird in Kürze neu geladen.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              fontSize: '16px',
              marginTop: '16px',
              cursor: 'pointer',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Jetzt neu laden
          </button>
          {this.state.error && (
            <pre style={{ 
              marginTop: '20px', 
              padding: '16px', 
              backgroundColor: '#f7f7f7',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '14px'
            }}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

console.log('Starting application initialization...'); // Debug log

const container = document.getElementById("root");
if (!container) {
  throw new Error("Failed to find root element");
}

const root = createRoot(container);

console.log('Root created, rendering application...'); // Debug log

root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

console.log('Application rendered'); // Debug log

// Global error handler for non-React errors
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

// Log environment information
console.log('Environment:', {
  nodeEnv: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  baseUrl: import.meta.env.BASE_URL,
});