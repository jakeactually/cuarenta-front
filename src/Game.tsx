import * as cards from './cards';
import { Set } from 'immutable';
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { Card, CardCode, GameState, Suite } from './Room';

const symbols = {
    S: '♠',
    C: '♣',
    H: '♥',
    D: '♦',
};

let count = 0;

export const GameComponent = () => {
    const params = useParams();
    
    const [socketCount, setSocketCount] = useState(0);
    const [handSelection, setHandSelection] = useState<Card | null>(null);
    const [boardSelection, setBoardSelection] = useState<Set<CardCode>>(Set());
    const [game, setGame] = useState<GameState>({
        room: {
            players: [],
            deck: [],
            board: [],
            active: false,
            players_list: [],
            turn: 0,
            dirty: false,
        },
        player: {
            id: 0,
            name: '',
            hand: [],
            points: 0,
            card_points: 0,
        },
    });

    useEffect(() => {
        axios.get(`/play/${params.id}`).then(({ data }) => {
            setGame(data);
        });
    }, [socketCount]);

    const connect = () => {
        const socket = new WebSocket(
            `ws://localhost:8080/api/state/${params.id}`
        );

        socket.onmessage = ev => {
            count = count + 1;
            setSocketCount(count);
            console.log(ev);
        };

        socket.onerror = ev => {
            console.log(ev);
            setTimeout(connect, 1000);
        };
    };

    useEffect(() => {
        connect();
    }, []);
    
    return (
        <main>
            <div id="control">
                <div id="players">
                    <div className="player legend">
                        <br></br>
                        POINTS<br></br>
                        CARDS
                    </div>
                    {game.room.players.map(player =>
                    <div className={player.id == game.room.current_player?.id ? 'current player' : 'player'}>
                        <div>{player.name}</div>
                        <div>
                            <div>
                                {player.points}
                            </div>
                            <div>
                                {player.card_points}
                            </div>
                        </div>
                    </div>)}
                </div>
                
                <button
                    id="action"
                    className={actionClass(handSelection, boardSelection)}
                    onClick={action(handSelection, boardSelection, params.id || '',
                        setHandSelection, game.room.board, setBoardSelection)}>
                    {actionText(handSelection, boardSelection)}
                </button>
            </div>
            <div className="form">
                <div id="board">
                    {game.room.board.map(card =>
                    <img
                        src={cards[`card_${card.name}`]}
                        className={boardSelection.has(card.name) ? 'selected' : ''}
                        onClick={() => setBoardSelection(toggle(boardSelection, card.name))} />)}
                </div>
                <div id="hand">
                    {game.player.hand.map(card =>
                    <img
                    src={cards[`card_${card.name}`]}
                    className={handSelection && handSelection.name === card.name ? 'selected' : ''}
                    onClick={() => setHandSelection(card)} />)}
                </div>
            </div>
        </main>
    )
};

const toggle = <T extends unknown>(set: Set<T>, item: T) => set.has(item) ? set.delete(item) : set.add(item);

const action = (
    handSelection: Card | null,
    boardSelection: Set<CardCode>,
    roomId: String,
    setHandSelection: Function,
    board: Card[],
    setBoardSelection: Function,
) => async () => {
    let action;
    if (handSelection) {
        action = 'sum';
    } else if (boardSelection.size) {
        action = 'claim';
    } else {
        action = 'pass';
    }
    
    const request = {
        action,
        hand: handSelection,
        board: [...boardSelection].map(cardName =>
            board.find(card => card.name == cardName)
        )
    };

    try {
        await axios.post(`/turn/${roomId}`, request);
    } catch (error) {
        toast.error((error as AxiosError).response?.data);
    }

    setBoardSelection(Set());
    setHandSelection(null);
};


const actionText = (handSelection: Card | null, boardSelection: Set<CardCode>) => {
    if (handSelection) {
        if (!boardSelection.size) {
            return 'THROW ' + handSelection.name.replace(/[SCHD]/g, char => symbols[char as Suite]);
        }

        return 'SUM ' + [handSelection.name, ...boardSelection]
            .join(' + ')
            .replace(/[SCHD]/g, char => symbols[char as Suite]);
    }

    if (boardSelection.size) {
        return 'CLAIM ' + [...boardSelection]
            .join(', ')
            .replace(/[SCHD]/g, char => symbols[char as Suite]);
    }

    return 'PASS';
};

const actionClass = (handSelection: Card | null, boardSelection: Set<CardCode>) => {
    if (handSelection) {
        return '';
    }

    if (boardSelection.size) {
        return '';
    }

    return 'disabled';
};
