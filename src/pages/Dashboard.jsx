import { useState } from "react";
import Room from "./Room";

export default function Dashboard () {
    const [joined, setJoined] = useState(false);
    return (
        <div>
            <h1>Virtual interview</h1>

            {
                !joined && (
                <button onClick={() => setJoined(true)}>
                    Join Room
                </button>
                )
            }

            {
                joined && (
                <Room/>
                )
            }
            
        </div>

    );
}

