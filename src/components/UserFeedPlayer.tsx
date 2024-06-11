import { useEffect, useRef } from "react";

interface Props {
    stream?: MediaStream
}

const UserFeedPlayer : React.FC<Props> = ({stream}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if(videoRef.current && stream){
            videoRef.current.srcObject = stream;
        }
    }, [stream])

    return(
        <video
            ref={videoRef}
            className="w-[300px] h-[200px]"
            muted
            autoPlay
        />
    )
} 

export default UserFeedPlayer;