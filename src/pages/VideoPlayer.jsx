import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

export const VideoPlayer = ({ user }) => {
    const videoRef = useRef();

    useEffect(() => {
        if (user.videoTrack && videoRef.current) {
            user.videoTrack.play(videoRef.current);
        }
    }, [user]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
        />
    )
}

VideoPlayer.propTypes = {
    user: PropTypes.number.isRequired,
}