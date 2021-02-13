import './App.css';
import * as cards from './cards.js';
import { Set, OrderedSet } from 'immutable';
import { useState } from 'react';

const all = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'].flatMap(number =>
  ['C', 'D', 'H', 'S'].map(sign =>
    ({ key: `${number}${sign}`, img: cards[`card_${number}${sign}`] })
  )
);

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

function App() {
  const [hand, setHand] = useState(new OrderedSet(
    Array(5).fill().map(() => all[Math.floor(Math.random() * all.length)])
  ));
  const [board, setBoard] = useState(new OrderedSet(
    Array(20).fill().map(() => all[Math.floor(Math.random() * all.length)])
  ));
  const [handSelection, setHandSelection] = useState(new Set());
  const [boardSelection, setBoardSelection] = useState(new Set());

  return (
    <div className="App">
      <header className="App-header">
        <div id="action">
          {actionText(handSelection, boardSelection)}
        </div>
        <div id="board">
          {board.map(card =>
            <img
              src={card.img}
              className={boardSelection.has(card.key) ? 'selected' : ''}
              onClick={() => setBoardSelection(toggle(boardSelection, card.key))} />)}
        </div>
        <div id="hand">
          {hand.map(card =>
            <img
            src={card.img}
            className={handSelection.has(card.key) ? 'selected' : ''}
            onClick={() => setHandSelection(toggle(handSelection, card.key))} />)}
        </div>
      </header>
    </div>
  );
}

export default App;
