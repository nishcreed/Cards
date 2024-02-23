import { useSelector,useDispatch } from 'react-redux';
import { startGame } from '../../redux/game/gameAction';
import { useState } from 'react';
import Card from '../card/card';

export default function Game(){
    const [won,setWon] = useState(false);
    const start = useSelector(state => state.start);
    const dispatch = useDispatch();

    return (
        <>
        <button type="button" className="btn btn-outline-success" onClick={() => dispatch(startGame())} >Start</button>
        {won && <span>"You Won"</span>}
        <div className='cards'>

            <Card ind={0}/>
            <Card ind={1}/>
            <Card ind={2}/>
            <Card ind={3}/>
            <Card ind={4}/>
        </div>
        </>
    )
}