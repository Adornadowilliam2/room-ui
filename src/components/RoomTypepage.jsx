import { useState, useRef } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import "react-calendar/dist/Calendar.css";
import {
  destroyRoomType,
  storeRoomType,
  updateRoomType,
} from "../api/roomtype";
import { toast } from "react-toastify";

export default function RoomTypepage({
  roomTypes,
  cookies,
  retrieve,
  user,
  isSmallScreen,
}) {
  const [roomTypeName, setRoomTypeName] = useState("");
  const contentRef = useRef(null);
  const [warnings, setWarnings] = useState({});
  const [editDialog, setEditDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const handleAddRoomType = (e) => {
    e.preventDefault();
    const body = {
      room_type: roomTypeName,
    };

    storeRoomType(body, cookies.AUTH_TOKEN).then((res) => {
      if (res?.ok) {
        toast.success(res.message);
        retrieve();
        setRoomTypeName("");
        setWarnings({});
      } else {
        toast.error(res.message);
        setWarnings(res?.errors);
      }
    });
  };

  const handleEditRoomType = (id) => {
    const body = {
      room_type: editDialog?.room_type,
    };
    updateRoomType(body, cookies.AUTH_TOKEN, id).then((res) => {
      if (res?.ok) {
        toast.success(res.message);
        retrieve();
        setEditDialog(null);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleDeleteRoomType = (id) => {
    destroyRoomType(cookies.AUTH_TOKEN, id).then((res) => {
      if (res?.ok) {
        toast.success(res.message);
        retrieve();
        setDeleteDialog(null);
      } else {
        toast.error(res.message);
      }
    });
  };
  return (
    <Container sx={{ marginTop: 4 }} ref={contentRef}>
      <h2>Room Types</h2>
      {/* Add Room Type Form */}
      <TextField
        label="Room Type Name"
        variant="outlined"
        fullWidth
        value={roomTypeName}
        onChange={(e) => setRoomTypeName(e.target.value)}
        sx={{ mb: 2, mt: 2 }}
        error={!!warnings?.room_type}
        helperText={warnings?.room_type}
        size="small"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddRoomType}
        sx={{ marginBottom: 2 }}
      >
        Add Room Type
      </Button>

      {/* Room Types Table */}
      <TableContainer component={Paper}>
        <Table
          sx={{
            "& .MuiTableCell-root": {
              p: isSmallScreen ? 1 : 2,
              border: "1px solid black",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Modified At</TableCell>
              {user?.role === "admin" ? <TableCell>Actions</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {roomTypes.map((roomType) => (
              <TableRow key={roomType.id}>
                <TableCell>
                  {roomType.id + ".) " + roomType.room_type}
                </TableCell>
                <TableCell>{roomType.created_at.slice(0, 10)}</TableCell>
                <TableCell>{roomType.updated_at.slice(0, 10)}</TableCell>
                {user?.role === "admin" ? (
                  <TableCell>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => {
                        setEditDialog(roomType);
                      }}
                      sx={{ mr: 2, mb: isSmallScreen ? 2 : 0 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => setDeleteDialog(roomType.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={!!deleteDialog}>
        <DialogTitle>Delete Room Type</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this room type? <br /> This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog(null)}
            color="primary"
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteRoomType(deleteDialog)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!editDialog}>
        <DialogTitle>Edit Room Type</DialogTitle>
        <DialogContent>
          <TextField
            label="Room Type Name"
            variant="outlined"
            fullWidth
            value={editDialog?.room_type}
            onChange={(e) =>
              setEditDialog((prev) => ({
                ...prev,
                room_type: e.target.value,
              }))
            }
            sx={{ mt: 2 }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditDialog(null)}
            color="primary"
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleEditRoomType(editDialog?.id)}
            color="warning"
            variant="contained"
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
