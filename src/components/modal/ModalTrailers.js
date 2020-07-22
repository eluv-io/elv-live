import React from "react";
import TitleGrid from "../grid/TitleGrid";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@inject("siteStore")
@observer
class ModalTrailers extends React.Component {

  render() {
    const featuredTitle = this.props.title;
    let trailers = [featuredTitle];

    return (
      <React.Fragment>
        <div className={`modal__container ${this.props.showTab === "Trailers" ? "" : "hide"}`}>
          <h1 className="modal__title">
            {featuredTitle.displayTitle}
          </h1>
          <TitleGrid name="Trailers" titles={trailers} trailers={true} shouldPlay={true} isEpisode={false} isPoster={false}/>
        </div>
      </React.Fragment>
    );
  }
}

export default ModalTrailers;