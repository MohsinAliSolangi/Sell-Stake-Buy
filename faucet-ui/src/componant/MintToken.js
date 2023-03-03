import React from 'react'
import tokenAbi from "../ethereum/BrnToken.json";
import tokenAddress from '../ethereum/BrnToken-address.json'
import { useEffect, useState, Row } from 'react'
import Staking from './Staking'
import Stake from './Stake'
import { ethers } from "ethers"
const { ethereum } = window;



const signer = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  //Setsigner
  const signer = provider.getSigner()
  const token = new ethers.Contract(tokenAddress.address, tokenAbi.abi, signer)
  return token;
}



const MintToken = ({ walletAddress }) => {
 const [loading, setloading] = useState(false);
  const [market, setMarket] = useState([]);
  const [amount, setAmount] = useState(null);
  //const [Amount, setAmount] = useState({value:"",amount:""});
  const [price, setPrice] = useState(null);
  const [stakeAmount, setStakeAmount] = useState([]);



  const ListedTokens = async () => {
  try {
      let list = await signer().ListedTokens();
      let items = []
      let lgth = list.length;
      for (let i = 0; i < lgth; i++) {
        if (list[i].price > 0) {
          items.push(list[i])
        }
      }
      setMarket(items);
    } catch (error) {
  console.log(error) 
  }
}



  



  const mints = async () => {
    try {
      setloading(true);
      await signer().mint(walletAddress, amount, { value: amount });
      setAmount("")
      setPrice("")
      alert("successfully Minted");
      setloading(false);
      window.location.reload();
    } catch (error) {
      console.log(error)
      setloading(false);
    }
  
  }



  const SellTokens = async () => {
  
    try {
      setloading(true);
    await signer().SellTokens(amount, price);
    setAmount("")
    setPrice("")
    alert("successfully lsited");
    setloading(false);
    window.location.reload();
    } catch (error) {
      console.log(error) 
      setloading(false);
    }
    
  }

  const tokenStaking = async () => {
    try {
      setloading(true);
      await signer().tokenStaking(amount);
      setAmount("");
      setloading(false);
      window.location.reload();
    } catch (error) {
      console.log(error) 
      setloading(false);
    }
  
  }

  const Stakings = async () => {
    try {
      let temp = await signer().stakingId();
    let items = []
    for (let i = 0; i <= temp; i++) {
      let stake = await signer().staking(i);
      if (stake.staker.toString().toLowerCase() === walletAddress.toString().toLowerCase()) {
        let stakes = await signer().staking(i);
        items.push(stakes)
      }
    }
    setStakeAmount(items) 
    } catch (error) {
      console.log(error) 
    }
  }

  useEffect(() => {
    ListedTokens()
    Stakings();
  }, [])
  useEffect(() => {
    if (stakeAmount.length > 0) {
      return
    }
    else {
      Stakings();
    }
  }, [stakeAmount])

  return (
    <div>
      <div className="faucet-hero-body">
        <div className="container main-content ">
          <div className="box address-box">
            <h1 className="title">Minting</h1>
            <p>Price: 0.00001 ETH </p>
            <div className="columns">
              <div className="column is-four-fifths">
                <input
                  className="input is-medium"
                  type="number"
                  required
                  placeholder="Enter Amount"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="column">
                <button onClick={mints} className="button is-link" disabled={loading}>
                  Mint
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* ///////////Staking//////////////////// */}
        <div className="container main-content" >
          <div className="box address-box">
            <h1 className="title">Staking Tokens </h1>
            <p>Staking Time 24Hr</p>
            <div className="columns">
              <div className="column is-four-fifths">
                <input
                  className="input is-medium"
                  type="number"
                  required
                  placeholder="Enter Tokens"
                  onChange={(e) => setAmount(e.target.value)}

                />
              </div>
              <div className="column">
                <button onClick={tokenStaking} className="button is-link" disabled={loading}>
                  Staking
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* ////////////Listing//////////////////// */}
        <div className="container main-content">
          <div className="box address-box">
            <h1 className="title">Listing Tokens</h1>
            <div className="columns">
              <div className="column is-four-fifths">
                <input
                  className="input is-medium"
                  type="number"
                  required
                  placeholder="Enter Tokens"
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div style={{ marginTop: "10px" }}>
                  <input
                    className="input is-medium"
                    type="number"
                    required
                    placeholder="Enter Price"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ marginTop: "30px" }} className="column">
                <button className="button is-link" onClick={SellTokens} disabled={loading}>
                  Listing
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ///////////WithDraw Token//////////////////// */}
        <div className="container main-content">
          <div className="box address-box">
            <h2 className="title">Withdraw Tokens</h2>
            <div className="columns">
              {stakeAmount.length > 0
                ? <div>
                  {stakeAmount?.map((items, idxx) => (
                    <div className='col'>
                      <Stake walletAddress={walletAddress} items={items} idxx={idxx} />
                    </div>
                  ))}</div>
                : ""
              }
              <div className="column">
              </div>
            </div>
          </div>
        </div>
      </div>





      <div style={{marginTop:"20px"}}>

        {market.length > 0 ?

          <div className="row">
            {market.map((item, idx) => (
              <div className='col'>
              <div className='col'>

                <Staking walletAddress={walletAddress} item={item} idx={idx} />
                </div>
                </div>
            ))}
          </div>
          : (
            <main style={{ padding: "1rem 0" }}>
              <h2>No Listing</h2>
              <div>
              </div>
            </main>
          )}
      </div>










    </div>
  )
}

export default MintToken
