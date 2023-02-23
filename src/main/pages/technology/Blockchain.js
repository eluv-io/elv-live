import React, {useState} from "react";
import {RichText} from "../../components/Misc";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import LearnMore from "./LearnMore";

const Blockchain = observer(() => {
  const copy = mainStore.l10n.blockchain;
  const tabs = Object.keys(copy.pages).map(key => [copy.pages[key].label, key]);

  const [tab, setTab] = useState("our_blockchain");

  return (
    <div className="page light">
      <div className="page__header-container">
        <h1>{ copy.title }</h1>
        <h3>{ copy.header }</h3>
      </div>
      <div className="page__content-block right-links">
        <RichText richText={copy.pages[tab].text} key={`page-${tab}`} className="page__copy fade-in--slow" />
        <div className="page__side-links">
          {
            tabs.map(([label, key]) =>
              <button
                onClick={() => setTab(key)}
                key={`link-${key}`}
                className={`page__side-link ${tab === key ? "active" : "inactive"}`}
              >
                { label }
              </button>
            )
          }
        </div>
      </div>
      <div className="page__content-block">
        <LearnMore />
      </div>
    </div>
  );
});

export default Blockchain;
