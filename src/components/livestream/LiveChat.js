import React from 'react';
import { Chat, Channel, ChannelHeader, Window } from 'stream-chat-react';
import { MessageList, MessageInput, MessageLivestream } from 'stream-chat-react';
import { MessageInputSmall, Thread } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';

import 'stream-chat-react/dist/css/index.css';

class LiveChat extends React.Component {
  render() {
    const chatClient = new StreamChat('dc2kwcahqj6v');
    const userToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYmx1ZS1uaWdodC0yIn0.85eBZJi1Z7UbT65_Ib3PbTA8l8Utv0-Ii8Dfyd9NU_M';

    chatClient.setUser(
      {
        id: 'blue-night-2',
        name: 'Blue night',
        image: 'https://getstream.io/random_png/?id=blue-night-2&name=Blue+night'
      },
      userToken,
    );

    const channel = chatClient.channel('livestream', 'spacex', {
      image: 'https://goo.gl/Zefkbx',
      name: 'SpaceX launch discussion',
    });

    return (
      <Chat client={chatClient} theme={'livestream dark'}>
        <Channel channel={channel} Message={MessageLivestream}>
          <Window hideOnThread>
            <ChannelHeader live />
            <MessageList />
            <MessageInput Input={MessageInputSmall} focus />
          </Window>
          <Thread fullWidth />
        </Channel>
      </Chat>
    );
  }
};

export default LiveChat;