import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import {axios} from "../../utils/axios";

const NEW_CHAT_MESSAGE_EVENT = "message"; // Name of the event
// const SOCKET_SERVER_URL = process.env.SOCKET_SERVER_URL;
const SOCKET_SERVER_URL = 'http://localhost:4000';
// console.log(process.env)
const useChat = (roomId,socketRef) => {
  const [messages, setMessages] = useState([]); // Sent and received messages

  useEffect(() => {
    // Creates a WebSocket connection
    // socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
    //   query: { roomId:roomId,userId:userId},
    //   path:'.'
    // });
    // socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
    //   query: { roomId:roomId,userId:userId},
    //   path:'.'
    // });
    // socketRef.current.emit("joinRoom",{roomId:roomId,userId:userId})

    // console.log('socketRef::::',socketRef.current)
    // Listens for incoming messages
    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      // console.log('log:::::message',message)
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.userId === socketRef.current.id,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });
  }, [roomId]);

  // Sends a message to the server that
  // forwards it to all users in the same room
  const sendMessage = (messageBody) => {

  };
  const sendMessageToApi=(messageBody)=>{
    axios({
      method:'post',
      url:'/db/message/create',
      data:{
        status:'active',
        text:messageBody,
        type:'text',
        groupId:roomId
      }
    }).then(res=>{
    }).catch(e=>{

    }).finally(_=>{
    })
  }

  return { messages, sendMessage };
};

export default useChat;
