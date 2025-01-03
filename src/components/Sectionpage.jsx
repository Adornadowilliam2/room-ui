import { useState, useRef, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import "react-calendar/dist/Calendar.css";

import { toast } from "react-toastify";
import { deleteSubject, storeSubject, updateSubject } from "../api/subject";
import { deleteSection, storeSection, updateSection } from "../api/section";

export default function Sectionpage({ sections, retrieve, cookies }) {
  const [sectionName, setSectionName] = useState("");
  const contentRef = useRef(null);
  const [sectionType, setSectionType] = useState("");
  const [warnings, setWarnings] = useState({});
  const [editDialog, setEditDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const handleAddSection = (e) => {
    e.preventDefault();
    const body = {
      section_name: sectionName,
      section_type: sectionType,
    };

    storeSection(body, cookies.AUTH_TOKEN).then((res) => {
      if (res?.ok) {
        toast.success(res.message);
        retrieve();
        setSectionName("");
        setSectionType("");
        setWarnings({});
      } else {
        toast.error(res.message);
        setWarnings(res?.errors);
      }
    });
  };

  const handleEditSection = (id) => {
    const body = {
      section_name: editDialog?.section_name,
      section_type: editDialog?.section_type,
    };
    updateSection(body, cookies.AUTH_TOKEN, id).then((res) => {
      if (res?.ok) {
        toast.success(res.message);
        retrieve();
        setEditDialog(null);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleDeleteSection = (id) => {
    deleteSection(cookies.AUTH_TOKEN, id).then((res) => {
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
      <h2>Sections</h2>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          label="Section Name"
          variant="outlined"
          fullWidth
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          sx={{ mb: 2, mt: 2 }}
          size="small"
        />
        <TextField
          label="Section Type"
          variant="outlined"
          fullWidth
          value={sectionType}
          onChange={(e) => setSectionType(e.target.value)}
          sx={{ mb: 2, mt: 2 }}
          size="small"
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddSection}
        sx={{ marginBottom: 2 }}
      >
        Add Section
      </Button>

      {/* Room Types Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Modified At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>
                  {subject.id + ".) " + subject.section_name}
                </TableCell>
                <TableCell>{subject.created_at.slice(0, 10)}</TableCell>
                <TableCell>{subject.updated_at.slice(0, 10)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => {
                      setEditDialog(subject);
                    }}
                    sx={{ mr: 2 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setDeleteDialog(subject.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
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
            onClick={() => handleDeleteSection(deleteDialog)}
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
            value={editDialog?.section_name}
            onChange={(e) =>
              setEditDialog((prev) => ({
                ...prev,
                section_name: e.target.value,
              }))
            }
            sx={{ mt: 2 }}
            required
          />
          <TextField
            label="Room Type Name"
            variant="outlined"
            fullWidth
            value={editDialog?.section_type}
            onChange={(e) =>
              setEditDialog((prev) => ({
                ...prev,
                section_type: e.target.value,
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
            onClick={() => handleEditSection(editDialog?.id)}
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
