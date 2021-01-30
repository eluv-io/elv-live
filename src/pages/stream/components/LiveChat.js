import React from "react";
import {inject, observer} from "mobx-react";
import { GrChatOption} from "react-icons/gr";

//import "stream-chat-react/dist/css/index.css";

let StreamChatImports, StreamChatReactImports;

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
    if(!StreamChatImports) {
      StreamChatImports = await import("stream-chat");
    }

    if(!StreamChatReactImports) {
      StreamChatReactImports = await import ("stream-chat-react");
    }

    let chatClient = new StreamChatImports.StreamChat("mt6wsqe77eb2");
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

  handleSubmit = () => async () => {
    let name = this.state.chatName;

    if(name !== "") {
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
    if(!StreamChatImports || !StreamChatReactImports) {
      return null;
    }

    let chatClient = this.state.chatClient;
    let channel = this.state.channel;

    if(!this.state.onChat) {
      return (
        <StreamChatReactImports.Chat client={chatClient} theme={this.props.onDarkMode ? "livestream dark" : "livestream light"}>
          <StreamChatReactImports.Channel channel={channel} Message={StreamChatReactImports.MessageLivestream} LoadingIndicator={() => {return null;}}>
            <StreamChatReactImports.Window hideOnThread>
              <StreamChatReactImports.ChannelHeader live />
              <StreamChatReactImports.MessageList dateSeparator={() => {return null;}}/>
              {this.state.onChat ?
                <StreamChatReactImports.MessageInput Input={StreamChatReactImports.MessageInputSimple} focus={false} /> :
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
            </StreamChatReactImports.Window>
            <StreamChatReactImports.Thread fullWidth autoFocus={false} />
          </StreamChatReactImports.Channel>
        </StreamChatReactImports.Chat>
      );
    } else {

      if(!this.state.channel2) {
        return null;
      }


      let channel2 = this.state.channel2;
      return (
        <StreamChatReactImports.Chat client={chatClient} theme={this.props.onDarkMode ? "livestream dark" : "livestream light"}>
          <StreamChatReactImports.Channel channel={channel2} Message={StreamChatReactImports.MessageLivestream} LoadingIndicator={() => {return null;}}>
            <StreamChatReactImports.Window hideOnThread>
              <StreamChatReactImports.ChannelHeader live />
              <StreamChatReactImports.MessageList dateSeparator={() => {return null;}}/>
              <StreamChatReactImports.MessageInput Input={StreamChatReactImports.MessageInputSimple} focus={false} />
            </StreamChatReactImports.Window>
            <StreamChatReactImports.Thread fullWidth autoFocus={false} />
          </StreamChatReactImports.Channel>
        </StreamChatReactImports.Chat>
      );
    }
  }
}

export default LiveChat;
