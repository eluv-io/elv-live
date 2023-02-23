import React, {useState} from "react";
import ImageIcon from "../../components/ImageIcon";
import Modal from "../../components/Modal";
import {RichText} from "../../components/Misc";
import {mainStore} from "../../stores/Main";

import {XIcon} from "../../static/icons/Icons";
import {observer} from "mobx-react";

const PartnerInfo = observer(({name, logo, modalContent, isProvider, isValidator, setShowModal}) => {
  return (
    <div className="partner-info modal-box">
      {
        !isProvider && !isValidator ? null :
          <div className="partner__tags">
            {isProvider ? <div className="partner__tag partner__tag--provider">{ mainStore.l10n.partners.node_provider }</div> : null}
            {isValidator ? <div className="partner__tag partner__tag--validator">{ mainStore.l10n.partners.governance_validator }</div> : null}
          </div>
      }
      <ImageIcon icon={logo} title={name} className="partner-info__logo" />
      {
        typeof modalContent === "string" ?
          <RichText richText={modalContent} className="partner-info__content partner-info__content--rich-text"/> :
          <div className="partner-info__content">{modalContent}</div>
      }
      <button onClick={() => setShowModal(false)} className="modal__close-button light modal-box__close-button">
        <ImageIcon icon={XIcon} title="Close" className="modal-box__close-button-icon" />
      </button>
    </div>
  );
});

const PartnerIcon = observer(({name, logo, modalContent, isProvider, isValidator}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)} className="partner-icon">
        {
          !isProvider && !isValidator ? null :
            <div className="partner__tags">
              {isProvider ? <div className="partner__tag partner__tag--provider">{ mainStore.l10n.partners.node_provider }</div> : null}
              {isValidator ? <div className="partner__tag partner__tag--validator">{ mainStore.l10n.partners.governance_validator }</div> : null}
            </div>
        }
        <ImageIcon icon={logo} title={name} className="partner-icon__logo" />
        <div className="partner-icon__action">{ mainStore.l10n.actions.read_more }</div>
      </button>
      <Modal active={showModal} Close={() => setShowModal(false)} hideCloseButton className="modal--modal-box partner-modal">
        <PartnerInfo name={name} logo={logo} modalContent={modalContent} isProvider={isProvider} isValidator={isValidator} setShowModal={setShowModal} />
      </Modal>
    </>
  );
});

export default PartnerIcon;
