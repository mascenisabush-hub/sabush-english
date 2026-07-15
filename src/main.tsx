import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Silence benign development environment WebSocket / Vite HMR connection warnings
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (reason) {
      const msg = typeof reason === 'string' ? reason : (reason.message || '');
      if (msg.includes('WebSocket') || msg.includes('websocket')) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }
  });

  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const firstArg = args[0];
    if (typeof firstArg === 'string') {
      if (
        firstArg.includes('[vite] failed to connect to websocket') || 
        firstArg.includes('WebSocket closed without opened') ||
        firstArg.includes('Disconnecting idle stream') ||
        firstArg.includes('Timed out waiting for new targets') ||
        firstArg.includes('GrpcConnection RPC \'Listen\'') ||
        firstArg.includes('@firebase/firestore')
      ) {
        return;
      }
    }
    // Check other arguments too in case the error is passed differently
    for (const arg of args) {
      if (arg && typeof arg === 'string') {
        if (
          arg.includes('Disconnecting idle stream') ||
          arg.includes('Timed out waiting for new targets') ||
          arg.includes('GrpcConnection RPC \'Listen\'')
        ) {
          return;
        }
      } else if (arg && arg.message && typeof arg.message === 'string') {
        if (
          arg.message.includes('Disconnecting idle stream') ||
          arg.message.includes('Timed out waiting for new targets') ||
          arg.message.includes('GrpcConnection RPC \'Listen\'')
        ) {
          return;
        }
      }
    }
    originalConsoleError.apply(console, args);
  };

  const originalConsoleWarn = console.warn;
  console.warn = (...args: any[]) => {
    const firstArg = args[0];
    if (typeof firstArg === 'string') {
      if (
        firstArg.includes('Disconnecting idle stream') ||
        firstArg.includes('Timed out waiting for new targets') ||
        firstArg.includes('GrpcConnection RPC \'Listen\'') ||
        firstArg.includes('@firebase/firestore')
      ) {
        return;
      }
    }
    for (const arg of args) {
      if (arg && typeof arg === 'string') {
        if (
          arg.includes('Disconnecting idle stream') ||
          arg.includes('Timed out waiting for new targets') ||
          arg.includes('GrpcConnection RPC \'Listen\'')
        ) {
          return;
        }
      }
    }
    originalConsoleWarn.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

