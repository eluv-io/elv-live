import React, {useEffect} from "react";
import {observer} from "mobx-react";
import {onEnterPressed} from "Utils/Misc";
import {useState} from "react";
import {RichText} from "Common/Components";
import {useRouteMatch} from "react-router";
import {rootStore, siteStore} from "Stores";

const initialCode = (new URLSearchParams(window.location.search)).get("code");

const OfferPage = observer(() => {
  const match = useRouteMatch();
  const [code, setCode] = useState(initialCode || "");
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const offer = siteStore.currentSiteInfo.offers?.find(offer => offer.id === match.params.offerId) || {};

  const RedeemOffer = async () => {
    try {
      setError(undefined);
      setLoading(true);

      await rootStore.RedeemOffer({
        tenantId: offer.tenant_id || this.siteStore.currentSiteInfo.tenant_id,
        ntpId: offer.ntp_id,
        code
      });

      rootStore.SetWalletPanelVisibility({
        visibility: "full",
        location: {
          page: "marketplaceItem",
          params: {
            sku: offer.sku,
            tenantSlug: siteStore.currentSiteInfo.marketplace_info.tenant_slug,
            marketplaceSlug: siteStore.currentSiteInfo.marketplace_info.marketplace_slug
          }
        }
      });
    } catch(error) {
      setError("Failed to redeem code");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="page-container code-entry-page-container">
      <div className="main-content-container offer-page">
        <h2 className="offer-page__title">{ offer?.title || "Redeem Offer"}</h2>
        <RichText richText={offer.description || "Description"} className="markdown-document offer-page__description" />

        { error ? <div className="error-message offer-page__error"> {error} </div> : null }

        <input
          className="offer-page__input"
          placeholder="Redemption Code"
          value={code}
          onChange={event => {
            setError(undefined);
            setCode(event.target.value);
          }}
          onKeyPress={onEnterPressed(RedeemOffer)}
        />

        <button
          disabled={!code || error}
          onClick={RedeemOffer}
          title="Submit"
          className="btn offer-page__button"
        >
          {loading ?
            <div className="offer-page__button__loader">
              <div className="la-ball-clip-rotate la-sm">
                <div></div>
              </div>
            </div> :
            "Redeem Offer"
          }
        </button>
      </div>
    </div>
  );
});

export default OfferPage;
