import React from "react";
import {inject, observer} from "mobx-react";
import Collapsible from "react-collapsible";

import Navigation from "Layout/Navigation";
import Footer from "Layout/Footer";

@inject("rootStore")
@inject("siteStore")
@observer
class Support extends React.Component {
  componentDidMount() {
    document.body.scrollIntoView();
  }

  render() {
    let faqData = this.props.siteStore.faqData;

    return (
      <div className="page-container support-page">
        <div className="main-content-container support-container">
          <div className="support-header">
            <h1 className="support-header--title">FAQ</h1>
          </div>
          <div className="support-body">
            {faqData.map((obj, index) =>
              <Collapsible transitionTime={150} trigger={obj.question} key={index}>
                <p>{obj.answer}</p>
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
