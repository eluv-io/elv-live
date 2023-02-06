import React, {useState} from "react";
import {Link, NavLink} from "react-router-dom";
import ImageIcon from "./ImageIcon";
import {Loader} from "./Loader";

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

export const ActionComponent = (props) => {
  const useNavLink = props.useNavLink;

  props = { ...props };
  delete props.useNavLink;

  if(props.icon) {
    props.children = (
      <>
        <ImageIcon icon={props.icon} title={props.iconLabel} className="action__icon" />
        { props.children }
      </>
    );

    delete props.icon;
    delete props.iconLabel;
  }

  // Allow links to be specified with 'to' param
  if(props.to?.startsWith("https://") || props.to?.startsWith("mailto:")) {
    props.href = props.to;
    props.target = "_blank";
    props.rel = "external";
    delete props.to;
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

  let underline = props.underline;
  delete props.underline;

  if(props.to) {
    if(useNavLink) {
      return <NavLink
        {...props}
        className={({isActive}) => PrependClassName(isActive ? `active ${underline ? "active--underline" : ""}` : `inactive ${underline ? "inactive--underline" : ""}`, props.className)}
      />;
    } else {
      return <Link {...props} />;
    }
  } else if(props.href) {
    return <a {...props} />;
  } else {
    return <button {...props} />;
  }
};

export const Button = (props) => {
  return (
    <ActionComponent
      {...props}
      className={PrependClassName("button", props.className)}
    />
  );
};

export const ButtonWithLoader = (props) => {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      {...props}
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
};

export const Action = (props) => {
  return (
    <ActionComponent
      {...props}
      className={PrependClassName("action", props.className)}
    />
  );
};
