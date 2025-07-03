import React, { useContext, useEffect } from 'react';
import TitleBar from './TitleBar';
import MessageList from './MessageList';
import InputPanel from './InputPanel';
import { GlobalContext } from '../../../contexts/ConversationState';
import socket from '../../../configs/socket';

const ChatBox = ({ chatId, userId }) => {
  const {
    getConversation,
    updateConversation,
    addConversation,
    addNewMessage,
    isReady,
  } = useContext(GlobalContext);

  const cvs = getConversation(chatId);
  const otherUsername =
    (userId === cvs.firstId ? cvs.secondUserName : cvs.firstUserName) || '';

  useEffect(() => {
    if (!isReady) return;

    const handler = ({ conversation, newMessage }) => {
      const existing = getConversation(conversation._id);

      // Prevent echoing message already sent by this user
      if (localStorage.username === newMessage.username) return;

      if (existing) {
        updateConversation(conversation);
        addNewMessage({ conversation, message: newMessage });
      } else {
        addConversation(conversation);
      }
    };

    socket.on('receive-message', handler);
    return () => socket.off('receive-message', handler);
  }, [isReady]);

  return (
    <div className='flex-grow flex-shrink flex max-h-full border-l-2 border-gray-200 flex-col'>
      <TitleBar name={otherUsername} className='self-start' />
      <MessageList name={otherUsername} conversation={cvs} />
      <div className='w-full px-4 mt-1'>
        <InputPanel cid={cvs._id} uid={userId} className='w-7/8 self-end' />
      </div>
    </div>
  );
};

export default ChatBox;
