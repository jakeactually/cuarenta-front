import * as cards from './Cards';
import { Set, OrderedSet } from 'immutable';
import axios from "axios";
import { useEffect, useState } from "react";
import {  useRouteMatch } from "react-router-dom";

export const Game = () => {
    const { params } = useRouteMatch();
    
    const [hand, setHand] = useState(new OrderedSet());
    const [board, setBoard] = useState(new OrderedSet());
    const [handSelection, setHandSelection] = useState(new Set());
    const [boardSelection, setBoardSelection] = useState(new Set());

    useEffect(() => {
        axios.get(`/play/${params.id}`).then(({ data }) => {
            setBoard(new OrderedSet(data.room.board));
            setHand(new OrderedSet(data.user.hand));
        });
    }, []);
    
    return (
        <main>
            <div class="form">
                <div id="action">
                    {actionText(handSelection, boardSelection)}
                </div>
                <div id="board">
                    {board.map(card =>
                    <img
                        src={cards[`card_${card.name}`]}
                        className={boardSelection.has(card.name) ? 'selected' : ''}
                        onClick={() => setBoardSelection(toggle(boardSelection, card.name))} />)}
                </div>
                <div id="hand">
                    {hand.map(card =>
                    <img
                    src={cards[`card_${card.name}`]}
                    className={handSelection.has(card.name) ? 'selected' : ''}
                    onClick={() => setHandSelection(toggle(handSelection, card.name))} />)}
                </div>
            </div>
        </main>
    )
};

const toggle = (set, item) => set.has(item) ? set.delete(item) : set.add(item);

const actionText = (handSelection, boardSelection) => {
    if (handSelection.size) {
        return [...handSelection, ...boardSelection].join(' + ');
    }

    if (boardSelection.size) {
        return 'CLAIM ' + [...boardSelection].join(', ');
    }

    return '';
};
