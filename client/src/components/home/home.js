import './home.css'

export default function Home() {
    return (
        <div id='home'>
        <h1 className='heading heading-home'>Welcome to <span className='explode'>Exploding</span> Kitten!</h1>
        <h2 className='heading sub-heading'>The Ultimate Card Game Adventure</h2>
        <div className="body">
            <div className='card-types'>
                <h3 style={{color:'#FFF8DC'}}>Types of cards:</h3>
                <ul className="card-list">
                        <li style={{color:'#FFF8DC'}}><span>🐱</span> Cat card</li>
                        <li style={{color:'#008080'}}><span>✨</span> Defuse card</li>
                        <li style={{color:'#32CD32'}}><span>↻</span> Shuffle card</li>
                        <li style={{color:'#8B0000'}}><span>💥</span> Exploding kitten card</li>
                </ul>
            </div>
            
            <div className="how-card">
            <div className="how-card-inner">
                <div className="how-card-front">
                <span className='how-span'>How To Play</span>
                </div>
                <div className="how-card-back">
                <p className='how-para'>There will be a button to start the game. When the game is started there will be a deck of 5 cards ordered randomly. Each time user clicks on the deck a card is revealed and that card is removed from the deck. 
                A player wins the game once he draws all 5 cards from the deck and there is no card left to draw. Player can save and resume the game later.</p>
                </div>
            </div>
            </div>

            <h3 style={{color:'#FFF8DC'}} className="rules-heading">Rules :</h3>
            <ul className="rules-list">
                <li>If the card drawn from the deck is a cat card, then the card is removed from the deck.</li>
                <li>If the card is exploding kitten (bomb) then the player loses the game.</li>
                <li>If the card is a defusing card, then the card is removed from the deck. This card can be used to defuse one bomb that may come in subsequent cards drawn from the deck.</li>
                <li>If the card is a shuffle card, then the game is restarted and the deck is filled with 5 cards again.</li>
            </ul>
            <span className="hope">Hope you don't get frustrated :)</span>
        </div>
        </div>
        
    )
}