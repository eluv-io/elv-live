import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import Papa from "papaparse";
import {mainStore} from "../../stores/Main";
import AndroidDeviceCSV from "../../static/documents/device-matrix-android.csv";
import FireDeviceCSV from "../../static/documents/device-matrix-fire-tv.csv";
import AppleDeviceCSV from "../../static/documents/device-matrix-tvOS.csv";
import {SearchIcon} from "../../static/icons/Icons";
import ImageIcon from "../../components/ImageIcon";
import DevicesGraphic from "../../static/images/main/media_wallet/devices-graphic.png";
import {PageContainer} from "../../MainApp";

const AutocompleteResults = ({
  searchTerm,
  results,
  setSearchTerm,
  setResults,
  hasMatch=false,
  selectedItemIndex
}) => {
  if(!searchTerm) { return null; }

  return (
    <div className="compatible-devices__autocomplete-results">
      {
        (!results.length || hasMatch) ?
          <div className="compatible-devices__autocomplete-results">
            <h3 className="compatible-devices__autocomplete-results-header">
              {
                !results.length ?
                  "Sorry, this platform isn't supported yet."
                  : hasMatch ?
                    `${results[0]} is supported.` : null
              }
            </h3>
            <div className="compatible-devices__autocomplete-results-subheader">
              <span>Download our <span className="compatible-devices__download-text">Full Device Matrix</span> for more information.</span>
              <div className="compatible-devices__item-links">
                <a href={AppleDeviceCSV} download="Device Matrix - Apple TV.csv">Apple TV</a>
                <span className="compatible-devices__item-links-separator">|</span>
                <a href={AndroidDeviceCSV} download="Device Matrix - Android TV.csv">Android TV</a>
                <span className="compatible-devices__item-links-separator">|</span>
                <a href={FireDeviceCSV} download="Device Matrix - FireTV.csv">Amazon Fire TV</a>
                <span className="compatible-devices__item-links-separator">|</span>
              </div>
            </div>
          </div> :
          <ul>
            {
              results.map((result, index) => (
                <li
                  key={result}
                  className={`compatible-devices__autocomplete-result-item ${selectedItemIndex === index ? "compatible-devices__autocomplete-result-item--selected" : ""}`}
                  onClick={() => {
                    setSearchTerm(result);
                    setResults([result]);
                  }}
                >
                  {result}
                </li>
              ))
            }
          </ul>
      }
    </div>
  );
};

const AutocompleteSearch = ({
  setShowImage,
  deviceList=[]
}) => {
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

  useEffect(() => {
    setShowImage(!searchTerm);
  }, [searchTerm]);

  const Debounce = (func) => {
    let timeoutId;

    return (...args) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, 300);
    };
  };

  const HandleKeyDown = (event) => {
    if(event.key === "ArrowUp") {
      setSelectedItemIndex((prevIndex) =>
        Math.max(prevIndex - 1, -1)
      );
    } else if(event.key === "ArrowDown") {
      setSelectedItemIndex((prevIndex) =>
        Math.min(prevIndex + 1, results.length - 1)
      );
    } else if(event.key === "Enter") {
      const selectedTerm =results[selectedItemIndex];
      setResults([selectedTerm]);
      setSearchTerm(selectedTerm);
    }
  };

  const HandleInputChange = (currentTerm) => {
    if(currentTerm === "") {
      setSelectedItemIndex(-1);
      setResults([]);
      setSearchTerm("");
    } else {
      const newResults = deviceList.filter(term => term.toLowerCase().startsWith(currentTerm.toLowerCase()));
      setResults(newResults);
      setSearchTerm(currentTerm);
    }
  };

  return (
    <div className="compatible-devices__autocomplete">
      <div className="compatible-devices__autocomplete-search">
        <ImageIcon className="compatible-devices__autocomplete-icon" icon={SearchIcon} />
        <input
          type="search"
          placeholder="Search"
          className="compatible-devices__autocomplete-input"
          value={searchTerm}
          onChange={(event) => Debounce(HandleInputChange(event.target.value))}
          onKeyDown={HandleKeyDown}
        />
      </div>
      <AutocompleteResults
        key={results.length}
        searchTerm={searchTerm}
        results={results} setSearchTerm={setSearchTerm}
        setResults={setResults}
        hasMatch={(results.length === 1 && results[0].toLowerCase() === searchTerm.toLowerCase())}
        selectedItemIndex={selectedItemIndex}
      />
    </div>
  );
};

const FullWidthElements = ({showImage=true}) => {
  return (
    <div className={`compatible-devices__graphic ${showImage ? "" : "compatible-devices__graphic--hidden"}`} style={{backgroundImage: showImage ? `url(${DevicesGraphic})` : ""}} />
  );
};

const CompatibleDevices = observer(() => {
  const [showImage, setShowImage] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const {heading, devices, more_info} = mainStore.l10n.compatible_devices;

  useEffect(() => {
    const rows = ["Apple TV HD", "Apple TV 4K", "Apple TV 4K (2nd generation)"];

    const getData = async() => {
      const androidResponse = await fetch(AndroidDeviceCSV);
      const fireResponse = await fetch(FireDeviceCSV);

      for(const response of [androidResponse, fireResponse]) {
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder("utf-8");
        const csv = decoder.decode(result.value);
        const results = Papa.parse(csv, { header: true });
        results.data.forEach(row => {
          rows.push(`${row["Brand"] || row["Version"]} ${row["Device"] || ""}`);
        });
      }

      rows.sort();
      setDeviceList(rows);
    };

    getData();
  }, []);

  return (
    <PageContainer after={<FullWidthElements showImage={showImage} />} padded>
      <div className="page compatible-devices">
        <div className="page__header-container">
          <h1>{heading.header}</h1>
          <h3>{heading.subheader}</h3>
        </div>
        <div className="page__content-block">
          {
            devices.map(({title, description}) => (
              <div key={title} className="compatible-devices__item">
                <h3 className="compatible-devices__item-title">{title}</h3>
                <div className="compatible-devices__item-description">{description}</div>
              </div>
            ))
          }
          <div className="compatible-devices__item">
            <h3 className="compatible-devices__item-title">{more_info.title}</h3>
            <div className="compatible-devices__item-description">
              {more_info.description}
              <div className="compatible-devices__item-description-download-text">{more_info.download_text}</div>
              <div className="compatible-devices__item-links">
                <a href={AppleDeviceCSV} download="Device Matrix - Apple TV.csv">Apple TV</a>
                <span className="compatible-devices__item-links-separator">|</span>
                <a href={AndroidDeviceCSV} download="Device Matrix - Android TV.csv">Android TV</a>
                <span className="compatible-devices__item-links-separator">|</span>
                <a href={FireDeviceCSV} download="Device Matrix - FireTV.csv">Amazon Fire TV</a>
                <span className="compatible-devices__item-links-separator">|</span>
              </div>
            </div>
          </div>
          <AutocompleteSearch setShowImage={setShowImage} deviceList={deviceList} />
        </div>
      </div>
    </PageContainer>
  );
});

export default CompatibleDevices;
