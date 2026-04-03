import React from "react";
import {Box, Divider, Flex, Title} from "@mantine/core";
import {mainStore} from "../../stores/Main";
import {Accordion, AccordionGroup, RichText} from "../../components/Misc";

const AccordionSection = ({title, items}) => {
  return (
    <Box mb={36}>
      <AccordionGroup
        key={`video-editor-accordion-section-${title}`}
        header={items ? title : ""}
      >
        {
          items ?
            items.map(item => (
              <Accordion title={item.title} key={`video-editor-accordion-item-${item.title}`}>
                <RichText className="accordion__description-card" richText={item.description}/>
              </Accordion>
            )) :
            <Accordion title={header} hasHeader={false} defaultOpen>
              <RichText className="accordion__description-card" richText={description}/>
            </Accordion>
        }
      </AccordionGroup>
    </Box>
  );
};

const CorePlatform = () => {
  const copy = mainStore.l10n.bucharest_core_platform;

  return (
    <div className="page light">
      <Box mb={36}>
        <Flex align="center" direction="column">
          <Title fw={600} order={1} fz={{base: "1.5rem", md: "2.5rem"}} c="neutral.1">{copy.header}</Title>
          <Title order={2} fz={{base: "1.25rem", md: "2rem"}} fw={600} c="purple.7">
            {copy.subheader}
          </Title>
        </Flex>
        <Divider color="purple.5" mt={36} maw={670} mx="auto" />
      </Box>

      {
        copy.sections.map(section => (
          <Box key={`accordion-group-${section.header}`}>
            <Title fw={600} order={1} fz={{base: "1.5rem", md: "2.5rem"}}mb={36}>{ section.header }</Title>
            {
              section.accordions.map(accordion => (
                <AccordionSection
                  key={`accordion-${accordion.title}`}
                  title={accordion.title}
                  items={accordion.items}
                />
              ))
            }
          </Box>
        ))
      }
    </div>
  );
};

export default CorePlatform;
