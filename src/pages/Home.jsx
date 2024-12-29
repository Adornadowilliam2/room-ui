import { useState, useRef, useEffect } from "react";
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
import { Menu } from "@mui/icons-material";
import { CSSTransition } from "react-transition-group";
import { useSelector } from "react-redux";
import checkAuth from "../hoc/checkAuth";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { retrieveRooms, showRoom } from "../api/room";
import { useCookies } from "react-cookie";
import { indexBookings } from "../api/booking";
import { logout as logoutApi } from "../api/auth";
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Login from "./Login";



function Home() {
  const [selectedSidebar, setSelectedSidebar] = useState("Dashboard");
  const [open, setOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [roomTypeName, setRoomTypeName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const user = useSelector((state) => state.auth.user);
  const handleSidebarClick = (sidebar) => {
    setSelectedSidebar(sidebar);
    setOpen(false);
  }
  const [cookies , setCookie, removeCookie] = useCookies();
  const retrieve = () => { 
    retrieveRooms(cookies.AUTH_TOKEN).then((res) => {
  
      if (res?.ok) {
        setRooms(res.data);
      }
      indexBookings(cookies.AUTH_TOKEN).then((res) => {
   
        if (res?.ok) {
          setBookings(res.data);
        }
      
      });
    })


  };
  useEffect(() => {
    retrieve();
  }, []);

 const [date, setDate] = useState(new Date());
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

const filteredBookings = bookings.filter((booking) => {
  const today = new Date();
  const bookingDate = new Date(booking?.book_from); // Make sure it's a Date object
  const diffTime = today - bookingDate; // Time difference in milliseconds
  const diffDays = diffTime / (1000 * 3600 * 24); // Convert time difference to days

  // Ensure bookingDate is valid
  if (isNaN(bookingDate)) return false;

  // Filter by date range
  const isInDateRange =
    (daysFilter === 7 && diffDays <= 7) ||
    (daysFilter === 28 && diffDays <= 28) ||
    (daysFilter === 90 && diffDays <= 90);

  // Filter by search term (case-insensitive search for userName or roomName)
  const matchesSearchTerm =
    booking?.users?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
    booking?.rooms?.room_name
      ?.toLowerCase()
      ?.includes(searchTerm.toLowerCase());

  return isInDateRange && matchesSearchTerm;
});
  
  const handleLogout = () => {
    logoutApi(cookies.AUTH_TOKEN).then((response) => {
      if (response?.ok) {
        toast.success(response?.message);
        removeCookie("AUTH_TOKEN");
        dispatch(logout(cookies.AUTH_TOKEN));
        navigate("/login");
      } else {
        toast.error(response?.message);
      }
    });
  };


  const contentRef = useRef(null); // Create a ref for content

  return (
    <>
      {user ? (
        <Box sx={{ display: "flex" }}>
      {/* Sidebar (Drawer) */}
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
        open={open}
      >
        <List>
          <ListItem
            onClick={() => handleSidebarClick("Dashboard")}
            sx={{ cursor: "pointer" }}
            button="true"
          >
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem
            onClick={() => handleSidebarClick("Subjects")}
            sx={{ cursor: "pointer" }}
            button="true"
          >
            <ListItemText primary="Subjects" />
          </ListItem>
          <ListItem
            onClick={() => handleSidebarClick("Room Types")}
            sx={{ cursor: "pointer" }}
            button="true"
          >
            <ListItemText primary="Room Types" />
          </ListItem>
          <ListItem
            onClick={() => handleSidebarClick("Sections")}
            sx={{ cursor: "pointer" }}
            button="true"
          >
            <ListItemText primary="Sections" />
          </ListItem>
          <ListItem
            onClick={() => handleLogout()}
            sx={{ cursor: "pointer" }}
            button="true" 
          >
            <ListItemText primary="Logout" />
           
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
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
        <AppBar position="sticky">
          <Toolbar>
            {isSmallScreen && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleSidebar}
              >
                <Menu />
              </IconButton>
            )}
            <Typography variant="h6">Dashboard</Typography>
          </Toolbar>
        </AppBar>

        {/* Dashboard Section */}
        <CSSTransition
          in={selectedSidebar === "Dashboard"}
          timeout={300}
          classNames="fade"
          unmountOnExit
          nodeRef={contentRef} // Pass the ref to CSSTransition
        >
          <Container ref={contentRef}>
            <Box
              sx={{
                display: "flex",
                gap: 4,
                marginTop: 4,
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              {/* Calendar */}
              <Container sx={{ display: "block", margin: "auto" }}>
                <Calendar onChange={handleDateChange} value={date} />
                <p>Selected Date: {date.toDateString()}</p>
              </Container>

              {/* Room Management Panel */}
              <Container
                sx={{
                  padding: 2,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                }}
              >
                <h3>Room Management</h3>
                <Divider sx={{ marginBottom: 2 }} />
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel id="room-select-label">Room Name</InputLabel>
                  <Select
                    labelId="room-select-label"
                    name="roomName"
                    value={newBooking.roomName}
                    onChange={handleBookingChange}
                    label="Room Name"
                  >
                    {rooms.map((room, index) => (
                      <MenuItem key={index + 1} value={room.room_name}>
                        {room.room_name} (Capacity: {room.capacity})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
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
                  InputLabelProps={{
                    shrink: true,
                  }}
                  size="small"
                />
                <TextField
                  label="End Time"
                  name="endTime"
                  type="time"
                  value={newBooking.endTime}
                  onChange={handleBookingChange}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  size="small"
                />
                <TextField
                  label="Subject"
                  name="subject"
                  value={newBooking.subject}
                  onChange={handleBookingChange}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  size="small"
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSubmitBooking}
                >
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
                      <TableCell>Day of the Week</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking?.users?.name}</TableCell>
                        <TableCell>{booking?.rooms?.room_name}</TableCell>
                        <TableCell>{booking.day_of_week}</TableCell>
                        <TableCell>{booking.start_time.slice(0, 5)  + " - " + booking.end_time.slice(0, 5)}</TableCell>
                        <TableCell>{booking?.subjects?.subject_name}</TableCell>
                        <TableCell>{booking.book_from}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
          </Container>
        </CSSTransition>

        {/* Subjects Section */}
        <CSSTransition
          in={selectedSidebar === "Subjects"}
          timeout={300}
          classNames="fade"
          unmountOnExit
          nodeRef={contentRef} // Pass the ref to CSSTransition
        >
          <h1 ref={contentRef}>Subjects</h1>
        </CSSTransition>

        {/* Room Types Section */}
        <CSSTransition
          in={selectedSidebar === "Room Types"}
          timeout={300}
          classNames="fade"
          unmountOnExit
          nodeRef={contentRef} // Pass the ref to CSSTransition
        >
          <h1 ref={contentRef}>Room Types</h1>
        </CSSTransition>

        {/* Sections Section */}
        <CSSTransition
          in={selectedSidebar === "Sections"}
          timeout={300}
          classNames="fade"
          unmountOnExit
          nodeRef={contentRef} // Pass the ref to CSSTransition
        >
          <h1 ref={contentRef}>Sections</h1>
        </CSSTransition>
      </Box>
    </Box>
      ) : (
          <Login />
      )}
    </>
  );
}

export default checkAuth(Home);
