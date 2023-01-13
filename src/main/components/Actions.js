import React, {useEffect, useState} from "react";
import {Link, NavLink} from "react-router-dom";
import ImageIcon from "./ImageIcon";
import {Loader} from "./Loader";

// Classname might be a function because of react-router navlink
const PrependClassName = (addition, className) => {
  let updatedClassName;
  if(typeof className !== "function") {
    updatedClassName = `${addition} ${className || ""}`;
  } else {
    updatedClassName = (...args) => {
      const classResults = className(...args);

      return `${addition} ${classResults || ""}`;
    };
  }

  return updatedClassName;
};

const Action = (props) => {
  const useNavLink = props.useNavLink;

  props = { ...props };
  delete props.useNavLink;

  if(props.icon) {
    props.children = (
      <>
        <ImageIcon icon={props.icon} className="action__icon" />
        { props.children }
      </>
    );
    delete props.icon;
  }

  if(props.to) {
    if(useNavLink) {
      return <NavLink {...props} className={({isActive}) => PrependClassName(isActive ? "active" : "inactive", props.className)} />;
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
    <Action
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

export const TextLink = (props) => {
  return (
    <Action
      {...props}
      className={PrependClassName("link", props.className)}
    />
  );
};
