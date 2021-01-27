import React from "react";
import { Chat, Channel, ChannelHeader, Window } from "stream-chat-react";
import { MessageList, MessageInput, MessageLivestream } from "stream-chat-react";
import { MessageInputSimple, Thread } from "stream-chat-react";
import {inject, observer} from "mobx-react";
import { StreamChat } from "stream-chat";
import { GrChatOption} from "react-icons/gr";

import "stream-chat-react/dist/css/index.css";

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

  async componentDidMount() {
    let chatClient = new StreamChat("mt6wsqe77eb2");
    await chatClient.setAnonymousUser();

    let channel = chatClient.channel("livestream", "rita-ora-test7", {
      name: "Rita Ora",
    });
    this.setState({chatClient: chatClient});
    this.setState({channel: channel});
  }

  componentWillUnmount() {
    if(this.state.chatClient) {
      this.state.chatClient.disconnect();
    }
  }

  handleSubmit = () => async event => {
    let name = this.state.chatName;

    if(name != "") {
      this.setState({onChat: true});
      this.state.chatClient.disconnect();

      await this.state.chatClient.setGuestUser({ id: name, name: name });
      
      let channel = this.state.chatClient.channel("livestream", "rita-ora-test7", {
        name: "Rita Ora",
      });
      this.setState({channel2: channel});
    } 
  };

  handleNameChange(event) {
    this.setState({chatName: event.target.value});
  }

  render() {
    let chatClient = this.state.chatClient;
    let channel = this.state.channel;

    if(!this.state.onChat) {
      return (
        <Chat client={chatClient} theme={this.props.onDarkMode ? "livestream dark" : "livestream light"}>
          <Channel channel={channel} Message={MessageLivestream} LoadingIndicator={() => {return null;}}>
            <Window hideOnThread>
              <ChannelHeader live />
              <MessageList dateSeparator={() => {return null;}}/>
              {this.state.onChat ? 
                <MessageInput Input={MessageInputSimple} focus={false} /> :
                <div className={this.props.onDarkMode ? "stream-chat-signup-dark" : "stream-chat-signup-light" } >
                  <div className="stream-chat-form" >
                    <input
                      onFocus={() => this.setState({name_placeholder: ""})}
                      onBlur={() => this.setState({name_placeholder: "Name"})}
                      placeholder={this.state.name_placeholder}
                      value={this.state.chatName}
                      onChange={this.handleNameChange} 
                    />
                  </div>
                  <button className="enter-chat-button" role="link" onClick={this.handleSubmit()}>
                    <GrChatOption style={{ height: "25px", width: "25px",marginRight: "10px"  }} /> Join Chat
                  </button>
                </div> 
              }
            </Window>
            <Thread fullWidth autoFocus={false} />
          </Channel>
        </Chat>
      );
    } else {
      
      if(!this.state.channel2) {
        return null;
      }


      let channel2 = this.state.channel2;
      return (
        <Chat client={chatClient} theme={this.props.onDarkMode ? "livestream dark" : "livestream light"}>
          <Channel channel={channel2} Message={MessageLivestream} LoadingIndicator={() => {return null;}}>
            <Window hideOnThread>
              <ChannelHeader live />
              <MessageList dateSeparator={() => {return null;}}/>
              <MessageInput Input={MessageInputSimple} focus={false} /> 
            </Window>
            <Thread fullWidth autoFocus={false} />
          </Channel>
        </Chat>
      );
    }
  }
}

export default LiveChat;