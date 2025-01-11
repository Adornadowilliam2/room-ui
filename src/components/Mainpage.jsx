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
  Tab,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { CalendarMonth, CalendarToday } from "@mui/icons-material";

export default function Mainpage({
  bookings,
  rooms,
  subjects,
  sections,
  user,
  store,
  cookies,
  retrieve,
  isSmallScreen,
}) {
  const [date, setDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [daysFilter, setDaysFilter] = useState(7);
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

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const selectedDateString = newDate.toISOString().split("T")[0];
    setSelectedDay(selectedDateString);

    const bookingsForSelectedDay = bookings.filter((booking) => {
      const bookingDate = new Date(booking.book_from)
        .toISOString()
        .split("T")[0];
      return bookingDate === selectedDateString;
    });

    setDayBookings(bookingsForSelectedDay);
    setOpenDialog(true);
  };
  const bookedDates = new Set(
    bookings.map(
      (booking) => new Date(booking.book_from).toISOString().split("T")[0]
    )
  );

  const tileContent = ({ date, view }) => {
    const dateString = date.toISOString().split("T")[0];
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

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayBookings, setDayBookings] = useState([]);

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

  const filteredBookings = bookings.filter((booking) => {
    const today = new Date();
    const bookingDate = new Date(booking?.book_from);
    const diffTime = today - bookingDate;
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (isNaN(bookingDate)) return false;

    const isInDateRange =
      (daysFilter === 7 && diffDays <= 7) ||
      (daysFilter === 28 && diffDays <= 28) ||
      (daysFilter === 90 && diffDays <= 90);

    const matchesSearchTerm =
      booking?.users?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      booking?.rooms?.room_name
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase());

    return isInDateRange && matchesSearchTerm;
  });

  const contentRef = useRef(null);

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
  const [warnings, setWarnings] = useState({});
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
  return (
    <Container ref={contentRef}>
      {/* container for calendar and add booking form */}
      <Box
        sx={{
          display: "flex",
          gap: 4,
          marginTop: 4,
          justifyContent: "space-evenly",
          alignItems: "center",
          flexWrap: isSmallScreen ? "wrap" : "nowrap",
        }}
      >
        {/* Calendar */}
        <Container sx={{ display: "block", margin: "auto" }}>
          <Typography variant="h6">
            {" "}
            <IconButton>
              <CalendarToday />
            </IconButton>
            Today's Date: {dayjs().format("MMMM D, YYYY")}
          </Typography>
          <Typography>
            {" "}
            <IconButton>
              <CalendarMonth />
            </IconButton>{" "}
            Selected Date: {date.toDateString()}
          </Typography>
          <Calendar
            onChange={handleDateChange}
            value={date}
            tileContent={tileContent}
          />
        </Container>

        <Dialog open={!!openDialog} fullWidth maxWidth="md">
          <DialogTitle>Bookings on {selectedDay}</DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User Name</TableCell>
                    <TableCell>Room Name</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Section</TableCell>
                    <TableCell>Booked From</TableCell>
                    <TableCell>Booked Until</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dayBookings.length == 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No bookings found for this day.
                      </TableCell>
                    </TableRow>
                  ) : (
                    dayBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking?.users?.name}</TableCell>
                        <TableCell>{booking?.rooms?.room_name}</TableCell>
                        <TableCell>
                          {booking.start_time.slice(0, 5)} -{" "}
                          {booking.end_time.slice(0, 5)}
                        </TableCell>
                        <TableCell>{booking?.subjects?.subject_name}</TableCell>
                        <TableCell>{booking?.sections?.section_name}</TableCell>
                        <TableCell>{booking.book_from}</TableCell>
                        <TableCell>{booking.book_until}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDialog(false)}
              color="primary"
              variant="contained"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Room Management Panel */}
        <Container
          sx={{
            width: isSmallScreen ? "400px" : "400px",
            border: isSmallScreen ? "1px solid black" : "none",
          }}
        >
          <Typography variant="h6">Create New Booking</Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <Box component="form" onSubmit={handleAddBooking}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
              }}
            >
              {/* Room Name Select */}
              <Box>
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
              </Box>

              {/* Days of the Week */}
              <Box>
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
              </Box>

              {/* Start Time */}
              <Box>
                <InputLabel>Start Time</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileTimePicker
                    value={newBooking.startTime}
                    onChange={handleStartTimeChange}
                  />
                </LocalizationProvider>
                {warnings?.start_time ? (
                  <FormHelperText error>{warnings.start_time}</FormHelperText>
                ) : null}
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
                {warnings?.end_time ? (
                  <FormHelperText error>{warnings.end_time}</FormHelperText>
                ) : null}
              </Box>

              {/* Subject Select */}
              <Box>
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
              </Box>

              {/* Section Select */}
              <Box>
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
              </Box>

              {/* Date From */}
              <Box>
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
              </Box>

              {/* Date Until */}
              <Box>
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
              </Box>
            </Box>
            {/* Submit Button */}

            <Button variant="contained" type="submit" sx={{ mt: 2 }} fullWidth>
              Add Booking
            </Button>
          </Box>
        </Container>
      </Box>
      {/* Search and Filter Controls */}
      <Container sx={{ marginTop: 4, display: "flex", gap: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel id="days-filter-label">Filter by Days</InputLabel>
          <Select
            labelId="days-filter-label"
            value={daysFilter}
            onChange={(event) => setDaysFilter(event.target.value)}
            label="Filter by Days"
          >
            <MenuItem value={7}>Last 7 Days</MenuItem>
            <MenuItem value={28}>Last 28 Days</MenuItem>
            <MenuItem value={90}>Last 90 Days</MenuItem>
          </Select>
        </FormControl>
      </Container>

      {/* Table for Bookings */}
      <Container sx={{ marginTop: 4 }}>
        <h2>Recents</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    p: isSmallScreen ? 0 : 2,
                    border: isSmallScreen && "1px solid black",
                  }}
                >
                  {isSmallScreen ? "User" : "User Name"}
                </TableCell>
                <TableCell
                  sx={{
                    p: isSmallScreen ? 0 : 2,
                    border: isSmallScreen && "1px solid black",
                  }}
                >
                  Room Name
                </TableCell>
                <TableCell
                  sx={{
                    p: isSmallScreen ? 0 : 2,
                    border: isSmallScreen && "1px solid black",
                  }}
                >
                  Day of the Week
                </TableCell>
                <TableCell
                  sx={{
                    p: isSmallScreen ? 0 : 2,
                    border: isSmallScreen && "1px solid black",
                  }}
                >
                  Time
                </TableCell>
                <TableCell
                  sx={{
                    p: isSmallScreen ? 0 : 2,
                    border: isSmallScreen && "1px solid black",
                  }}
                >
                  {isSmallScreen ? "Sub" : " Subject"}
                </TableCell>
                <TableCell
                  sx={{
                    p: isSmallScreen ? 0 : 2,
                    border: isSmallScreen && "1px solid black",
                  }}
                >
                  {isSmallScreen ? "Sec" : "Section"}
                </TableCell>
                <TableCell
                  sx={{
                    p: isSmallScreen ? 0 : 2,
                    border: isSmallScreen && "1px solid black",
                  }}
                >
                  Book From
                </TableCell>
                <TableCell
                  sx={{
                    p: isSmallScreen ? 0 : 2,
                    border: isSmallScreen && "1px solid black",
                  }}
                >
                  Book Until
                </TableCell>
                <TableCell
                  sx={{
                    p: isSmallScreen ? 0 : 2,
                    border: isSmallScreen && "1px solid black",
                  }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell
                    sx={{
                      p: isSmallScreen ? 0 : 2,
                      border: isSmallScreen && "1px solid black",
                    }}
                  >
                    {booking?.id + ".) " + booking?.users?.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      p: isSmallScreen ? 0 : 2,
                      border: isSmallScreen && "1px solid black",
                    }}
                  >
                    {booking?.rooms?.room_name}
                  </TableCell>
                  <TableCell
                    sx={{
                      p: isSmallScreen ? 0 : 2,
                      border: isSmallScreen && "1px solid black",
                    }}
                  >
                    {isSmallScreen
                      ? booking.day_of_week.slice(0, 3)
                      : booking.day_of_week}
                  </TableCell>
                  <TableCell
                    sx={{
                      p: isSmallScreen ? 0 : 2,
                      border: isSmallScreen && "1px solid black",
                    }}
                  >
                    {booking.start_time.slice(0, 5) +
                      " - " +
                      booking.end_time.slice(0, 5)}
                  </TableCell>
                  <TableCell
                    sx={{
                      p: isSmallScreen ? 0 : 2,
                      border: isSmallScreen && "1px solid black",
                    }}
                  >
                    {isSmallScreen
                      ? booking?.subjects?.subject_name.slice(0, 4)
                      : booking?.subjects?.subject_name}
                  </TableCell>
                  <TableCell
                    sx={{
                      p: isSmallScreen ? 0 : 2,
                      border: isSmallScreen && "1px solid black",
                    }}
                  >
                    {booking?.sections?.section_name}
                  </TableCell>
                  <TableCell
                    sx={{
                      p: isSmallScreen ? 0 : 2,
                      border: isSmallScreen && "1px solid black",
                    }}
                  >
                    {booking.book_from}
                  </TableCell>
                  <TableCell
                    sx={{
                      p: isSmallScreen ? 0 : 2,
                      border: isSmallScreen && "1px solid black",
                    }}
                  >
                    {booking.book_until}
                  </TableCell>
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
                      p: isSmallScreen ? 0 : 2,
                      border: isSmallScreen && "1px solid black",
                      borderRadius: "10px",
                      color: "black",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {isSmallScreen ? "*" : booking?.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Container>
  );
}
