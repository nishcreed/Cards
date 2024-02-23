import { useSelector,useDispatch } from 'react-redux';
import { shuffleCards, startGame } from '../../redux/game/gameAction';
import './game.css'
import Card from '../card/card';

export default function Game(){
    const start = useSelector(state => state.start);
    const msg = useSelector(state => state.msg);
    const won = useSelector(state => state.won);
    const dispatch = useDispatch();

    return (
        <div className='game'>
        <button type="button" className="btn btn-outline-success"
        onClick={() =>{start==false ? dispatch(startGame()) : dispatch(shuffleCards(true))}}>Start</button>
        <span className='msg heading'>{won ? "You have won!..Press start for another game" : msg}</span>
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