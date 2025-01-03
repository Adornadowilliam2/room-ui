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
} from "@mui/material";
import "react-calendar/dist/Calendar.css";

import { toast } from "react-toastify";
import { deleteSubject, storeSubject, updateSubject } from "../api/subject";

export default function Subjectpage({ retrieve, cookies, subjects }) {
  const [subjectName, setSubjectName] = useState("");
  const contentRef = useRef(null);
  const [subjectType, setSubjectType] = useState("");
  const [warnings, setWarnings] = useState({});
  const [editDialog, setEditDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const handleAddSubject = (e) => {
    e.preventDefault();
    const body = {
      subject_name: subjectName,
      subject_type: subjectType,
    };

    storeSubject(body, cookies.AUTH_TOKEN).then((res) => {
      if (res?.ok) {
        toast.success(res.message);
        retrieve();
        setSubjectName("");
        setSubjectType("");
        setWarnings({});
      } else {
        toast.error(res.message);
        setWarnings(res?.errors);
      }
    });
  };

  const handleEditSubject = (id) => {
    const body = {
      subject_name: editDialog?.subject_name,
      subject_type: editDialog?.subject_type,
    };
    updateSubject(body, cookies.AUTH_TOKEN, id).then((res) => {
      if (res?.ok) {
        toast.success(res.message);
        retrieve();
        setEditDialog(null);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleDeleteSubject = (id) => {
    deleteSubject(cookies.AUTH_TOKEN, id).then((res) => {
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
    <Container sx={{ mt: 4 }} ref={contentRef}>
      <h2>Subjects</h2>
      {/* Add Subject Form */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          label="Subject Name"
          variant="outlined"
          id="subject_name"
          fullWidth
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          sx={{ mb: 2, mt: 2 }}
          size="small"
          error={!!warnings?.subject_name}
          helperText={warnings?.subject_name}
        />
        <TextField
          label="Subject Type"
          variant="outlined"
          id="subject_type"
          fullWidth
          value={subjectType}
          onChange={(e) => setSubjectType(e.target.value)}
          sx={{ mb: 2, mt: 2 }}
          size="small"
          error={!!warnings?.subject_type}
          helperText={warnings?.subject_type}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddSubject}
        sx={{ marginBottom: 2 }}
      >
        Add Subject
      </Button>

      {/* Subjects Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Modified At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>
                  {subject.id + ".) " + subject.subject_name}
                </TableCell>
                <TableCell>{subject.subject_type}</TableCell>
                <TableCell>{subject.created_at.slice(0, 10)}</TableCell>
                <TableCell>{subject.updated_at.slice(0, 10)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="warning"
                    sx={{ mr: 1 }}
                    onClick={() => {
                      setEditDialog(subject);
                    }}
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
      <Dialog open={!!editDialog}>
        <DialogTitle>Edit Subject</DialogTitle>
        <DialogContent>
          <TextField
            label="Subject Name"
            variant="outlined"
            id="subject_name"
            fullWidth
            sx={{ mt: 2 }}
            value={editDialog?.subject_name}
            onChange={(e) =>
              setEditDialog((prev) => ({
                ...prev,
                subject_name: e.target.value,
              }))
            }
            required
          />
          <TextField
            label="Subject Type"
            variant="outlined"
            id="subject_type"
            fullWidth
            sx={{ mt: 2 }}
            value={editDialog?.subject_type}
            onChange={(e) =>
              setEditDialog((prev) => ({
                ...prev,
                subject_type: e.target.value,
              }))
            }
            required
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setEditDialog(null)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => handleEditSubject(editDialog?.id)}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!deleteDialog}>
        <DialogTitle>Delete Subject</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this subject? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDeleteDialog(null)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteSubject(deleteDialog)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
