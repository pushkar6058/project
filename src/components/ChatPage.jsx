import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { IoIosSend, IoMdClose, IoMdMenu } from "react-icons/io";
import { IoChatboxEllipses, IoPersonCircleSharp } from 'react-icons/io5';
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import { getMessagess, getUsers, removeUserFromRoom } from '../services/RoomService';
import { timeAgo } from '../config/helper';
import { GoFileSubmodule } from "react-icons/go";
import axios from 'axios';
import { FaArrowCircleDown, FaVideo } from 'react-icons/fa';
import { MdCall } from 'react-icons/md';
// import { Client } from "@stomp/stompjs";
import { baseURL } from '../config/AxiosHelper';
// import ModeButton from '../context/ModeButton';


function ChatPage() {
    const {
        roomId, currentUser, connected, setRoomId, setCurrentUser, setConnected, userId, setUserId
    } = useChatContext();

    const navigate = useNavigate();
    useEffect(() => {
        if (!connected) {
            navigate("/");
        }
    }, [connected, roomId, currentUser]);

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [input, setInput] = useState("");
    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);
    const [pvtClient, setpvtClient] = useState(null);
    const [privateChats, setPrivateChats] = useState([]);
    // const [privateChats, setPrivateChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [greeting, setGreeting] = useState("");




    useEffect(() => {
        const hours = new Date().getHours();
        if (hours < 12) {
            setGreeting("Good Morning ");
        } else {
            setGreeting("Good Evening ");
        }
    }, []);

 
    useEffect(()=>{
        const connectWebSocket = () => {
            ///SockJS
            const sock = new SockJS(`${baseURL}/chat`);
            const client = Stomp.over(sock);
      
            client.connect({}, () => {
              setStompClient(client);
              setpvtClient(client);

      
              toast.success("connected");
      
              client.subscribe(`/topic/room/${roomId}`, (message) => {
                // console.log(message);
                console.log("subscribed to ",roomId);
      
                const newMessage = JSON.parse(message.body);
                setMessages((prev) => [...prev, newMessage]);
                //rest of the work after success receiving the message
              }
              
          ),


        //   error in this
          client.subscribe(`/user/${userId}/private`,(payload)=>{
            const msg=JSON.parse(payload.body);
           
                privateChats((prev)=>[...prev,msg]);
            
          })


            });
            
          };

          if(connected){
            connectWebSocket();
          }
    },[roomId]);
        
    
    
          useEffect(() => {
            if (chatBoxRef.current) {
              chatBoxRef.current.scroll({
                top: chatBoxRef.current.scrollHeight,
                behavior: "smooth",
              });
            }
          }, [messages]);

          const onClickArrow=()=>{
            if (chatBoxRef.current) {
                chatBoxRef.current.scroll({
                  top: chatBoxRef.current.scrollHeight,
                  behavior: "smooth",
                });
              }
          }
        
        
        
    useEffect(() => {
        async function loadMessages() {
            try {
                const messages = await getMessagess(roomId);
                console.log(messages);
                setMessages(messages);
            } catch (error) {
                console.log(error);
            }
        }
        if (connected) {
            loadMessages();
        }
    }, []);
   

    useEffect(() => {
        async function loadUsers() {
            try {
                const response = await getUsers(roomId);
                setUsers(response);
            } catch (error) {
                console.log(error);
            }
        }
        if (connected) {
            loadUsers();
        }
    }, []);

    const sendMessage = async () => {
        if (stompClient && connected && input.trim()) {
          console.log(input);
    
          const message = {
            sender: currentUser,
            content: input,
            roomId: roomId,
          };
    
          stompClient.send(
            `/app/sendMessage/${roomId}`,
            {},
            JSON.stringify(message)
          );
          setInput("");
        }
    
        //
      };



    //   error in sending the message to private user
    const sendPrivateMessage = () => {
     
      // const pvtClient = privateChats.get(receiverId);
     
      if (pvtClient && pvtClient.connected) {

          const pvtMessage = {
              sender: userId,
              receiver: tab,
              content: input,
              // timeStamp: new Date().toISOString()
          };
  
          pvtClient.send(`/app/private-message/`,{},JSON.stringify(pvtMessage),
          );
          setPrivateChats((prev)=>[...prev,pvtMessage]);
  
         
  
          // Clear the input field
          setInput("");

        //   event.preventDefault();
      }
  };


   

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    const handleKeyDownPrivate = (event) => {
        if (event.key === "Enter") {
            sendPrivateMessage();
        }
    };

    const handleLogout = () => {
        console.log("disconnected");
        removeUser(roomId, userId);
        stompClient.disconnect();
        

        
        setConnected(false);
        setRoomId("");
        setUserId("");
        setCurrentUser("");
        navigate("/");
    };

    async function removeUser() {
        try {
            const response = await removeUserFromRoom(roomId, userId);
            setUsers(response);
        } catch (error) {
            console.log(error);
        }
    }

    const handleClickUser = (user) => {
        if (user.userId !== userId) {
            // it sets the reciever Id in the Tab
            setTab(user.userId);
            
        }
    };

    return (
        <div className="h-screen bg-neutral-900 text-gray-200">
    {/* Header */}
    <header className="bg-neutral-800 border-b border-neutral-700 fixed w-full z-50 px-6 h-20 flex justify-between items-center shadow-md">

        {/* Username */}
        <div className="flex items-center space-x-2">
            <h1 className='text-xl text-blue-400'>{greeting}, {currentUser}</h1>
            
        </div>

        {/* Room ID */}
        <div className="flex items-center space-x-2 ml-12">
            <h1 className='text-xl font-semibold text-gray-200'>Room :</h1>
            <span className=' text-gray-400 py-1.5 px-1 text-xl font-medium '>
                {roomId}
            </span>
        </div>

        

        {/* Leave Button */}
        <button
            onClick={handleLogout}
            className='bg-neutral-700 text-gray-200 px-6 py-2 rounded-md hover:bg-neutral-600 cursor-pointer duration-200 font-medium'>
            Leave
        </button>
    </header>

    {/* Chat Area */}
    <main ref={chatBoxRef} className="pt-24 pb-28 px-4 h-screen overflow-auto bg-neutral-800 ">
        {/* Sidebar */}
        <div className='flex flex-row'>
        <div className="relative w-1/6 shadow-lg ">
            <div className="fixed left-0 top-20 w-[16.66vw] h-full bg-neutral-900 rounded-sm text-gray-200 p-4 shadow-md transition-transform duration-300 transform">
                <ul className="mt-4 space-y-3 overflow-y-auto max-h-[500px] max-w-full pb-4 scroll-auto border-neutral-700 scrollbar-hide">
                    {/* ChatRoom Tab */}
                    <li
                        onClick={() => setTab("CHATROOM")}
                        className={`p-3 rounded-lg shadow text-center cursor-pointer ${tab === "CHATROOM" ? "bg-neutral-500" : ""}`}
                    >
                        ChatRoom
                    </li>

                    {/* Section Header */}
                    <h2 className="text-xl font-semibold text-green-400 pb-3">
                        Users in Room
                    </h2>

                    {/* Users List */}
                    {users.map((user, index) => (
                        <li
                            key={index}
                            onClick={() => handleClickUser(user)}
                            className={`flex items-center justify-between p-3 rounded-lg shadow space-x-3  ${user.userId === userId ? "hover:bg-neutral-900 " : "cursor-pointer "} ${tab === user.userId && userId !== user.userId ? "bg-neutral-500" : " hover:bg-neutral-700 duration-200"}`}
                        >
                            <span className="text-gray-200 font-medium mx-4 min-w-[120px] max-w-[200px] truncate">
                                {user.userId} {user.userId === userId ? <span > (You) </span> : ""}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* Messaging Area */}
        {tab === "CHATROOM" ? (
            <div className='w-5/6 m-4 '>
                <div className=' mx-auto space-y-4'>

                    <div 
                    onClick={()=>onClickArrow()}
                    className='mx-auto  cursor-pointer '>
                        <FaArrowCircleDown className='w-5 h-5 mx-auto text-gray-400' />
                       
                    </div>
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === currentUser ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-md ${msg.sender === currentUser ? "bg-neutral-700 text-white" : "bg-neutral-600 text-gray-200"} rounded-2xl px-4 py-3 shadow-md`}>
                                <div className='flex items-start space-x-3 max-w-md'>
                                    <IoPersonCircleSharp className={`${msg.sender === currentUser ? "text-white" : "text-gray-400"} min-h-5 min-w-5 mt-1`} />
                                    <div className='space-y-1'>
                                        <p className='text-xs font-medium text-gray-400'>{msg.sender}</p>
                                        <p className='break-all whitespace-pre-wrap'>{msg.content}</p>
                                        <p className='text-xs text-gray-400'>{timeAgo(msg.timeStamp)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='fixed bottom-0 mx-auto w-5/6 right-0 bg-neutral-800  border-neutral-600 border-t p-4 scroll-auto'>
                    <div className='max-w-4xl mx-auto flex items-center space-x-4'>
                        <input
                            onKeyDown={handleKeyDown}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            type="text"
                            placeholder='Type your message here...'
                            className='flex-1 bg-neutral-800 text-gray-200 border border-neutral-600 rounded-full px-6 py-3 focus:ring-2 focus:ring-blue-400 placeholder-gray-400'
                        />
                        <button
                            onClick={sendMessage}
                            className="p-3 rounded-full bg-blue-400 text-white shadow-md hover:bg-blue-600 transition duration-300">
                            <IoIosSend className="w-4 h-4" />
                        </button>
                        <button
                            className="p-3 rounded-full bg-green-400 text-white shadow-md hover:bg-green-600 transition duration-300">
                            <GoFileSubmodule className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className='w-5/6'>
                <div className=''>
                    {/* Start chat with {tab} */}




                    {/* error here */}

                    {privateChats.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === userId ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-md ${msg.sender === userId ? "bg-neutral-700 text-white" : "bg-neutral-600 text-gray-200"} rounded-2xl px-4 py-3 shadow-md`}>
                                <div className='flex items-start space-x-3 max-w-md'>
                                    <IoPersonCircleSharp className={`${msg.sender === userId ? "text-white" : "text-gray-400"} min-h-5 min-w-5 mt-1`} />
                                    <div className='space-y-1'>
                                        <p className='text-xs font-medium text-gray-400'>{msg.sender}</p>
                                        <p className='break-all whitespace-pre-wrap'>{msg.content}</p>
                                        {/* <p className='text-xs text-gray-400'>{timeAgo(msg.timeStamp)}</p> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='fixed bottom-0 mx-auto w-5/6 right-0 bg-neutral-800  border-neutral-600 border-t p-4 scroll-auto'>
                    <div className=' max-w-4xl mx-auto flex items-center space-x-4'>
                        <input
                            onKeyDown={handleKeyDownPrivate}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            type="text"
                            placeholder='Type your message here...'
                            className='flex-1 bg-neutral-800 text-gray-200 border border-neutral-600 rounded-full px-6 py-3 focus:ring-2 focus:ring-blue-400 placeholder-neutral-400'
                        />
                        <button
                            onClick={()=>sendPrivateMessage()}
                            className="p-3 rounded-full bg-blue-400 text-white shadow-md hover:bg-blue-600 transition duration-300">
                            <IoIosSend className="w-4 h-4" />
                        </button>
                        <button
                            className="p-3 rounded-full bg-green-400 text-white shadow-md hover:bg-green-600 transition duration-300">
                            <GoFileSubmodule className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        )}
        </div>
    </main>
</div>
    );
}

export default ChatPage;