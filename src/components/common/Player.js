import React, {useState, useEffect} from "react";
import EluvioPlayer from "@eluvio/elv-player-js";

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

        setPlayer(
          new EluvioPlayer(element, params)
        );
      }}
    />
  );
};

export default Player;
