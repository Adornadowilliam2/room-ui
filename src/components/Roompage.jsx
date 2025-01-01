import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
} from "@mui/material";

import { toast } from "react-toastify";

export default function Roompage({ rooms, roomTypes, cookies, retrieve }) {
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const contentRef = useRef(null);

  return (
    <Container ref={contentRef}>
      <Box sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setAddDialog(true)}
        >
          Add Room
        </Button>

        {/* Add Room Dialog */}
        <Dialog open={!!addDialog}>
          <DialogTitle>Add Room</DialogTitle>
          <DialogContent>
            <TextField
              label="Room Name"
              fullWidth
              value={editDialog?.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              sx={{ marginBottom: "16px" }}
            />
            <FormControl fullWidth sx={{ marginBottom: "16px" }}>
              <InputLabel id="room-type-label">Room Type</InputLabel>
              <Select
                labelId="room-type-label"
                value={newRoom.roomTypeId}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, roomTypeId: e.target.value })
                }
              >
                {roomTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.room_type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Location"
              fullWidth
              value={newRoom.location}
              onChange={(e) =>
                setNewRoom({ ...newRoom, location: e.target.value })
              }
              sx={{ marginBottom: "16px" }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={newRoom.description}
              onChange={(e) =>
                setNewRoom({ ...newRoom, description: e.target.value })
              }
              sx={{ marginBottom: "16px" }}
            />
            <TextField
              label="Capacity"
              type="number"
              fullWidth
              value={newRoom.capacity}
              onChange={(e) =>
                setNewRoom({ ...newRoom, capacity: e.target.value })
              }
              sx={{ marginBottom: "16px" }}
            />
            {/* Image Drag-and-Drop Section */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddRoomClose} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleCreateRoom} variant="outlined">
              Create Room
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Room Dialog */}
        <Dialog open={editDialog} onClose={handleEditRoomClose}>
          <DialogTitle>Edit Room</DialogTitle>
          <DialogContent>
            {console.log(editDialog)}
            <TextField
              label="Room Name"
              fullWidth
              value={editDialog?.room_name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              sx={{ marginBottom: "16px" }}
            />
            <FormControl fullWidth sx={{ marginBottom: "16px" }}>
              <InputLabel id="edit-room-type-label">Room Type</InputLabel>
              <Select
                labelId="edit-room-type-label"
                value={editDialog?.room_type_id}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, roomTypeId: e.target.value })
                }
              >
                {roomTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.room_type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Location"
              fullWidth
              value={editDialog?.location}
              onChange={(e) =>
                setNewRoom({ ...newRoom, location: e.target.value })
              }
              sx={{ marginBottom: "16px" }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={editDialog?.description}
              onChange={(e) =>
                setNewRoom({ ...newRoom, description: e.target.value })
              }
              sx={{ marginBottom: "16px" }}
            />
            <TextField
              label="Capacity"
              type="number"
              fullWidth
              value={editDialog?.capacity}
              onChange={(e) =>
                setNewRoom({ ...newRoom, capacity: e.target.value })
              }
              sx={{ marginBottom: "16px" }}
            />
            {/* Optionally, add a section for editing the image */}
            <Box
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                border: dragging ? "2px dashed #3f51b5" : "2px dashed #cccccc",
                padding: "16px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              {newRoom.image ? (
                <img
                  src={URL.createObjectURL(newRoom.image)}
                  alt="Room Preview"
                  style={{ width: "100%", height: "140px", objectFit: "cover" }}
                />
              ) : (
                <Typography>Drag and drop an image here</Typography>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  sx={{ marginTop: "8px" }}
                >
                  Choose Image
                </Button>
              </label>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditRoomClose} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleEditRoom} variant="outlined">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Display Rooms */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {rooms.map((room) => (
            <Box key={room.id} sx={{ width: 300 }}>
              <img
                src={
                  room.image ||
                  "https://images.pexels.com/photos/1470945/pexels-photo-1470945.jpeg"
                }
                alt="Room Image"
                style={{ width: "100%", height: "140px", objectFit: "cover" }}
              />
              <Typography variant="h6">{room.name}</Typography>
              <Typography variant="body2">Capacity: {room.capacity}</Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleEditRoomOpen(room)}
                sx={{ marginTop: "8px" }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleDeleteRoom(room.id)}
                sx={{ marginTop: "8px" }}
              >
                Delete
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
