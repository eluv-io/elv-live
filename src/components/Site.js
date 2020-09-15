// import React from "react";
// import {inject, observer} from "mobx-react";
// import SwiperGrid from "./grid/SwiperGrid";
// import ViewTitle from "./ViewTitle";
// import TitleGrid from "./grid/TitleGrid";
// import {Redirect, withRouter} from "react-router";
// import AsyncComponent from "./AsyncComponent";
// import MoviePremiere from "./premiere/MoviePremiere";
// import ActiveTitle from "./premiere/ActiveTitle";
// import HeroGrid from "./hero/HeroGrid";
// // import OldBoxFeature from "./hero/OldBoxFeature";
// import BoxFeature from "./hero/BoxFeature";
// import NewVideoFeature from "./hero/NewVideoFeature";
// import NavigationBar from "./NavigationBar";

// const FormatName = (name) => {
//   return (name || "")
//     .split(/[_, \s]/)
//     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// };

// @inject("rootStore")
// @inject("siteStore")
// @withRouter
// @observer
// class Site extends React.Component {
//   ArrangementEntry(entry, i) {
//     const key = `arrangement-entry-${i}`;

//     let name, titles;
//     switch (entry.type) {
//       case "header":
//         return <h1 key={key}>{entry.options.text}</h1>;
//       case "playlist":
//         const playlist = this.props.siteStore.siteInfo.playlists.find(playlist => playlist.slug === entry.playlist_slug);
//         name = entry.label;
//         titles = playlist.titles;
//         break;
//       case "asset":
//         name = entry.label;
//         titles = this.props.siteStore.siteInfo.assets[entry.name];
//         break;
//       default:
//         // eslint-disable-next-line no-console
//         console.error("Unknown Asset Type:", entry.type);
//         // eslint-disable-next-line no-console
//         console.error(entry);
//         return;
//     }


//     const variant = entry.options && entry.options.variant;
//     switch (entry.component) {
//       case "hero":
//         return (
//           <HeroGrid
//             key={key}
//             titles={titles}
//           />
//         );
//       case "feature":
//         switch (variant) {
//           case "box":
//             return (
//               <BoxFeature
//                 key={key}
//                 title={entry.title}
//                 trailers={false}
//                 shouldPlay={false}
//                 isEpisode={false}
//                 backgroundColor={entry.options.color}
//               />
//             );
//           case "video":
//             return (
//               <NewVideoFeature
//                 key={key}
//                 title={entry.title}
//                 trailers={false}
//                 shouldPlay={false}
//                 isEpisode={false}
//               />
//             );
//           default:
//             // eslint-disable-next-line no-console
//             console.error("Unknown variant:", variant);
//             // eslint-disable-next-line no-console
//             console.error(entry);
//             return;
//         }

//       case "carousel":
//         return (
//           <SwiperGrid
//             key={key}
//             name={name}
//             titles={titles}
//             trailers={false}
//             shouldPlay={false}
//             isEpisode={false}
//             isPoster={variant === "portrait"}
//           />
//         );

//       case "grid":
//         return (
//           <TitleGrid
//             key={key}
//             name={name}
//             titles={titles}
//             trailers={false}
//             shouldPlay={false}
//             isEpisode={false}
//             isPoster={variant === "portrait"}
//           />
//         );
//       default:
//         // eslint-disable-next-line no-console
//         console.error("Unknown component:", entry.component);
//         // eslint-disable-next-line no-console
//         console.error(entry);
//     }
//   }

//   Content() {
//     if(this.props.siteStore.searchQuery) {
//       return (
//         <TitleGrid
//           noTitlesMessage="No results found"
//           name="Search Results"
//           titles={this.props.siteStore.searchResults}
//           trailers={false}
//           shouldPlay={false}
//           isEpisode={false}
//         />
//       );
//     }


//     const siteCustomization = this.props.siteStore.siteCustomization || {};
//     let arrangement = siteCustomization.arrangement;
//     this.props.siteStore.SetBackgroundColor(siteCustomization.colors.background);
//     this.props.siteStore.SetPrimaryFontColor(siteCustomization.colors.primary_text);

//     if(!arrangement) {
//       // Default arrangement: Playlists then assets, all medium carousel
//       arrangement = this.props.siteStore.siteInfo.playlists.map(playlist => ({
//         type: "playlist",
//         name: playlist.name,
//         label: playlist.name,
//         playlist_slug: playlist.slug,
//         component: "carousel",
//         options: {
//           variant: "landscape",
//           width: "medium"
//         }
//       }));

//       arrangement = arrangement.concat(
//         Object.keys(this.props.siteStore.siteInfo.assets).sort().map(key => ({
//           type: "asset",
//           name: key,
//           label: FormatName(key),
//           component: "carousel",
//           options: {
//             variant: "landscape",
//             width: "medium"
//           }
//         }))
//       );
//     }

//     return arrangement.map((entry, i) => this.ArrangementEntry(entry, i));
//   }

//   //USING THIS TO TEST DIFFERENT COMPONENTS
//   TestContent() {
//     if(this.props.siteStore.searchQuery) {
//       return (
//         <TitleGrid
//           noTitlesMessage="No results found"
//           name="Search Results"
//           titles={this.props.siteStore.searchResults}
//           trailers={false}
//           shouldPlay={false}
//           isEpisode={false}
//         />
//       );
//     }
//     // let titles = this.props.siteStore.siteInfo.assets.titles;
//     // let moreTitles = titles.concat(this.props.siteStore.siteInfo.assets.titles);

//     return (
//       <React.Fragment>
//         <HeroGrid titles={this.props.siteStore.siteInfo.playlists[1].titles}   />
//         <SwiperGrid name="All Seres" titles={this.props.siteStore.siteInfo.assets.series}    trailers={false} shouldPlay={false} isEpisode={false} isPoster={false}/>
//         <VideoFeature title={this.props.siteStore.siteInfo.assets.titles[1]}    trailers={false} shouldPlay={false} isEpisode={false} />
//         <SwiperGrid name="Most Viewed" titles={this.props.siteStore.siteInfo.assets.titles}    trailers={false} shouldPlay={false} isEpisode={false} isPoster={true}/>
//         <BoxFeature title={this.props.siteStore.siteInfo.assets.titles[2]}    trailers={false} shouldPlay={false} isEpisode={false} />
//         { this.props.siteStore.siteInfo.playlists.map(playlist =>
//           <SwiperGrid
//             key={`title-reel-playlist-${playlist.playlistId}`}
//             name={playlist.name}
//             titles={playlist.titles}
//             trailers={false}
//             shouldPlay={false}
//             isEpisode={false}
//             isPoster={false}
//           />
//         )}
//         <BoxFeature title={this.props.siteStore.siteInfo.assets.titles[3]}    trailers={false} shouldPlay={false} isEpisode={false} />
//         <VideoFeature title={this.props.siteStore.siteInfo.assets.titles[0]}    trailers={false} shouldPlay={false} isEpisode={false} />
//         <SwiperGrid name="All Titles" titles={this.props.siteStore.siteInfo.assets.titles}    trailers={false} shouldPlay={false} isEpisode={false} isPoster={false}/>
//         <TitleGrid name="All Titles" titles={this.props.siteStore.siteInfo.assets.titles}    trailers={false} shouldPlay={false} isEpisode={false} isPoster={true}/>
//       </React.Fragment>
//     );
//   }

//   ShowVideo() {
//     return <ViewTitle key={`active-title-${this.props.siteStore.activeTitle.titleId}`} />;
//   }

//   ShowPremiere() {
//     const siteCustomization = this.props.siteStore.siteCustomization || {};
//     this.props.siteStore.SetBackgroundColor(siteCustomization.colors.background);
//     this.props.siteStore.SetPrimaryFontColor(siteCustomization.colors.primary_text);

//     return <MoviePremiere title={this.props.siteStore.premiere.title} />;
//   }


//   render() {
//     if(!this.props.rootStore.client || (this.props.match.params.siteSelectorId && !this.props.rootStore.accessCode)) {
//       return <Redirect to={`/code/${this.props.match.params.siteSelectorId}`} />;
//     }

//     return (
//       <AsyncComponent
//         Load={async () => await this.props.siteStore.LoadSite(this.props.match.params.siteId, this.props.match.params.writeToken)}
//         render={() => {
//           if(!this.props.siteStore.siteInfo) { return null; }

//           return (
//             <div className="container">
//               {/* If there's an activeTitle (playing video full screen), get rid of Nav Bar.  */}

//               { this.props.siteStore.activeTitle ? null : <NavigationBar />}

//               {/* If there's an activeTitle (playing video full screen), play the title. 
//               If no activeTitle, check if there's a singleTitle (displaying one title) and show that.
//               If no singleTitle, check if it's a premiere and show that. 
//               If no singleTitle or premiere, show Content (Main Sample Site Page).  */}
              
//               { this.props.siteStore.activeTitle ? this.ShowVideo() : this.props.siteStore.singleTitle ? <ActiveTitle /> : (this.props.siteStore.premiere ? this.ShowPremiere() : this.Content())}
//             </div>
//           );
//         }}
//       />
//     );
//   }
// }

// export default Site;
