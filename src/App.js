import './App.css';
import * as cards from './cards.js';

const all = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'].flatMap(number =>
  ['C', 'D', 'H', 'S'].map(sign =>
    cards[`card_${number}${sign}`]
  )
);

function App() {
  const hand = Array(5).fill().map(() => all[Math.floor(Math.random() * all.length)]);
  const board = Array(20).fill().map(() => all[Math.floor(Math.random() * all.length)]);

  return (
    <div className="App">
      <header className="App-header">
        <div id="board">
          {board.map(card => <img src={card} />)}
        </div>
        <div id="hand">
          {hand.map(card => <img src={card} />)}
        </div>
      </header>
    </div>
  );
}

export default App;
