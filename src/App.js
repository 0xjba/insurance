import './App.css';
import Insure from './insure';
import myContractAbi from './Insurance.json'

function App() {
  return (
    <div className="App">
      <Insure contractAddress="0x0020407a683d8AA20A22F2230cFa0D8057F3FDf4" contractAbi={myContractAbi} />
    </div>
  );
}

export default App;
