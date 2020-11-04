// import React from "react";
// import {inject, observer} from "mobx-react";
// import { Dropdown } from "semantic-ui-react";
// import AsyncComponent from "../video/AsyncComponent";
// import TitleGrid from "../grid/TitleGrid";

// @inject("rootStore")
// @inject("siteStore")
// @observer
// class PremiereEpisodes extends React.Component {

//   constructor(props) {
//     super(props);

//     this.state = {
//       selected: 0
//     };

//     this.PageContent = this.PageContent.bind(this);
//   }

//   Seasons() {
//     return (this.props.siteStore.assets[this.props.title.versionHash] || {assets: {}}).assets.seasons || [];
//   }

//   Episodes() {
//     const season = this.Seasons()[this.state.selected];
//     const episodes = (this.props.siteStore.assets[season.versionHash] || {assets: {}}).assets.episodes || [];
//     return (
//       <AsyncComponent
//         key={`episode-list-${this.state.selected}`}
//         Load={async () => {
//           // Load season to resolve episode info
//           if(this.props.siteStore.assets[season.versionHash]) {
//             return;
//           }

//           await this.props.siteStore.LoadAsset(season.baseLinkPath);
//         }}
//         render={() => (
//           <div className={`premiereTabs__episode-container__episodes ${this.props.showTab === "Episodes" ? "" : "hide"}`}>
//             <TitleGrid
//               name=""
//               titles={episodes}
//               trailers={true}
//               shouldPlay={true}
//               isEpisode={true}
//               isPoster={false}
//             />
//           </div>
//         )}
//       />
//     );
//   }

//   PageContent() {
//     const seasons = this.Seasons()
//       .map((season, i) => ({
//         key: `season-${i}`,
//         text: season.displayTitle,
//         value: i
//       }));

//     return (
      
//       <div className={"premiereTabs__episode-container"}>
//         <div className={"premiereTabs__episode-container__dropdown"}>
//           <Dropdown
//             fluid
//             selection
//             options={seasons}
//             value={this.state.selected}
//             onChange={(_, data) => this.setState({selected: parseInt(data.value)})}
//           />
//         </div>
//         {this.Episodes()}
//       </div>
//     );
//   }

//   render() {
//     return (
//       <AsyncComponent
//         Load={async () => {
//           // Load series to resolve season info
//           if(this.props.siteStore.assets[this.props.title.versionHash]) {
//             return;
//           }

//           await this.props.siteStore.LoadAsset(this.props.title.baseLinkPath);
//         }}
//         render={this.PageContent}
//       />
//     );
//   }
// }

// export default PremiereEpisodes;