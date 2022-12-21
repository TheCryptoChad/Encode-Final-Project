import Head from 'next/head'
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { AppBar, Box, Button, Grid, Modal, Paper, styled, TextField, Toolbar, Typography } from '@mui/material';
import AddItemModal from '../components/AddItemModal';
import abi from "../contract-files/artifacts/contracts/Escrow.sol/Escrow.json";
import { Escrow__factory } from '../contract-files/typechain-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [open, setOpen] = useState(false);
  const [offer, setOffer] = useState("");
  const [owner, setOwner] = useState(false);
  const [openModalAddItem, setOpenModalAddItem] = useState(false);
  const contractAddress = "0x087b9B4C37424CDb39af8e5E45A5eb8D6Aa01C80";

  const contractABI = abi;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#1A2027',
    color: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const products = [
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
    {title: 'Racing Car', price: 0.5, description: 'An amazing antique racing car from the great year of 1922, great for collections. Almost untouched from the day it was purchased, a true necessity of a real collector.', image: '/metamask.png'},
  ]

  function formatBalance(unformattedBalance: String) {
    const options = { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 4 
    }
    const formattedBalance = Number(unformattedBalance).toLocaleString('en', options)
    return Number(formattedBalance)
  }

  const getProductsFromContract = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contractFactory = new Escrow__factory(signer);
        const _escrowContract = await contractFactory.attach(contractAddress);
        // const _escrowContract = new ethers.Contract(
        //   contractAddress,
        //   contractABI,
        //   signer
        // );
        let productos = await _escrowContract.GetAuctions();
        // setTotalQuiz(Number(ethers.utils.formatEther(count)));
        console.log("prodcust", productos);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("errorrrrr", error)
    }
  }

  useEffect(() => {
    getProductsFromContract();
  }, [])
  

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

        //Implement logic to check if owner of an item listing
        setOwner(true);
        
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function submitOffer() {
    //Call contract function
    const offerN = Number(offer);
  }

  async function closeAuction() {
    //Call contract function
  }

  const handleClickOpenModalAddItem = () => {
    setOpenModalAddItem(true);
  };

  return (
    <>
      <Head>
        <title>Market - Excrow</title>
        <meta name="description" content="The Cryptographic Escrow dApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
      </Head>

      <AddItemModal open={openModalAddItem} setOpen={setOpenModalAddItem} />

      <Box sx={{ flexGrow: 1 }}>
        <AppBar sx={{ background: '#1A2027' }} position="fixed">
          <Toolbar>
            <img id="logo" height="50px" src="/logo.jpg"/>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              ExCrow
            </Typography>

            <Box sx={{ flexGrow: 1, justifyContent: 'start', display: 'flex' }}>
              {connected ? <Button variant="contained" onClick={handleClickOpenModalAddItem}>List Item</Button> : "" }
            </Box>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Connected Account: {formattedAddress}
            </Typography>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ETH Balance: {balance?.toString()}
            </Typography>
            
            <Box sx={{ flexGrow: 1, justifyContent: 'end', display: 'flex' }}>
              <Button color="inherit" onClick={connectWallet}>
                <img height="40px" src="/metamask.png"/>
                {connected ? 'Connection Successful!' : 'Connect to MetaMask'}
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      <Box sx={{ marginTop: 15 }}>
        <Grid container spacing={{ xs: 2, md: 2 }}  columns={{ xs: 2, sm: 4, md: 20 }}>
          {products.map((product, index) => {
            return (
              <Grid item xs={6} sm={6} md={4} lg={2} key={index}>
                <Item id="products" onClick={handleOpen} sx={{color: 'white', paddingX: 5}}>
                  <img height="130px" src={product.image}/>
                  <Typography variant="h3" component="div" sx={{ marginY: 2 }}>
                    {product.title}
                  </Typography>
                  <Typography variant="h6" component="div" sx={{ textAlign: 'justify' }}>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" component="div" sx={{ marginY: 2, textAlign: 'end' }}>
                        Price: {product.price} ETH
                  </Typography>
                </Item>
                <Modal open={open} onClose={handleClose}>
                  <Box sx={modalStyle}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end'}}>
                      <Button variant="contained" onClick={handleClose}>
                        X
                      </Button>
                    </Box>
                    <Typography variant="h3" component="div" sx={{ marginY: 2 }}>
                      {product.title}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ textAlign: 'justify', marginY: 2 }}>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <TextField placeholder='0.0' sx={{input: { color: 'white', background: '#FFFFFF22', borderRadius: '10px', textAlign: "end" } }} variant="outlined" onChange={e => setOffer(e.target.value)}/>
                      <Typography sx={{ flexGrow: 1, textAlign: 'center' }} variant="h6" component="div">
                        Price: {product.price} ETH
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                      <Button variant="contained" onClick={submitOffer}>
                        Make Offer!
                      </Button>
                      {owner && <Button variant="contained" onClick={closeAuction}>Close Auction!</Button>}
                    </Box>
                  </Box>
                </Modal>
              </Grid>
            )
          })}
        </Grid>
      </Box>

    </>
  )
}
