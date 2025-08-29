import React, {useEffect, useRef, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import ImageIcon from "./ImageIcon";
import {Loader} from "./Loader";
import {useCombinedRefs} from "../utils/Utils";

// Classname might be a function because of react-router navlink
const PrependClassName = (addition, className="") => {
  let updatedClassName;
  if(typeof className !== "function") {
    updatedClassName = `${addition} ${className}`;
  } else {
    updatedClassName = (...args) => {
      const classResults = className(...args);

      return `${addition} ${classResults || ""}`;
    };
  }

  return updatedClassName;
};

export const ActionComponent = React.forwardRef((props, ref) => {
  props = { ...props };
  const location = useLocation();

  // Handle navlink
  const useNavLink = props.useNavLink;
  const exact = props.exact;
  const underline = props.underline;
  const basePath = props.basePath;

  delete props.useNavLink;
  delete props.exact;
  delete props.underline;
  delete props.basePath;

  if(useNavLink) {
    const to = props.to || basePath || "";
    let routeActive;
    if(exact || location.pathname === "/") {
      routeActive = location.pathname === to;
    } else {
      routeActive = location.pathname.startsWith(to) || to.startsWith(location.pathname);
    }

    props.className = PrependClassName(routeActive ? `active ${underline ? "active--underline" : ""}` : `inactive ${underline ? "inactive--underline" : ""}`, props.className);
  }

  if(props.icon) {
    props.children = (
      <>
        <ImageIcon icon={props.icon} label={props.label || props.iconLabel} className="action__icon" />
        {
          props.children ?
            <span className="action__content">
              {props.children}
            </span> : null
        }
      </>
    );

    delete props.icon;
  }

  delete props.iconLabel;

  // Allow links to be specified with 'to' param
  if(props.to?.startsWith("https://") || props.to?.startsWith("mailto:")) {
    props.href = props.to;
    props.target = "_blank";
    props.rel = "external";
    delete props.to;
  } else if(props.to?.includes("#")) {
    const [to, hash] = props.to.split("#");

    props.to = to;
    const originalOnClick = props.onClick;
    props.onClick = async () => {
      originalOnClick && await originalOnClick();

      setTimeout(() => window.location.hash = "#" + hash, 50);
    };
  }

  if(props.includeArrow) {
    props.children = (
      <>
        {props.children}
        <div className="action__arrow">
          →
        </div>
      </>
    );
    delete props.includeArrow;
  }

  if(props.to) {
    return <Link {...props} ref={ref} />;
  } else if(props.href) {
    return <a {...props} ref={ref} />;
  } else {
    return <button {...props} ref={ref} />;
  }
});

export const Button = React.forwardRef((props, ref) => {
  return (
    <ActionComponent
      {...props}
      ref={ref}
      className={PrependClassName("button", props.className)}
    />
  );
});

export const ButtonWithLoader = React.forwardRef((props, ref) => {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      {...props}
      ref={ref}
      children={
        <>
          <div className="loader-button__content">
            { props.children }
          </div>
          <div className="loader-button__indicator">
            <Loader />
          </div>
        </>
      }
      onClick={async event => {
        if(loading) { return; }

        setLoading(true);

        try {
          await props.onClick(event);
        } finally {
          setLoading(false);
        }
      }}
      className={PrependClassName(`loader-button ${loading ? "loading" : "normal"}`, props.className)}
    />
  );
});

export const Action = React.forwardRef((props, ref) => {
  return (
    <ActionComponent
      {...props}
      ref={ref}
      className={PrependClassName("action", props.className)}
    />
  );
});

export const MenuButton = React.forwardRef((props, ref) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const containerRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, containerRef);

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
    document.addEventListener("mouseup", HandleClickOutside);
    document.addEventListener("keydown", HandleEscapeKey);

    return (() => {
      document.removeEventListener("mouseup", HandleClickOutside);
      document.removeEventListener("keydown", HandleEscapeKey);
    });
  }, []);

  props = {...props};
  const items = props.items || [];
  const optionClassName = props.optionClassName || "";
  delete props.items;
  delete props.optionClassName;

  return (
    <Action
      {...props}
      ref={combinedRef}
      onClick={event => {
        event.stopPropagation();
        setMenuOpen(!menuOpen);
      }}
      className={PrependClassName("menu-button", props.className)}
    >
      { props.children }
      {
        menuOpen &&
        <ul className="menu-button__options">
          {(items || []).map((item, index) => (
            <li key={`menu-button-${index}`} className="menu-button__item">
              <Action to={item.to} onClick={() => setMenuOpen(false)} className={optionClassName} {...item.props}>
                <div className="menu-button__options--flex">
                  <div className="menu-button__item-title-row">
                    {
                      item.icon &&
                      <ImageIcon icon={item.icon} className="menu-button__item-icon" />
                    }
                    { item.label }
                  </div>
                  {
                    item.subtitle &&
                    <p className={`menu-button__item-subtitle${item.icon ? " indent" : ""}`}>
                      { item.subtitle }
                    </p>
                  }
                </div>
              </Action>
            </li>
          ))}
        </ul>
      }
    </Action>
  );
});
