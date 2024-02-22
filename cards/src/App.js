import logo from './logo.svg';
import './App.css';
import Card from './components/card';
import { useState } from 'react';

function App() {

  const [card_names,setCardNames] = useState(['Cat','Defuse','Shuffle','Explode']);
  const [won,setWon] = useState(false);

  const shuffle = () => {
    var array = [...card_names];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generate random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements at i and j
    }
    setCardNames(array);
  }

  return (
    <div className="App">
      <button type="button" className="btn btn-outline-success" onClick={shuffle}>Start</button>
      {won && <span>"You Won"</span>}
      <div className='cards'>
        {
          card_names.map((name,ind) => <Card key={name} name={name} ind={ind}/>)
        }
      </div>
    </div>
  );
}

export default App;
