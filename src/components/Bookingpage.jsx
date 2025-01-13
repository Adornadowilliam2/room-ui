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
  Stack,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Icon,
  List,
  ListItem,
} from "@mui/material";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import Calendar from "react-calendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { destroy, update } from "../api/booking";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

function Bookingpage({
  bookings,
  rooms,
  sections,
  subjects,
  retrieve,
  store,
  cookies,
  user,
  isSmallScreen,
}) {
  const [selectedSection, setSelectedSection] = useState(""); // Track
  const [warnings, setWarnings] = useState({});
  const [editDialog, setEditDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);

  const handleRowToggle = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

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
  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);

    // Determine AM or PM
    const amPm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Return the formatted time
    return `${hours}:${minutes} ${amPm}`;
  };
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
          justifyContent: isSmallScreen ? "space-evenly" : "space-between",
          flexWrap: isSmallScreen ? "wrap" : "nowrap",
          padding: 0,
          margin: 0,
        }}
      >
        <Container>
          <Calendar tileContent={tileContent} />
        </Container>
        <Container sx={{ maxWidth: 400, marginTop: isSmallScreen ? 2 : 0 }}>
          <Typography variant="h6">Create New Booking</Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <Box component="form" onSubmit={handleAddBooking}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              {/* Room Name Select */}
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
                {warnings?.room_id && (
                  <FormHelperText error>{warnings.room_id}</FormHelperText>
                )}
              </FormControl>

              {/* Days of the Week */}
              <FormControl fullWidth>
                <InputLabel id="days-select-label">Days of the Week</InputLabel>
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
                      <Checkbox checked={newBooking.daysOfWeek.includes(day)} />
                      {day}
                    </MenuItem>
                  ))}
                </Select>
                {warnings?.day_of_week && (
                  <FormHelperText error>{warnings.day_of_week}</FormHelperText>
                )}
              </FormControl>

              {/* Start Time */}
              <Box>
                <InputLabel>Start Time</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileTimePicker
                    value={newBooking.startTime}
                    onChange={handleStartTimeChange}
                  />
                </LocalizationProvider>
                {warnings?.start_time && (
                  <FormHelperText error>{warnings.start_time}</FormHelperText>
                )}
              </Box>

              {/* End Time */}
              <Box>
                <InputLabel>End Time</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileTimePicker
                    value={newBooking.endTime}
                    onChange={handleEndTimeChange}
                  />
                </LocalizationProvider>
                {warnings?.end_time && (
                  <FormHelperText error>{warnings.end_time}</FormHelperText>
                )}
              </Box>

              {/* Subject Select */}
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
                {warnings?.subject_id && (
                  <FormHelperText error>{warnings.subject_id}</FormHelperText>
                )}
              </FormControl>

              {/* Section Select */}
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
                {warnings?.section_id && (
                  <FormHelperText error>{warnings.section_id}</FormHelperText>
                )}
              </FormControl>

              {/* Date From */}
              <TextField
                label="Date From"
                name="date_from"
                type="date"
                value={newBooking.date_from}
                onChange={handleBookingChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              {warnings?.book_from && (
                <FormHelperText error>{warnings.book_from}</FormHelperText>
              )}

              {/* Date Until */}
              <TextField
                label="Date Until"
                name="date_until"
                type="date"
                value={newBooking.date_until}
                onChange={handleBookingChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              {warnings?.book_until && (
                <FormHelperText error>{warnings.book_until}</FormHelperText>
              )}
            </Box>
            <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
              Add Booking
            </Button>
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
        {isSmallScreen ? (
          <TableContainer component={Paper}>
            <Table
              sx={{
                "& .MuiTableCell-root": { p: 1, border: "1px solid black" },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>More Info Click Here</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Room Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(filteredBookings.length > 0
                  ? filteredBookings
                  : bookings
                ).map((booking) => (
                  <>
                    <TableRow key={booking.id}>
                      <TableCell>
                        <Button
                          onClick={() => handleRowToggle(booking.id)}
                          size="small"
                          variant="outlined"
                          sx={{
                            minWidth: "40px",
                            textAlign: "center",
                          }}
                        >
                          {expandedRows.includes(booking.id) ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {booking?.id + ".) " + booking?.users?.name}
                      </TableCell>
                      <TableCell>{booking?.rooms?.room_name}</TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        <Button
                          onClick={() => setEditDialog(booking)}
                          color="warning"
                          variant="contained"
                          sx={{ mr: 1, mb: isSmallScreen ? 1 : 0 }}
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

                    {/* Additional content to be displayed when row is expanded */}
                    {expandedRows.includes(booking.id) && (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <List>
                            <ListItem>
                              Subject: {booking?.subjects?.subject_name}
                            </ListItem>
                            <ListItem>
                              Section: {booking?.sections?.section_name}
                            </ListItem>
                            <ListItem>
                              Day of Week: {booking?.day_of_week}
                            </ListItem>
                            <ListItem>
                              Time:{" "}
                              {convertTo12HourFormat(
                                booking?.start_time.slice(0, 5)
                              )}{" "}
                              -{" "}
                              {convertTo12HourFormat(
                                booking?.end_time.slice(0, 5)
                              )}
                            </ListItem>
                            <ListItem>Book From: {booking?.book_from}</ListItem>
                            <ListItem>
                              Book Until: {booking?.book_until}
                            </ListItem>
                            <ListItem>Status: {booking?.status}</ListItem>
                            <ListItem>
                              Created At: {booking?.created_at.slice(0, 10)}
                            </ListItem>
                            <ListItem>
                              Updated At: {booking?.updated_at.slice(0, 10)}
                            </ListItem>
                          </List>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table
              sx={{
                "& .MuiTableCell-root": { p: 1, border: "1px solid black" },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ p: 1 }}>Username</TableCell>
                  <TableCell>Room</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Day of Week</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Book From</TableCell>
                  <TableCell>Book Until</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Updated At</TableCell>

                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(filteredBookings.length > 0
                  ? filteredBookings
                  : bookings
                ).map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      {booking?.id + ".) " + booking?.users?.name}
                    </TableCell>
                    <TableCell>{booking?.rooms?.room_name}</TableCell>
                    <TableCell>{booking?.subjects?.subject_name}</TableCell>
                    <TableCell>{booking?.sections?.section_name}</TableCell>
                    <TableCell>{booking?.day_of_week}</TableCell>
                    <TableCell>
                      {convertTo12HourFormat(booking?.start_time.slice(0, 5))} -{" "}
                      {convertTo12HourFormat(booking?.end_time.slice(0, 5))}
                    </TableCell>
                    <TableCell>{booking?.book_from}</TableCell>
                    <TableCell>{booking?.book_until}</TableCell>
                    <TableCell
                      style={{
                        background:
                          booking.status === "confirmed"
                            ? "#72A98F"
                            : booking.status === "pending"
                            ? "orange"
                            : booking.status === "rejected"
                            ? "red"
                            : "black",
                        p: 0,

                        color: "black",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {booking?.status}
                    </TableCell>
                    <TableCell>{booking?.created_at.slice(0, 10)}</TableCell>
                    <TableCell>{booking?.updated_at.slice(0, 10)}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => setEditDialog(booking)}
                        color="warning"
                        variant="contained"
                        sx={{ mr: 1, mb: isSmallScreen ? 1 : 0 }}
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
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
                setEditDialog({
                  ...editDialog,
                  room_id: e.target.value,
                })
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
                setEditDialog({
                  ...editDialog,
                  subject_name: e.target.value,
                })
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
                setEditDialog({
                  ...editDialog,
                  section_name: e.target.value,
                })
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
            type="date"
          />

          <TextField
            label="Book Until"
            name="book_until"
            value={editDialog?.book_until}
            fullWidth
            sx={{ marginTop: 2 }}
            type="date"
          />

          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Day of Week</InputLabel>
            <Select
              name="day_of_week"
              value={editDialog?.day_of_week}
              onChange={(e) =>
                setEditDialog({
                  ...editDialog,
                  day_of_week: e.target.value,
                })
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
