import React, { useState } from "react";
import {
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Divider,
  Checkbox,
  FormControlLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import default calendar styles
import { Menu } from "@mui/icons-material";

// Dummy data for the table (with added date field)
const bookingData = [
  {
    userName: "John Doe",
    roomName: "Room A",
    daysOfWeek: "Mon, Wed, Fri",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    subject: "Team Meeting",
    date: new Date("2024-12-22"), // Add date for filtering
  },
  {
    userName: "Jane Smith",
    roomName: "Room B",
    daysOfWeek: "Tue, Thu",
    startTime: "1:00 PM",
    endTime: "3:00 PM",
    subject: "Client Call",
    date: new Date("2024-12-18"), // Add date for filtering
  },
  {
    userName: "Alice Johnson",
    roomName: "Room C",
    daysOfWeek: "Mon, Thu, Sat",
    startTime: "9:00 AM",
    endTime: "11:00 AM",
    subject: "Presentation",
    date: new Date("2024-12-20"), // Add date for filtering
  },
];

// Dummy room data for room management
const rooms = [
  { name: "Room A", capacity: 10 },
  { name: "Room B", capacity: 15 },
  { name: "Room C", capacity: 5 },
];

export default function Home() {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(true); // Sidebar open state
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering
  const [daysFilter, setDaysFilter] = useState(7); // Default filter to 7 days
  const [newBooking, setNewBooking] = useState({
    userName: "",
    roomName: "",
    startTime: "",
    endTime: "",
    subject: "",
    daysOfWeek: [],
  }); // State to handle new booking form
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen is small (phone/tablet)

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const toggleSidebar = () => {
    setOpen(!open);
  };

  // Handle new booking form changes
  const handleBookingChange = (event) => {
    const { name, value } = event.target;
    setNewBooking((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle day selection changes
  const handleDaySelection = (event) => {
    const { value } = event.target;
    setNewBooking((prev) => ({
      ...prev,
      daysOfWeek: value,
    }));
  };

  // Handle form submission to add a new booking (for demo purposes)
  const handleSubmitBooking = () => {
    console.log("New booking submitted:", newBooking);
    // Logic to add booking goes here
    setNewBooking({
      userName: "",
      roomName: "",
      startTime: "",
      endTime: "",
      subject: "",
      daysOfWeek: [],
    }); // Reset form
  };

  // Filter bookings based on the selected range (7, 28, 90 days)
  const filteredBookings = bookingData.filter((booking) => {
    const today = new Date();
    const diffTime = today - new Date(booking.date);
    const diffDays = diffTime / (1000 * 3600 * 24); // Convert time difference to days

    // Filter by date range
    const isInDateRange =
      (daysFilter === 7 && diffDays <= 7) ||
      (daysFilter === 28 && diffDays <= 28) ||
      (daysFilter === 90 && diffDays <= 90);

    // Filter by search term (case-insensitive search for userName or roomName)
    const matchesSearchTerm =
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomName.toLowerCase().includes(searchTerm.toLowerCase());

    return isInDateRange && matchesSearchTerm;
  });

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar (Drawer) */}
      <Drawer
        sx={{
          width: isSmallScreen ? 180 : 240, // Smaller width on small screens (phones)
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isSmallScreen ? 180 : 240, // Adjust width based on screen size
            boxSizing: "border-box",
            transition: "width 0.3s ease", // Smooth transition for width change
          },
        }}
        variant={isSmallScreen ? "temporary" : "permanent"} // Change to temporary on small screens
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
      >
        <List>
          <ListItem>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Bookings" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Sections" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Rooms" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          padding: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* AppBar */}
        <AppBar position="sticky">
          <Toolbar>
            {isSmallScreen && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleSidebar}
                sx={{ mr: 2 }}
              >
                <Menu />
              </IconButton>
            )}
            <Typography variant="h6">Dashboard</Typography>
          </Toolbar>
        </AppBar>

        {/* Calendar and Room Management Panel */}
        <Box sx={{ display: "flex", gap: 4, marginTop: 4 }}>
          {/* Calendar */}
          <Container sx={{ flex: 1 }}>
            <h2>Select a Date</h2>
            <Calendar onChange={handleDateChange} value={date} />
            <p>Selected Date: {date.toDateString()}</p>
          </Container>

          {/* Room Management Panel */}
          <Container
            sx={{
              width: 300,
              padding: 2,
              border: "1px solid #ddd",
              borderRadius: 2,
            }}
          >
            <h3>Room Management</h3>
            <Divider sx={{ marginBottom: 2 }} />
            <TextField
              label="User Name"
              name="userName"
              value={newBooking.userName}
              onChange={handleBookingChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel id="room-select-label">Room Name</InputLabel>
              <Select
                labelId="room-select-label"
                name="roomName"
                value={newBooking.roomName}
                onChange={handleBookingChange}
                label="Room Name"
              >
                {rooms.map((room) => (
                  <MenuItem key={room.name} value={room.name}>
                    {room.name} (Capacity: {room.capacity})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel id="days-select-label">Days of the Week</InputLabel>
              <Select
                labelId="days-select-label"
                name="daysOfWeek"
                multiple
                value={newBooking.daysOfWeek}
                onChange={handleDaySelection}
                renderValue={(selected) => selected.join(", ")}
              >
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <MenuItem key={day} value={day}>
                      <Checkbox
                        checked={newBooking.daysOfWeek.indexOf(day) > -1}
                      />
                      {day}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            <TextField
              label="Start Time"
              name="startTime"
              type="time"
              value={newBooking.startTime}
              onChange={handleBookingChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="End Time"
              name="endTime"
              type="time"
              value={newBooking.endTime}
              onChange={handleBookingChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Subject"
              name="subject"
              value={newBooking.subject}
              onChange={handleBookingChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" fullWidth onClick={handleSubmitBooking}>
              Add Booking
            </Button>
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
          <h2>Booking Details</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>Room Name</TableCell>
                  <TableCell>Days of the Week</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.map((booking, index) => (
                  <TableRow key={index}>
                    <TableCell>{booking.userName}</TableCell>
                    <TableCell>{booking.roomName}</TableCell>
                    <TableCell>{booking.daysOfWeek}</TableCell>
                    <TableCell>{booking.startTime}</TableCell>
                    <TableCell>{booking.endTime}</TableCell>
                    <TableCell>{booking.subject}</TableCell>
                    <TableCell>{booking.date.toDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </Box>
  );
}
