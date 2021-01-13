import {io} from "socket.io-client";

export class SocketUtil {
  static init(username){
    return io(process.env.REACT_APP_SOCKET_SERVER_URL,{
      // path: '/',
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      timeout: 20000,
      autoConnect: true,
      query: {},
      // options of the Engine.IO client
      upgrade: true,
      forceJSONP: false,
      jsonp: true,
      forceBase64: false,
      enablesXDR: false,
      timestampRequests: true,
      timestampParam: 't',
      policyPort: 843,
      transports: ['polling', 'websocket'],
      transportOptions: {},
      rememberUpgrade: false,
      onlyBinaryUpgrades: false,
      requestTimeout: 0,
      protocols: [],
      // options for Node.js
      agent: false,
      pfx: null,
      key: null,
      passphrase: null,
      cert: null,
      ca: null,
      ciphers: [],
      rejectUnauthorized: true,
      perMessageDeflate: true,
      forceNode: false,
      localAddress: null,
      // options for Node.js / React Native
      extraHeaders: {
        username:username
      },
    })
  }
}
