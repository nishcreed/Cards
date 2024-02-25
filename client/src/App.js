import './App.css';
import {useDispatch, useSelector } from 'react-redux';

import { BrowserRouter as Router,Route,Routes  } from "react-router-dom";
import { useEffect, useState } from 'react';
import Game from './components/game/game';
import Home from './components/home/home';
import Navbar from './components/navbar/navbar';
import Leaderboard from './components/leaderboard/leaderboard';
import { lBoardUpdate } from './redux/game/gameAction';

function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws')
    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      console.log('Message received from server:');
      dispatch(lBoardUpdate(true));
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
    window.addEventListener('beforeunload', () => {
      console.log('WebSocket connection closed');
      ws.close();
    });

    return () => {
      ws.close();
    };
    
  }, []);

  return (
    
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

  );
}

export default App;
