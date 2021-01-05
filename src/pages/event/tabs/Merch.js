import React from "react";
import {inject, observer} from "mobx-react";

@inject("rootStore")
@inject("siteStore")
@observer
class Merch extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      merchBack: undefined,
      merchImage: undefined
    };
  }

  async componentDidMount() {
    let merchImage = await this.props.siteStore.client.LinkUrl({...this.props.siteStore.siteParams, linkPath: `public/sites/${this.props.name}/images/checkout_merch/default`});
    let merchBack = await this.props.siteStore.client.LinkUrl({...this.props.siteStore.siteParams, linkPath: `public/sites/${this.props.name}/images/merch_back/default`});
    this.setState({merchBack: merchBack});
    this.setState({merchImage: merchImage});
  }
  
  render() {
    let checkoutMerch = this.props.siteStore.eventSites[this.props.name]["merch_tab"];

    return (
      <div className={"merch-container"}>
        {checkoutMerch.map((obj, index) =>
          <a href={obj["url"]} target="_blank" className="merch-item" key={index}>
            <img className="merch-image" src={this.state.merchImage} label="merchFront" onMouseOver={e => (e.currentTarget.src = this.state.merchBack)} onMouseOut={e => (e.currentTarget.src =this.state.merchImage)}/>
            <div className="merch-detail">
              <span className="merch-name">{obj["name"]}</span>
              <span className="merch-price">{obj["price"]}</span>
            </div>
          </a>
        )}
      </div>
    );
  }
}

export default Merch;