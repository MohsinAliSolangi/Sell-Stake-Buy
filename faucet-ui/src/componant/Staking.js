import React from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import tokenAbi from "../ethereum/BrnToken.json";
import tokenAddress from '../ethereum/BrnToken-address.json'
import { ethers } from "ethers"
const { ethereum } = window;




const signer=()=>{
  const provider = new ethers.providers.Web3Provider(window.ethereum)
    //Setsigner
  const signer = provider.getSigner()
  const token = new ethers.Contract(tokenAddress.address, tokenAbi.abi, signer)
  return token;
  }
  

const Staking = ({walletAddress,item,idx}) => {
    
  const BuyToken= async()=>{
  console.log(signer())
  let id = await item.tokenId.toString();  
  console.log(id,item.tokens)
  await signer().BuyToken(item.tokenId,item.tokens,{value:item.price})
    alert("Successfully Buy");
}




return (
    <div>
  {item.price > 0 ?
              <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                   {item.seller}
        </Typography>
        <Typography variant="h5" component="div">
                   {item.tokens.toString()} Tokens
        </Typography>
        <Typography sx={{ mb: 2 }} color="text.secondary">
                {item.price.toString()} Price
        </Typography>
        <Typography variant="body3">
         Listing For Sale 
          <br />
          {'"This is MrS Token"'}
        </Typography>
      </CardContent>
     <button onClick={BuyToken} className="button is-link ">
                  Buy Tokens
      </button>
  </Card>
:""}
    
    </div>
  )
}

export default Staking
