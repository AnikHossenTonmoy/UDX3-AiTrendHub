
import React from 'react';
import { NavLink } from 'react-router-dom';

const PublicMobileNav = () => {
  const navItems = [
    { icon: 'home', label: 'Home', path: '/' },
    { icon: 'lightbulb', label: 'Prompts', path: '/prompts' },
    { icon: 'brush', label: 'Studio', path: '/studio' },
    { icon: 'grid_view', label: 'Tools', path: '/ai-tools' },
    { icon: 'bookmark', label: 'Saved', path: '/saved' },
  ];

  return (
    <>
      <style>{`
        /* From Uiverse.io by eslam-hany - Adapted for React */ 
        .button-container {
          display: flex;
          background-color: rgba(0, 73, 144, 0.95); /* Added slight opacity for glass effect */
          width: 280px; /* Slightly wider to fit 5 items comfortably */
          height: 50px; /* Increased height for better touch targets */
          align-items: center;
          justify-content: space-around;
          border-radius: 12px; /* Slightly smoother radius */
          box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px,
            rgba(0, 73, 144, 0.5) 5px 10px 15px;
          transition: all 0.5s;
          backdrop-filter: blur(8px);
        }
        
        .button-container:hover {
          width: 320px;
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
          position: relative;
        }

        .uiverse-button:hover {
          transform: translateY(-3px);
        }
        
        .uiverse-button.active {
           background-color: rgba(255, 255, 255, 0.2);
           box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
        }

        .uiverse-icon {
          font-size: 24px;
        }
      `}</style>
      
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pb-safe">
        <div className="button-container">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `uiverse-button ${isActive ? 'active' : ''}`}
              title={item.label}
            >
              {({ isActive }) => (
                <span className={`material-symbols-outlined uiverse-icon ${isActive ? 'fill-1' : ''}`}>
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

export default PublicMobileNav;
