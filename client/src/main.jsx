import App from './App.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from 'react-dom/client';
import { SessionProvider } from './contexts/session.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
   <SessionProvider>
    <App />
    </SessionProvider>

);