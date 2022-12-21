import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/material';
import { useState } from 'react';
import { BigNumber, ethers } from "ethers";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function AddItemModal({open, setOpen, getAuctions}) {

  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [minAmount, setMinAmount] = useState();
  const [loadingTxn, setLoadingTxn] = useState(false);

  const contractAddress = "0x5a41069AFd6Ff3dFCB0ED28847EAB9F5721b0e08"

  async function getAbi() {
    const data = require('../contract-files/artifacts/contracts/Escrow.sol/Escrow.json');
    const abi = data.abi;
    return abi
  }

  const handleClose = () => {
    setOpen(false);
  };

  async function addAuction() {
    const abi = await getAbi();     
    
    try {
      const { ethereum } = window;

      if (ethereum) {
        console.log("entraa")
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        setLoadingTxn(true);
        const publishTxn = await contract.PublishAuction(title, description, ethers.utils.parseUnits(minAmount, 18));

        await publishTxn.wait();
        setLoadingTxn(false);

        await getAuctions();
        handleClose();
      } else {
        toast.error("Ethereum object doesn't exist!");
      }
    } catch (error) {
      toast.error("¡Something wrong!" + error.message);
      setLoadingTxn(false);
    }
  }

  return (
    <div>
      <Dialog sx={{border: '2px solid #000'}} open={open} onClose={handleClose}>
          <DialogTitle sx={{color:'white', bgcolor: '#1A2027', borderTop: '2px solid #000', borderRight: '2px solid #000', borderLeft: '2px solid #000'}}>ADD Item</DialogTitle>
          <DialogContent sx={{color:'white', bgcolor: '#1A2027', borderRight: '2px solid #000', borderLeft: '2px solid #000'}}>
          <TextField
              sx={{input: { color: 'white'} }}
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              onChange={e => setTitle(e.target.value)}
            />       
            <TextField
              sx={{input: { color: 'white'} }}
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              onChange={e => setDescription(e.target.value)}
            />
            <TextField
              sx={{input: { color: 'white', textAlign: "end"} }}
              autoFocus
              margin="dense"
              id="price"
              label="Price"
              type="text"
              fullWidth
              variant="standard"
              onChange={e => setMinAmount(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{color:'white', bgcolor: '#1A2027', borderBottom: '2px solid #000', borderRight: '2px solid #000', borderLeft: '2px solid #000'}}>
            <LoadingButton loading={loadingTxn} variant="contained" onClick={handleClose}>Cancel</LoadingButton>
            <LoadingButton loading={loadingTxn} variant="contained" onClick={addAuction}>Add</LoadingButton>
          </DialogActions>

        
      </Dialog>
    </div>
  );
}