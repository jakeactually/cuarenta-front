import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { Home } from './Home';
import { Room } from './Room';
import { JoinRoom } from './JoinRoom';
import { Game } from './Game';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/room/:id">
            <Room />
          </Route>
          <Route path="/join-room/:id">
            <JoinRoom />
          </Route>
          <Route path="/play/:id">
            <Game />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

export default App;
