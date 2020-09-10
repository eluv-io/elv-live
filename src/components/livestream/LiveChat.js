import React from "react";
import { Chat, Channel, ChannelHeader, Window } from "stream-chat-react";
import { MessageList, MessageInput, MessageLivestream } from "stream-chat-react";
import { MessageInputFlat, Thread } from "stream-chat-react";
import { StreamChat } from "stream-chat";
import artist1 from "../../static/images/livestream/artist1.png";

import "stream-chat-react/dist/css/index.css";

class LiveChat extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.chatClient = new StreamChat('dc2kwcahqj6v');
  //   this.userToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYmx1ZS1uaWdodC0yIn0.85eBZJi1Z7UbT65_Ib3PbTA8l8Utv0-Ii8Dfyd9NU_M";

  //   // this.chatClient.setBaseURL(process.env.REACT_APP_CHAT_SERVER_ENDPOINT);
  //   this.chatClient.setUser(
  //     {
  //       id: 'example-user',
  //       name: "BN",
  //       image: "https://getstream.io/random_png/?id=blue-night-2&name=Blue+night"
  //     },
  //     this.userToken,
  //   );
  //   this.channel = this.chatClient.channel('livestream', "eluvio", {
  //     image: {artist1},
  //     name: "Liam Payne: The LP Show",
  //     example: 1,
  //   });

  //   this.channel.watch();
  // }

  render() {
    const chatClient = new StreamChat("dc2kwcahqj6v");
    const userToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYmx1ZS1uaWdodC0yIn0.85eBZJi1Z7UbT65_Ib3PbTA8l8Utv0-Ii8Dfyd9NU_M";

    chatClient.setUser(
      {
        id: "blue-night-2",
        name: "John Scott",
        image: "https://getstream.io/random_png/?id=blue-night-2&name=Blue+night"
      },
      userToken,
    );

    const channel = chatClient.channel("livestream", "eluvio", {
      image: {artist1},
      name: "Liam Payne: The LP Show",
    });


    return (
      <Chat client={chatClient} theme={"livestream dark"}>
        <Channel channel={channel} Message={MessageLivestream}>
          <Window hideOnThread>
            <ChannelHeader live />
            <MessageList />
            <MessageInput Input={MessageInputFlat} focus />
          </Window>
          <Thread fullWidth />
        </Channel>
      </Chat>
    );
  }
}

export default LiveChat;