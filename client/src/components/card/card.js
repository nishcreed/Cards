import { useDispatch, useSelector } from 'react-redux';
import './card.css';
import { flipCard, shuffleCards } from '../../redux/game/gameAction';
import { useEffect } from 'react';


export default function Card({ind}) {

    const shuffle = useSelector(state => state.shuffle);
    const cnt = useSelector(state => state.cnt);
    const start = useSelector(state => state.start);
    const cards = useSelector(state => state.cards);
    const username = useSelector(state => state.username);
    const dispatch = useDispatch();
    var type = cards[ind];

    useEffect(()=>{
        if(shuffle){
            var card = document.getElementById(`card${ind}`);
            card.style.opacity = '1';
            if(ind == 4){
                card.style.pointerEvents = 'auto';
                card.style.cursor = 'pointer';
            }
            var inner = document.getElementById(`inner${ind}`);
            inner.style.transform = '';
            setTimeout(()=>{
                dispatch(shuffleCards(false));
            },800);    
        }
    },[shuffle])

    useEffect(()=>{
        if(username){
            if(cnt<ind){
                var inner = document.getElementById(`inner${ind}`);
                inner.style.transform = 'rotateY(180deg)';
                setTimeout(function() {
                    var card = document.getElementById(`card${ind}`);
                    card.style.opacity = '0';
                    card.style.pointerEvents = 'none';
                }, 600);
            }
            else if(cnt >=ind ){
                var card = document.getElementById(`card${ind}`);
                card.style.opacity = '1';
                if(ind == 4){
                    card.style.pointerEvents = 'auto';
                    card.style.cursor = 'pointer';
                }
                var inner = document.getElementById(`inner${ind}`);
                inner.style.transform = '';
            }
        }
    },[username])

    const flip = () =>{
        var inner = document.getElementById(`inner${ind}`);
        inner.style.transform = 'rotateY(180deg)';
        setTimeout(function() {
            var card = document.getElementById(`card${ind}`);
            card.style.opacity = '0';
            card.style.pointerEvents = 'none';
            
            setTimeout(()=>{
                switch(type){
                    case 'Cat':
                        dispatch(flipCard('cat'));
                        break;
                    case 'Defuse':
                        dispatch(flipCard('defuse'));
                        break;
                    case 'Shuffle':
                        dispatch(shuffleCards(true));
                        break;
                    case 'Explode':
                        dispatch(flipCard('explode'));
                        break;
                }
            },800)
        }, 600);

    }

    const getSymbol = (type) => {
        switch (type) {
            case "Cat":
              return <span className="symbol">🐱</span>;
            case "Shuffle":
              return <span className="symbol">↻</span>;
            case "Defuse":
              return <span className="symbol">✨</span>;
            case "Explode":
              return <span className="symbol">💥</span>;
            default:
              return "Unknown";
          }
    }
    const getBackColor = (type) => {
        switch(type){
            case 'Explode':
                return '#333333'
            case 'Cat':
                return '#FFF8DC'
            case 'Shuffle':
                return '#32CD32'
            case 'Defuse':
                return '#008080'
        }
        
    }
    return(
        <div id={`card${ind}`} className="card" 
        style={(start && (cnt == ind)) ? {pointerEvents:'auto',cursor:'pointer'}:{pointerEvents:'none',cursor:'none'}} 
        onClick={flip}>
        <div id={`inner${ind}`} className="card-inner">
            <div className="card-front">
            </div>
            <div className="card-back" style={{backgroundColor: (shuffle? '#8B0000' :(type ? getBackColor(type) : '#8B0000'))}}>
            <span className="symbol top-left">{getSymbol(type)}</span>
            <span className="symbol top-right">{getSymbol(type)}</span>
            <span className="symbol bottom-left">{getSymbol(type)}</span>
            <span className="symbol bottom-right">{getSymbol(type)}</span>

            <span className="center-text" style={{color:type == 'Cat' ? 'black' : ''}}>{shuffle ? '' : type}</span>
            </div>
        </div>
        </div>
    )
}