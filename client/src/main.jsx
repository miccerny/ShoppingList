import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from 'react-dom/client';

async function prepareMocks() {
  if (import.meta.env.VITE_API_URL) {
    try {
      const res = await fetch('http://localhost:8080');
      if (res.ok) {
        console.log('✅ Backend is running.');
        return;
      }
    } catch {
      console.log('⚠️ Backend not running, using MSW mocks...');
      const { worker } = await import('./mocks/browser');
      await worker.start();
    }
  }
}

prepareMocks().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
});