import { useEffect, useState } from "react";
import AgoraRTC  from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";

const APP_ID = '4285afde204f4617a16226d705c1092c';
const TOKEN = '007eJxTYBBYymoXcuqRZ5diSUDMncBFMxTMvs+RvCC97u1yCUfrX88UGEyMLEwT01JSjQxM0kzMDM0TDc2MjMxSzA1Mkw0NLI2S5+kJpDcEMjIEhJxlYIRCEJ+bITivND09J9U3NbWEgQEAuN8gQw=='
const CHANNEL = 'SnuggleMeet'

const client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
})

export default function Room () {
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);

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
            client.unpublish(tracks).then(() => client.leave());
        };
    }, []);
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
        </div>
    )
}