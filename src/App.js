import './App.css';
import Insure from './insure';
import myContractAbi from './Insurance.json'

function App() {
  return (
    <div className="App">
      <Insure contractAddress="0xcb1E1927016fb407CB95B092B111a7E5C0c4b1C0" contractAbi={myContractAbi} />
    </div>
  );
}

export default App;
