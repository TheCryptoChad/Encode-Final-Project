import Head from 'next/head'
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import { AppBar, Box, Button, Grid, Paper, styled, Toolbar, Typography } from '@mui/material';

//Esto es de referencia para cuando haya que importar el factory de verdad
// import { Lottery__factory } from '../typechain-types/factories/contracts/Lottery__factory'

const Item = styled(Paper)(() => ({
  backgroundColor: '#1A2027',
  textAlign: 'center',
  color: 'white',
}));

export default function Home() {
  const [address, setAddress] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");
  const [provider, setProvider] = useState<Web3Provider>();
  const [balance, setBalance] = useState<Number>();
  const [connected, setConnected] = useState(false);

  const products = [1, 2, 3, 4, 5]

  function formatBalance(unformattedBalance: String) {
    const options = { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 4 
    }
    const formattedBalance = Number(unformattedBalance).toLocaleString('en', options)
    return Number(formattedBalance)
  }


  async function connectWallet() {
    if(typeof window.ethereum){
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(accounts[0]);

        const addressStart = await accounts[0].substring(0, 6);
        const addressEnd = await accounts[0].substring(accounts[0].length-4, accounts[0].length);
        setFormattedAddress(addressStart+"..."+addressEnd);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        const balanceBN = await provider.getBalance(accounts[0]);
        const balance = formatBalance(ethers.utils.formatEther(balanceBN));
        setBalance(balance);

        setConnected(true);
        
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <Head>
        <title>Market - Excrow</title>
        <meta name="description" content="The Cryptographic Escrow dApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
      </Head>

      <Box sx={{ flexGrow: 1 }}>
        <AppBar color="primary" enableColorOnDark position="fixed">
          <Toolbar>
            <img height="60px" src="/logo.png"/>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              ExCrow
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Connected Account: {formattedAddress}
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ETH Balance: {balance?.toString()}
            </Typography>
            <Button color="inherit" onClick={connectWallet}>
              <img height="60px" src="/metamask.png"/>
              {connected ? 'Connection Successful!' : 'Connect to MetaMask'}
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      <Box sx={{ marginTop: 20 }}>
        <Grid container spacing={5} columns={3}>
          {products.map((product, index) => {
            return (
              <Grid item xs={12} sm={4} key={index}>
                <Item>
                  {product}
                </Item>
              </Grid>
            )
          })}
        </Grid>
      </Box>

    </>
  )
}
