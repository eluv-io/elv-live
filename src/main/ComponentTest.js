import React, {useState} from "react";
import {Button, ButtonWithLoader, Action} from "./components/Actions";
import {CaptionedImage, GridCarousel, InfoBox} from "./components/Misc";
import Modal from "./components/Modal";
import {observer} from "mobx-react";
import {uiStore} from "./stores/Main";

import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import PartnerIcon from "./pages/partners/PartnerIcon";

import TestIcon from "./static/test/Event icon.svg";
import TestIcon2 from "./static/test/link.svg";
import TestImage from "./static/test/newRO3.jpg";
import TestImage2 from "./static/test/heroRita.jpg";
import EluvioLogo from "./static/images/logos/eluvio-logo.svg";


const ModalTest = ({scroll=false, className=""}) => {
  return (
    <div className={`component-test__modal modal-box ${className}`}>
      <Button className="light primary">Light Button</Button>
      <Button icon={TestIcon} className="light primary">Light Button with Icon</Button>

      <Action to={"/asd"} className="light">Link</Action>
      <Action to={"/asd"} useNavLink className="light">Inactive Link</Action>
      <Action to={"/"} useNavLink className="light">Active Link</Action>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>

      {
        scroll ?
          <>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </> : null
      }
    </div>
  );
};

const childs = (
  <>
    <PartnerIcon
      logo={EluvioLogo}
      name="Eluvio"
      isValidator
      isProvider
      modalContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
    />

    <PartnerIcon
      logo={EluvioLogo}
      name="Eluvio"
      isProvider
      modalContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
    />

    <PartnerIcon
      logo={EluvioLogo}
      name="Eluvio"
      isValidator
      modalContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
    />
    <PartnerIcon
      logo={EluvioLogo}
      name="Eluvio"
      isValidator
      isProvider
      modalContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
    />

    <PartnerIcon
      logo={EluvioLogo}
      name="Eluvio"
      isProvider
      modalContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
    />

    <PartnerIcon
      logo={EluvioLogo}
      name="Eluvio"
      isValidator
      modalContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
    />
  </>
);

const ComponentTest = observer(() => {
  const [showModal, setShowModal] = useState(false);
  const [showFullWidthModal, setShowFullWidthModal] = useState(false);
  const [showFullWidthScrollModal, setShowFullWidthScrollModal] = useState(false);

  return (
    <>
      <div className="component-test">
        <div>Page Width: {uiStore.pageWidth}</div>
        <div>Page Height: {uiStore.pageHeight}</div>

        <h1>Header 1</h1>
        <h2>Header 2</h2>
        <h3>Header 3</h3>
        <h4>Header 4</h4>

        <GridCarousel className="partners__list" classNameGrid="partners__list--grid" classNameCarousel="partners__list--carousel">
          { childs }
        </GridCarousel>

        <InfoBox
          icon={TestIcon}
          header="Info Box"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
          links={[
            {
              to: "https://google.com",
              text: "Link 1",
              icon: TestIcon
            },
            {
              to: "https://google.com",
              text: "Link 2",
              icon: TestIcon
            },
            {
              to: "https://google.com",
              text: "Link 3",
              icon: TestIcon
            }
          ]}

        />

        <InfoBox
          icon={TestIcon}
          header="Info Box no Links"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
        />

        <InfoBox
          header="The Real Cannonball Run Documentary Launches Web3 Experience Ahead of Debut in 2023"
          subheader={"January 14th, 2023"}
          links={[
            {
              to: "https://google.com",
              text: "Read More",
              icon: TestIcon
            }
          ]}
        />

        <Button className="light primary">Light Button</Button>
        <Button icon={TestIcon} className="light primary">Light Button with Icon</Button>

        <Button className="light secondary">Secondary Light Button</Button>
        <Button icon={TestIcon} className="light secondary">Secondary Light Button with Icon</Button>

        <Button className="light primary small">Small Light Button</Button>
        <Button icon={TestIcon} className="light primary small secondary">Small Secondary Light Button with Icon</Button>

        <Button icon={TestIcon2} className="light primary extra-small">Extra Small</Button>

        <Button to={"https://google.com"} icon={TestIcon} includeArrow className="light secondary">External Link</Button>
        <Action to={"https://google.com"} includeArrow className="light">External Link</Action>

        <PartnerIcon
          logo={EluvioLogo}
          name="Eluvio"
          isValidator
          isProvider
          modalContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
        />

        <ButtonWithLoader icon={TestIcon2} onClick={async () => await new Promise(resolve => setTimeout(resolve, 10000))} className="light primary">Button with Loader</ButtonWithLoader>
        <ButtonWithLoader icon={TestIcon2} onClick={async () => await new Promise(resolve => setTimeout(resolve, 1000))} className="light secondary small">Button with Loader</ButtonWithLoader>
        <ButtonWithLoader icon={TestIcon2} onClick={async () => await new Promise(resolve => setTimeout(resolve, 1000))} className="light primary extra-small">Send</ButtonWithLoader>

        <Action to={"/asd"} className="light">Link</Action>
        <Action to={"/asd"} useNavLink className="light">Inactive Link</Action>
        <Action to={"/"} useNavLink className="light">Active Link</Action>

        <CaptionedImage expandable image={TestImage} caption="This is an image caption. It will wrap if it is too long. You can click the image to expand." className="component-test__captioned-image" imageClassName="component-test__image" />

        <Button onClick={() => setShowModal(true)} className="light primary">Show Default Modal</Button>
        <Button onClick={() => setShowFullWidthModal(true)} className="light primary">Show Full Screen Modal (Short)</Button>
        <Button onClick={() => setShowFullWidthScrollModal(true)} className="light primary">Show Full Screen Modal (Long)</Button>

        <Modal className="modal--modal-box" active={showModal} Close={() => setShowModal(false)}>
          <ModalTest />
        </Modal>

        <Modal active={showFullWidthModal} className="full" Close={() => setShowFullWidthModal(false)}>
          <ModalTest className="full" />
        </Modal>

        <Modal active={showFullWidthScrollModal} className="full" Close={() => setShowFullWidthScrollModal(false)}>
          <ModalTest scroll className="full" />
        </Modal>

        <ContactForm />
        <Footer />
      </div>
      <div className="component-test dark">
        <Button className="dark primary">Dark Button</Button>
        <Button icon={TestIcon} className="dark primary">Dark Button with Icon</Button>

        <Button className="dark secondary">Secondary Dark Button</Button>
        <Button icon={TestIcon} className="dark secondary">Secondary Dark Button with Icon</Button>

        <InfoBox
          dark
          icon={TestIcon}
          header="Info Box"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
          links={[
            {
              to: "https://google.com",
              text: "Link 1",
              icon: TestIcon
            },
            {
              to: "https://google.com",
              text: "Link 2",
              icon: TestIcon
            },
            {
              to: "https://google.com",
              text: "Link 3",
              icon: TestIcon
            }
          ]}

        />

        <InfoBox
          dark
          icon={TestIcon}
          header="Info Box no Links"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis."
        />

        <InfoBox
          dark
          header="The Real Cannonball Run Documentary Launches Web3 Experience Ahead of Debut in 2023"
          subheader={"January 14th, 2023"}
          links={[
            {
              to: "https://google.com",
              text: "Read More",
              icon: TestIcon
            }
          ]}
        />

        <Action to={"/asd"} className="dark">Link</Action>
        <Action to={"/asd"} useNavLink className="dark">Inactive Link</Action>
        <Action to={"/"} useNavLink className="dark">Active Link</Action>

        <ButtonWithLoader icon={TestIcon2} onClick={async () => await new Promise(resolve => setTimeout(resolve, 10000))} className="dark primary">Button with Loader</ButtonWithLoader>
        <ButtonWithLoader icon={TestIcon2} onClick={async () => await new Promise(resolve => setTimeout(resolve, 1000))} className="dark secondary small">Button with Loader</ButtonWithLoader>
        <ButtonWithLoader icon={TestIcon2} onClick={async () => await new Promise(resolve => setTimeout(resolve, 1000))} className="dark primary extra-small">Send</ButtonWithLoader>

        <CaptionedImage image={TestImage2} expandable caption="This is an image caption. It will wrap if it is too long. You can click the image to expand." className="component-test__captioned-image dark" imageClassName="component-test__image" />

        <ContactForm className="dark" />
        <Footer dark />
      </div>
    </>
  );
});

export default ComponentTest;
