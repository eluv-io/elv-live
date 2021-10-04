import React, {useState} from "react";

const PreLogin = ({onComplete}) => {
  const [country, setCountry] = useState("United States");

  return (
    <div className="pre-login">
      <h2 className="pre-login__header">
        The Windows 11 NFT is a one-of-a-kind cryptographic token that lives in your digital wallet and unlocks valuable experiences and rewards
      </h2>

      <div className="pre-login__select-container">
        <label htmlFor="country" className="pre-login__select-label">Country</label>
        <select
          name="country"
          onChange={event => setCountry(event.target.value)}
          className="pre-login__select"
        >
          <option value="United States">United States</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {
        country === "United States" ?
          <div className="pre-login__note">
            I will receive information, tips, and offers about NFTs for Windows and Surface Devices and other Microsoft products and services.
            <a href="https://go.microsoft.com/fwlink/?LinkId=521839" target="_blank" rel="noopener">Privacy Statement</a>
          </div> : null
      }

      <div className="pre-login__actions">
        <button className="login-page__login-button login-page__login-button-pre-login pre-login__button" onClick={() => onComplete({data: { country }})}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default PreLogin;
