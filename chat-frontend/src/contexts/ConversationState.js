import React, { createContext, useReducer, useEffect } from 'react';
import AppReducer from './AppReducer';
import request from 'request';
import { history } from '../configs/browserHistory';

const url = {
  LOCAL: 'http://localhost:5000' // ✅ Local backend URL
};

const initialState = {
  conversations: [],
  ready: false,
  sessionValid: true,
  refresh: false,
  newMessage: { cid: '', message: {} },
  isEmojiShow: false,
  inputEvent: {}
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  useEffect(() => {
    (async function fetchData() {
      const options = {
        uri: `${url.LOCAL}/api/conversation-list?id=${localStorage.userId}`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.chattoken}`
        }
      };

      request.get(options, function (err, httpResponse, body) {
        if (err || httpResponse.statusCode !== 200) {
          console.error("❌ Conversation fetch failed:", err || body);
          localStorage.removeItem('chattoken');
          localStorage.removeItem('username');
          localStorage.removeItem('userId');
          history.replace('/');
        } else {
          const obj = JSON.parse(body);
          console.log("✅ Conversation API Response:", obj);

          // ✅ Make sure obj.list is an array before dispatching
          if (Array.isArray(obj.list)) {
            updateConversations(obj.list);
          } else {
            console.error("❌ obj.list is not an array:", obj.list);
          }
        }
      });
    })();
  }, []);

  const updateConversations = cs => {
    dispatch({ type: 'update', conversations: cs });
  };

  const updateConversation = cs => {
    dispatch({ type: 'update-single', conversation: cs });
  };

  const addConversation = cs => {
    dispatch({ type: 'add', conversation: cs });
  };

  const updateRefresh = () => {
    dispatch({ type: 'refresh' });
  };

  const getConversation = cid => {
    return state.conversations.find(c => c._id === cid) || 0;
  };

  const addNewMessage = ({ conversation, message }) => {
    dispatch({ type: 'new-message', conversation, message });
  };

  const toggleEmoji = status => {
    dispatch({ type: 'toggle-emoji', status });
  };

  const updateInputEvent = inputEvent => {
    dispatch({ type: 'update-input', inputEvent });
  };

  return (
    <GlobalContext.Provider
      value={{
        conversations: state.conversations,
        newMessage: state.newMessage,
        isEmojiShow: state.isEmojiShow,
        isReady: state.ready,
        refresh: state.refresh,
        inputEvent: state.inputEvent,
        updateRefresh: updateRefresh,
        updateConversations: updateConversations,
        updateConversation: updateConversation,
        getConversation: getConversation,
        addConversation: addConversation,
        addNewMessage: addNewMessage,
        toggleEmoji: toggleEmoji,
        updateInputEvent: updateInputEvent
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
