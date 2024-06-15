/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import SocketIoClient from "socket.io-client";
import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as UUIDv4 } from "uuid";
import { peerReducer } from "../reducers/peerReducer";
import { addPeerAction } from "../actions/peerAction";

const WS_Server = "http://localhost:5500";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SocketContext = createContext<any | null>(null);

const socket = SocketIoClient(WS_Server, {
  withCredentials: false,
  transports: ["polling", "websocket"],
});

interface Props {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();

  // state variable to store the userId
  const [user, setUser] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [screenShare, setScreenShare] = useState<boolean>(false);

  const [peers, dispatch] = useReducer(peerReducer, {}); // peers -> state, dispatch -> method

  const fetchUserFeed = async () => {
    let stream;
    if (screenShare) {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
    } else {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
    }

    setStream(stream);
  };

  useEffect(() => {
    const userId = UUIDv4();
    // peerjs --port 9000 --key peerjs --path /myapp
    const newPeer = new Peer(userId, {
      host: 'peer-server-63ll.onrender.com',
      secure: true,
      path: '/peerjs',
      token: '11blbjyuden',
      config: {
        'iceServers': [
          { urls: 'stun:stun.l.google.com:19302' },
          // { urls: 'turn:your.turn.server:3478', credential: 'your_credential', username: 'your_username' }
        ]
      }
    });

    setUser(newPeer);

    fetchUserFeed();

    const enterRoom = ({ roomId }: { roomId: string }) => {
      navigate(`/room/${roomId}`);
    };

    // We will transfer the user to the room page when we collect an event of room-created
    socket.on("room-created", enterRoom);
  }, [screenShare]);

  useEffect(() => {
    if (!user || !stream) return;

    socket.on("user-joined", ({ peerId }: { peerId: string }) => {
      const call = user.call(peerId, stream);
      console.log(`Calling the new peer ${peerId}`);
      call.on("stream", () => {
        //@ts-ignore
        dispatch(addPeerAction(peerId, stream));
      });
    });

    user.on("call", (call) => {
      // what to do when other peers on the group call you when you joined
      console.log("receiving a call");
      call.answer(stream);
      call.on("stream", () => {
        //@ts-ignore
        dispatch(addPeerAction(call.peer, stream));
      });
    });

    socket.emit("ready");
  }, [user, stream]);

  return (
    <SocketContext.Provider
      value={{ socket, user, stream, peers, screenShare, setScreenShare }}
    >
      {children}
    </SocketContext.Provider>
  );
};
