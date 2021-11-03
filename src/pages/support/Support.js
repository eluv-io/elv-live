import React from "react";
import {inject, observer} from "mobx-react";
import Collapsible from "react-collapsible";
import Footer from "Layout/Footer";

import DefaultFAQ from "Assets/copy/FAQ.yaml";

@inject("rootStore")
@inject("siteStore")
@observer
class Support extends React.Component {
  componentDidMount() {
    document.body.scrollIntoView();
  }

  render() {
    let faq = this.props.siteStore.currentSiteInfo.faq;

    if(!faq || faq.length === 0) {
      faq = DefaultFAQ.faq;
    }

    return (
      <div className="page-container support-page">
        <div className="main-content-container support-container">
          <div className="support-header">
            <h1 className="support-header--title">FAQ</h1>
          </div>
          <div className="support-body">
            {Object.values(faq).map(({question, answer}, index) =>
              <Collapsible className="faq-entry" openedClassName="faq-entry faq-entry-open" transitionTime={150} trigger={question} key={index}>
                <p>{ answer }</p>
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
