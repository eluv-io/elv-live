import React, {useState} from "react";
import {Button, ButtonWithLoader, TextLink} from "./components/Actions";
import {CaptionedImage} from "./components/Misc";
import Modal from "./components/Modal";
import {observer} from "mobx-react";
import {uiStore} from "./stores/Main";

import TestIcon from "./static/test/Event icon.svg";
import TestIcon2 from "./static/test/link.svg";
import TestImage from "./static/test/newRO3.jpg";
import TestImage2 from "./static/test/heroRita.jpg";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";


const ModalTest = ({scroll=false, className=""}) => {
  return (
    <div className={`component-test__modal ${className}`}>
      <Button className="light primary">Light Button</Button>
      <Button icon={TestIcon} className="light primary">Light Button with Icon</Button>

      <TextLink to={"/asd"} className="light">Link</TextLink>
      <TextLink to={"/asd"} useNavLink className="light">Inactive Link</TextLink>
      <TextLink to={"/"} useNavLink className="light">Active Link</TextLink>

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

        <Button className="light primary">Light Button</Button>
        <Button icon={TestIcon} className="light primary">Light Button with Icon</Button>

        <Button className="light secondary">Secondary Light Button</Button>
        <Button icon={TestIcon} className="light secondary">Secondary Light Button with Icon</Button>

        <Button className="light primary small">Small Light Button</Button>
        <Button icon={TestIcon} className="light primary small secondary">Small Secondary Light Button with Icon</Button>

        <Button icon={TestIcon2} className="light primary extra-small">Extra Small</Button>

        <ButtonWithLoader icon={TestIcon2} onClick={async () => await new Promise(resolve => setTimeout(resolve, 10000))} className="light primary">Button with Loader</ButtonWithLoader>
        <ButtonWithLoader icon={TestIcon2} onClick={async () => await new Promise(resolve => setTimeout(resolve, 1000))} className="light secondary small">Button with Loader</ButtonWithLoader>
        <ButtonWithLoader icon={TestIcon2} onClick={async () => await new Promise(resolve => setTimeout(resolve, 1000))} className="light primary extra-small">Send</ButtonWithLoader>

        <TextLink to={"/asd"} className="light">Link</TextLink>
        <TextLink to={"/asd"} useNavLink className="light">Inactive Link</TextLink>
        <TextLink to={"/"} useNavLink className="light">Active Link</TextLink>

        <CaptionedImage expandable image={TestImage} caption="This is an image caption. It will wrap if it is too long. You can click the image to expand." className="component-test__captioned-image" imageClassName="component-test__image" />

        <Button onClick={() => setShowModal(true)} className="light primary">Show Default Modal</Button>
        <Button onClick={() => setShowFullWidthModal(true)} className="light primary">Show Full Screen Modal (Short)</Button>
        <Button onClick={() => setShowFullWidthScrollModal(true)} className="light primary">Show Full Screen Modal (Long)</Button>

        <Modal active={showModal} Close={() => setShowModal(false)}>
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

        <TextLink to={"/asd"} className="dark">Link</TextLink>
        <TextLink to={"/asd"} useNavLink className="dark">Inactive Link</TextLink>
        <TextLink to={"/"} useNavLink className="dark">Active Link</TextLink>

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
