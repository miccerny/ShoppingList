/**
 * Root application component.
 *
 * Responsibilities:
 * - Defines application routing using React Router.
 * - Renders global layout (navbar, main content).
 * - Integrates session handling (authentication state).
 * - Displays global flash messages.
 *
 * Note:
 * This component acts as the main composition layer of the frontend.
 * Individual pages are rendered based on the current URL.
 */
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import ListIndex from './Lists/ListIndex'
import "bootstrap/dist/css/bootstrap.min.css";
import RegistrationPage from './Users/RegistrationPage';
import { useSession } from './contexts/session';
import { apiDelete } from './utils/api';
import LoginPage from './Users/LoginPage';
import ItemIndex from './items/ItemIndex';
import './styles/styles.css'
import './styles/inputCheck.css'
import './styles/inputField.css'
import './styles/LoginPage.css'
import './styles/navbar.css'
import { useFlash } from './contexts/flash';
import FlashMessage from './components/FlashMessage';

function IndexRedirect() {
  // Okamžitě pošli uživatele na /list.
  return <Navigate to="/list" replace />;
}

/**
 * Main application component.
 *
 * @returns {JSX.Element} Rendered application layout with routing.
 *
 * Note:
 * This component is rendered once and stays mounted.
 * Only the content inside <Routes> changes when navigating.
 */
export function App() {
  /**
   * Global flash message state.
   *
   * - flash: currently displayed message (if any)
   * - clear: function to remove the message
   */
  const { flash} = useFlash();

  /**
   * Authentication session state.
   *
   * - session.data → logged-in user info
   * - session.status → "loading" | "authenticated" | "unauthenticated"
   */
  const { session, setSession } = useSession();

   /**
   * Handles user logout action.
   *
   * Behavior:
   * - Sends logout request to backend
   * - Resets session state on frontend regardless of API result
   *
   * Note:
   * .finally() ensures local logout even if the backend request fails.
   */
  const handleLogoutClick = () => {
    apiDelete("/logout")
      .finally(() => setSession({ data: null, status: "unauthenticated" }));
  };


  return (

     /**
     * BrowserRouter enables client-side routing.
     *
     * Note:
     * Navigation happens without full page reloads.
     */
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <div className='container'>

          {/* Application navigation bar */}
          <nav className="navbar navbar-expand navbar-light bg-light w-100">

            {/* Left navigation area (currently unused) */}
            <div className="nav-layout w-100">
              <div className="nav-left">
                {/* intentionally left empty */}
              </div>
              {/* Center navigation links */}
              <ul className="navbar-nav nav-center">
                <li className="nav-item">
                  <Link to={"/list"} className="nav-link fw-semibold">
                    Seznamy
                  </Link>
                </li>
              </ul>
              {/* Right navigation area – authentication dependent */}
              <ul className='navbar-nav nav-right gap-3 align-items-center'>
                {/* Session loading indicator */}
                {session.status === "loading" ? (
                  <li className='nav-item'>
                    <div 
                      className='spinner-border spinner-border-sm' 
                      role='status'
                      >
                      <span className='visually-hidden'>Loading...</span>
                    </div>
                    <span>Připojuji se k serveru (první načtení může trvat déle)…</span>
                  </li>
                ) : session.data ? (
                   /**
                   * Authenticated user view:
                   * - Displays user email
                   * - Shows logout button
                   */
                  <>
                    <li className='nav-item'>{session.data.email}</li>
                    <li className='nav-item'>
                      <button 
                        className='btn btn-sm btn-secondary' 
                        onClick={handleLogoutClick}
                        >
                        Odhlásit se
                      </button>
                    </li>
                  </>
                ) : (
                  /**
                   * Unauthenticated user view:
                   * - Registration link
                   * - Login link
                   */
                  <>
                    <li className='nav-item'>
                      <Link 
                        to={"/register"} 
                        className='nav-link'
                        >Registrace</Link>
                    </li>
                    <li className='nav-item'>
                      <Link 
                        to={"/login"} 
                        className='nav-link'
                        >Přihlásit se</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </nav>
           {/* Global flash message display */}
          <>
            {flash && (
              <div className="container mt-3 text-center">
                <FlashMessage theme={flash.type} text={flash.message} />
              </div>
            )}
          </>
          {/* Main content area */}
          <main className="flex-grow-1">
            <div className="container text-center mt-4">
              {/* Application routes */}
              <Routes>
                 {/* Default route → redirect to list overview */}
                <Route index element={<IndexRedirect />} />
                {/* List-related routes */}
                <Route path="/list">
                  <Route index element={<ListIndex />} />
                  <Route path='show/:id' element={<ItemIndex />} />
                </Route>
                {/* Authentication routes */}
                <Route path='/register' element={<RegistrationPage />} />
                <Route path='/login' element={<LoginPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>

  );
};

export default App;
