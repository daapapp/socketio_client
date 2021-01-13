import React, {useCallback, useEffect, useState} from 'react'

import {Link, useHistory} from "react-router-dom";
import {axios} from '../../utils/axios';
import {getCookie} from "../../utils/cookie";
import {SocketUtil} from "../../utils/socket";


function Page(props) {
  const {socketRef} =props
  let history = useHistory();
  // useEffect(()=>{
  //   console.log(props)
  // },[props])
  const [roomName, setRoomName] = React.useState("");
  const [rooms,setRooms]= useState([]);
  const [groups,setGroups]= useState([]);
  const [allUsers,setAllUsers]= useState([]);
  const [newUser,setNewUser]=useState(null)
  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };
  const getAllUsers= ()=>{
    socketRef.current?.emit('allSockets',(err,sockets)=>{
      // alert(JSON.stringify(sockets))
      console.log('allSockets:',err,sockets)
      if(sockets&&Array.isArray(sockets)) {
        setAllUsers(sockets)
      }
    })
  }
  const getAllRooms= ()=>{
    socketRef.current?.emit('allRooms',(err,sockets)=>{
      // alert(JSON.stringify(sockets))
      console.log('getAllRooms',err,sockets)
      if(sockets&&Array.isArray(sockets)){
        setRooms(sockets)
      }

    })
  }
  useEffect(()=>{
    if(socketRef){
      console.log('socketRef.current',socketRef)
      getAllRooms()
      socketRef.current?.on('join',(e)=>{
        alert('join')
        getAllUsers()
        getAllRooms()
      })
      //  socketRef?.current.on('connect',(msg)=>{
      //    console.log(msg)
      //    setNewUser(msg)
      //   setTimeout(()=>{
      //     setNewUser(null)
      //   },3000)
      // })
      getAllUsers()

    }
  },[socketRef,socketRef.current])
  const joinToGroup=(roomId,username)=>{
    socketRef.current.emit('joinRoom',{roomId:roomId,username:username,socketId:String(socketRef?.current?.id)},(e)=>{
    })
  }
  const getAllGroups= async ()=>{
    try{
      const response= await axios({method:'get',url:'db/group',})
      console.log(response)
      setGroups(response.data)
    }catch (e){
      console.log(e)
    }
  }
  useEffect(()=>{
    getAllGroups()
  },[])

  useEffect(()=>{
    const username= getCookie('username')
    if(username){
      socketRef.current=SocketUtil.init(username)
    }else {
      history.push('/login')
    }
  },[])

  return (
    <div>
      <h1>
        {getCookie('username')||''}
      </h1>
      <p>
        all rooms : include users
      </p>
      <div style={{flexDirection:'column',display:'flex'}}>
      {
        rooms.map(room=>{
          return (<Link to={{pathname:`/${room}`,search:'?userId=sss'}} className="enter-room-button" key={room}>room: {room||''}</Link>)
        })
      }
      </div>
      <input
        type="text"
        placeholder="Room"
        value={roomName}
        onChange={handleRoomNameChange}
        className="text-input-field"
      />
      <Link to={{pathname:`/${roomName}`,search:'?userId=sss'}} className="enter-room-button">
        Create New room
      </Link>

      <hr />
      <p>
        groups
      </p>
      <div style={{flexDirection:'column',display:'flex'}}>
        {
          groups&&Array.isArray(groups)?groups.map(group=>{
            return (<Link to={{pathname:`/${group?.id}`,search:'?userId=x'}} className="enter-room-button" key={group.id} onClick={()=>{

            }}> {group.name||''}</Link>)
          }):null
        }
      </div>
      <div style={{position:'absolute',right:0,top:0,backgroundColor:'#e1f1ed',flexDirection:'column',display:'flex'}}>
        <h1>All Online users</h1>
        <div>
          {newUser?newUser?.message:''}
        </div>
        {
          allUsers.map(user=>(<Link key={user+'_'} to={{pathname:`/${user}`,search:'?userId=sss'}} className="enter-room-button">
            {user||''}
          </Link>))
        }
      </div>
    </div>
  );
}

export default Page;
