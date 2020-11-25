import React from "react";
import {inject, observer} from "mobx-react";
import EventTabs from "../EventTabs";
import {ImageIcon} from "elv-components-js";
import CloseIcon from "../../../static/icons/x.svg";
import hero1 from "../../../static/images/ritaora/hero1.jpg";
import Tickets from "../../livestream/Payment/Tickets";

import {Redirect} from "react-router";
import Logo from "../../../static/images/Logo.png";

import heroImg from "../../../static/images/ritaora/hero1.jpg";

@inject("rootStore")
@inject("siteStore")
@observer
class Concert extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPayment: false,
      showTrailer: false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  Trailer() {

    // let eventInfo = this.props.siteStore.eventAssets.get("rita-ora");
    // let featuredTitle = eventInfo.stream;
    // this.props.siteStore.PlayTrailer(featuredTitle);

      return (
      
        <React.Fragment>
        
        <div onClick={() => this.setState({showTrailer: false})} className="backdrop" />

        <div className="modal show" >
          <ImageIcon
            key={`back-icon-Close Modal`}
            className={"back-button__modal"}
            title={"Close Modal"}
            icon={CloseIcon}
            onClick={() => this.setState({showTrailer: false})}
          />

          <div className={`modal__container`}>          
            
            <iframe 
              width="100%" 
              height="100%"
              src="https://www.youtube.com/embed/FS07b8EUlCs" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            >
              </iframe>
         
          </div>
        </div>
      </React.Fragment>
      )
    

  }

  Payment() {

    
    return (
      
      <React.Fragment>
        
        <div onClick={() => this.setState({showPayment: false})} className="backdrop" />

        <div className="modal2 show2" >
          <ImageIcon
            key={`back-icon-Close Modal`}
            className={"back-button__modal"}
            title={"Close Modal"}
            icon={CloseIcon}
            onClick={() => this.setState({showPayment: false})}
          />

          <div className={`modal2__container`}>   
            <div className="ticket-modal">
              <Tickets/>
            </div>       
          </div>
        </div>
      </React.Fragment>
    )
  }


  render() {
    // if (!this.props.siteStore.eventAssets.has(this.props.match.params.name)) {
    //   return <Redirect to='/'/>;
    // }
    // let eventInfo = this.props.siteStore.eventAssets.get(this.props.match.params.name);
    let thumbnail = heroImg;

    // const backgroundColor =  this.props.siteStore.siteCustomization.colors.background;
    const backgroundColor =  "#000321";
    const backgroundHelp =  "#000112";
    const backgroundHelp2 =  "#00010a";

    const blackColor =  "#000000";

    const backgroundColor1 =  backgroundColor + "00";
    const backgroundColor2 =  backgroundColor + "4C";
    const backgroundColor3 =  backgroundColor+ "66";
    const backgroundColor4 =  backgroundColor + "B3";
    const backgroundColor5 =  backgroundColor + "CC";
    const backgroundColor6 =  backgroundColor+ "E6";

    const backgroundStyle = {
      backgroundSize: "cover",
      backgroundImage: `linear-gradient(to bottom, ${backgroundColor1} 55%, ${backgroundColor3} 60%, ${backgroundColor4} 65%, ${backgroundColor5}  70%, ${backgroundColor6} 75%, ${backgroundColor} 80%,  ${backgroundHelp} 85%,  ${backgroundHelp2} 90%, ${blackColor} 100%), url(${thumbnail})`,
      backgroundPosition: "center",
      objectFit: "cover",
      height: "100%",
    };

    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    let vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vw', `${vw}px`);

    return (
      <div className="home-containerBlack">
        <div className="event-nav">
          <ImageIcon className="event-nav__container--logo" icon={Logo} label="Eluvio" />
        </div>

        <div style={backgroundStyle} className="active-background" />

        <div className="active-view-container">
            <div className="active-view-container__heading">
              <h1 className="name"> {"Rita Ora"} </h1>
              <h1 className="location">{ "Streaming Live from the Eiffel Tower" }</h1>
              <h1 className="time">{ "January 28th, 2021 · 8:00 PM PST" }</h1>
            </div>
            

          {this.props.match.params.name === "rita-ora" ? 
            <React.Fragment>
              <div className="active-view-container__button">
                <button className="btnPlay btnDetails__heroPlay" onClick={() => this.setState({showPayment: true})}>
                  Buy Tickets
                </button>
                {/* {window.innerHeight > 1000 ?      <button onClick={() => this.setState({showTrailer: true})} className="btnPlay btnDetails__heroDetail">
                  Watch Promo
                </button> : 
                <a href="https://store.ritaora.com/products/phoenix-tour-tee-black" target="_blank" className="btnPlay btnDetails__heroDetail">
<button className="btnPlay btnDetails__heroDetail">
                  Watch Promo
                </button>
              </a>
              
                } */}
               <button onClick={() => this.setState({showTrailer: true})} className="btnPlay btnDetails__heroDetail">
                  Watch Promo
                </button> 

              </div> 
              <div className="active-view-container__overview">
                <EventTabs title={null} type={"concert"} name={"rita-ora"}/>
              </div>
            </React.Fragment>
          : 
            <div className="active-view-container__button">
              <h1 className="coming-soon">More Info Coming Soon</h1>
            </div>
          }
         
        </div>
        { this.state.showTrailer ? this.Trailer(): null}
        { this.state.showPayment ? this.Payment(): null}


        <div className="live-footer">
          <h3 className="live-footer__title">
            Copyright © Eluvio 2020 
          </h3>
        </div>
      </div>
    );
  }
}

export default Concert;