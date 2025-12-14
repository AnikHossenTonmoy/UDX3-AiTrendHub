
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const MobileNav = () => {
  const location = useLocation();
  
  // Only show Mobile Nav on Admin pages
  if (!location.pathname.startsWith('/admin')) return null;

  const navItems = [
    { icon: 'dashboard', label: 'Dash', path: '/admin' },
    { icon: 'grid_view', label: 'Tools', path: '/admin/tools' },
    { icon: 'settings', label: 'Config', path: '/admin/settings' },
  ];

  return (
    <>
      <style>{`
        /* From Uiverse.io by eslam-hany */ 
        .admin-button-container {
          display: flex;
          background-color: rgba(0, 73, 144, 0.95);
          width: 200px; /* Smaller width for fewer items */
          height: 50px;
          align-items: center;
          justify-content: space-around;
          border-radius: 12px;
          box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px,
            rgba(0, 73, 144, 0.5) 5px 10px 15px;
          transition: all 0.5s;
          backdrop-filter: blur(8px);
        }
        
        .admin-button-container:hover {
          width: 240px;
          transition: all 0.5s;
        }

        .uiverse-button {
          outline: 0 !important;
          border: 0 !important;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          transition: all ease-in-out 0.3s;
          cursor: pointer;
        }

        .uiverse-button:hover {
          transform: translateY(-3px);
        }

        .uiverse-button.active {
           background-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pb-safe">
        <div className="admin-button-container">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `uiverse-button ${isActive ? 'active' : ''}`
              }
            >
              {({ isActive }) => (
                <span className={`material-symbols-outlined text-[24px] ${isActive ? 'fill-1' : ''}`}>
                  {item.icon}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
