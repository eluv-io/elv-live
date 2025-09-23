import React from "react";
import {BackgroundImage, Box, Button, Flex, Group, Stack, Text, Title} from "@mantine/core";
import BgImage from "../../static/images/resources/narrow-wave.png";
import {useNavigate} from "react-router";

const Card = ({title, description, action={}}) => {
  return (
    <Stack>
      <Title>{ title }</Title>
      <Text>{ description }</Text>
      <Button
        variant="outline"
        radius={8}
        color="highlight.8"
        onClick={action.onClick}
      >
        { action.text }
      </Button>
    </Stack>
  );
};

const Section = ({
  title,
  subtitle,
  primaryColor,
  items=[]
}) => {
  return (
    <div>
      <Group wrap="nowrap" gap={8}>
        <Title size={32} c="darkText.1" fw={600}>{ title }</Title>
        <Title c={primaryColor} size={32} fw={600}>{ subtitle }</Title>
      </Group>
      <Flex direction="row">
        {
          items.map(item => (
            <Card
              key={item.id}
              title={item.title}
              description={item.description}
              action={item.action}
            />
          ))
        }
      </Flex>
    </div>
  );
};

const LearningResources = () => {
  const navigate = useNavigate();
  const data = [
    {id: "resource-1", title: "Placeholder Title", description: "Quick description or the first paragraph of the document can go here. Zero-code OTT Max out at this length.", action: {text: "Link Text", onClick: () => navigate("/community")}},
    {id: "resource-2", title: "Placeholder Title", description: "Quick description or the first paragraph of the document can go here. Zero-code OTT Max out at this length.", action: {text: "Link Text", onClick: () => navigate("")}},
    {id: "resource-3", title: "Placeholder Title", description: "Quick description or the first paragraph of the document can go here. Zero-code OTT Max out at this length.", action: {text: "Link Text", onClick: () => navigate("")}}
  ];

  return (
    <Box h={600} ml={80} mr={80} mt={30}>
      <BackgroundImage src={BgImage} h="100%" w="100%">
        <Section
          title="Document"
          subtitle="Category"
          items={data}
          primaryColor="highlight.8"
        />
      </BackgroundImage>
    </Box>
  );
};

export default LearningResources;
