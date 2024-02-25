import { useEffect, useState } from 'react'
import './leaderboard.css'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { lBoardUpdate } from '../../redux/game/gameAction';

export default function Leaderboard() {
    const [leaderboard,setLeaderboard] = useState([]);
    const lBoard = useSelector(state => state.lBoard)
    const dispatch = useDispatch();

    useEffect(()=>{
        async function get(){
            try {
                const {data} = await axios.get('/leaderboard');
                setLeaderboard(data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        }
        get();
    },[])
    useEffect(()=>{
        async function get(){
            try {
                const {data} = await axios.get('/leaderboard');
                setLeaderboard(data);
                dispatch(lBoardUpdate(false));
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        }
        if(lBoard){
            get(); 
        }
    },[lBoard])
    return (
        <div id='leaderboard'>
        <h1 style={{textAlign:'center'}}>Leaderboard</h1>

        <table class="table table-dark table-hover">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Username</th>
            <th scope="col">Score</th>
            </tr>
        </thead>
        <tbody>
            {leaderboard && leaderboard.map((user,ind)=>{return( 
            <tr key={`row${ind}`}>
                <th scope="row" key={`head${ind}`}>{ind+1} </th>
                <td key={`username${ind}`}>{user.username}</td>
                <td key={`score${ind}`}>{user.score}</td>
            </tr>
            )})}
        </tbody>
        </table>
        </div>
    )
}