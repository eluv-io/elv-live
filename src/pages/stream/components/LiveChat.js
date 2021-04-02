import React from "react";
import {inject, observer} from "mobx-react";
import { GrChatOption } from "react-icons/gr";

import "stream-chat-react/dist/css/index.css";

import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  MessageInputSimple,
  MessageLivestream,
  Thread
} from "stream-chat-react";
import {PageLoader} from "Common/Loaders";
import {onEnterPressed} from "Utils/Misc";

@inject("siteStore")
@inject("rootStore")
@observer
class LiveChat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anonymous: true,
      chatClient: null,
      channel: null,
      chatName: "",
      loading: true
    };
  }

  async InitializeChannel(userName, createOnly=false) {
    const channelTitle = `${this.props.siteStore.streamPageInfo.header} - ${this.props.siteStore.streamPageInfo.subheader}`;

    if(!createOnly) {
      this.setState({channel: undefined});
    }

    await this.state.chatClient.disconnect();

    if(userName) {
      await this.state.chatClient.setGuestUser({
        id: userName.replace(/[^a-zA-Z0-9]/g, ""),
        name: userName
      });
    } else {
      await this.state.chatClient.connectAnonymousUser();

      const channelExists = (await this.state.chatClient.queryChannels({id: this.props.siteStore.chatChannel})).length > 0;

      if(!channelExists) {
        await this.InitializeChannel("channelCreator", true);

        await this.state.chatClient.disconnect();
        await this.state.chatClient.connectAnonymousUser();
      }
    }

    try {
      const channel = await this.state.chatClient.channel(
        "livestream",
        this.props.siteStore.chatChannel,
        { name: channelTitle }
      );

      if(createOnly) {
        await channel.create();
        return;
      }

      this.setState({
        channel,
        anonymous: !userName
      });
    } catch(error) {
      console.error(error);
    }
  }

  componentDidMount() {
    this.setState({
      chatClient: new StreamChat("yyn7chg5xjwq")
    }, async () => {
      await this.InitializeChannel();
      this.setState({loading: false});
    });
  }

  componentWillUnmount() {
    if(this.state.chatClient) {
      this.state.chatClient.disconnect();
    }
  }

  async JoinChat() {
    if(!this.state.chatName) { return; }

    this.InitializeChannel(this.state.chatName);
  }

  Input() {
    if(this.state.anonymous) {
      // Name input
      return (
        <div className={this.props.siteStore.darkMode ? "stream-chat-signup-dark" : "stream-chat-signup-light"}>
          <div className="stream-chat-form">
            <input
              placeholder="Enter your name to chat"
              value={this.state.chatName}
              onKeyPress={onEnterPressed(() => this.JoinChat())}
              onChange={event => this.setState({chatName: event.target.value})}
            />
          </div>
          <button className="enter-chat-button" role="link" onClick={() => this.JoinChat()}>
            <GrChatOption style={{height: "25px", width: "25px", marginRight: "10px"}}/> Join Chat
          </button>
        </div>
      );
    }

    // Chat input
    return <MessageInput Input={MessageInputSimple} focus={false}/>;
  }

  render() {
    if(!this.state.channel) {
      return <PageLoader />;
    }

    return (
      <Chat client={this.state.chatClient} theme={this.props.siteStore.darkMode ? "livestream dark" : "livestream light"}>
        <Channel channel={this.state.channel} Message={MessageLivestream} loadingIndicator={() => null}>
          <Window hideOnThread>
            <ChannelHeader live/>
            <MessageList dateSeparator={() => { return null; }}/>
            { this.Input() }
          </Window>
          <Thread fullWidth autoFocus={false}/>
        </Channel>
      </Chat>
    );
  }
}

export default LiveChat;
