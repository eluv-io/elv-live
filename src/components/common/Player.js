import React, {useState, useEffect} from "react";
import {InitializeEluvioPlayer} from "@eluvio/elv-player-js/lib/index";

const Player = ({params, className=""}) => {
  const [player, setPlayer] = useState(undefined);

  useEffect(() => {
    return () => {
      if(player) {
        player.Destroy();
      }
    };
  }, []);

  return (
    <div
      className={`player-target ${className}`}
      ref={element => {
        if(!element || player) { return; }

        InitializeEluvioPlayer(element, params)
          .then(player => setPlayer(player));
      }}
    />
  );
};

export default Player;
