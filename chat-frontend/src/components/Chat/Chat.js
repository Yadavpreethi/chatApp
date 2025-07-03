import React, { useEffect } from 'react';
import { GlobalProvider } from '../../contexts/ConversationState';
import ChatList from './ChatList/ChatList';
import ChatBox from './ChatBox/ChatBox';
import socket from '../../configs/socket';

const Chat = (props) => {
  const userId = localStorage.getItem("userId");
  const chatId = props.match.params.id;

  useEffect(() => {
    document.title = 'Chat';

    // ✅ Identify user to the backend for private Socket.IO messaging
    if (userId) {
      socket.emit("identify", userId);
    }

    // ✅ Authenticated request to get conversation list
    const token = localStorage.getItem("chattoken");
    if (token) {
      fetch(`http://localhost:5000/api/conversation-list?id=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch chats");
          return res.json();
        })
        .then((data) => {
          console.log("✅ Fetched conversations:", data);
          // optional: you can add logic to update state here if needed
        })
        .catch((err) => {
          console.error("❌ Error fetching conversations:", err);
        });
    }
  }, [userId, chatId]);

  return (
    <GlobalProvider>
      <div className="h-screen flex">
        <ChatList chatId={chatId} />
        <ChatBox chatId={chatId} userId={userId} />
      </div>
    </GlobalProvider>
  );
};

export default Chat;
