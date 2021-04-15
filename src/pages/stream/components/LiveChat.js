import React from "react";
import {inject, observer} from "mobx-react";

import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  MessageInput,
  MessageInputSimple,
  VirtualizedMessageList
} from "stream-chat-react";
import {Loader} from "Common/Loaders";
import {IsIOSSafari, onEnterPressed} from "Utils/Misc";

@inject("siteStore")
@inject("rootStore")
@observer
class LiveChat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anonymous: true,
      anonymousChatClient: undefined,
      chatClient: undefined,
      channel: undefined,
      chatName: "",
      loading: true
    };
  }

  async InitializeChannel(userName) {
    try {
      this.setState({loading: true});

      if(userName) {
        await this.state.chatClient.setGuestUser({
          id: userName.replace(/[^a-zA-Z0-9]/g, ""),
          name: userName
        });

        const channel = await this.state.chatClient.channel("livestream", this.props.siteStore.chatChannel);

        this.setState({channel: undefined}, () => this.setState({channel, anonymous: false}));
        await this.state.anonymousChatClient.disconnectUser();
      } else {
        await this.state.anonymousChatClient.connectAnonymousUser();

        const channelExists = (await this.state.anonymousChatClient.queryChannels({cid: `livestream:${this.props.siteStore.chatChannel}`})).length > 0;

        if(!channelExists) {
          await this.state.chatClient.setGuestUser({id: "channelCreator", name: "channelCreator"});

          const channel = await this.state.chatClient.channel("livestream", this.props.siteStore.chatChannel);
          await channel.create();

          await this.state.chatClient.disconnectUser();
        }

        const channel = await this.state.anonymousChatClient.channel("livestream", this.props.siteStore.chatChannel);

        this.setState({channel, anonymous: true});
      }
    } finally {
      this.setState({loading: false});
    }
  }

  componentDidMount() {
    this.setState({
      anonymousChatClient: new StreamChat("s2ypn9y5jvzv"),
      chatClient: new StreamChat("s2ypn9y5jvzv")
    }, async () => {
      await this.InitializeChannel();
      this.setState({loading: false});
    });
  }

  componentWillUnmount() {
    if(this.state.chatClient) {
      this.state.chatClient.disconnectUser();
    }

    if(this.state.anonymousChatClient) {
      this.state.anonymousChatClient.disconnectUser();
    }
  }

  async JoinChat() {
    if(!this.state.chatName) { return; }

    this.InitializeChannel(this.state.chatName);
  }

  Input() {
    if(this.state.loading) {
      return <Loader />;
    }

    if(this.state.anonymous) {
      // Name input
      return (
        <form className="chat__input-container chat__form" onSubmit={event => event.preventDefault()}>
          <input
            className="chat__form__input"
            placeholder="Enter your name to chat"
            value={this.state.chatName}
            onKeyPress={onEnterPressed(() => this.JoinChat())}
            onChange={event => this.setState({chatName: event.target.value})}
          />
          <button className="chat__form__submit" onClick={() => this.JoinChat()}>Join Chat</button>
        </form>
      );
    }

    // Chat input
    return <MessageInput Input={MessageInputSimple} focus={false}/>;
  }

  render() {
    if(!this.state.channel) {
      return null;
    }

    return (
      <div className={`chat-container ${IsIOSSafari() ? "ios-safari" : ""}`}>
        <Chat client={this.state.anonymous ? this.state.anonymousChatClient : this.state.chatClient} theme="livestream dark">
          <Channel channel={this.state.channel} LoadingIndicator={() => null}>
            <VirtualizedMessageList />
            { this.Input() }
          </Channel>
        </Chat>
      </div>
    );
  }
}

export default LiveChat;
