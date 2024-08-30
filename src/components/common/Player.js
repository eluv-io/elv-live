import React, {useState, useEffect} from "react";
import {InitializeEluvioPlayer} from "@eluvio/elv-player-js/lib/index";
import {observer} from "mobx-react";
import {rootStore} from "Stores";

export const Player = observer(({
  params,
  className=""
}) => {
  const [player, setPlayer] = useState(undefined);
  const [videoDimensions, setVideoDimensions] = useState(undefined);

  useEffect(() => {
    return () => player?.Destroy();
  }, [rootStore.client, player]);

  return (
    <div className={`player-container ${player ? "player-container--loaded" : "player-container--loading"} ${className}`}>
      <div
        className="player-container__player"
        style={{aspectRatio: `${videoDimensions?.width || 16} / ${videoDimensions?.height || 9}`}}
        ref={element => {
          if(!element || player) { return; }

          InitializeEluvioPlayer(element, params)
            .then(player => {
              setPlayer(player);
              player.controls.RegisterVideoEventListener("canplay", event => {
                setVideoDimensions({width: event.target.videoWidth, height: event.target.videoHeight});
              });
            });
        }}
      />
    </div>
  );
});


export default Player;
