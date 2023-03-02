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


function Stake ({walletAddress,items,idxx}) {

console.log("itemsssssssssssss",items.toString())
return (<>
    <div>
      
      {/* <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>

          </Typography>
          <Typography variant="h5" component="div">
                     {items.toString()} Tokens
          </Typography>
          <Typography sx={{ mb: 2 }} color="text.secondary">
                 
          </Typography>
          <Typography variant="body3">
           Listing For Sale 
            <br />
            {'"This is MrS Token"'}
          </Typography>
        </CardContent>
     </Card> */}
     <p>{items.toString()}</p>

      </div>
  
</>

  )
}

export default Stake
