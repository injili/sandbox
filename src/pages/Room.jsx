import { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom/client";
import AgoraRTC  from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";

const APP_ID = '4285afde204f4617a16226d705c1092c';
const TOKEN = '007eJxTYDhUuWG3sd7H+xGMB9c7r91eUPU47bxd1hzGBFUVm8cay9wVGEyMLEwT01JSjQxM0kzMDM0TDc2MjMxSzA1Mkw0NLI2SeT9KpDcEMjLw/NBnYIRCEJ+bITivND09J9U3NbWEgQEAA8kglA=='
const CHANNEL = 'SnuggleMeet'

const client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
})

export default function Room () {
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);
    const videoRef = useRef(null);

    const handleUserJoined = async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === 'video') {
            setUsers((previousUsers) => [...previousUsers, user]);
        }

        if (mediaType == 'audio') {
            // user.audioTrack.play
        }
    }
    const handleUserLeft = (user) => {
        setUsers((previousUsers) => 
            previousUsers.filter((u) => u.uid !== user.uid)
        );
    };

    const openWindow = async () => {
        try {
            const dpip = await window.documentPictureInPicture.requestWindow({
                width: "500",
                height: "500",
            });

            const pipDiv = dpip.document.createElement("div");
            pipDiv.setAttribute("id", "pip-root");
            dpip.document.body.append(pipDiv);
            const pipRoot = ReactDOM.createRoot(
                dpip.document.getElementById("pip-root")
            );
            pipRoot.render(<WindowContents />);
        } catch (error) {
            if (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        client.on('user-published', handleUserJoined);
        client.on('user-left', handleUserLeft);

        client.join(APP_ID, CHANNEL, TOKEN, null)
        .then((uid) =>
            Promise.all([
                AgoraRTC.createMicrophoneAndCameraTracks(),
                uid,
            ])
        )
        .then(([tracks, uid]) => {
            const [audioTrack, videoTrack] = tracks;
            setLocalTracks(tracks);
            setUsers((previousUsers) => [
                ...previousUsers,
                {
                    uid,
                    videoTrack,
                },
            ]);
            client.publish(tracks);
        });

        return () => {
            for (let localTrack of localTracks) {
                localTrack.stop();
                localTrack.close();
            }
            client.off('user-published', handleUserJoined);
            client.off('user-left', handleUserLeft);
            client.unpublish(localTracks).then(() => client.leave());
        };
    }, []);

    const WindowContents = () => {
        return (
          <div className="bg-red flex gap-2">
                {users.map((user) => (
                    <VideoPlayer key={user.uid} user={user}/>
                ))}
          </div>
        );
      };

    
    return (
        <div className="flex justify-center">
            <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 200px)',
            }}
            >
                {users.map((user) => (
                    <VideoPlayer key={user.uid} user={user}/>
                ))}
            </div>
            <button onClick={openWindow} className="border-2 bg-red p-4">open</button>
        </div>
    )
}