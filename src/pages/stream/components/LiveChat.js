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

  handleNameChange(event) {
    this.setState({chatName: event.target.value});
  }

  render() {
    const noDate = () => {return null;};

    const handleSubmit = () => async event => {
      event.preventDefault();
      let name = this.state.chatName;
      if(name != "") {
        this.setState({onChat: true});
        this.state.chatClient.disconnect();

        /* eslint-disable no-unused-vars */
        const connectResponse = await this.state.chatClient.setGuestUser({ id: name, name: name });
        /* eslint-enable no-unused-vars */
        
        let channel = chatClient.channel("livestream", "rita-ora-test7", {
          name: "Rita Ora",
        });
        this.setState({channel2: channel});
      } 
    };

    let chatClient = this.state.chatClient;
    let channel = this.state.channel;

    if(!this.state.onChat) {
      return (
        // <Chat client={this.state.chatClient} theme={"livestream light"} className="stream-container__tabs--chat">
        <Chat client={chatClient} theme={this.props.onDarkMode ? "livestream dark" : "livestream light"}>
          <Channel channel={channel} Message={MessageLivestream} LoadingIndicator={noDate}>
            <Window hideOnThread>
              <ChannelHeader live />
              <MessageList dateSeparator={noDate}/>
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
                  <button className="enter-chat-button" role="link" onClick={handleSubmit()}>
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
        // <Chat client={this.state.chatClient} theme={"livestream light"} className="stream-container__tabs--chat">
        <Chat client={chatClient} theme={this.props.onDarkMode ? "livestream dark" : "livestream light"}>
          <Channel channel={channel2} Message={MessageLivestream} LoadingIndicator={noDate}>
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

export default LiveChat;