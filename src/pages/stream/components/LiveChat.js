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

@inject("siteStore")
@inject("rootStore")
@observer
class LiveChat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      onChat: false,
      chatClient: null,
      channel: null,
      channel2: null,
      chatName: "",
      name_placeholder: "Name",
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async InitializeChannel(user={id: "channelcreator", name: "channel creator"}) {
    this.setState({channel: null});

    const channelName = `${this.props.siteStore.streamPageInfo.header} - ${this.props.siteStore.streamPageInfo.subheader}`;

    await this.state.chatClient.disconnect();
    await this.state.chatClient.setGuestUser(user);
    const channel = await this.state.chatClient.channel(
      "livestream",
      channelName.replace(/[^a-zA-Z0-9]/g, ""),
      { name: channelName }
    );

    this.setState({channel});
  }

  async componentDidMount() {
    this.setState({
      chatClient: new StreamChat("yyn7chg5xjwq")
    }, () => this.InitializeChannel());
  }

  componentWillUnmount() {
    if(this.state.chatClient) {
      this.state.chatClient.disconnect();
    }
  }

  async handleSubmit() {
    if(!this.state.chatName) { return; }

    this.InitializeChannel({id: this.state.chatName, name: this.state.chatName});

    this.setState({onChat: true});
  }

  handleNameChange(event) {
    this.setState({chatName: event.target.value});
  }

  render() {
    let chatClient = this.state.chatClient;
    let channel = this.state.channel;

    if(!this.state.channel) {
      return null;
    }

    return (
      <Chat client={chatClient} theme={this.props.onDarkMode ? "livestream dark" : "livestream light"}>
        <Channel channel={channel} Message={MessageLivestream} LoadingIndicator={() => { return null; }}>
          <Window hideOnThread>
            <ChannelHeader live/>
            <MessageList dateSeparator={() => { return null; }}/>
            {
              this.state.onChat ?
                <MessageInput Input={MessageInputSimple} focus={false}/> :
                <div className={this.props.onDarkMode ? "stream-chat-signup-dark" : "stream-chat-signup-light"}>
                  <div className="stream-chat-form">
                    <input
                      onFocus={() => this.setState({name_placeholder: ""})}
                      onBlur={() => this.setState({name_placeholder: "Name"})}
                      placeholder={this.state.name_placeholder}
                      value={this.state.chatName}
                      onChange={this.handleNameChange}
                    />
                  </div>
                  <button className="enter-chat-button" role="link" onClick={() => this.handleSubmit()}>
                    <GrChatOption style={{height: "25px", width: "25px", marginRight: "10px"}}/> Join Chat
                  </button>
                </div>
            }
          </Window>
          <Thread fullWidth autoFocus={false}/>
        </Channel>
      </Chat>
    );
  }
}

export default LiveChat;
