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
  List,
  ListItem,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
  CalendarMonth,
  CalendarToday,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

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
  isMediumScreen,
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
  const [expandedRows, setExpandedRows] = useState([]);

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
  const handleRowToggle = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };
  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);

    
    const amPm = hours >= 12 ? "PM" : "AM";

    
    hours = hours % 12 || 12;

    
    return `${hours}:${minutes} ${amPm}`;
  };
  return (
    <Container sx={{ marginTop: 4 }} ref={contentRef}>
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
            {isSmallScreen ? (
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
                      <TableCell>User Name</TableCell>
                      <TableCell>Room Name</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Section</TableCell>
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
                            {convertTo12HourFormat(booking.start_time)} -{" "}
                            {convertTo12HourFormat(booking.end_time)}
                          </TableCell>
                          <TableCell>
                            {booking?.subjects?.subject_name}
                          </TableCell>
                          <TableCell>
                            {booking?.sections?.section_name}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
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
                      <TableCell>User Name</TableCell>
                      <TableCell>Room Name</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Section</TableCell>
                      <TableCell>Booked From</TableCell>
                      <TableCell>Booked Until</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell>Updated At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dayBookings.length == 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          No bookings found for this day.
                        </TableCell>
                      </TableRow>
                    ) : (
                      dayBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking?.users?.name}</TableCell>
                          <TableCell>{booking?.rooms?.room_name}</TableCell>
                          <TableCell>
                            {convertTo12HourFormat(booking.start_time)} -{" "}
                            {convertTo12HourFormat(booking.end_time)}
                          </TableCell>
                          <TableCell>
                            {booking?.subjects?.subject_name}
                          </TableCell>
                          <TableCell>
                            {booking?.sections?.section_name}
                          </TableCell>
                          <TableCell>{booking.book_from}</TableCell>
                          <TableCell>{booking.book_until}</TableCell>
                          <TableCell>
                            {booking.created_at.slice(0, 10)}
                          </TableCell>
                          <TableCell>
                            {booking.updated_at.slice(0, 10)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
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
                        {day.slice(0, 3)}
                      </MenuItem>
                    ))}
                  </Select>
                  {warnings?.day_of_week ? (
                    <FormHelperText error>
                      {warnings.day_of_week}
                    </FormHelperText>
                  ) : null}
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
      <h2>Recents  </h2>
     
      {isSmallScreen ? (
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
                <TableCell>More Info Click Here</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Room Name</TableCell>
                <TableCell>Subject</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.map((booking) => (
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
                    <TableCell>{booking?.subjects?.subject_name}</TableCell>
                  </TableRow>

                  {/* Additional content to be displayed when row is expanded */}
                  {expandedRows.includes(booking.id) && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <List>
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
                          <ListItem>Book Until: {booking?.book_until}</ListItem>
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
                        color: "black",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {booking?.status}
                    </TableCell>
                    <TableCell>{booking?.created_at.slice(0, 10)}</TableCell>
                    <TableCell>{booking?.updated_at.slice(0, 10)}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
