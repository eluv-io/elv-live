import React from "react";
import { Link } from "react-router-dom";
import {ImageIcon} from "elv-components-js";
import {inject, observer} from "mobx-react";
import Collapsible from 'react-collapsible';

import Navigation from "./Navigation";
import Footer from "./Footer";
// import { faq } from "../../assets/data";

import Logo from "../../assets/images/logo/darkLogo.png";

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
