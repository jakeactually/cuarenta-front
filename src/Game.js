import * as cards from './Cards';
import { Set } from 'immutable';
import axios from "axios";
import { useEffect, useState } from "react";
import {   useRouteMatch } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';
import { Socket } from './amber';

const symbols = {
    S: '♠',
    C: '♣',
    H: '♥',
    D: '♦',
};

let count = 0;

export const Game = () => {
    const { params } = useRouteMatch();
    const { addToast } = useToasts();
    
    const [socketCount, setSocketCount] = useState(0);
    const [handSelection, setHandSelection] = useState(null);
    const [boardSelection, setBoardSelection] = useState(new Set());
    const [game, setGame] = useState({
        room: {
            players: [],
            board: []
        },
        user: {
            hand: []
        }
    });

    useEffect(() => {
        axios.get(`/play/${params.id}`).then(({ data }) => {
            setGame(data);
        });
    }, [count]);

    useEffect(() => {
        const socket = new Socket('/state');
        
        socket.connect({ port: 4000 }).then(() => {
            const channel = socket.channel(`cuarenta_room:${params.id}`);
            channel.join();
            channel.on('message_new', () => {
                setSocketCount(++count);
            });
        });
    }, []);
    
    return (
        <main>
            <div id="control">
                <div id="players">
                    <div class="player legend">
                        <br></br>
                        POINTS<br></br>
                        CARDS
                    </div>
                    {game.room.players.map(player =>
                    <div className={player.id == game.room.current_player.id ? 'current player' : 'player'}>
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
                    onClick={action(handSelection, boardSelection, params.id,
                        addToast, setHandSelection, game.room.board, setBoardSelection)}>
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
                    {game.user.hand.map(card =>
                    <img
                    src={cards[`card_${card.name}`]}
                    className={handSelection && handSelection.name === card.name ? 'selected' : ''}
                    onClick={() => setHandSelection(card)} />)}
                </div>
            </div>
        </main>
    )
};

const toggle = (set, item) => set.has(item) ? set.delete(item) : set.add(item);

const action = (handSelection, boardSelection,
    roomId, addToast, setHandSelection, board, setBoardSelection) => async () => {

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
        
        if (action == 'pass') {
        }
    } catch (error) {
        addToast(error.response.data, {
            appearance: 'error',
            autoDismiss: true
        });
    }

    setBoardSelection(new Set());
    setHandSelection(null);
};

const actionText = (handSelection, boardSelection) => {
    if (handSelection) {
        if (!boardSelection.size) {
            return 'THROW ' + handSelection.name.replace(/[SCHD]/g, char => symbols[char]);
        }

        return 'SUM ' + [handSelection.name, ...boardSelection]
            .join(' + ')
            .replace(/[SCHD]/g, char => symbols[char]);
    }

    if (boardSelection.size) {
        return 'CLAIM ' + [...boardSelection]
            .join(', ')
            .replace(/[SCHD]/g, char => symbols[char]);
    }

    return 'PASS';
};

const actionClass = (handSelection, boardSelection) => {
    if (handSelection) {
        return '';
    }

    if (boardSelection.size) {
        return '';
    }

    return 'disabled';
};
