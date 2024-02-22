import './card.css';
import { useEffect } from 'react';
export default function Card({name,ind}) {

    useEffect(()=>{
        switch(ind){
            case 0:
                var card = document.getElementById(`card${ind}`);
                card.style.right = '20px';
                card.style.top = '20px';
                break;
            case 1:
                var card = document.getElementById(`card${ind}`);
                card.style.right = '10px';
                card.style.top = '10px';
                break;
            case 2:
                var card = document.getElementById(`card${ind}`);
                card.style.right = '-10px';
                card.style.top = '-10px';
                break;
            case 3:
                var card = document.getElementById(`card${ind}`);
                card.style.right = '-20px';
                card.style.top = '-20px';
                break;
            default:
                break;
        }
    },[]);

    const flip = () =>{
        var inner = document.getElementById(`inner${ind}`);
        inner.style.transform = 'rotateY(180deg)';
        setTimeout(function() {
            var card = document.getElementById(`card${ind}`);
            card.style.opacity = 0;
            card.style.pointerEvents = 'none';
        }, 600);
    }
    return(
        <div id={`card${ind}`} className="card" onClick={flip}>
        <div id={`inner${ind}`} className="card-inner">
            <div className="card-front">
            </div>
            <div className="card-back">
            <span>{name}</span>
            </div>
        </div>
        </div>
    )
}