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
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Divider,
  Checkbox,
  Grid,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Icon,
} from "@mui/material";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import Calendar from "react-calendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { destroy, update } from "../api/booking";

function Bookingpage({
  bookings,
  rooms,
  sections,
  subjects,
  retrieve,
  store,
  cookies,
  user,
}) {
  const [selectedSection, setSelectedSection] = useState(""); // Track
  const [warnings, setWarnings] = useState({});
  const [editDialog, setEditDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [newBooking, setNewBooking] = useState({
    roomId: "",
    subjectId: "",
    sectionId: "",
    startTime: dayjs().startOf("hour"),
    endTime: dayjs().add(1, "hour"),
    daysOfWeek: [],
    date_from: "",
    date_until: "",
  });
  const handleStartTimeChange = (newValue) => {
    setNewBooking((prev) => ({
      ...prev,
      startTime: newValue,
    }));
  };

  const handleEndTimeChange = (newValue) => {
    setNewBooking((prev) => ({
      ...prev,
      endTime: newValue,
    }));
  };
  // Handle booking form submission
  const handleAddBooking = (e) => {
    e.preventDefault();

    const body = {
      user_id: user?.id,
      room_id: newBooking.roomId,
      start_time: newBooking.startTime.format("HH:mm"),
      end_time: newBooking.endTime.format("HH:mm"),
      subject_id: newBooking.subjectId,
      section_id: newBooking.sectionId,
      day_of_week: newBooking.daysOfWeek,
      book_from: newBooking.date_from,
      book_until: newBooking.date_until,
    };

    store(body, cookies.AUTH_TOKEN).then((res) => {
      if (res?.ok) {
        setNewBooking({
          roomId: "",
          subjectId: "",
          sectionId: "",
          startTime: dayjs().startOf("hour"),
          endTime: dayjs().add(1, "hour"),
          daysOfWeek: [],
          date_from: "",
          date_until: "",
        });
        toast.success(res.message);
        retrieve();
        setWarnings({});
      } else {
        toast.error(res.message);
        setWarnings(res?.errors);
      }
    });
  };

  const handleDeleteBooking = (id) => {
    destroy(cookies.AUTH_TOKEN, id).then((res) => {
      if (res?.ok) {
        toast.success(res.message);
        retrieve();
        setDeleteDialog(null);
      } else {
        toast.error(res.message);
      }
    });
  };
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const handleEditBooking = (id) => {
    const body = {
      user_id: user?.id,
      room_id: editDialog?.room_id,
      start_time: startTime?.format("HH:mm"),
      end_time: endTime?.format("HH:mm"),
      subject_id: editDialog?.subject_id,
      section_id: editDialog?.section_id,
      day_of_week: editDialog?.day_of_week,
      book_from: editDialog?.book_from,
      book_until: editDialog?.book_until,
      status: editDialog?.status,
    };
    update(body, cookies.AUTH_TOKEN, id).then((res) => {
      console.log(body);
      if (res?.ok) {
        toast.success(res.message);
        retrieve();
        setEditDialog(null);
      } else {
        toast.error(res.message);
      }
    });
  };
  const handleBookingChange = (event) => {
    const { name, value } = event.target;
    setNewBooking((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDaySelection = (event) => {
    const { value } = event.target;
    setNewBooking((prev) => ({
      ...prev,
      daysOfWeek: value,
    }));
  };

  // Filter bookings by selected section
  const filteredBookings = bookings.filter(
    (booking) => booking?.sections?.id === selectedSection
  );

  // Create a set of booked dates (ISO format YYYY-MM-DD)
  const bookedDates = new Set(
    filteredBookings
      .map((booking) => {
        const startDate = dayjs(booking.book_from).format("YYYY-MM-DD");
        const endDate = dayjs(booking.book_until).format("YYYY-MM-DD");

        // Include both start and end dates in the bookedDates set
        return startDate === endDate ? startDate : [startDate, endDate];
      })
      .flat()
  );

  // Define tile content to show red dot on booked dates
  const tileContent = ({ date, view }) => {
    const dateString = date.toISOString().split("T")[0]; // Get ISO date (YYYY-MM-DD)
    if (bookedDates.has(dateString)) {
      return (
        <Box
          style={{
            width: "8px",
            height: "8px",
            backgroundColor: "red",
            borderRadius: "50%",
          }}
        />
      );
    }
    return null;
  };

  const contentRef = useRef(null);

  return (
    <Box sx={{ padding: 2 }} ref={contentRef}>
      {/* Section Selector */}
      <FormControl fullWidth>
        <InputLabel>Section name</InputLabel>
        <Select
          fullWidth
          value={selectedSection} // The value of the select
          onChange={(e) => setSelectedSection(e.target.value)} // Update selectedSection when a new value is selected
          sx={{ mb: 2 }}
        >
          {/* Map over the sections to create the MenuItems */}
          {sections && sections.length > 0 ? (
            sections.map((section) => (
              <MenuItem key={section.id} value={section.id}>
                {section.section_name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="">Sections Available</MenuItem>
          )}
        </Select>
      </FormControl>

      {/* Calendar with Red Dots for Bookings */}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Container>
          <Calendar tileContent={tileContent} />
        </Container>
        <Container sx={{ maxWidth: 500 }}>
          <Typography variant="h6">Create New Booking</Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <Box component="form" onSubmit={handleAddBooking}>
            <Grid container spacing={2}>
              {/* Room Name Select */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="room-select-label">Room Name</InputLabel>
                  <Select
                    labelId="room-select-label"
                    name="roomId"
                    value={newBooking.roomId}
                    onChange={handleBookingChange}
                    label="Room Name"
                  >
                    {rooms.map((room) => (
                      <MenuItem key={room.id} value={room.id}>
                        {room.room_name} (Capacity: {room.capacity})
                      </MenuItem>
                    ))}
                  </Select>
                  {warnings?.room_id ? (
                    <FormHelperText error>{warnings.room_id}</FormHelperText>
                  ) : null}
                </FormControl>
              </Grid>

              {/* Days of the Week */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="days-select-label">
                    Days of the Week
                  </InputLabel>
                  <Select
                    labelId="days-select-label"
                    name="daysOfWeek"
                    multiple
                    value={newBooking.daysOfWeek}
                    onChange={handleDaySelection}
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <MenuItem key={day} value={day}>
                        <Checkbox
                          checked={newBooking.daysOfWeek.includes(day)}
                        />
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                  {warnings?.day_of_week ? (
                    <FormHelperText error>
                      {warnings.day_of_week}
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </Grid>

              {/* Start Time */}
              <Grid item xs={6}>
                <InputLabel>Start Time</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileTimePicker
                    value={newBooking.startTime}
                    onChange={handleStartTimeChange}
                    sx={{
                      '& .MuiInputBase-root': {
                        width:"300px" 
                      },
                    }}
                  />
                </LocalizationProvider>
                {warnings?.start_time ? (
                  <FormHelperText error>{warnings.start_time}</FormHelperText>
                ) : null}
              </Grid>

              {/* End Time */}
              <Grid item xs={6}>
                <InputLabel>End Time</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileTimePicker
                    value={newBooking.endTime}
                    onChange={handleEndTimeChange}
                    sx={{
                      '& .MuiInputBase-root': {
                        width:"300px" 
                      },
                    }}
                  />
                </LocalizationProvider>
                {warnings?.end_time ? (
                  <FormHelperText error>{warnings.end_time}</FormHelperText>
                ) : null}
              </Grid>

              {/* Subject Select */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="subject-select-label">Subject</InputLabel>
                  <Select
                    labelId="subject-select-label"
                    name="subjectId"
                    value={newBooking.subjectId}
                    onChange={handleBookingChange}
                    label="Subject"
                  >
                    {subjects.map((subject) => (
                      <MenuItem key={subject.id} value={subject.id}>
                        {subject.subject_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {warnings?.subject_id ? (
                    <FormHelperText error>{warnings.subject_id}</FormHelperText>
                  ) : null}
                </FormControl>
              </Grid>

              {/* Section Select */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="section-select-label">Section</InputLabel>
                  <Select
                    labelId="section-select-label"
                    name="sectionId"
                    value={newBooking.sectionId}
                    onChange={handleBookingChange}
                    label="Section"
                  >
                    {sections.map((section) => (
                      <MenuItem key={section.id} value={section.id}>
                        {section.section_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {warnings?.section_id ? (
                    <FormHelperText error>{warnings.section_id}</FormHelperText>
                  ) : null}
                </FormControl>
              </Grid>

              {/* Date From */}
              <Grid item xs={6}>
                <TextField
                  label="Date From"
                  name="date_from"
                  type="date"
                  value={newBooking.date_from}
                  onChange={handleBookingChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {warnings?.book_from ? (
                  <FormHelperText error>{warnings.book_from}</FormHelperText>
                ) : null}
              </Grid>

              {/* Date Until */}
              <Grid item xs={6}>
                <TextField
                  label="Date Until"
                  name="date_until"
                  type="date"
                  value={newBooking.date_until}
                  onChange={handleBookingChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {warnings?.book_until ? (
                  <FormHelperText error>{warnings.book_until}</FormHelperText>
                ) : null}
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button variant="contained" type="submit" fullWidth>
                  Add Booking
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Bookings Table for the selected section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">
          Bookings for{" "}
          {
            sections.find((section) => section.id === selectedSection)
              ?.section_name
          }
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Room</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Day of Week</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Book From</TableCell>
                <TableCell>Book Until</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(filteredBookings.length > 0 ? filteredBookings : bookings).map(
                (booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      {booking?.id + ".) " + booking?.users?.name}
                    </TableCell>
                    <TableCell>{booking?.rooms?.room_name}</TableCell>
                    <TableCell>{booking?.subjects?.subject_name}</TableCell>
                    <TableCell>{booking?.sections?.section_name}</TableCell>
                    <TableCell>{booking?.day_of_week}</TableCell>
                    <TableCell>
                      {booking?.start_time.slice(0, 5) +
                        " - " +
                        booking?.end_time.slice(0, 5)}
                    </TableCell>
                    <TableCell>{booking?.book_from}</TableCell>
                    <TableCell>{booking?.book_until}</TableCell>
                    <TableCell>{booking?.status}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => setEditDialog(booking)}
                        color="warning"
                        variant="contained"
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => setDeleteDialog(booking.id)}
                        color="error"
                        variant="contained"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={!!deleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this booking? <br /> This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)} variant="contained">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDeleteBooking(deleteDialog);
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editDialog}>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Room</InputLabel>
            <Select
              name="room"
              value={editDialog?.rooms?.id}
              onChange={(e) =>
                setEditDialog({ ...editDialog, room_id: e.target.value })
              }
            >
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.room_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Subject</InputLabel>
            <Select
              name="subject"
              value={editDialog?.subjects?.id}
              onChange={(e) =>
                setEditDialog({ ...editDialog, subject_name: e.target.value })
              }
            >
              {/* Map through your list of subjects */}
              {subjects.map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.subject_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Section</InputLabel>
            <Select
              name="section"
              value={editDialog?.sections?.id}
              onChange={(e) =>
                setEditDialog({ ...editDialog, section_name: e.target.value })
              }
            >
              {/* You can map through a list of available sections if you have one */}
              {sections.map((section) => (
                <MenuItem key={section.id} value={section.id}>
                  {section.section_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Book From"
            name="book_from"
            value={editDialog?.book_from}
            fullWidth
            sx={{ marginTop: 2 }}
          />

          <TextField
            label="Book Until"
            name="book_until"
            value={editDialog?.book_until}
            fullWidth
            sx={{ marginTop: 2 }}
          />

          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Day of Week</InputLabel>
            <Select
              name="day_of_week"
              value={editDialog?.day_of_week}
              onChange={(e) =>
                setEditDialog({ ...editDialog, day_of_week: e.target.value })
              }
            >
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileTimePicker
                value={startTime || dayjs(editDialog?.start_time, "HH:mm")}
                onChange={(newValue) => setStartTime(newValue)}
              />
            </LocalizationProvider>
          </FormControl>

          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileTimePicker
                value={endTime || dayjs(editDialog?.end_time, "HH:mm")}
                onChange={(newValue) => setEndTime(newValue)}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={editDialog?.status}
              onChange={(e) =>
                setEditDialog({ ...editDialog, status: e.target.value })
              }
            >
              {["confirmed", "pending", "rejected"].map((status) => (
                <MenuItem
                  key={status}
                  value={status}
                  disabled={status === "pending"}
                >
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DialogActions>
            <Button onClick={() => setEditDialog(null)} variant="contained">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleEditBooking(editDialog?.id);
              }}
              color="warning"
              variant="contained"
            >
              Update
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Bookingpage;
