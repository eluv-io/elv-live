import React from "react";
import { Chat, Channel, ChannelHeader, Window } from "stream-chat-react";
import { MessageList, MessageInput, MessageLivestream } from "stream-chat-react";
import { MessageInputFlat, Thread } from "stream-chat-react";
import { StreamChat } from "stream-chat";
import artist1 from "../../static/images/livestream/artist1.png";
import {inject, observer} from "mobx-react";

import "stream-chat-react/dist/css/index.css";

@inject("siteStore")
@inject("rootStore")
@observer
class LiveChat extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.chatClient = new StreamChat('dc2kwcahqj6v');
  //   this.username = this.props.rootStore.email;
    
  //   // async () => {
  //   //   this.userToken = await this.chatClient.devToken(this.username);
  //   // };
  //   console.log(this.chatClient.devToken(this.username));
    
  //   this.chatClient.setUser(
  //     {
  //       id: this.username,
  //       name: this.username,
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
   const client = this.props.rootStore.chatClient;
   const user = this.props.rootStore.chatID;

   const username = this.props.rootStore.email;

   client.setUser(
    {
      id: username,
      name: username,
      // image: "https://getstream.io/random_png/?id=blue-night-2&name=Blue+night"
    },
    user,
  );

    const channel = client.channel("livestream", "eluvio", {
      image: {artist1},
      name: "Liam Payne: The LP Show",
    });


    return (
      <Chat client={client} theme={"livestream dark"}>
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