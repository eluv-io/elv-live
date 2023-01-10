import React from "react";
import {observer} from "mobx-react";
import {onEnterPressed} from "Utils/Misc";
import {useState} from "react";
import {RichText} from "Common/Components";
import {rootStore, siteStore} from "Stores";
import {PageLoader} from "Common/Loaders";
import {useNavigate, useParams} from "react-router";

const initialCode = (new URLSearchParams(window.location.search)).get("code");

const OfferPage = observer(() => {
  const {offerId} = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState(initialCode || "");
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const offer = siteStore.currentSiteInfo.offers?.find(offer => offer.id === offerId) || {};

  const RedeemOffer = async () => {
    try {
      setError(undefined);
      setLoading(true);

      await rootStore.RedeemOffer({
        tenantId: offer.tenant_id || siteStore.currentSiteInfo.tenant_id,
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

      await new Promise(resolve => setTimeout(resolve, 3000));
      navigate(siteStore.SitePath(""));
    } catch(error) {
      console.log(error);
      setError(siteStore.l10n.codes.errors.failed);
    } finally {
      setLoading(false);
    }
  };

  if(!rootStore.walletLoaded) {
    return <PageLoader />;
  }

  return (
    <div className="page-container code-entry-page-container">
      <div className="main-content-container offer-page">
        <h2 className="offer-page__title">{ offer?.title || siteStore.l10n.codes.redeem_offer }</h2>
        { offer.description ? <RichText richText={offer.description} className="markdown-document offer-page__description" /> : null }

        { error ? <div className="error-message offer-page__error"> {error} </div> : null }

        <input
          className="offer-page__input"
          placeholder={siteStore.l10n.codes.redemption_code}
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
          title={siteStore.l10n.codes.redeem_offer}
          className="btn offer-page__button"
        >
          {loading ?
            <div className="offer-page__button__loader">
              <div className="la-ball-clip-rotate la-sm">
                <div></div>
              </div>
            </div> :
            siteStore.l10n.codes.redeem_offer
          }
        </button>
      </div>
    </div>
  );
});

export default OfferPage;
