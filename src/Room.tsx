import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

export type Suite = 'S' | 'C' | 'H' | 'D';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
export type CardCode = `${Rank}${Suite}`;

export interface Card {
    id: number;
    name: CardCode;
    number: string;
    sign: string;
}

export interface Player {
    id: number;
    name: string;
    hand: Card[];
    points: number;
    card_points: number;
}

export interface Room {
    players: Player[];
    deck: Card[];
    board: Card[];
    current_player?: Player;
    active: boolean;
    players_list: Player[];
    turn: number;
    dirty: boolean;
    claim?: Card[];
    last_card?: Card;
}

export interface User {
    id: number;
    name: string;
    hand: Card[];
    points: number;
    card_points: number;
}

export interface GameState {
    room: Room;
    player: User;
}

export const Room = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState<Room>({ players: [] } as unknown as Room);
    const [update, setUpdate] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(`/room/${params.id}`);
                setRoom(data);
            } catch (error) {
                if ((error as AxiosError).response?.status === 401) {
                    navigate(`/join-room/${params.id}`);
                }
            }
        })();
    }, [update]);

    const connect = () => {
        const socket = new WebSocket(
            `${location.origin.replace('http', 'ws')}/cuarenta/api/state/${params.id}`
        );

        socket.onmessage = async ev => {
            console.log(ev);
            setUpdate(update + 1);
        };

        socket.onerror = ev => {
            console.log(ev);
            setTimeout(connect, 1000);
        };
    };

    useEffect(() => {
        connect();
    }, []);

    return <main>
        <form>
            <div id="room-id">Room #{params.id}</div>

            <p id="invite-text">
                You can invite others by sharing the link of this page
            </p>

            <div id="player-names">
                {room.players.map((player, i) =>
                    <div key={i} className="player-name">
                        {player.name}
                    </div>)
                }
            </div>

            <button
                type="button"
                className="blue-button down"
                onClick={play(navigate, params.id || '', room, toast)}>
                Play
            </button>
            <button type="button" className="blue-button">
                Leave
            </button>
        </form>
    </main>;
};

export const play = (navigate: NavigateFunction, roomId: string, room: Room, toast: { error: Function }) => () => {
    if (room.players.length === 2 || room.players.length === 4) {
        navigate(`/play/${roomId}`);
    } else {
        toast.error('There must be 2 or 4 players');
    }
};
