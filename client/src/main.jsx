import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from './contexts/session.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SessionProvider>
    <App />
    </SessionProvider>
  </StrictMode>,
)
