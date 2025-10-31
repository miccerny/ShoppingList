import { BrowserRouter, data, Link, Navigate, Route, Routes } from 'react-router-dom';
import ListIndex from './Lists/ListIndex'
import "bootstrap/dist/css/bootstrap.min.css";
import RegistrationPage from './Users/RegistrationPage';
import { useSession } from './contexts/session';
import { apiDelete } from './utils/api';
import LoginPage from './Users/LoginPage';
import ItemIndex from './items/ItemIndex';




export function App() {
  const { session, setSession } = useSession();
  const handleLogoutClick = () => {
    apiDelete("/logout")
      .finally(() => setSession({ data: null, status: "unauthenticated" }));
  };

  if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
  session.status = "authenticated";
  session.data = { email: "michal@example.com" };
}

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <div className='col-12 col-sm-10'>
          <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-center items-between">
            <ul className="navbar-nav gap-3">
              <li className="nav-item">
                <Link to={"/list"} className="nav-link">
                  Seznamy
                </Link>
              </li>
            </ul>
            <ul className='navbar-nav gap-3'>
              {session.status === "loading" ? (
                <div className='spinner-border spinner-border-sm' role='status'>
                  <span className='visually-hidden'>Loading...</span>
                </div>
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
          </nav>

          <main className="flex-grow-1 d-flex justify-content-center align-items-start">
            <div className="container-fluid text-center mt-4">
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
