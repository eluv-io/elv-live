import React from "react";
import {inject, observer} from "mobx-react";
import Collapsible from 'react-collapsible';

import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

@inject("rootStore")
@inject("siteStore")
@observer
class Support extends React.Component {

  render() {
    let faqInfo = this.props.siteStore.faqData;
    
    return (
        <div className="support-page">
          <Navigation/>
  
          <div className="support-container">
            <div className="support-header">
              <h1 className="support-header--title">Fan FAQ</h1>
            </div>
            <div className="support-body">
              {faqInfo.map((obj, index) =>
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
