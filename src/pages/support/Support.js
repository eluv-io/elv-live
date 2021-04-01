import React from "react";
import {inject, observer} from "mobx-react";
import Collapsible from "react-collapsible";
import Footer from "Layout/Footer";

import { faq } from "Assets/copy/FAQ.yaml";

@inject("rootStore")
@inject("siteStore")
@observer
class Support extends React.Component {
  componentDidMount() {
    document.body.scrollIntoView();
  }

  render() {
    return (
      <div className="page-container support-page">
        <div className="main-content-container support-container">
          <div className="support-header">
            <h1 className="support-header--title">FAQ</h1>
          </div>
          <div className="support-body">
            {Object.values(faq).map(({q, a}, index) =>
              <Collapsible className="faq-entry" openedClassName="faq-entry faq-entry-open" transitionTime={150} trigger={q} key={index}>
                <p>{ a }</p>
              </Collapsible>
            )}
          </div>
        </div>
        <Footer/>
      </div>

    );
  }
}


export default Support;
