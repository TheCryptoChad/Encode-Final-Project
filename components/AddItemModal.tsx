import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/material';


export default function AddItemModal({open, setOpen}) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog sx={{border: '2px solid #000'}} open={open} onClose={handleClose}>
          <DialogTitle sx={{color:'white', bgcolor: '#1A2027', borderTop: '2px solid #000', borderRight: '2px solid #000', borderLeft: '2px solid #000'}}>List Item</DialogTitle>
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
            />
          </DialogContent>
          <DialogActions sx={{color:'white', bgcolor: '#1A2027', borderBottom: '2px solid #000', borderRight: '2px solid #000', borderLeft: '2px solid #000'}}>
            <Button variant="contained" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleClose}>Add</Button>
          </DialogActions>

        
      </Dialog>
    </div>
  );
}