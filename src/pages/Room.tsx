import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/socketContext";
import UserFeedPlayer from "../components/UserFeedPlayer";

const Room:React.FC = () => {
    const {id} = useParams();
    const {socket, user, stream, peers, screenShare, setScreenShare} = useContext(SocketContext);

    const fetchParticipantsList = ({roomId, participants}: {roomId: string, participants: string[]}) => {
        console.log("Fetched room participants");
        console.log(`${roomId} has ${participants}`)
      }

    useEffect(() => {
        // Emitting this event so that either created of room or joiner in the room,
        // anyone is added the server knows that new possible have been added to the room
        if(user){
            socket.emit('joined-room', {roomId: id, peerId: user._id});
            socket.on('get-users', fetchParticipantsList);
        }
    }, [id, user, socket])


    const handleClick = () => {
        if(screenShare){
            setScreenShare(false);
        }else{
            setScreenShare(true);
        }
    }

    return(
        <div>
            Room : {id}
            <br />
            Your own user feed
            <UserFeedPlayer stream={stream} />

            <div>
                Other User's feed
                {Object.keys(peers).map((peerId) => (
                    <>
                        <UserFeedPlayer key={peerId} stream={peers[peerId].stream} />
                    </>
                ))}
            </div>
            <button className="fixed p-3 rounded-md bg-secondary bottom-3" onClick={handleClick}>
                {screenShare ? "Stop Sharing" : "Share Screen"}
            </button>
        </div>
    )
}

export default Room;