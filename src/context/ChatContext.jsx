import { createContext, useContext, useState } from "react";

const ChatContext = createContext();


export const ChatProvider = ( {children} ) => {
  const [roomId, setRoomId] = useState("");
  const[userId,setUserId]=useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [connected, setConnected] = useState(false);
 
  // const[email,setemail]=useState("");

  return (
    <ChatContext.Provider
      value={{
        userId,setUserId,
        roomId,
        currentUser,
        connected,
        setRoomId,
        setCurrentUser,
        setConnected,
        
        
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => useContext(ChatContext);
export default useChatContext;