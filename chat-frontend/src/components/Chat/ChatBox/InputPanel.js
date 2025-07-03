import React, { useState, useContext } from 'react';
import { GlobalContext } from '../../../contexts/ConversationState';
import socket from '../../../configs/socket';

const InputPanel = ({ cid, uid }) => {
  const [messageText, setMessageText] = useState('');
  const { updateConversation, getConversation, addNewMessage } = useContext(GlobalContext);

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    const payload = {
      cid,
      uid,
      content: messageText,
      username: localStorage.username,
    };

    try {
      const response = await fetch("http://localhost:5000/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.chattoken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const { newMessage } = await response.json();
      const conversation = getConversation(cid);

      // Emit message via socket
      socket.emit("send-message", { newMessage, conversation });

      // Update local conversation and chat immediately
      updateConversation({
        ...conversation,
        lastMessage: newMessage.content,
        lastSender: newMessage.username,
      });

      addNewMessage({ conversation, message: newMessage }); // ✅ immediately show in chatbox

      setMessageText('');
    } catch (err) {
      console.error("❌ Error sending message:", err.message);
      alert("Failed to send message");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="flex items-center space-x-2 py-2">
      <input
        type="text"
        placeholder="Type a message"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-grow border rounded px-4 py-2"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
};

export default InputPanel;
