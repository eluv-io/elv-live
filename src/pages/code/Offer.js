import React, {useEffect} from "react";
import {observer} from "mobx-react";
import {LocalizeString, onEnterPressed} from "Utils/Misc";
import {useState} from "react";
import {RichText} from "Common/Components";
import {rootStore, siteStore} from "Stores";
import {PageLoader} from "Common/Loaders";
import {useNavigate, useParams} from "react-router";
import UrlJoin from "url-join";

const initialCode = (new URLSearchParams(window.location.search)).get("code");

const OfferPage = observer(() => {
  const navigate = useNavigate();
  const params = useParams();
  const [code, setCode] = useState(initialCode || "");
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const offer = siteStore.currentSiteInfo.offers?.find(offer => offer.id === params.offerId) || {};
  const previouslyRedeemed = localStorage.getItem(`${params.offerId}-code`);

  const RedeemOffer = async () => {
    try {
      setError(undefined);
      setLoading(true);

      if(!previouslyRedeemed) {
        await rootStore.RedeemOffer({
          tenantId: offer.tenant_id || siteStore.currentSiteInfo.tenant_id,
          ntpId: offer.ntp_id,
          code
        });

        localStorage.setItem(`${params.offerId}-code`, code);
      }

      const marketplace = offer.marketplace &&
        siteStore.additionalMarketplaces.find(({marketplace_slug}) => marketplace_slug === offer.marketplace) ||
        siteStore.marketplaceInfo;
      const redirectToOwned = offer.sku && siteStore.currentSiteInfo?.event_button_marketplace_redirect_to_owned_item;
      let params = "";
      if(redirectToOwned) {
        if(siteStore.currentSiteInfo.event_button_marketplace_redirect_page === "media") {
          params = "?redirect=owned-media";
        } else {
          params = "?redirect=owned";
        }
      }

      rootStore.SetWalletPanelVisibility({
        visibility: "full",
        location: {
          path : UrlJoin(
            "/marketplace",
            marketplace.marketplaceId,
            "store",
            offer.sku || "",
            params
          )
        }
      });

      await new Promise(resolve => setTimeout(resolve, 3000));
      navigate(siteStore.SitePath(""));
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error(error);

      try {
        if(error.body && error.body.includes("not yet valid")) {
          const releaseDate = new Date(parseInt(error.body.match(/.+VAT: (\d+)/)[1]));
          setError(
            LocalizeString(
              siteStore.l10n.codes.errors.not_yet_valid,
              { date: releaseDate.toLocaleDateString(navigator.languages, {year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric"}) }
            )
          );
          return;
        }
        // eslint-disable-next-line no-empty
      } catch(error) {}

      setError(siteStore.l10n.codes.errors.failed);
    } finally {
      setLoading(false);
    }
  };

  // Automatically redeem if code specified
  useEffect(() => {
    if(code || previouslyRedeemed) {
      RedeemOffer();
    }
  }, []);

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
          onKeyDown={onEnterPressed(RedeemOffer)}
        />

        <button
          disabled={!code}
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
