import { useSelector,useDispatch } from 'react-redux';
import { log, setState, shuffleCards, startGame } from '../../redux/game/gameAction';
import './game.css'
import Card from '../card/card';
import axios from 'axios';
import { useEffect } from 'react';

export default function Game(){
    const state = useSelector(state => state);
    const start = state.start;
    const msg = state.msg;
    const won = state.won;
    const username = state.username;
    const dispatch = useDispatch();

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

    const saveState = () => {
        axios.post('/game',state)
        .then((res)=>{
            console.log(res.data.message);
        })
        .catch((err)=>{
            console.log(err);
        })
    }


    useEffect(()=>{
        if(won){
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

            <button type="button" className="btn btn-outline-light" style={{pointerEvents:!username?'none':''}}
            onClick={() =>{start==false ? dispatch(startGame()) : dispatch(shuffleCards(true))}}>Start</button>
            <span className='msg heading'>{won ? "You have won!..Press start for another game" : (!username?'Log in to play':msg) }</span>
            <div className='cards'>
                <Card ind={0}/>
                <Card ind={1}/>
                <Card ind={2}/>
                <Card ind={3}/>
                <Card ind={4}/>
            </div>
            <div className='btm' style={{opacity:!start ? '0' : '1',pointerEvents:!start ? 'none' : 'auto'}}>
                <button onClick={()=>{saveState();alert('Your progress has been saved')}} type="button" className="btn btn-outline-light">Save</button>
                <span>Press save to resume later</span>
            </div>
        </div>
    )
}