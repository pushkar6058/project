import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast';
import {  createRoomApi, joinChatApi, sendUsers, } from '../services/RoomService';
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';
// import ModeButton from '../context/ModeButton';
// import useTheme from '../context/ThemeContext';
// import { FaMoon, FaSun } from 'react-icons/fa';


// import { emailContext } from './Login';

function JoinCreateChat() {


 
  // const {formData}=useContext(useChatContext);

  

  const [detail,setDetail]=useState({
    roomId:"",
    userName:"",
    userId:"" 
   });


  const { roomId,userId,setUserId,userName,setRoomId,setCurrentUser,setConnected}=useChatContext();


  const navigate=useNavigate();

  function handleFormInputChange(event){
      setDetail({
        ...detail,
        [event.target.name]:event.target.value,
      });
  }

  
  function validateForm(){
    if(detail.roomId==="" || detail.userName==="" || detail.userId===""){
      toast.error("Please Fill the following details...")
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      //join chat

      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("joined..");
        setCurrentUser(detail.userName);
        setUserId(detail.userId);
        setRoomId(detail.roomId);
        setConnected(true);
        await handleAddUser();
        navigate("/chat");
        console.log("user joined");
              } 
      catch (error) {
        if (error.status == 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in joining room");
        }
        console.log(error);
      }
    }
  }

  async function createRoom(){

    if(validateForm()){
      // create room
      console.log(detail);
      // we can call api to create room in the backend 
      try {
        const response=await createRoomApi(detail.roomId);
        // console.log(response)
        toast.success("Room created successfully!!")
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setUserId(response.userId);
        setConnected(true);
        await handleAddUser();
        navigate("/chat");
        console.log("room created");
        // we have to redirect this to chats
      } catch (error) {
        if(error.status==400){
          toast.error("Room already exists");
        }
        else{
         toast.error(error);
         console.log(error);
        } 
      }
    }
  }

  
  const handleAddUser = async () => {
    try {
        await sendUsers(detail.roomId, detail.userId,detail.userName );
        toast.success("User Added");
        
    } catch (error) {
        console.log("Failed to add user: " + error.response?.data);
    }
};

// Fetch users in a room






  return (
    <div className="min-h-screen bg-neutral-900 text-gray-200">
  {/* Header Section */}
  <header className="w-full px-6 h-20 flex justify-center items-center shadow-md bg-neutral-800">
    <h1 className="text-4xl font-bold text-gray-200">
      Chat Application
    </h1>
  </header>

  {/* Main Content */}
  <div className="min-h-[80vh] flex items-center justify-center px-4">
    <div className="relative w-full max-w-md bg-neutral-800 rounded-2xl shadow-md p-8 space-y-6 border border-neutral-700">
      <h2 className="text-2xl font-bold text-center text-gray-200">Join Room / Create Room</h2>
      
      <form className="space-y-6">
        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-gray-400 font-medium pl-1">UserName</label>
          <input
            onChange={handleFormInputChange}
            value={detail.userName}
            type="text"
            id="name"
            name="userName"
            className="px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-500 shadow-sm transition-all duration-300"
            placeholder="Enter your name"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="id" className="text-gray-400 font-medium pl-1">UserId</label>
          <input
            onChange={handleFormInputChange}
            value={detail.userId}
            type="text"
            id="id"
            name="userId"
            className="px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-500 shadow-sm transition-all duration-300"
            placeholder="Enter your UserId"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="roomId" className="text-gray-400 font-medium pl-1">Room ID</label>
          <input
            onChange={handleFormInputChange}
            name="roomId"
            value={detail.roomId}
            type="text"
            id="roomId"
            className="px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-500 shadow-sm transition-all duration-300"
            placeholder="Enter room ID"
          />
        </div>

        <div className="flex flex-row justify-between pt-4">
          <button
            onClick={createRoom}
            type="button"
            className="w-40 py-3 px-6 rounded-xl bg-blue-500 text-white font-semibold shadow-md cursor-pointer hover:shadow-lg transform hover:bg-blue-700 duration-300 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Create Room
          </button>
          <button
            onClick={joinChat}
            type="button"
            className="w-40 py-3 px-6 rounded-xl bg-green-600 text-white font-semibold shadow-md cursor-pointer hover:shadow-lg transform hover:bg-green-700 duration-300 focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          >
            Join Room
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

  
  )
}

export default JoinCreateChat;