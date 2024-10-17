import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

export const VideoPlayer = ({ user }) => {
    const ref = useRef();

    useEffect(() => {
        user.videoTrack.play(ref.current);
    }, []);

    return (
        <div>
            Uid: {user.uid}
            <div
                ref={ref}
                className="w-[200px] h-[200px]">
            </div>
        </div>
    )
}

VideoPlayer.propTypes = {
    user: PropTypes.number.isRequired,
}