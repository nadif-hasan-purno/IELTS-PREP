import React, { useEffect, useState } from 'react';

const Themes = () => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('theme') || 'exotic';
  });

  useEffect(() => {
    // Apply the theme to the document element
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    
    // Force update of all elements to ensure theme is applied
    const forceThemeUpdate = () => {
      // This is a hack to force browsers to recalculate styles
      document.body.style.display = 'none';
      document.body.offsetHeight; // Trigger reflow
      document.body.style.display = '';
    };
    
    forceThemeUpdate();
  }, [currentTheme]);

  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName);
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      </div>
      <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Exotic"
            value="exotic"
            checked={currentTheme === 'exotic'}
            onChange={() => handleThemeChange('exotic')}
          />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Light"
            value="light"
            checked={currentTheme === 'light'}
            onChange={() => handleThemeChange('light')}
          />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Dark"
            value="dark"
            checked={currentTheme === 'dark'}
            onChange={() => handleThemeChange('dark')}
          />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Cupcake"
            value="cupcake"
            checked={currentTheme === 'cupcake'}
            onChange={() => handleThemeChange('cupcake')}
          />
        </li>
      </ul>
    </div>
  );
};

export default Themes;