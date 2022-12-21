import Head from 'next/head'
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { AppBar, Box, Button, Grid, Modal, Paper, styled, TextField, Toolbar, Typography } from '@mui/material';
import AddItemModal from '../components/AddItemModal';

const Item = styled(Paper)(() => ({
  backgroundColor: '#1A2027',
  textAlign: 'center',
  color: 'white',
}));

export default function Home() {
  const [address, setAddress] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");
  const [balance, setBalance] = useState<Number>();
  const [connected, setConnected] = useState(false);
  const [open, setOpen] = useState(false);
  const [offer, setOffer] = useState("");
  const [owner, setOwner] = useState(false);
  const [openModalAddItem, setOpenModalAddItem] = useState(false);
  const [bidSuccess, setBidSuccess] = useState("");
  const [closeSuccess, setCloseSuccess] = useState("");
  const [approveSuccess, setApproveSuccess] = useState("");
  const [showAuction, setShowAuction] = useState<boolean>(true);

  const [auctions, setAuctions] = useState([]);
  const [escrows, setEscrows] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState([]);
  const [selectedEscrow, setSelectedEscrow] = useState([]);

  const contractAddress = "0x5a41069AFd6Ff3dFCB0ED28847EAB9F5721b0e08"

  const handleOpenAuction = async (auction) => {
    setOpen(true);
    await setSelectedAuction(auction);
  }

  const handleOpenEscrow = async (escrow) => { 
    setOpen(true);
    await setSelectedEscrow(escrow);
  }

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

  async function getAbi() {
    const data = require('../contract-files/artifacts/contracts/Escrow.sol/Escrow.json');
    const abi = data.abi;
    return abi
  }

  function formatBalance(unformattedBalance: String) {
    const options = { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 4 
    }
    const formattedBalance = Number(unformattedBalance).toLocaleString('en', options)
    return Number(formattedBalance)
  }

  function formatAddress(unformattedAddress: String){
    if(unformattedAddress != undefined){
      const addressStart = unformattedAddress.substring(0, 5);
      const addressEnd = unformattedAddress.substring(unformattedAddress.length-5, unformattedAddress.length);
      return(`${addressStart}...${addressEnd}`)
    }
    formatAddress(unformattedAddress)
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

        const balanceBN = await provider.getBalance(accounts[0]);
        const balance = formatBalance(ethers.utils.formatEther(balanceBN));
        setBalance(balance);

        setConnected(true);

      } catch (error) {
        console.log(error);
      }
    }
  }

  async function getAuctions() {
    const abi = await getAbi();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const auctions = await contract.GetAuctions()
    setAuctions(auctions)
    setShowAuction(true)
    console.log(auctions)
    return(auctions)
  }

  useEffect(() => {
    getAuctions();  
  }, [])
  

  async function getEscrows() {
    const abi = await getAbi();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const escrows = await contract.GetEscrows()
    setEscrows(escrows)
    setShowAuction(false)
    console.log(escrows)
    return(escrows)
  }

  async function submitOffer(id) {
    //Call contract function
    const abi = await getAbi();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const tx = await contract.connect(signer).Bid(id, {value: ethers.utils.parseEther(offer)});
    const receipt = await tx.wait()
    setBidSuccess(`Bid successful!`)
    getAuctions()
    setTimeout(() => {
      setBidSuccess(``)
    }, 5000)
  }

  async function closeAuction(id) {
    const abi = await getAbi();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const tx = await contract.connect(signer).Close(id);
    const receipt = await tx.wait()
    setCloseSuccess(`Auction Close Successful!`)
    getAuctions()
    setTimeout(() => {
      setCloseSuccess(``)
    }, 5000)
  }

  async function approveEscrow(id) {
    const abi = await getAbi();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const tx = await contract.connect(signer).Approve(id);
    const receipt = await tx.wait()
    setApproveSuccess(`Escrow Approval Successful!`)
    getEscrows()
    setTimeout(() => {
      setApproveSuccess(``)
    }, 5000)
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

      <AddItemModal open={openModalAddItem} setOpen={setOpenModalAddItem} getAuctions={getAuctions} />

      <Box sx={{ flexGrow: 1 }}>
        <AppBar sx={{ background: '#1A2027' }} position="fixed">
          <Toolbar>
            <img id="logo" height="50px" src="/logo.jpg"/>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              ExCrow
            </Typography>

            <Box sx={{ flexGrow: 1, justifyContent: 'start', display: 'flex', gap: 3, fontSize: 16 }}>
              {connected ? <Button variant="contained" onClick={handleClickOpenModalAddItem}>ADD Item</Button> : "" }
              {connected ? <Button variant="contained" onClick={getAuctions}>Show Auctions</Button> : "" }
              {connected ? <Button variant="contained" onClick={getEscrows}>Show Escrows</Button> : "" }
            </Box>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: 16 }}>
              Connected Account: {formattedAddress}
            </Typography>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: 16 }}>
              ETH Balance: {balance?.toString()}
            </Typography>
            
            <Box sx={{ flexGrow: 1, justifyContent: 'end', display: 'flex', fontSize: 16 }}>
              <Button color="inherit" onClick={connectWallet}>
                <img height="40px" src="/metamask.png"/>
                {connected ? 'Connection Successful!' : 'Connect to MetaMask'}
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {showAuction ?
      <Box sx={{ marginTop: 15 }}>
        <Grid container spacing={{ xs: 2, md: 2 }}  columns={{ xs: 2, sm: 4, md: 20 }}>
          {auctions.map((auction) => {
            if(auction.active){
              return (
                <Grid item xs={6} sm={6} md={4} lg={2} key={auction.id}>
                  <Item id="auctions" onClick={() => {handleOpenAuction(auction)}} sx={{color: 'white', padding: 5}}>
                    <Typography variant="h4" component="div" sx={{ marginY: 2 }}>
                      {auction.tittle}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ textAlign: 'justify' }}>
                      {auction.description}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ marginY: 2, textAlign: 'start' }}>
                          Highest Bid: <br/>{ethers.utils.formatEther(auction.minAmount.toString())} ETH
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ marginY: 2, textAlign: 'start' }}>
                          Highest Bidder: <br/>{formatAddress(auction.highestBidder)}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ marginY: 2, textAlign: 'start' }}>
                          Seller: <br/>{formatAddress(auction.owner)}
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
                        {selectedAuction.tittle}
                      </Typography>
  
                      <Typography variant="h6" component="div" sx={{ textAlign: 'justify', marginY: 2 }}>
                        {selectedAuction.description}
                      </Typography>
  
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                        <TextField placeholder='0.0' sx={{input: { color: 'white', background: '#FFFFFF22', borderRadius: '10px', textAlign: "end" } }} variant="outlined" onChange={e => setOffer(e.target.value)}/>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                        <Button variant="contained" onClick={() => {submitOffer(selectedAuction.id)}}>Make Offer!</Button>
                        <Button variant="contained" onClick={() => {closeAuction(selectedAuction.id)}}>Close Auction!</Button>
                      </Box>
  
                      <Typography sx={{ flexGrow: 1, textAlign: 'center', color:'green' }} variant="h6" component="div">
                          {bidSuccess} {closeSuccess}
                      </Typography>
                    </Box>
                  </Modal>
                </Grid>
              )
            }
          })}
        </Grid>
      </Box>
      :
      <Box sx={{ marginTop: 15 }}>
        <Grid container spacing={{ xs: 2, md: 2 }}  columns={{ xs: 2, sm: 4, md: 20 }}>
          {escrows.map((escrow) => {
            if(escrow.active){
              return (
                <Grid item xs={6} sm={6} md={4} lg={2} key={escrow.id}>
                  <Item id="auctions" onClick={() => {handleOpenEscrow(escrow)}} sx={{color: 'white', padding: 5}}>
                    <Typography variant="h6" component="div" sx={{ marginY: 2, textAlign: 'start' }}>
                      Buyer: {formatAddress(escrow.buyer)}
                    </Typography>
                    {escrow.buyerApproved ? <Typography variant="h6" component="div" sx={{ marginY: 2, textAlign: 'start', color: 'green' }}>Approved!</Typography> : <Typography variant="h6" component="div" sx={{ marginY: 2, textAlign: 'start', color: 'red' }}>Pending...</Typography>}
                    <Typography variant="h6" component="div" sx={{ marginY: 2, textAlign: 'start' }}>
                      Owner: {formatAddress(escrow.owner)}
                    </Typography>
                    {escrow.ownerApproved ? <Typography variant="h6" component="div" sx={{ marginY: 2, textAlign: 'start', color: 'green' }}>Approved!</Typography> : <Typography variant="h6" component="div" sx={{ marginY: 2, textAlign: 'start', color: 'red' }}>Pending...</Typography>}
                  </Item>
  
                  <Modal open={open} onClose={handleClose}>
                    <Box sx={modalStyle}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end'}}>
                        <Button variant="contained" onClick={handleClose}>
                          X
                        </Button>
                      </Box>
  
                      <Typography variant="h6" component="div" sx={{ marginY: 2, textAlign: 'start' }}>
                          Buyer:
                      </Typography>
                      {escrow.buyerApproved ? <Typography variant="h6" component="div" sx={{ marginY: 2, textAlign: 'start', color: 'green' }}>Approved!</Typography> : <Typography variant="h6" component="div" sx={{ marginY: 2, textAlign: 'start', color: 'red' }}>Pending...</Typography>}
                      <Typography variant="h6" component="div" sx={{ marginY: 2, textAlign: 'start' }}>
                          Owner:
                      </Typography>
                      {escrow.ownerApproved ? <Typography variant="h6" component="div" sx={{ marginY: 2, textAlign: 'start', color: 'green' }}>Approved!</Typography> : <Typography variant="h6" component="div" sx={{ marginY: 2, textAlign: 'start', color: 'red' }}>Pending...</Typography>}
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                        <Button variant="contained" onClick={() => {approveEscrow(escrow.id)}}>
                          Approve Escrow
                        </Button>
                      </Box>
  
                      <Typography sx={{ flexGrow: 1, textAlign: 'center', color:'green' }} variant="h6" component="div">
                          {approveSuccess}
                      </Typography>
                    </Box>
                  </Modal>
                </Grid>
              )
            }
          })}
        </Grid>
      </Box>
      }

    </>
  )
}