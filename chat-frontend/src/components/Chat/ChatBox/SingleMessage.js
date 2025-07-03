import React, { useState } from 'react';
import getAvatar from '../../../configs/getAvatar';

const SingleMessage = ({ message, myId, name, onDelete }) => {
  const isMyMessage = message.uid === myId; // ✅ FIXED: check with uid
  const [isHovering, setHovering] = useState(false);

  return isMyMessage ? (
    <div
      className="mx-3 mt-4 flex self-end relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {isHovering && (
        <button
          onClick={() => {
            if (window.confirm("Delete this message?")) {
              onDelete(message);
            }
          }}
          className="absolute -left-6 top-1 text-sm text-red-500 hover:text-red-700"
        >
          ❌
        </button>
      )}
      <div className="py-2 px-4 bg-gray-900 rounded-xl">
        <p className="text-white max-w-xs break-words">{message.content}</p>
      </div>
    </div>
  ) : (
    <div className="flex mx-3 mt-4 max-w-xs relative">
      <img
        src={getAvatar(name)}
        alt="avatar"
        className="h-8 w-8 self-end mr-2"
      />
      <div className="py-2 px-4 bg-gray-300 rounded-xl">
        <p className="text-black max-w-xs break-words">{message.content}</p>
      </div>
    </div>
  );
};

export default SingleMessage;
