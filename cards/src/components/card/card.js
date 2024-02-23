import { useDispatch, useSelector } from 'react-redux';
import './card.css';
import { useEffect } from 'react';
import { flipCard, shuffleCards } from '../../redux/game/gameAction';


export default function Card({ind}) {

    const cardTypes = ['Cat','Defuse','Shuffle','Explode'];
    var random= Math.floor(Math.random() * cardTypes.length);
    var type = cardTypes[random];
    const cnt = useSelector(state => state.cnt);
    const start = useSelector(state => state.start);
    const shuffle = useSelector(state => state.shuffle);
    const dispatch = useDispatch();
    console.log(cnt,shuffle)


    if(shuffle){
        var card = document.getElementById(`card${ind}`);
        card.style.opacity = '1';
        if(cnt==4){
            card.style.pointerEvents = 'auto';
            card.style.cursor = 'pointer';
        }

        var inner = document.getElementById(`inner${ind}`);
        inner.style.transform = '';
        setTimeout(()=>{
            random= Math.floor(Math.random() * cardTypes.length);
            type = cardTypes[random];
            dispatch(shuffleCards(false));
        },600);    
    }


    const flip = () =>{
        var inner = document.getElementById(`inner${ind}`);
        // inner.classList.add('flip')
        inner.style.transform = 'rotateY(180deg)';
        setTimeout(function() {
            var card = document.getElementById(`card${ind}`);
            // card.classList.add('hidden');
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
    return(
        <div id={`card${ind}`} className="card" 
        style={start && (cnt == ind) ? {pointerEvents:'auto',cursor:'pointer'}:{pointerEvents:'none',cursor:'none'}} 
        onClick={flip}>
        <div id={`inner${ind}`} className="card-inner">
            <div className="card-front">
            </div>
            <div className="card-back">
            <span style={{margin:'0 auto'}}>{type}</span>
            </div>
        </div>
        </div>
    )
}