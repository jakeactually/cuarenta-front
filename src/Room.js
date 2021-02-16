import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

export const Room = () => {
    const { params } = useRouteMatch();
    const history = useHistory();
    const [room, setRoom] = useState({ players: [] });

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(`/room/${params.id}`);
                setRoom(data);
            } catch (error) {
                if (error.response.status === 401) {
                    history.push(`/join-room/${params.id}`);
                }
            }
        })();
    }, []);

    return <main>
        <form class="">
            <div id="room-id">Room #{params.id}</div>

            <p id="invite-text">
                You can invite others by sharing the link of this page
            </p>

            <div id="player-names">
                { room.players.map((player, i) =>
                <div key={i} className="player-name">
                    {player.name}
                </div>)
                }
            </div>

            <button type="button" class="blue-button down" onClick={play(history, params.id)}>
                Play
            </button>
            <button type="button" class="blue-button">
                Leave
            </button>
        </form>
    </main>;
};

export const play = (history, roomId) => () => {
    history.push(`/play/${roomId}`);
};
