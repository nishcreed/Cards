import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Navbar() {
    const username = useSelector(state => state.username);

    const logout = () => {

    }

    return(
        <nav className="navbar navbar-expand-lg fixed-top bg-body-tertiary"  data-bs-theme="dark">
            <div className="container-fluid">
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
                {/* <ul className="navbar-nav mb-2 mb-lg-0">
                    {   !username &&
                        <li className="nav-item ml-auto">
                        <Link className="nav-link" to={'/login'}>Login</Link>
                        </li> 
                    }
                    {
                        username &&
                        <li className="nav-item ml-auto">
                        <span className="nav-link">Hey, {username}</span>
                        </li>
                    }
                    {   username &&
                        <>
                        <li className="nav-item ml-auto">
                        <Link className="nav-link" onClick={logout}>Logout</Link>
                        </li> 
                        </>
                    }
                </ul> */}
                </div>
            </div>
        </nav>
    )
}