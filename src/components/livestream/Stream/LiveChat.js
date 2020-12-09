import React from "react";
import { Chat, Channel, ChannelHeader, Window } from "stream-chat-react";
import { MessageList, MessageInput, MessageLivestream } from "stream-chat-react";
import { MessageInputSmall, MessageInputLarge, MessageInputFlat,MessageInputSimple,Thread } from "stream-chat-react";
import {inject, observer} from "mobx-react";
import { StreamChat } from "stream-chat";
import AsyncComponent from "../../support/AsyncComponent";

import "stream-chat-react/dist/css/index.css";


// a very minimalistic message component
class MyMessageComponent extends React.Component {
  render() {
    return <div><b>{this.props.message.user.name}</b> {this.props.message.text}</div>;
  }
}

@inject("siteStore")
@inject("rootStore")
@observer
class LiveChat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chatClient: null,
      channel: null
    };
  }

  componentWillUnmount() {
    if (this.state.chatClient) {
      this.state.chatClient.disconnect();
    }
  }

  render() {
    const noDate = () => {
        return (
         null);
        }
    return (
      <AsyncComponent
        Load={async () => {
            let name = this.props.rootStore.name;
            let chatClient = new StreamChat('xpkg6xgvwrnn');
            const token = chatClient.devToken(name);
            chatClient.setUser({ id: name, name: name,
              image: `https://getstream.io/random_svg/?name=${name}` }, token);

            let channel = chatClient.channel("livestream", "rita-ora-test6", {
              name: "Rita Ora Chat",
            });
            this.setState({chatClient: chatClient});
            this.setState({channel: channel});
        }}
        render={() => {
          if (!this.state.chatClient || !this.state.channel) {
            return null;
          } else {
            return (
              // <Chat client={this.state.chatClient} theme={"livestream light"} className="stream-container__tabs--chat">
              <Chat client={this.state.chatClient} theme={"livestream light"}>
                <Channel channel={this.state.channel} Message={MessageLivestream}>
                  <Window hideOnThread>
                    <ChannelHeader live />
                    <MessageList dateSeparator={noDate}/>
                    <MessageInput Input={MessageInputSimple} focus={false} />
                  </Window>
                  <Thread fullWidth autoFocus={false} />
                </Channel>
              </Chat>
            );
          }
        }
        }
      />
    );
  }
}

export default LiveChat;