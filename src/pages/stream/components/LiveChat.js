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
import {Counter, IsIOSSafari, onEnterPressed} from "Utils/Misc";

import ChatBackground from "Assets/images/ChatBackground.jpg";

import ChatSend from "Icons/chat send.svg";
import ImageIcon from "Common/ImageIcon";
import PopoutIcon from "Icons/external-link-arrow";
import HypeIcon from "Icons/heart.svg";

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
      loading: true,

      hypeCount: 0,
      lastHypeTotal: 0,
      hypeTotals: [],
      hypeMessageId: undefined,
      chatEvents: [],
      lastViewerUpdate: Date.now()
    };

    this.DisconnectChatClients = this.DisconnectChatClients.bind(this);
    this.Hype = this.Hype.bind(this);
  }

  SetViewers(count) {
    this.props.siteStore.UpdateViewers(count);
    this.setState({lastViewerUpdate: Date.now()});
  }

  async HypeMessageId() {
    if(this.state.hypeMessageId) { return this.state.hypeMessageId; }

    try {
      // See if the hype message is visible
      let messageInfo = this.state.channel.state.messages.find(message => message.hypeMessage);

      if(!messageInfo) {
        // Search for first message separately in case it fails
        messageInfo = (await this.state.channel.search({hypeMessage: true})).results[0].message;
      }

      this.setState({
        hypeMessageId: messageInfo.id,
        lastHypeTotal: messageInfo.reaction_scores.clap
      });

      return messageInfo.id;
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error("Failed to retrieve hype message:");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  async InitializeChannel(userName) {
    try {
      this.setState({loading: true});

      const chatChannel = this.props.siteStore.ChatChannel();

      let channel;
      if(userName) {
        await this.state.chatClient.setGuestUser({
          id: userName.replace(/[^a-zA-Z0-9]/g, ""),
          name: userName
        });

        if(this.state.channel) { this.state.channel.stopWatching(); }

        channel = await this.state.chatClient.channel("livestream", chatChannel);

        this.setState({channel: undefined}, () => this.setState({channel, hypeCount: 0, anonymous: false}));
        await this.state.anonymousChatClient.disconnectUser();

        window.channel = channel;

        localStorage.setItem("chat-name", userName);
      } else {
        await this.state.anonymousChatClient.setGuestUser({id: `${this.props.siteStore.siteSlug}-guest-user`});

        const channelExists = (await this.state.anonymousChatClient.queryChannels({cid: `livestream:${chatChannel}`})).length > 0;

        if(!channelExists) {
          await this.state.chatClient.setGuestUser({id: `${this.props.siteStore.siteSlug}-channel-creator`, name: "Eluvio Live"});

          const channel = await this.state.chatClient.channel("livestream", chatChannel);
          await channel.create();

          await channel.sendMessage({
            text: `Welcome to the ${this.props.siteStore.eventInfo.event_header || this.props.siteStore.eventInfo.event_title} stream on Eluvio Live!`,
            silent: true,
            hypeMessage: true
          });

          await this.state.chatClient.disconnectUser();
        }

        channel = await this.state.anonymousChatClient.channel("livestream", chatChannel);

        window.channel = channel;

        this.setState({channel, anonymous: true});
      }

      channel.watch();

      this.SetViewers(channel.state.watcher_count || 0);

      // Unsub from any previous chat events
      if(this.state.chatEvents.length > 0) {
        await Promise.all(
          this.state.chatEvents.map(async ({unsubscribe}) => {
            try {
              await unsubscribe();
            } catch(error) {
              // eslint-disable-next-line no-console
              console.error("Failed to unsubscribe from chat event");
              // eslint-disable-next-line no-console
              console.error(error);
            }
          })
        );

        this.setState({chatEvents: []});
      }

      const updatedReaction = await channel.on("reaction.updated", event => this.HypeEvent(event));
      const newReaction = await channel.on("reaction.new", event => this.HypeEvent(event));
      const messageReaction = await channel.on("message.new", event => this.SetViewers(event.watcher_count || 0));

      this.setState({
        lastViewerUpdate: Date.now(),
        chatEvents: [
          newReaction,
          updatedReaction,
          messageReaction
        ]
      });

      // Determine hype message for reaction count
      this.HypeMessageId();
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
    if(!this.props.streamPage) {
      document.body.style.overflow = "hidden";
    }

    window.addEventListener("beforeunload", this.DisconnectChatClients);

    this.setState({
      anonymousChatClient: new StreamChat("gescjvbmby9w"),
      chatClient: new StreamChat("gescjvbmby9w")
    }, async () => {
      window.anonClient = this.state.anonymousChatClient;
      window.chatClient = this.state.chatClient;

      // Opened in new window - use current name
      if(!this.props.streamPage && localStorage.getItem("chat-name")) {
        this.setState({chatName: localStorage.getItem("chat-name")}, () => this.JoinChat());
      } else {
        await this.InitializeChannel();
      }

      this.setState({loading: false});
    });

    this.watcherInterval = setInterval(async () => this.UpdateInterval(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.watcherInterval);

    if(this.state.channel) { this.state.channel.stopWatching(); }

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

  HypeLevel() {
    let diff = 0;
    if(this.state.hypeTotals.length > 2) {
      const min = Math.min(...this.state.hypeTotals.map(({count}) => count));
      const max = Math.max(...this.state.hypeTotals.map(({count}) => count));

      diff = max - min;
    }

    return {
      bgOpacity: 1 - (Math.min(diff, 100) / 100) * 0.5
    };
  }

  async UpdateInterval() {
    // Prune hype totals
    const now = Date.now();
    this.setState({
      hypeTotals: this.state.hypeTotals.filter(({checkedAt}) => now - checkedAt < 60000)
    });

    // Check channel for viewer count. Only do an explicit query if no other events have provided this info recently
    if(Date.now() - this.state.lastViewerUpdate > 60000) {
      const client = this.state.anonymous ? this.state.anonymousChatClient : this.state.chatClient;
      const channel = (await client.queryChannels({ cid: this.state.channel.cid }, {}, { watch: false }))[0];

      this.SetViewers(channel.state.watcher_count || 0);
    }
  }

  HypeEvent(event) {
    const hypeCount = Math.max(this.state.hypeCount, event.message.reaction_scores.clap);
    const now = Date.now();
    const hypeTotals = [ ...this.state.hypeTotals, { count: hypeCount, checkedAt: now } ]
      .filter(({checkedAt}) => now - checkedAt < 60000);

    this.setState({
      lastHypeTotal: hypeCount,
      hypeTotals
    });
  }

  async Hype(event) {
    const target = event.target.closest("button");
    target.classList.remove("hype-button-animation");
    void target.offsetWidth; // trigger reflow
    target.classList.add("hype-button-animation");

    window.target = target;

    // Limit to one update per second
    clearTimeout(this.hypeTimeout);
    this.setState({
      hypeCount: this.state.hypeCount + 1
    }, () => {
      const Hype = async () => {
        this.lastHype = Date.now();
        await this.state.channel.sendReaction(await this.HypeMessageId(), {type: "clap", score: this.state.hypeCount});
      };

      if(Date.now() - (this.lastHype || 0) < 1000) {
        this.hypeTimeout = setTimeout(Hype, 1000);
      } else {
        Hype();
      }
    });
  }

  render() {
    if(!this.state.channel || this.props.hidden) {
      return null;
    }

    const bgOpacity = this.HypeLevel().bgOpacity;

    return (
      <div className={`stream-page__chat-panel ${this.props.streamPage ? "stream-page__chat-panel-stream-page" : "stream-page__chat-panel-full-screen"}`}>
        <div className="stream-page__chat-panel__header">
          <div className="stream-page__chat-panel__header-top">
            <h2 className="stream-page__chat-panel__header-text">{ this.props.siteStore.streamPageInfo.header }</h2>
            {
              this.props.streamPage ?
                <button
                  title="Open chat in new window"
                  onClick={() => {
                    this.props.Hide();

                    window.open(
                      window.location.pathname.replace(/\/stream$/, "/chat"),
                      "_blank",
                      `height=${screen.height},width=350,left=${screen.width - 350}`
                    );
                  }}
                  className="stream-page__chat-panel__header__popout-button"
                >
                  <ImageIcon icon={PopoutIcon}/>
                </button> : null
            }
          </div>
          <div className="stream-page__chat-panel__header-stats">
            <div className="stream-page__chat-panel__hype">
              <button
                title="LUV"
                onClick={this.Hype}
                className="stream-page__chat-panel__hype-button"
              >
                <ImageIcon icon={HypeIcon} />
              </button>
              <Counter to={this.state.lastHypeTotal} duration={1500} />
            </div>
          </div>
        </div>
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
              <div className="str-chat__background">
                <div
                  style={{opacity: bgOpacity, boxShadow: `inset 0 0 10px rgba(255, 0, 230, ${(1 - bgOpacity) * 2})`}}
                  className="str-chat__background__gradient"
                />
                <img alt="Chat Background" src={ChatBackground} className="str-chat__background-image" />
              </div>
              <VirtualizedMessageList />
              { this.Input() }
              { this.state.formActive ? this.ChatNameForm() : null }
            </Channel>
          </Chat>
        </div>
      </div>
    );
  }
}

export default inject("siteStore")(inject("rootStore")(observer(LiveChat)));
