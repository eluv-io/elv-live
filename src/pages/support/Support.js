import React from "react";
import {inject, observer} from "mobx-react";
import Collapsible from "react-collapsible";
import Footer from "Layout/Footer";

import DefaultFAQ from "Assets/copy/FAQ.yaml";
import {RichText} from "Common/Components";

const initialKey = new URLSearchParams(window.location.search).get("q");

@inject("rootStore")
@inject("siteStore")
@observer
class Support extends React.Component {
  componentDidMount() {
    if(initialKey) {
      setTimeout(() => {
        const target = document.querySelector(`.faq-entry--${initialKey}`);
        if(target) {
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - 100,
            behavior: "smooth"
          });
        }
      }, 500);
    } else {
      document.body.scrollIntoView();
    }
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
            {Object.values(faq).map(({key, question, answer}, index) =>
              <Collapsible
                className={`faq-entry faq-entry--${key || index}`}
                openedClassName={`faq-entry faq-entry--${key || index} faq-entry-open`}
                transitionTime={150}
                trigger={question}
                key={index}
                open={key && key === initialKey}
              >
                <RichText richText={answer} className="markdown-document support-body__rich-text" />
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
