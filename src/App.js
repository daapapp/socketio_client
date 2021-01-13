import './App.css';
import { BrowserRouter as Router, Switch, Route, } from "react-router-dom";
import Home from './pages/home'
import Login from './pages/login'
import ChatRoom from './pages/room';
import Pv from './pages/pv';
import {io } from "socket.io-client";
import {useEffect, useRef} from "react";
import {SocketUtil} from "./utils/socket";
import {getCookie} from "./utils/cookie";
import {useHistory } from "react-router-dom";
function App(req) {
  const socketRef = useRef(null);
  useEffect(()=>{
    console.log(socketRef.current)
    if(socketRef.current){
      socketRef.current.on("connect", () => {
        console.log(socketRef.current.id,); // x8WIv7-mJelg7on_ALbx
      });
    }
    // socketRef.current.on("disconnect", () => {
    //   console.log(socket.id); // undefined
    // });
    return ()=>{
      if(socketRef.current) {
        socketRef.current.disconnect();
      }
    }
  },[])
  return (
    <Router>
      <Switch>
        <Route exact path={'/login'} component={(props)=><Login {...props} socketRef={socketRef} />} />
        <Route exact path="/" component={(props)=><Home {...props} socketRef={socketRef} />} />
        <Route exact path="/:roomId" component={(props)=><ChatRoom {...props} socketRef={socketRef} />} />
        <Route exact path="/pv/:user" component={(props)=><Pv {...props} socketRef={socketRef} />} />
      </Switch>
    </Router>
  );
}

export default App;
