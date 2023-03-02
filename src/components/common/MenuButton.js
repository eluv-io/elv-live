import React, {useState, useEffect, useRef} from "react";

export const MenuButton = ({children, items, className="", optionClassName=""}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const containerRef = useRef(null);

  const HandleClickOutside = (event) => {
    if(containerRef.current && !containerRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  const HandleEscapeKey = (event) => {
    if(event.key === "Escape") {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", HandleClickOutside);
    document.addEventListener("keydown", HandleEscapeKey);

    return (() => {
      document.removeEventListener("mousedown", HandleClickOutside);
      document.removeEventListener("keydown", HandleEscapeKey);
    });
  }, []);

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={event => {
        event.preventDefault();
        event.stopPropagation();
        setMenuOpen(!menuOpen);
      }}
      className={`menu-button ${menuOpen ? "menu-button--active" : ""} ${className}`}
      ref={containerRef}
    >
      { children }
      {
        menuOpen &&
        <ul className="menu-button__options">
          {(items || []).map((item, index) => (
            <li key={`menu-button-${index}`} className="menu-button__option">
              <button
                onClick={() => {
                  item.onClick();
                  setMenuOpen(false);
                }}
                className={`menu-button__button ${optionClassName}`}
              >
                { item.label }
              </button>
            </li>
          ))}
        </ul>
      }
    </div>
  );
};

export default MenuButton;
