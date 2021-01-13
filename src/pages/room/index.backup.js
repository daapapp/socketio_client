import React, {useEffect, useState} from 'react'
import useChat from "./useChat";
import {Link} from "react-router-dom";
import {getCookie} from "../../utils/cookie";
import {
  MessageBox,
  ChatItem,
  ChatList,
  SystemMessage,
  MessageList,
  Input,
  Button,
  Avatar,
  Navbar,
  SideBar,
  Dropdown,
  Popup,
  MeetingList,
} from 'react-chat-elements';
import FaSearch from 'react-icons/lib/fa/search';
import FaComments from 'react-icons/lib/fa/comments';
import FaClose from 'react-icons/lib/fa/close';
import FaMenu from 'react-icons/lib/md/more-vert';
import FaSquare from 'react-icons/lib/md/crop-square';
class Page extends React.PureComponent{
  constructor(props) {
    super(props);
    const { roomId,} = props.match.params; // Gets roomId from URL
    this.state={
      username:getCookie('username')||'',
      roomId:roomId,
    }

  }
   checkSocketRef=()=>{
    if(this.props.socketRef&&this.props.socketRef.current){
      return true
    }
    return false
   }
   handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };
   leaveRoom= ()=>{
   if(this.checkSocketRef()){
     const {socketRef}=this.props
     socketRef?.current.emit('leaveRoom' ,{userId:socketRef?.current?.id+'',roomId:roomId,},(e,result) => {
       console.log('leaveRoom=>>>>>>',e,result)
     })
   }

  }
   handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage("");
  };
   getALlSocketsInRoom=()=>{
     if(this.checkSocketRef()) {
       const {socketRef} = this.props
       socketRef?.current.emit('allSocketsInRoom', {roomId: roomId}, (e, users) => {
         console.log('allSocketsInRoom=>>>>>>', e, users)
         setOnlineUsers(users)
       })
     }
  }
  listeners=()=>{
    if(this.checkSocketRef()){
      const {socketRef}=this.props
      socketRef?.current.on('_user_join' ,(msg) => {
        setNewUserJoined(msg)
        setTimeout(()=>{
          setNewUserJoined(null)
        },3000)
        getALlSocketsInRoom()
      })
      socketRef?.current.on('_user_leave' ,(msg) => {
        setUserLeave(msg)
        setTimeout(()=>{
          setUserLeave(null)
        },3000)
        getALlSocketsInRoom()
      })
    }
}
  componentDidMount() {
    this.liseners()
  }

  // console.log(props)
  const {socketRef}=this.props
  const { messages, sendMessage } = useChat(roomId,socketRef); // Creates a websocket and manages messaging
  const [newMessage, setNewMessage] = React.useState(""); // Message to be sent
  const [newUserJoined,setNewUserJoined]=useState(null);
  const [userLeave,setUserLeave]=useState(null);
  const [onlineUsers,setOnlineUsers] = useState([])


  return (
    <div>
      <div className="chat-room-container">
        <Link to={{pathname:`/`}} onClick={leaveRoom} >
         Exit room
        </Link>
        <h3 className="room-name">Room: {roomId}</h3>
        <h3 className="room-name">username: {username}</h3>
        <div>
          {newUserJoined?<p>{newUserJoined?.username||''} joined group</p>:null }
        </div>
        <div>
          {userLeave?<p>{userLeave?.message||''}</p>:null }
        </div>
        <div className="messages-container">
          <ol className="messages-list">
            {messages.map((message, i) => (
              <li
                key={i}
                className={`message-item ${
                  message.ownedByCurrentUser ? "my-message" : "received-message"
                }`}
              >
                {message.body}
              </li>
            ))}
          </ol>
        </div>
        <textarea
          value={newMessage}
          onChange={handleNewMessageChange}
          placeholder="Write message..."
          className="new-message-input-field"
        />
        <button onClick={handleSendMessage} className="send-message-button">
          Send
        </button>
      </div>
      <div style={{position:'absolute',right:0,top:0,backgroundColor:'#e1f1ed',flexDirection:'column',display:'flex'}}>
        <h1>Online users in this Room</h1>
        {
          onlineUsers.map(user=>(<Link key={user+'_'} to={{pathname:`/${'roomName'}`,search:'?userId=sss'}} className="enter-room-button">
            {user||''}
          </Link>))
        }
      </div>
    </div>
  );
}

export default Page;
