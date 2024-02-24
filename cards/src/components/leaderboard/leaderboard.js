import { useEffect, useState } from 'react'
import './leaderboard.css'
import axios from 'axios'

export default function Leaderboard() {
    const [leaderboard,setLeaderboard] = useState([]);
    useEffect(()=>{
        async function get(){
            try {
                const {data} = await axios.get('/leaderboard');
                setLeaderboard(data); // Assuming response.data is an array of users
                console.log(data,typeof(data));
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        }
        get();
    },[])
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
            {leaderboard.map((user,ind)=>{return( 
            <tr>
                <th scope="row">{ind+1}</th>
                <td>{user.username}</td>
                <td>{user.score}</td>
            </tr>
            )})}
        </tbody>
        </table>
        </div>
    )
}