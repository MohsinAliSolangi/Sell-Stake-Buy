import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Countdown from 'react-countdown'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import tokenAbi from "../ethereum/BrnToken.json";
import tokenAddress from '../ethereum/BrnToken-address.json'
import { ethers } from "ethers"
const { ethereum } = window;

//contract 
const signer = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const token = new ethers.Contract(tokenAddress.address, tokenAbi.abi, signer)
  return token;
}

function Stake ({withdraw,walletAddress,items,idxx}) {
  const [loading, setloading] = useState(false);



  
const WithdrawStakingTokens = async()=>{
  try {
    setloading(true);
    await signer().WithdrawStakingTokens(items.satkeId.toString());
    alert("successfully Withdraw")
    setloading(false);
    window.location.reload();
  } catch (error) {
    console.log(error)
    setloading(false);
  }
  
}



const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return 'completed';
  } else {
    // Render a countdown
    return <span>{hours}:{minutes}:{seconds}</span>;
  }
};


return (<>
    <div>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
      RemainTime: <Countdown date={items.stakingEndTime * 1000} renderer={renderer} />
          <br/>
            {items.satkeId.toString()}
          </Typography>
          <Typography variant="h5" component="div">
          {items.tokens.toString()}
          </Typography>
          <Typography sx={{ mb: 2 }} color="text.secondary">
          {items.staker} 
          </Typography>
          <Typography variant="body3">
            Staking Tokens 
          </Typography>
        </CardContent>
     </Card>
      </div>
      <button onClick={WithdrawStakingTokens} className="button is-link " disabled={loading}>
              WithDraw Tokens
      </button>
  </>
  )
}

export default Stake
