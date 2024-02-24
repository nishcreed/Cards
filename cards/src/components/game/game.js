import { useSelector,useDispatch } from 'react-redux';
import { log, shuffleCards, startGame } from '../../redux/game/gameAction';
import './game.css'
import Card from '../card/card';
import axios from 'axios';
import { useEffect } from 'react';

export default function Game(){
    const start = useSelector(state => state.start);
    const msg = useSelector(state => state.msg);
    const won = useSelector(state => state.won);
    const username = useSelector(state => state.username)
    const dispatch = useDispatch();
    const login = () => {
        const ip = document.getElementById('username');
        const username = ip.value;
        ip.value = '';
        dispatch(log(username));
    }

    useEffect(()=>{
        if(won){
            console.log('hi');
            axios.post('/leaderboard',{username:username})
            .then((res)=>{
                console.log(res.data.message);
            })
            .catch((err)=>{
                console.log(err);
            })
        }
    },[won])

    return (
        <div className='game'>
            <div class="input-group" style={{width:'30%',marginBottom:'30px'}}>
                <input type="text" id="username" class="form-control" placeholder={username?`Logged in as ${username}`:'Log in with an username to play'} aria-label="Text input with segmented dropdown button" />
                <button onClick={login} type="button" class="btn btn-outline-secondary">Log in</button>
            </div>

            <button type="button" className="btn btn-outline-secondary" style={{pointerEvents:!username?'none':''}}
            onClick={() =>{start==false ? dispatch(startGame()) : dispatch(shuffleCards(true))}}>Start</button>
            <span className='msg heading'>{won ? "You have won!..Press start for another game" : (!username?'Log in to play':msg) }</span>
            <div className='cards'>
                <Card ind={0}/>
                <Card ind={1}/>
                <Card ind={2}/>
                <Card ind={3}/>
                <Card ind={4}/>
            </div>
        </div>
    )
}