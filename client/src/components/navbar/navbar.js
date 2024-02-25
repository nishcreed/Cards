import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { log, setState } from "../../redux/game/gameAction";

export default function Navbar() {

    const dispatch = useDispatch();
    const username = useSelector(state => state.username);

    const login = async () => {
        const ip = document.getElementById('username');
        const username = ip.value;
        ip.value = '';

        const res = await axios.get(`/game?username=${username}`);
        if (res.status === 200) {
            alert(`Your game has been restored, ${username}`)
            dispatch(setState(res.data));
        } else if (res.status === 204) {
            dispatch(log(username));
        } else {
            console.log('Unexpected status code:', res.status);
        }
    }

    return(
        <nav  className="navbar navbar-expand-lg fixed-top bg-body-tertiary"  data-bs-theme="dark">
            <div style={{color:'#FFF8DC'}} className="container-fluid">
                <Link className="navbar-brand" to="/">Exploding Kitten</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to={'/game'}>Game</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to={'/leaderboard'}>Leaderboard</Link>
                    </li>
                </ul>
                <form class="d-flex" role="search" onSubmit={(e) => {e.preventDefault();login()}}>
                <input id="username" class="form-control me-2" type="search" placeholder={username?`Hello, ${username}`:"Enter username"} aria-label="Search" />
                <button class="btn btn-outline-success" type="submit">Login</button>
                </form>
                </div>
            </div>
        </nav>
    )
}