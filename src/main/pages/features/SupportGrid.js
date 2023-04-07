import {CheckSquareIcon, ClockIcon, MailIcon, SocialIcons, TelephoneIcon} from "../../static/icons/Icons";
import ImageIcon from "../../components/ImageIcon";
import React from "react";
import {observer} from "mobx-react";

const ItemCard = observer(({data, dark = false, compactRows}) => {
  const iconMap = {
    aroundClock: {
      label: "24x7",
      icon: ClockIcon
    },
    email: {
      label: "Email",
      icon: MailIcon
    },
    priorityEmail: {
      label: "Priority Email",
      icon: MailIcon
    },
    telephone: {
      label: "Telephone",
      icon: TelephoneIcon
    },
    slack: {
      label: "Slack",
      icon: SocialIcons.SlackIcon
    }
  };

  const {label, level_1, level_2, level_3, level_1_text, level_2_text, level_3_text, icons={}} = data;

  return (
    <div className={`features-support__item-card ${dark ? "dark" : "light"} ${compactRows ? `features-support__item-card--${compactRows}` : ""}`}>
      <div className="features-support__item-card-content">
        <span>
          { label }
          {
            Object.values(icons).some(iconName => iconName) &&
            <div className="features-support__item-card-communication">
              {
                Object.keys(icons || {}).map(iconKey => (
                  icons[iconKey] &&
                  <span key={`icon-${iconKey}`} className="features-support__item-card-communication__item">
                    <ImageIcon icon={iconMap[iconKey].icon}/>
                    <span className="features-support__icon-text">&nbsp;{iconMap[iconKey].label}</span>
                  </span>
                ))
              }
            </div>
          }
        </span>
        <span className="centered">
          {
            level_1_text ? level_1_text : level_1 ? <ImageIcon icon={CheckSquareIcon} /> : ""
          }
        </span>
        <span className="centered">
          {
            level_2_text ? level_2_text : level_2 ? <ImageIcon icon={CheckSquareIcon} /> : ""
          }
        </span>
        <span className="centered">
          {
            level_3_text ? level_3_text : level_3 ? <ImageIcon icon={CheckSquareIcon} /> : ""
          }
        </span>
      </div>
    </div>
  );
});

const ItemElements = observer(({items=[], compactRows, sections=[]}) => {
  if(sections.length > 0) {
    return sections.map(section => (
      <div key={section.header}>
        <div className="features-support__grid-section-header">{ section.header }</div>
        {
          section.items.map((sectionItem, index) => (
            <ItemCard
              data={sectionItem}
              key={`item-card-${sectionItem.label}-${index}`}
              compactRows={compactRows}
            />
          ))
        }
      </div>
    ));
  } else {
    return (
      items.map((item, index) => (
        <ItemCard
          data={item}
          key={`item-card-${item.label}-${index}`}
          compactRows={compactRows}
        />
      ))
    );
  }
});

const SupportGrid = observer(({items=[], compactRows, sections=[]}) => {
  return (
    <div className="features-support__grid-container">
      <div className="features-support__header-row">
        <span></span>
        <span className="features-support__header-text">
          <span className="features-support__header-text__subheader no-tablet">Level 1</span>
          <div className="features-support__header">Pay As You Go</div>
        </span>
        <span className="features-support__header-text">
          <span className="features-support__header-text__subheader no-tablet">Level 2</span>
          <div className="features-support__header">Professional Creator</div>
        </span>
        <span className="features-support__header-text">
          <span className="features-support__header-text__subheader no-tablet">Level 3</span>
          <div className="features-support__header">Creative Enterprise</div>
        </span>
      </div>
      <ItemElements items={items} compactRows={compactRows} sections={sections} />
    </div>
  );
});

export default SupportGrid;
