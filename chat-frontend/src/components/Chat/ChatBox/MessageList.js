import React, { useContext, useEffect, useState } from 'react';
import SingleMessage from './SingleMessage';
import { animateScroll } from 'react-scroll';
import { GlobalContext } from '../../../contexts/ConversationState';
import socket from '../../../configs/socket';
import TypingIndicator from './TypingIndicator';
import request from 'request';

const MessageList = ({ conversation, name }) => {
  const { isReady, newMessage } = useContext(GlobalContext);

  const cvs = conversation;
  const userId = localStorage.userId;
  const [messages, setMessages] = useState([]);
  const [otherTyping, setOtherTyping] = useState(false);
  const [otherName, setOtherName] = useState('');
  const [isLoading, setLoading] = useState(true);

  // Fetch messages on conversation change
  useEffect(() => {
    setLoading(true);
    setMessages([]);

    if (cvs._id) {
      const options = {
        uri: `http://localhost:5000/api/get-messages?cid=${cvs._id}`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.chattoken}`,
        },
      };

      request.get(options, function (err, httpResponse, body) {
        if (httpResponse.statusCode === 200) {
          const { messageList } = JSON.parse(body);
          setMessages(messageList);
        }
        setLoading(false);
      });
    }

    const typingHandler = ({ cid, uid, isTyping, name }) => {
      if (cid === cvs._id && uid !== userId) {
        setOtherName(name);
        setOtherTyping(isTyping);
      }
    };

    socket.on('user-typing', typingHandler);
    return () => socket.off('user-typing', typingHandler);
  }, [cvs._id]);

  // Live new messages
  useEffect(() => {
    if (cvs._id && newMessage?.cid === cvs._id) {
      setMessages((prev) => [...prev, newMessage.message]);
    }
  }, [newMessage, cvs._id]);

  // Live delete messages from socket
  useEffect(() => {
    socket.on('message-deleted', ({ cid, messageId }) => {
      if (cid === cvs._id) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      }
    });
    return () => socket.off('message-deleted');
  }, [cvs._id]);

  // Handle delete from UI
  const handleDelete = async (message) => {
    try {
      const res = await fetch('http://localhost:5000/api/delete-message', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.chattoken}`,
        },
        body: JSON.stringify({
          messageId: message._id,
          conversationId: cvs._id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== message._id));
      } else {
        alert(data.msg || "Failed to delete message");
      }
    } catch (err) {
      console.error("❌ Delete error:", err.message);
      alert("Server error while deleting message");
    }
  };

  // Auto scroll
  useEffect(() => {
    animateScroll.scrollToBottom({
      containerId: 'messages',
      smooth: false,
      duration: 0,
    });
  }, [messages, otherTyping, isLoading]);

  return (
    <div className='bg-white flex-grow flex flex-col overflow-y-auto' id='messages'>
      {isLoading ? (
        <div className='spinner-md flex-grow text-center text-gray-500 py-4'>Loading...</div>
      ) : (
        messages.map((el) => (
          <SingleMessage
            key={el._id || Date.now()}
            name={name}
            message={el}
            myId={userId}
            onDelete={handleDelete}
          />
        ))
      )}
      {otherTyping && <TypingIndicator name={otherName} />}
    </div>
  );
};

export default MessageList;
