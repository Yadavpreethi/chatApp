import React, { useState, useEffect, useContext } from 'react';
import Panel from '../User/Panel';
import ListConversation from './ListConversation';
import SearchBar from './SearchBar';
import ListSearchTile from './ListSearchTile';
import { GlobalContext } from '../../../contexts/ConversationState';
import { history } from '../../../configs/browserHistory';
import socket from '../../../configs/socket';
import url from '../../../configs/url';

const ChatList = (props) => {
  const { addConversation, getConversation } = useContext(GlobalContext);
  const [isSearchFocusing, updateSearchFocusing] = useState(false);
  const [isMouseOverResult, updateMouseOverResult] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState([]);

  const myId = localStorage.getItem("userId");

  const fetchPeople = async (query = '') => {
    try {
      const res = await fetch(`${url.LOCAL}/api/search?s=${query}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.chattoken}`,
        },
      });

      if (!res.ok) return setSearchResult([]);
      const data = await res.json();

      // Optionally filter to only show online users:
      const filtered = data.result.filter(u => u._id !== myId);
      setSearchResult(filtered);
    } catch (err) {
      console.error("❌ Failed to fetch people:", err);
    }
  };

  const searchOnFocus = () => {
    updateSearchFocusing(true);
    fetchPeople('');
  };

  const searchOutFocus = (e) => {
    e.target.value = '';
    updateSearchFocusing(false);
  };

  const openConversation = async (targetUserId) => {
    try {
      const res = await fetch(
        `${url.LOCAL}/api/conversation?id1=${myId}&id2=${targetUserId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.chattoken}`,
          },
        }
      );

      if (!res.ok) return;

      const data = await res.json();
      const existing = getConversation(data.conversation._id);

      if (!existing) {
        addConversation(data.conversation);
        socket.emit("new-conversation", {
          conversation: data.conversation,
          createId: myId,
        });
      }

      updateSearchFocusing(false);
      updateMouseOverResult(false);
      history.push(`/chat/${data.conversation._id}`);
    } catch (err) {
      console.error("❌ Failed to open conversation:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetchPeople(); // initial fetch

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className='flex flex-col w-1/4 max-h-screen'>
      <Panel />

      <SearchBar
        searchOnFocus={searchOnFocus}
        searchOutFocus={searchOutFocus}
        searchPeople={fetchPeople}
      />

      {!isSearchFocusing && !isMouseOverResult ? (
        <ListConversation className='flex-grow' chatId={props.chatId} />
      ) : (
        <ListSearchTile
          className='flex-grow'
          listResults={searchResult}
          setMouse={updateMouseOverResult}
          openConversation={openConversation}
        />
      )}
    </div>
  );
};

export default ChatList;
