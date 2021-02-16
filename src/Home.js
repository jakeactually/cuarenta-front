import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export const Home = ({ match }) => {
    const history = useHistory();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        axios.get('/').then(({ data }) => {
            setUserName(data.name);
        });
    }, []);
    
    return <main>
        <form>
            <input
                type="text"
                placeholder="Enter a name"
                value={userName}
                onChange={ev => setUserName(ev.target.value)}
                required />
            <br></br>
            <button
                type="button"
                className="blue-button"
                onClick={makeARoom(history, userName)}>
                Make a room
            </button>
        </form>
    </main>;
};

export const makeARoom = (history, userName) => async () => {
    const query = new URLSearchParams();
    query.append('username', userName);
    const { data, status } = await axios.post('/new-room', query);
    
    if (status === 401) {
        history.push(`/join-room/${data.room_id}`);
    } else {
        history.push(`/room/${data.room_id}`);
    }
};
