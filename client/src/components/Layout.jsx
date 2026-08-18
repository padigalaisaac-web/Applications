import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/books', label: 'Books' },
  { to: '/members', label: 'Members' },
  { to: '/issue', label: 'Issue Book' },
  { to: '/transactions', label: 'Transactions' }
];

export default function Layout({ children }) {
  return (
    <div className="app">
      <header className="header">
        <h1 className="brand">Library Management System</h1>
        <nav className="nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="content">{children}</main>
    </div>
  );
}
