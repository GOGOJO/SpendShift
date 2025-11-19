import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navigation.css';

export default function Navigation() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo-link">
          <h1 className="nav-logo">SpendShift</h1>
        </Link>
        {isAuthenticated ? (
          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link
              to="/goals"
              className={`nav-link ${location.pathname === '/goals' ? 'active' : ''}`}
            >
              Goals
            </Link>
            <div className="nav-user">
              <span className="nav-user-email">{user?.email}</span>
              <button className="nav-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

