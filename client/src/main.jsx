import App from './App.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from 'react-dom/client';
import { SessionProvider } from './contexts/session.jsx';


// "mock" | "backend"
console.log("ENV CHECK:", {
  DEV: import.meta.env.DEV,
  MODE: import.meta.env.VITE_API_MODE,
  BACKEND: import.meta.env.VITE_BACKEND_URL,
});

async function enableMocking() {
  const DEV = import.meta.env.DEV;
  const MODE = import.meta.env.VITE_API_MODE;

  // 1) produkce mocky nikdy nespouští
  if (!DEV) {
    console.log("%cProduction build → MSW disabled", "color: gray");
    return;
  }

  // 2) backend mode → vypnout MSW
  if (MODE === "backend") {
    console.log("%cDEV mode → real backend enabled (MSW OFF)", "color: green");
    return;
  }

  // 3) mock mode → zapnout MSW
  if (MODE === "mock") {
    console.log("%cDEV mode → MSW mock enabled", "color: orange");
    const { worker } = await import('./mocks/browser');
    await worker.start();
    return;
  }

  if (!["mock", "backend"].includes(MODE)) {
  console.warn("Unknown VITE_API_MODE:", MODE);

  if (!BACKEND && !(DEV && MODE === "mock")) {
  console.warn("⚠️ BACKEND URL is missing");
}
}
}
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <SessionProvider>
      <App />
    </SessionProvider>
  );
});