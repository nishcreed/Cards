import logo from './logo.svg';
import './App.css';
import { Provider } from 'react-redux';
import store from './redux/store';
import Game from './components/game/game';

function App() {

  return (
    <Provider store={store}>
      <div className="App">
        <Game/>
      </div>
    </Provider>
  );
}

export default App;
