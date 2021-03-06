import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { ToastProvider } from 'react-toast-notifications';

import { Home } from './Home';
import { Room } from './Room';
import { JoinRoom } from './JoinRoom';
import { Game } from './Game';
import axios from 'axios';

axios.defaults.baseURL = window.location.origin.replace('3000', '4000');
axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <ToastProvider>
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
      </ToastProvider>
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
