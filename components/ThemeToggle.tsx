
import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Initial check
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    const html = document.documentElement;
    
    // Default to dark if no preference or explicitly dark
    const shouldBeDark = storedTheme === 'dark' || (!storedTheme && isSystemDark) || (!storedTheme && html.classList.contains('dark'));
    
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsDark(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <>
      <style>{`
        /* From Uiverse.io by njesenberger */ 
        .toggle-container {
          --active-color: #3b82f6; /* Tailwind Blue 500 */
          --inactive-color: #d3d3d6;
          position: relative;
          aspect-ratio: 292 / 142;
          height: 1.6em; /* Scaled for Navbar */
        }

        .toggle-input {
          appearance: none;
          margin: 0;
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .toggle {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .toggle-background {
          fill: var(--inactive-color);
          transition: fill .4s;
        }

        .toggle-input:checked + .toggle .toggle-background {
          fill: var(--active-color);
        }

        .toggle-circle-center {
          transform-origin: center;
          transition: transform .6s;
        }

        .toggle-input:checked + .toggle .toggle-circle-center {
          transform: translateX(150px);
        }

        .toggle-circle {
          transform-origin: center;
          transition: transform .45s;
          backface-visibility: hidden;
        }

        .toggle-circle.left {
          transform: scale(1);
        }

        .toggle-input:checked + .toggle .toggle-circle.left {
          transform: scale(0);
        }

        .toggle-circle.right {
          transform: scale(0);
        }

        .toggle-input:checked + .toggle .toggle-circle.right {
          transform: scale(1);
        }
        
        .toggle-icon {
          transition: fill .4s;
        }

        .toggle-icon.on {
          fill: var(--inactive-color);
        }

        .toggle-input:checked + .toggle .toggle-icon.on {
          fill: #fff;
        }

        .toggle-icon.off {
          fill: #eaeaec;
        }

        .toggle-input:checked + .toggle .toggle-icon.off {
          fill: var(--active-color);
        }
      `}</style>
      <div className="toggle-container" title="Toggle Dark/Light Mode">
        <input 
            className="toggle-input" 
            type="checkbox" 
            checked={isDark}
            onChange={handleChange}
            aria-label="Toggle Dark Mode"
        />
        <svg className="toggle" viewBox="0 0 292 142" xmlns="http://www.w3.org/2000/svg">
          <path className="toggle-background" d="M71 142C31.7878 142 0 110.212 0 71C0 31.7878 31.7878 0 71 0H221C260.212 0 292 31.7878 292 71C292 110.212 260.212 142 221 142H71Z" />
          <g className="toggle-circle-center">
            <circle className="toggle-circle left" cx="71" cy="71" r="63" fill="white" />
            <circle className="toggle-circle right" cx="71" cy="71" r="63" fill="white" />
          </g>
        </svg>
      </div>
    </>
  );
};

export default ThemeToggle;
