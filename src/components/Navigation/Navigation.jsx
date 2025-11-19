import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <h1 className="nav-logo">SpendShift</h1>
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
        </div>
      </div>
    </nav>
  );
}

