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

import ChatSend from "Assets/icons/chat send.svg";

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
      formActive: false,
      loading: true
    };

    this.DisconnectChatClients = this.DisconnectChatClients.bind(this);
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

  DisconnectChatClients() {
    if(this.state.chatClient) {
      this.state.chatClient.disconnectUser();
    }

    if(this.state.anonymousChatClient) {
      this.state.anonymousChatClient.disconnectUser();
    }
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.DisconnectChatClients);

    this.setState({
      anonymousChatClient: new StreamChat("s2ypn9y5jvzv"),
      chatClient: new StreamChat("s2ypn9y5jvzv")
    }, async () => {
      await this.InitializeChannel();
      this.setState({loading: false});
    });
  }

  componentWillUnmount() {
    this.DisconnectChatClients();

    window.removeEventListener("beforeunload", this.DisconnectChatClients);
  }

  async JoinChat() {
    if(!this.state.chatName) { return; }

    this.setState({
      chatName: "",
      formActive: false
    });

    this.InitializeChannel(this.state.chatName);
  }

  ChatNameForm() {
    return (
      <div className="chat-container__username-form-container" onClick={() => this.setState({formActive: false})}>
        <form
          className="chat-container__input-container chat-container__username-form"
          onSubmit={event => event.preventDefault()}
          onClick={event => event.stopPropagation()}
        >
          <label htmlFor="name" className="chat-container__form__label">Enter your name to chat</label>
          <input
            autoComplete="off"
            ref={element => element && element.focus()}
            name="name"
            placeholder="Name"
            className="chat-container__form__input"
            value={this.state.chatName}
            onKeyPress={onEnterPressed(() => this.JoinChat())}
            onChange={event => this.setState({chatName: event.target.value})}
          />
          <button className="chat-container__form__submit" onClick={() => this.JoinChat()}>
            Join Chat
          </button>
        </form>
      </div>
    );
  }

  Input() {
    if(this.state.loading) {
      return <Loader />;
    }

    if(this.state.anonymous) {
      // Name input
      return (
        <div className="chat-container__input-container chat-container__join-chat-container">
          <button className="chat-container__input-container__join-chat" onClick={() => this.setState({formActive: true})}>
            Join Chat
          </button>
        </div>
      );
    }

    // Chat input
    return <MessageInput Input={MessageInputSimple} additionalTextareaProps={{maxLength: 300}} focus={false}/>;
  }

  render() {
    if(!this.state.channel) {
      return null;
    }

    return (
      <div
        className={`chat-container ${IsIOSSafari() ? "ios-safari" : ""}`}
        ref={() => {
          // Replace default send button with custom one
          if(document.querySelector(".str-chat__send-button")) {
            document.querySelector(".str-chat__send-button").innerHTML = ChatSend;
          }
        }}
      >
        <Chat client={this.state.anonymous ? this.state.anonymousChatClient : this.state.chatClient} theme="livestream dark">
          <Channel channel={this.state.channel} LoadingIndicator={() => null}>
            <VirtualizedMessageList />
            { this.Input() }
            { this.state.formActive ? this.ChatNameForm() : null }
          </Channel>
        </Chat>
      </div>
    );
  }
}

export default LiveChat;
