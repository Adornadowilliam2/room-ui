import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Slide
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useDropzone } from 'react-dropzone'; 
import { deleteRoom, updateRoom, storeRoom } from "../api/room";
import { toast } from "react-toastify";
import $ from "jquery";
import classroom from "../assets/classroom-xxl.png"


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function Roompage({
  rooms,
  user,
  cookies,
  retrieve,
  roomTypes,
}) {
  const [addDialog, setAddDialog] = useState(null);
  const [viewDialog, setViewDialog] = useState(null);
  const [editDialog, setEditDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [roomTypeId, setRoomTypeId] = useState(null);
  const [imageFile, setImageFile] = useState(null); 
  const contentRef = useRef(null);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setImageFile(acceptedFiles[0]); 
    },
    accept: 'image/*',  
  });

  const handleDeleteRoom = (id) => {
    deleteRoom(cookies.AUTH_TOKEN, id).then((res) => {
      if (res?.ok) {
        toast.success(res.message);
        retrieve();
        setDeleteDialog(null);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleEditRoom = (id) => {
    const form = new FormData();
    const body = {
      room_name: editDialog?.room_name,
      room_type_id: editDialog?.room_type_id,
      location: editDialog?.location,
      description: editDialog?.description,
      capacity: editDialog?.capacity,
    };
    updateRoom(body, cookies.AUTH_TOKEN, id).then((res) => {
      if (res?.ok) {
        toast.success(res.message);
        retrieve();
        setEditDialog(null);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    const body = new FormData();
    body.append("room_name", $("#room_name").val());
    body.append("capacity", $("#capacity").val());
    body.append("room_type_id", roomTypeId);
    body.append("location", $("#location").val());
    body.append("description", $("#description").val());
    body.append("image", imageFile);  

    storeRoom(body, cookies.AUTH_TOKEN).then((res) => {
      if (res?.ok) {
        toast.success(res?.message);
        setAddDialog(false);
        retrieve();
      } else {
        toast.error(res?.message);
      }
    });
  };

  return (
    <Container ref={contentRef}>
      <Box>
        <Button
          variant="contained"
          onClick={() => setAddDialog(true)}
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Rooms
        </Button>
      </Box>

      <Dialog open={!!addDialog}    aria-describedby="alert-dialog-slide-description"  keepMounted component="form"  TransitionComponent={Transition} onSubmit={handleAddRoom}>
        <DialogTitle style={{display:"flex",alignItems:"center", gap:"10px"}}> <img src={classroom} alt="classroom icon" width={"50px"} /> Add Room</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ mt: 2 }}
            label="Room Name"
            variant="outlined"
            fullWidth
            id="room_name"
            required
          />
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel id="room-type-label">Room Type</InputLabel>
            <Select
              value={roomTypeId}
              displayEmpty
              fullWidth
              onChange={(e) => setRoomTypeId(e.target.value)}
            >
              {roomTypes.map((roomType) => (
                <MenuItem value={roomType.id} key={roomType.id}>
                  {roomType.room_type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            sx={{ mt: 2 }}
            label="Location"
            variant="outlined"
            fullWidth
            id="location"
            required
          />
          <TextField
            sx={{ mt: 2 }}
            label="Description"
            variant="outlined"
            id="description"
            fullWidth
            required
          />
          <TextField
            sx={{ mt: 2 }}
            label="Capacity"
            id="capacity"
            variant="outlined"
            fullWidth
            required
          />
          
          {/* Drag and Drop or File Input */}
          <Box sx={{ mt: 2 }} {...getRootProps()} style={{ border: '2px dashed #aaa', padding: '10px', cursor: 'pointer' }}>
            <input {...getInputProps()} />
            {imageFile ? (
              <Typography variant="body2">Selected file: {imageFile.name}</Typography>
            ) : (
              <Typography variant="body2">Drag and drop an image, or click to select one</Typography>
            )}
          </Box>
          
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              setAddDialog(false);
              setRoomTypeId(null);
              setImageFile(null);  
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" color="success" type="submit">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remaining room list rendering and other dialogs */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {rooms.map((room) => (
          <Box sx={{ mt: 2, border: "1px solid black", p: 2 }} key={room.id}>
            <img
              src={
                room.image || ""
              }
              alt="No image"
              style={{ width: "300px", height: "200px", objectFit: "cover" }}
            />
            <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
              {room.room_name}
            </Typography>
            <Typography sx={{ color: "dimgray", fontSize: "16px" }}>
              {room?.roomtypes?.room_type || "No RoomType"}
            </Typography>
            <Typography sx={{ color: "dimgray", fontSize: "14px" }}>
              Location: {room.location}
            </Typography>
            <Typography sx={{ color: "dimgray", fontSize: "14px" }}>
              Description: {room.description}
            </Typography>
            <Typography sx={{ color: "dimgray", fontSize: "14px" }}>
              Capacity: {room.capacity}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="info"
                sx={{ mr: 2 }}
                onClick={() => setViewDialog(room)}
              >
                View
              </Button>
              {user?.role === "admin" && (
                <>
                  <Button
                    variant="contained"
                    color="warning"
                    sx={{ mr: 2 }}
                    onClick={() => setEditDialog(room)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setDeleteDialog(room.id)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Dialogs for Edit, View, Delete */}
            <Dialog open={!!viewDialog}>
        <DialogTitle>View Room</DialogTitle>
        <DialogActions>
          <Button
            variant="contained"
            color="info"
            onClick={() => setViewDialog(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!editDialog}>
        <DialogTitle>View Room</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ mt: 2 }}
            label="Room Name"
            variant="outlined"
            fullWidth
            value={editDialog?.room_name}
            onChange={(event) => {
              setEditDialog({ ...editDialog, room_name: event.target.value });
            }}
          />
          <Select
            value={editDialog?.room_type_id}
            sx={{ mt: 2 }}
            displayEmpty
            fullWidth
            onChange={(event) => {
              setEditDialog({
                ...editDialog,
                room_type_id: event.target.value,
              });
            }}
          >
            {roomTypes.map((room_type) => (
              <MenuItem value={room_type.id} key={room_type.id}>{room_type.room_type}</MenuItem>
            ))}
          </Select>
          <TextField
            sx={{ mt: 2 }}
            label="Location"
            variant="outlined"
            fullWidth
            value={editDialog?.location}
            onChange={(event) => {
              setEditDialog({ ...editDialog, location: event.target.value });
            }}
          />
          <TextField
            sx={{ mt: 2 }}
            label="Description"
            variant="outlined"
            fullWidth
            value={editDialog?.description}
            onChange={(event) => {
              setEditDialog({ ...editDialog, description: event.target.value });
            }}
          />
          <TextField
            sx={{ mt: 2 }}
            label="Capacity"
            variant="outlined"
            fullWidth
            value={editDialog?.capacity}
            onChange={(event) => {
              setEditDialog({ ...editDialog, capacity: event.target.value });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="info"
            onClick={() => setEditDialog(null)}
          >
            Cancel
          </Button>
          <Button variant="contained" color="warning" onClick={() => handleEditRoom(editDialog.id)}>
            Edit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!deleteDialog}>
        <DialogTitle>Delete Room</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this room? <br /> This action cannot
            be undone
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="info"
            onClick={() => setDeleteDialog(null)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteRoom(deleteDialog)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
