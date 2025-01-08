import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField } from '@mui/material';
import React, { useRef, useState } from 'react'

export default function Roompage() {
    const [addDialog, setAddDialog] = useState(null);

  const contentRef = useRef(null);
  return (
    <Container ref={contentRef}>
        <Box>
            <Button variant='contained' onClick={()=>setAddDialog(true)} fullWidth sx={{mt:2}}>Add Rooms</Button>
        </Box>
        <Dialog open={!!addDialog}>
            <DialogTitle>Add Room</DialogTitle>
            <DialogContent>
            <TextField sx={{mt:2}} label='Room Name' variant='outlined' fullWidth />
            <Select value="" sx={{mt:2}}  displayEmpty fullWidth>
                <MenuItem value="" >Select a RoomType</MenuItem>
            </Select>
            <TextField sx={{mt:2}} label='Location' variant='outlined' fullWidth />
            <TextField sx={{mt:2}} label='Description' variant='outlined' fullWidth />
            <TextField sx={{mt:2}} label='Capacity' variant='outlined' fullWidth />
            <Box></Box>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='info'>Create</Button>
                <Button variant='contained' color='error' onClick={()=>setAddDialog(false)}>Cancel</Button>
            </DialogActions>
        </Dialog>
    </Container>
  )
}
