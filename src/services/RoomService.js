import { httpClient } from "../config/AxiosHelper";




export const createRoomApi = async (roomDetail) => {
  const response = await httpClient.post(`/api/v2/rooms`, roomDetail, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
  return response.data;
};

export const joinChatApi = async (roomId) => {
  const response = await httpClient.get(`/api/v2/rooms/${roomId}`);
  return response.data;
};



export const getMessagess=async(roomId,size=50,page=0)=>{
  const response=await httpClient.get(`/api/v2/rooms/${roomId}/messages?size=${size}&page=${page}`);
  return response.data;
}


// Add userList to a room
export const getUsers=async(roomId)=>{
  const response=await httpClient.get(`/api/v2/rooms/${roomId}/users`);
  return response.data;

}

export const sendUsers=async(roomId,userId,userName)=>{
  const response=await httpClient.post(`api/v2/rooms/${roomId}/users?userId=${userId}&userName=${userName}`);
  return response.data;
}


export const removeUserFromRoom=async(roomId,userId)=>{
  const response=await httpClient.delete(`api/v2/rooms/${roomId}/users/${userId}`);
  return response.data;
}