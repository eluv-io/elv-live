import React from "react";
import { withRouter } from "react-router-dom";

class ScrollToTop extends React.Component {
  Scroll() {
    document.body.scrollIntoView({behavior: "smooth"});
    document.body.scrollTo({top: 0});
    window.scrollTo({top: 0});
  }

  componentDidMount() {
    this.Scroll();
  }

  async componentDidUpdate(prevProps) {
    if(this.props.location.pathname !== prevProps.location.pathname) {
      this.Scroll();
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
