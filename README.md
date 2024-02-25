# Welcome to Exploding Kittens Game !

## About the game
There are 4 types of cards (cat, defuse, explode and shuffle) to play with. There will be a button to start the game. When the game is started there will 
be a deck of 5 cards ordered randomly. Each time user clicks on the deck a card is revealed and that card is removed from the deck. 
A player wins the game once he draws all 5 cards from the deck and there is no card left to draw. Player can save and resume the game later.

## Rules
- If the card drawn from the deck is a cat card, then the card is removed from the deck.
- If the card is exploding kitten (bomb) then the player loses the game.
- If the card is a defusing card, then the card is removed from the deck. This card can be used to defuse one bomb that may come in subsequent cards drawn from the deck.
- If the card is a shuffle card, then the game is restarted and the deck is filled with 5 cards again.

## How to run locally
- Install [NodeJs](https://nodejs.org/en), [Golang](https://go.dev/) and [Redis](https://redis.io/)
- Dwonload the zip of this repository
- Start the Redis server by running ```redis-server``` in a terminal (wsl in windows)
- In the extracted folder, run the following commands in order:
  - ```npm instal```
  - ```npm run depend```
  - ```npm run dev```
- Open a browser and type ```http://localhost:3000``` in address bar
