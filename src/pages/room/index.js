import React, {useEffect, useState} from 'react'
import useChat from "./useChat";
import {Link,withRouter } from "react-router-dom";
import {getCookie, setCookie} from "../../utils/cookie";
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
import {FaSearch, FaComments,FaWindowClose,FaFileAudio,FaFileVideo,FaFileImage } from 'react-icons/fa';
import {axios} from "../../utils/axios";
// setCookie('userId','1')
class Page extends React.PureComponent{
  constructor(props) {
    super(props);
    const {roomId=null,} = props.match.params; // Gets roomId from URL
    this.roomId=roomId;
    this.username=getCookie('username')||null
    this.userId=parseInt(getCookie('userId'))||null
    this.state={
      messages:[],
      newMessage:'',
      usersJoinedRoom:{},
      usersLeavedRoom:{},
      onlineUsers:[],
      modalIsVisible: false,
      list: 'chat',
    }
    this.inputRef = React.createRef();
  }
   checkSocketRef=()=>{
    return true
    // if(this.props.socketRef&&this.props.socketRef.current){
    //   return true
    // }
    return false
   }
   handleNewMessageChange = (event) => {
    this.setState({newMessage:event.target.value});
  };
   leaveRoom= ()=>{
   if(this.checkSocketRef()){
     const {socketRef}=this.props
     socketRef.current?.emit('leaveRoom' ,{userId:socketRef.current?.id+'',roomId:this.roomId,},(e,result) => {
       console.log('leaveRoom=>>>>>>',e,result)
       return
       this.setState({
         usersJoinedRoom:this.state.usersJoinedRoom.filter(id=>id!==socketRef.current?.id),
         onlineUsers:this.state.onlineUsers.filter(id=>id!==socketRef.current?.id)
       })
     })
   }

  }
   handleSendMessage = () => {
     const {newMessage}=this.state
     if(newMessage && typeof newMessage ==='string' && newMessage.length>0){
       if(this.checkSocketRef()) {
         const {socketRef} = this.props
         try {
           socketRef.current?.emit('message', this.roomId, {
             body: newMessage,
             username: this.username,
             roomId: this.roomId,
             userId:this.userId,
             type:'text',
           });
           axios({
             method:'post',
             url:'/db/message/create',
             data:{
               status:'active',
               text: newMessage,
               type:'text',
               groupId:this.roomId,
               userId:this.userId,
             }
           }).then(res=>{
           }).catch(e=>{

           }).finally(_=>{
           })
         } catch (e) {
           console.log('log::::sendMessage', e)
         }
       }
     }
  };
   getALlSocketsInRoom=()=>{
     if(this.checkSocketRef()) {
       const {socketRef} = this.props
       socketRef.current?.emit('allSocketsInRoom', {roomId: this.roomId}, (e, users) => {
         console.log('allSocketsInRoom=>>>>>>', e, users)
         this.setState({onlineUsers:users})
       })
     }
  }
  listeners=()=>{
    // if(this.checkSocketRef()){
      const {socketRef}=this.props
      socketRef.current?.on('_user_join' ,(msg) => {
        this.getALlSocketsInRoom()
        return
        const socketId=msg?.socketId?.toString()??null
        if(socketId){
          this.setState({
            usersJoinedRoom:{...this.state.usersJoinedRoom,[socketId]:msg}
          })
          setTimeout(()=>{
            if(this.state.usersJoinedRoom.hasOwnProperty(socketId)){
              const usersJoinedRoom= Object.assign({},this.state.usersJoinedRoom)
              delete usersJoinedRoom[socketId]
              this.setState({
                usersJoinedRoom: usersJoinedRoom
              })
            }
          },3000)
        }
      })
      socketRef.current?.on('_user_leave' ,(msg) => {
        this.getALlSocketsInRoom()
        return
        const socketId=msg?.socketId?.toString()??null
        if(socketId){
          this.setState({
            usersLeavedRoom:{...this.state.usersLeavedRoom,[socketId]:msg}
          })
          setTimeout(()=>{
            if(this.state.usersLeavedRoom.hasOwnProperty(socketId)){
              const usersLeavedRoom= Object.assign({},this.state.usersLeavedRoom)
              delete usersLeavedRoom[socketId]
              this.setState({
                usersLeavedRoom: usersLeavedRoom
              })
            }
          },3000)
        }
      })
      socketRef.current?.on('message', (message) => {
        this.setState({newMessage:'',messages:[...this.state.messages,{
            position: this.userId === message.userId?'right':'left' ,
            type:'text',
            text: message?.body||'',
            date: message?.created_at || new Date()
          }],},()=>{
          this.inputRef?.clear();
        })
      });
    // }
}
  getMessagesFromApi=(page=1)=>{
    axios({
      method:'get',
      url:'/db/message',
      params:{groupId:this.roomId}
    }).then(res=>{
      this.setState({messages:res.data.map(msg=>({...msg,position:msg?.UserId===this.userId?'right':'left'}))})
    }).catch(e=>{

    }).finally(_=>{
    })
}
toggleModal=()=>{
     this.setState({modalIsVisible:!this.state.modalIsVisible})
}
  componentDidMount() {
     this.mounted=true
    this.listeners()
    this.getALlSocketsInRoom()
    this.props.socketRef.current?.emit("joinRoom",{roomId:this.roomId,username:this.username})
    this.getMessagesFromApi()
  }
  componentWillUnmount() {
     this.mounted=false
  }

  render(){
  // console.log(props)
  const {socketRef}=this.props
  console.log(this.state.messages)
  return (
    <div className='container'  >

          <button onClick={this.toggleModal} style={{width:100}}>
            Exit room
          </button>
        <h3 className="room-name">Room: {this.roomId}</h3>
        <h3 className="room-name">username: {this.username}</h3>

      <Popup
        show={this.state.modalIsVisible}
        header='Warning'
        headerButtons={[{
          type: 'transparent',
          color:'black',
          text: 'close',
          onClick: () => {
            this.toggleModal()
          }
        }]}
        text='Are Upu want to leave group ?'
        footerButtons={[{
          color:'white',
          backgroundColor:'#ff5e3e',
          text:"No",
          onClick:()=>{
            this.toggleModal()
          }
        },{
          color:'white',
          backgroundColor:'lightgreen',
          text:"Yes",
          onClick:()=>{
            this.toggleModal()
            this.leaveRoom()
            this.props.history.push("/");
          }
        }]}/>
          <div style={{direction:"row"}}>
            <MessageList
              className='message-list'
              lockable={true}
              toBottomHeight={'100%'}
              dataSource={this.state.messages}
              // dataSource={[
              //   {
              //     position: 'right',
              //     type: 'text',
              //     text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
              //     date: new Date(),
              //   },]}
            />
            <Input
              placeholder="Type here..."
              multiline={true}
              value={this.state.newMessage}
              onChange={(e)=>this.setState({newMessage:e.target.value})}
              ref={el => (this.inputRef = el)}
              leftButtons={<Dropdown
                buttonProps={{
                  text: 'Send File',
                }}
                items={[
                  {
                    icon: {
                      component: <FaFileImage />,
                      float: 'left',
                      color: 'green',
                      size: 22,
                    },
                    text: 'Image'
                  },
                  {
                    icon: {
                      component: <FaFileAudio />,
                      float: 'left',
                      color: 'purple',
                      size: 22,
                    },
                    text: 'Audio'
                  },{
                    icon: {
                      component: <FaFileVideo />,
                      float: 'left',
                      color: 'red',
                      size: 22,
                    },
                    text: 'Video'
                  },
                ]}/>}

              className='input'
              rightButtons={
                <Button
                  color='white'
                  backgroundColor={'#31a065'}
                  text=' Send ' onClick={this.handleSendMessage}/>
              }/>
            <ChatList
              className='chat-list'
              dataSource={[
                {
                  avatar: 'https://facebook.github.io/react/img/logo.svg',
                  alt: 'Reactjs',
                  title: 'Facebook',
                  subtitle: 'What are you doing?',
                  date: new Date(),
                  unread: 0,
                },
              ]} />
          </div>
    </div>
  );
 }
}

export default withRouter(Page);
