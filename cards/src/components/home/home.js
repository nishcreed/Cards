import './home.css'

export default function Home() {
    return (
        <div id='home'>
        <h1 className='heading'>Exploding Kitten</h1>
        <h2 className='heading'>Welcome to the game!</h2>
        <div className="body">
            <span>There are 4 different types of cards</span>
            <ul>
                <li>Cat card</li>
                <li>Defuse card</li>
                <li>Shuffle card</li>
                <li>Exploding kitten card</li>
            </ul>
            <p>There will be a button to start the game. When the game is started there will be a deck of 5 cards ordered randomly. Each time user clicks on the deck a card is revealed and that card is removed from the deck. A player wins the game once he draws all 5 cards from the deck and there is no card left to draw. </p>
            <span>Rules :</span>
            <ul>
                <li>If the card drawn from the deck is a cat card, then the card is removed from the deck.</li>
                <li>If the card is exploding kitten (bomb) then the player loses the game.</li>
                <li>If the card is a defusing card, then the card is removed from the deck. This card can be used to defuse one bomb that may come in subsequent cards drawn from the deck.</li>
                <li>If the card is a shuffle card, then the game is restarted and the deck is filled with 5 cards again.</li>
            </ul>
            <span>Hope you don't get frustrated :)</span>
        </div>
        </div>
        
    )
}