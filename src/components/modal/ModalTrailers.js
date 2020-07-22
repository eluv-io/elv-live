import React from "react";
import TitleGrid from "../grid/TitleGrid";
import AsyncComponent from "../AsyncComponent";
import {inject, observer} from "mobx-react";

@inject("siteStore")
@observer
class ModalTrailers extends React.Component {
  constructor(props) {
    super(props);

    this.Trailers = this.Trailers.bind(this);
  }


  Trailers() {
    const title = this.props.siteStore.assets[this.props.title.versionHash];

    if(!title) { 
      return null; 
    }

    return (
      <TitleGrid name="Trailers" titles={title.assets.trailers || []} trailers={true} shouldPlay={true} isEpisode={false} isPoster={false}/>
    );
  }

  render() {
    return (
        <div className={`modal__container ${this.props.showTab === "Trailers" ? "" : "hide"}`}>
          <h1 className="modal__title">
            {this.props.title.displayTitle}
          </h1>
          <AsyncComponent
            Load={async () => {
              // Load series to resolve season info
              if(this.props.siteStore.assets[this.props.title.versionHash]) {
                return;
              }

              await this.props.siteStore.LoadAsset(this.props.title.baseLinkPath);
            }}
            render={this.Trailers}
          />
          {this.props.title.trailers ? null : <h1> No Trailers Available </h1> }
        </div>
    );
  }
}

export default ModalTrailers;
