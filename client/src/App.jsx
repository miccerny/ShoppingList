import { BrowserRouter, data, Link, Navigate, Route, Routes } from 'react-router-dom';
import ListIndex from './Lists/ListIndex'
import "bootstrap/dist/css/bootstrap.min.css";
import RegistrationPage from './Users/RegistrationPage';
import { useSession } from './contexts/session';
import { apiDelete } from './utils/api';
import LoginPage from './Users/LoginPage';
import ItemIndex from './items/ItemIndex';




export function App() {
const {session, setSession} = useSession();
const handleLogoutClick= () => {
  apiDelete("")
  .finally(() => setSession({data: null, status: "unauthorized"}));
}

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <div className='col-12 col-sm-10'>
        <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-center">

          <ul className="navbar-nav gap-3">
            <li className="nav-item">
              <Link to={"/list"} className="nav-link">
                Seznamy
              </Link>
            </li>
          </ul>
          <ul className='navbar-nav gap-3'>
            {session.data ? 
            <>
            <li className='nav-item'>{session.data.email}</li>
            <li className="nav-item">
              <button className='btn btn-sm btn-secondary' onClick={handleLogoutClick}>Odhlásit se</button>
            </li>
            </> : session.status === "loading" ?
            <>
            <div className='spinner-border spinner-border-sm' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
            </>
            :
            <>
            <li className='nav-item'>
              <Link to={"/register"} className='nav-link'>Registrace</Link>
            </li>
            <li className='nav-item'>
              <Link to={"/login"}>Přihlásit se</Link>
            </li>
            </>
            
            }
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
              <Route path='/login' element={<LoginPage/>}/>
            </Routes>
          </div>
        </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
