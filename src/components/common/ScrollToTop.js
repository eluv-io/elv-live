// eslint-disable-next-line no-unused-vars
import React, {useEffect} from "react";
import {useLocation} from "react-router";

const ScrollToTop = ({children}) => {
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => window.scrollTo(0, 0), 100);
  }, [location.pathname]);

  return children;
};

export default ScrollToTop;
