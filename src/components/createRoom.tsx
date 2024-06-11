import { useContext } from "react";
import { SocketContext } from "../context/socketContext";

const CreateRoom: React.FC = () => {
    const {socket} = useContext(SocketContext);

    const initRoom = () => {
        socket.emit('create-room')
    }

    return(
        <button className="btn btn-secondary" onClick={initRoom}>
            Start a new meeting a new room
        </button>
    )
}

export default CreateRoom;