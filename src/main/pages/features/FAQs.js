import React from "react";
import {Accordion} from "../../components/Misc";
import FaqsData from "../../content/FAQs.yaml";

const FAQs = () => {
  return (
    <div className="faqs">
      <Accordion title="FAQs" className="padded-block">
        <div className="faqs__content">
          {
            FaqsData.map(({title, description}, index) => (
              <div key={`faq-item-${index}`} className="faqs__content-section">
                <h3 className="faqs__content-section-number">{ index + 1 }</h3>
                <h3 className="faqs__content-title">{ title }</h3>
                <p className="faqs__content-description">{ description }</p>
              </div>
            ))
          }
        </div>
      </Accordion>
    </div>
  );
};

export default FAQs;
