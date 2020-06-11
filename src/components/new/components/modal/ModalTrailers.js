import React from "react";
import {inject, observer} from "mobx-react";
import SwiperGrid from "../SwiperGrid";
class ModalTrailers extends React.Component {
  render() {

    const featuredTitle = this.props.title;
    let trailers = [featuredTitle, featuredTitle, featuredTitle]; //Hardcode random trailers

    return (
      <React.Fragment>
        <div className={`modal__container ${this.props.showTab === "Trailers" ? "" : "hide"}`}>
          <h1 className="modal__title">
            {featuredTitle.displayTitle}
          </h1>
          <SwiperGrid name="Trailers" titles={trailers} modalClose={this.props.modalClose} modalOpen={this.props.modalOpen} playTitle={this.props.playTitle} trailers={true} shouldPlay={true} isEpisode={false}/>
        </div>
      </React.Fragment>
    );
  }
}

export default ModalTrailers;
