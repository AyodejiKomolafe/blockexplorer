import { Alchemy, Network, Utils } from "alchemy-sdk";
import { useEffect, useState } from "react";
// import { parseEther } from "alchemy-sdk/dist/src/api/utils";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockWithTransactions, setBlockWithTransactions] = useState();
  const [miner, setMiner] = useState();
  const [blockTransactions, setBlockTransactions] = useState([]);
  const [balance, setBalance] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    async function getBlockWithTransactions() {
      const transaction = await alchemy.core.getBlockWithTransactions(
        blockNumber
      );
      const transactionsHash = transaction.hash;
      const blockMiner = transaction.miner;
      setBlockWithTransactions(transactionsHash);
      setMiner(blockMiner);
      setBlockTransactions(transaction.transactions);
    }

    getBlockNumber();
    getBlockWithTransactions();
    getBalance();
  }, []);

  async function getBalance() {
    const addr = address;
    const bal = await alchemy.core.getBalance(addr);
    setBalance(bal);
    console.log(bal);
  }

  return (
    <div id="container">
      <div className="heading">
        <div className="App">Block Number: {blockNumber}</div>
        <div className="transactions">
          Block Transaction Hash: {blockWithTransactions}
        </div>
        <div className="App">Block Miner: {miner}</div>
      </div>
      <h4> First 20 Transactions:</h4>
      <ul>
        {" "}
        {blockTransactions.slice(-20).map((tx) => (
          <li key={tx.hash}>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://etherscan.io/tx/${tx.hash}`}
            >
              {tx.hash}
            </a>
          </li>
        ))}{" "}
      </ul>
      <div className="checkBalance">
        <input
          type="text"
          placeholder="input your address here"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
        />
        <button onClick={getBalance}>Check Balance</button>
        <p>{balance._hex && parseInt(balance._hex)} Wei</p>
      </div>
    </div>
  );
}

export default App;
