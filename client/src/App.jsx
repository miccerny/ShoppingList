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


export function App() {
  const { flash, clear } = useFlash();
  const { session, setSession } = useSession();
  const handleLogoutClick = () => {
    apiDelete("/logout")
      .finally(() => setSession({ data: null, status: "unauthenticated" }));
  };


  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <div className='container'>
          <nav className="navbar navbar-expand navbar-light bg-light w-100">
            <div className="nav-layout w-100">
              <div className="nav-left">
                {/* tady klidně nic */}
              </div>
              <ul className="navbar-nav nav-center">
                <li className="nav-item">
                  <Link to={"/list"} className="nav-link fw-semibold">
                    Seznamy
                  </Link>
                </li>
              </ul>

              <ul className='navbar-nav nav-right gap-3 align-items-center'>
                {session.status === "loading" ? (
                  <li className='nav-item'>
                    <div className='spinner-border spinner-border-sm' role='status'>
                      <span className='visually-hidden'>Loading...</span>
                    </div>
                  </li>
                ) : session.data ? (
                  <>
                    <li className='nav-item'>{session.data.email}</li>
                    <li className='nav-item'>
                      <button className='btn btn-sm btn-secondary' onClick={handleLogoutClick}>
                        Odhlásit se
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className='nav-item'>
                      <Link to={"/register"} className='nav-link'>Registrace</Link>
                    </li>
                    <li className='nav-item'>
                      <Link to={"/login"} className='nav-link'>Přihlásit se</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </nav>
          <>
            {flash && (
              <div className="container mt-3 text-center">
                <FlashMessage theme={flash.type} text={flash.message} />
              </div>
            )}
          </>
          <main className="flex-grow-1">
            <div className="container text-center mt-4">
              <Routes>
                <Route index element={<Navigate to={"/list"} />} />
                <Route path="/list">
                  <Route index element={<ListIndex />} />
                  <Route path='show/:id' element={<ItemIndex />} />
                </Route>
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
