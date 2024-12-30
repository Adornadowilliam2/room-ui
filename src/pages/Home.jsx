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
  Grid,
  FormHelperText,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import { CSSTransition } from "react-transition-group";
import { useSelector } from "react-redux";
import checkAuth from "../hoc/checkAuth";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { retrieveRooms, showRoom } from "../api/room";
import { useCookies } from "react-cookie";
import { indexBookings, store } from "../api/booking";
import { logout as logoutApi } from "../api/auth";
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import { retrieveRoomTypes } from "../api/roomtype";
import { getSubjects } from "../api/subject";
import { getSections } from "../api/section";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs from "dayjs";
import { toast } from "react-toastify";

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
  const [sections, setSections] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const handleSidebarClick = (sidebar) => {
    setSelectedSidebar(sidebar);
    setOpen(false);
  };
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [roomTypes, setRoomTypes] = useState([]);

  const [cookies, setCookie, removeCookie] = useCookies();
  const retrieve = () => {
    retrieveRooms(cookies.AUTH_TOKEN).then((res) => {
      if (res?.ok) {
        setRooms(res.data);
      }
      indexBookings(cookies.AUTH_TOKEN).then((res) => {
        if (res?.ok) {
          setBookings(res.data);
        }
        retrieveRoomTypes(cookies.AUTH_TOKEN).then((res) => {
          if (res?.ok) {
            setRoomTypes(res.data);
          }
        });
        getSubjects(cookies.AUTH_TOKEN).then((res) => {
          if (res?.ok) {
            setSubjects(res.data);
          }
        });
        getSections(cookies.AUTH_TOKEN).then((res) => {
          if (res?.ok) {
            setSections(res.data);
          }
        });
      });
    });
  };
  useEffect(() => {
    retrieve();
  }, []);

  const [date, setDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering
  const [daysFilter, setDaysFilter] = useState(7); // Default filter to 7 days
  const [newBooking, setNewBooking] = useState({
    roomId: "",
    subjectId: "",
    sectionId: "",
    startTime: dayjs().startOf("hour"),
    endTime: dayjs().add(1, "hour"),
    daysOfWeek: [],
    date_from: "",
    date_until: "",
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
  const addBooking = (e) => {
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
      console.log(res);
      if (res?.ok) {
        // Clear form on success
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
        console.log(res?.errors);
      }
    });
  };
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
                sx={{ cursor: "pointer" }}
                button="true"
                onClick={() => handleSidebarClick("Bookings")}
              >
                <ListItemText primary="Bookings" />
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
                  <Container>
                    <Typography variant="h6">Create New Booking</Typography>
                    <Divider sx={{ marginBottom: 2 }} />
                    <form onSubmit={addBooking}>
                      <Grid container spacing={2}>
                        {/* Room Name Select */}
                        <Grid item xs={6}>
                          <FormControl fullWidth>
                            <InputLabel id="room-select-label">
                              Room Name
                            </InputLabel>
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
                              <FormHelperText error>
                                {warnings.room_id}
                              </FormHelperText>
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
                                    checked={newBooking.daysOfWeek.includes(
                                      day
                                    )}
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
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileTimePicker
                              value={newBooking.startTime}
                              onChange={handleStartTimeChange}
                            />
                          </LocalizationProvider>
                          {warnings?.start_time ? (
                            <FormHelperText error>
                              {warnings.start_time}
                            </FormHelperText>
                          ) : null}
                        </Grid>

                        {/* End Time */}
                        <Grid item xs={6}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileTimePicker
                              value={newBooking.endTime}
                              onChange={handleEndTimeChange}
                            />
                          </LocalizationProvider>
                          {warnings?.end_time ? (
                            <FormHelperText error>
                              {warnings.end_time}
                            </FormHelperText>
                          ) : null}
                        </Grid>

                        {/* Subject Select */}
                        <Grid item xs={6}>
                          <FormControl fullWidth>
                            <InputLabel id="subject-select-label">
                              Subject
                            </InputLabel>
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
                              <FormHelperText error>
                                {warnings.subject_id}
                              </FormHelperText>
                            ) : null}
                          </FormControl>
                        </Grid>

                        {/* Section Select */}
                        <Grid item xs={6}>
                          <FormControl fullWidth>
                            <InputLabel id="section-select-label">
                              Section
                            </InputLabel>
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
                              <FormHelperText error>
                                {warnings.section_id}
                              </FormHelperText>
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
                            <FormHelperText error>
                              {warnings.book_from}
                            </FormHelperText>
                          ) : null}
                        </Grid>

                        {/* Date Until */}
                        <Grid item xs={6}>
                          <TextField
                            label="Date Until"
                            name="date_until"
                            type="date"
                            value={newBooking.book_until}
                            onChange={handleBookingChange}
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          {warnings?.book_until ? (
                            <FormHelperText error>
                              {warnings.book_until}
                            </FormHelperText>
                          ) : null}
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                          <Button variant="contained" type="submit" fullWidth>
                            Add Booking
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
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
                    <InputLabel id="days-filter-label">
                      Filter by Days
                    </InputLabel>
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
                          <TableCell>User Name</TableCell>
                          <TableCell>Room Name</TableCell>
                          <TableCell>Day of the Week</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>Subject</TableCell>
                          <TableCell>Section</TableCell>
                          <TableCell>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>{booking?.users?.name}</TableCell>
                            <TableCell>{booking?.rooms?.room_name}</TableCell>
                            <TableCell>{booking.day_of_week}</TableCell>
                            <TableCell>
                              {booking.start_time.slice(0, 5) +
                                " - " +
                                booking.end_time.slice(0, 5)}
                            </TableCell>
                            <TableCell>
                              {booking?.subjects?.subject_name}
                            </TableCell>
                            <TableCell>
                              {booking?.sections?.section_name}
                            </TableCell>
                            <TableCell>{booking.book_from}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Container>
              </Container>
            </CSSTransition>

            {/* Bookings Section */}
            <CSSTransition
              in={selectedSidebar === "Bookings"}
              timeout={300}
              classNames="fade"
              unmountOnExit
              nodeRef={contentRef} // Pass the ref to CSSTransition
            >
              <h1 ref={contentRef}>Bookings</h1>
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

