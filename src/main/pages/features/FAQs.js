import React from "react";
import {Accordion, RichText} from "../../components/Misc";
import {mainStore} from "../../stores/Main";
import {observer} from "mobx-react";

const FAQs = observer(() => {
  return (
    <div className="faqs">
      <Accordion title={mainStore.l10n.faq.header} className="padded-block">
        <div className="faqs__content">
          {
            mainStore.l10n.faq.questions.map(({question, answer}, index) => (
              <div key={`faq-item-${index}`} className="faqs__content-section">
                <h3 className="faqs__content-section-number">{ index + 1 }</h3>
                <h3 className="faqs__content-title">{ question }</h3>
                <RichText richText={answer} className="faqs__content-description" />
              </div>
            ))
          }
        </div>
      </Accordion>
    </div>
  );
});

export default FAQs;
