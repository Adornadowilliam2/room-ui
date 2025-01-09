import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useRef, useState } from 'react'

export default function Roompage({rooms, user}) {
    const [addDialog, setAddDialog] = useState(null);
    const [viewDialog, setViewDialog] = useState(null);
    const [editDialog, setEditDialog] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(null);

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
        <Box sx={{display:'flex', justifyContent:"space-evenly",flexWrap:"wrap",gap:2}}>
            {   
                rooms.map((room)=> (
                    <Box sx={{mt:2, border:"1px solid black", p:2}} key={room.id}>
                        <img src={room.image || "https://mfi-cyan.vercel.app/Copy%20of%204.png"} alt="No image" style={{width:"300px"}}/>
                        <Typography sx={{fontWeight:"bold", fontSize:"18px"}}>{room.room_name}</Typography>
                        <Typography sx={{color:"dimgray", fontSize:"16px"}}>{room?.roomtypes?.room_type || "No RoomType"}</Typography>
                        <Typography sx={{color:"dimgray", fontSize:"14px"}}>Location: {room.location}</Typography>
                        <Typography  sx={{color:"dimgray", fontSize:"14px"}}>Description: {room.description}</Typography>
                        <Typography sx={{color:"dimgray", fontSize:"14px"}}>Capacity: {room.capacity}</Typography>
                        <Box sx={{mt:2}}>
                            <Button variant='contained' color='info' sx={{mr:2}} onClick={()=>setViewDialog(room)}>View</Button>
                        {
                            user?.role == "admin" ? (
                        
                            <>
                            <Button variant='contained' color='warning' sx={{mr:2}}
                            onClick={()=>setEditDialog(room)}>Edit</Button>
                            <Button variant='contained' color='error' onClick={()=>setDeleteDialog(room.id)}>Delete</Button>
                            </>
                
                            ): null
                        }
                
                        </Box>
                    </Box>
                ))
            }
        </Box>
        <Dialog open={!!viewDialog}>
            <DialogTitle>View Room</DialogTitle>
            <DialogActions>
               
                <Button variant='contained' color='info' onClick={()=>setViewDialog(false)}>Cancel</Button>
            </DialogActions>
        </Dialog>
        <Dialog open={!!editDialog}>
            <DialogTitle>View Room</DialogTitle>
            <DialogContent>
            <TextField sx={{mt:2}} label='Room Name' variant='outlined' fullWidth value={editDialog?.room_name} onChange={(event)=>{setEditDialog({...editDialog, room_name:event.target.value})} }/>
            </DialogContent>
            <DialogActions>
     
                <Button variant='contained' color='info' onClick={()=>setEditDialog(null)}>Cancel</Button>
                <Button variant='contained' color='warning' onClick={()=>{}}>Edit</Button>
            </DialogActions>
        </Dialog>
        <Dialog open={!!deleteDialog}>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogContent>
            <Typography>Are you sure you want to delete this room? <br /> This action cannot be undone</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='info' onClick={()=>setDeleteDialog(null)}>Cancel</Button>
                <Button variant='contained' color='error' onClick={()=>{}}>Delete</Button>
            </DialogActions>
        </Dialog>
    </Container>    
  )
}
