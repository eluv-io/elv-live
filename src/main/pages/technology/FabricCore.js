import React from "react";
import {mainStore} from "../../stores/Main";
import {observer} from "mobx-react";
import {Accordion, AccordionGroup, RichText} from "../../components/Misc";

const FabricCore = observer(() => {
  const copy = mainStore.l10n.casablanca;

  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>{ copy.title }</h1>
        <h3>{ copy.header }</h3>
      </div>
      <div className="page__content-block">
        {
          copy.pages.fabric_core.sections.map(item => (
            <div key={`fabric-core-section-${item.title}`}>
              <h3 className="page__content-block__header light">{ item.title }</h3>
              <RichText richText={item.description} className="page__copy fade-in--slow" />
            </div>
          ))
        }
      </div>
      {
        copy.pages.fabric_core.accordion_sections.map(section => (
          <div className="page__content-block">
            <AccordionGroup
              key={`fabric-core-accordion-section-${section.header}`}
              header={section.items ? section.header : ""}
            >
              {
                section.items ?
                  section.items.map(item => (
                    <Accordion title={item.title} key={`fabric-core-accordion-item-${item.title}`}>
                      <RichText className="accordion__description-card" richText={item.description} />
                    </Accordion>
                  )) :
                  <Accordion title={section.header} hasHeader={false}>
                    <RichText className="accordion__description-card" richText={section.description} />
                  </Accordion>
              }
            </AccordionGroup>
          </div>
        ))
      }
    </div>
  );
});

export default FabricCore;

