import {useEffect} from "react";
import {observer} from "mobx-react";
import {mainStore} from "../../stores/Main";
import UrlJoin from "url-join";

const Wallet = observer(() => {
  const hashPath = window.location.hash.replace("#/", "/");
  useEffect(() => {
    window.location.href = UrlJoin(mainStore.walletAppUrl, hashPath || "");
  }, []);

  return null;
});

export default Wallet;
