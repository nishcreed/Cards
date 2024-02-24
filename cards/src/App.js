import './App.css';
import { Provider } from 'react-redux';
import store from './redux/store';
import { BrowserRouter as Router,Route,Routes  } from "react-router-dom";
import Game from './components/game/game';
import Home from './components/home/home';
import Navbar from './components/navbar/navbar';
import Leaderboard from './components/leaderboard/leaderboard';

function App() {

  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <Navbar></Navbar>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route path='/game' element={<Game />} />
            <Route path='/leaderboard' element={<Leaderboard />} />
          </Routes>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
