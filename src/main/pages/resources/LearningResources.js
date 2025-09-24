import React from "react";
import {BackgroundImage, Box, Button, Flex, Group, Text, Title} from "@mantine/core";
import BgImage from "../../static/images/resources/narrow-wave.png";
import {useNavigate} from "react-router";
import {ArrowRightIcon, DocumentIcon} from "../../static/icons/Icons";
import ImageIcon from "Common/ImageIcon";
import styles from "../../static/modules/LearningResources.module.css";

const Card = ({title, description, action={}, primaryColor}) => {
  return (
    <Box bg="white.0" flex="0 0 410px" h={312} bdrs={14} p="30px 35px 35px">
      <Flex direction="column" gap={20} h="100%">
        <Title c={primaryColor} size={28} lineClamp={2} fw={600}>{ title }</Title>
        <Text mah={72} lineClamp={3} m="auto 0">{ description }</Text>
        <Button
          classNames={{inner: styles.buttonInner}}
          variant="outline"
          radius={8}
          color={primaryColor}
          size="md"
          onClick={action.onClick}
          mt="auto"
          leftSection={<ImageIcon icon={DocumentIcon} height={30} width={33} className={styles.buttonLeftIcon} />}
          rightSection={<ImageIcon icon={ArrowRightIcon} className={styles.buttonRightIcon} />}
          fullWidth
        >
          <Text fw={700} c="black.6" size="1.125rem">
            { action.text }
          </Text>
        </Button>
      </Flex>
    </Box>
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
      <Group wrap="nowrap" gap={8} mb={35}>
        <Title size={32} c="gray.2" fw={600}>{ title }</Title>
        <Title c={primaryColor} size={32} fw={600}>{ subtitle }</Title>
      </Group>
      <Flex direction="row" gap={25}>
        {
          items.map(item => (
            <Card
              key={item.id}
              title={item.title}
              description={item.description}
              action={item.action}
              primaryColor={primaryColor}
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
    {id: "resource-1", title: "Placeholder Title Longer Long Long Title", description: "Quick description or the first paragraph of the document can go here. Zero-code OTT Max out at this length.", action: {text: "Link Text", onClick: () => navigate("/community")}},
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
          primaryColor="purple.8"
        />
      </BackgroundImage>
    </Box>
  );
};

export default LearningResources;
