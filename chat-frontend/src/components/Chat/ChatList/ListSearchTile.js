import React from "react";

const ListSearchTile = ({ className, listResults, setMouse, openConversation }) => {
  return (
    <div
      className={`overflow-y-auto ${className}`}
      onMouseEnter={() => setMouse(true)}
      onMouseLeave={() => setMouse(false)}
    >
      {listResults.length === 0 ? (
        <p className="p-4 text-center text-gray-500">No users found</p>
      ) : (
        listResults.map((user) => (
          <div
            key={user._id}
            onClick={() => openConversation(user._id)}
            className="p-4 border-b cursor-pointer hover:bg-gray-100"
          >
            {user.name}
          </div>
        ))
      )}
    </div>
  );
};

export default ListSearchTile;
