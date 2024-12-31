import { useState, useRef, useEffect } from "react";
import {
  Container,
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
  Button,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import { CSSTransition } from "react-transition-group";
import { useSelector } from "react-redux";
import checkAuth from "../hoc/checkAuth";
import "react-calendar/dist/Calendar.css";
import { retrieveRooms } from "../api/room";
import { useCookies } from "react-cookie";
import { indexBookings, store } from "../api/booking";
import { logout as logoutApi } from "../api/auth";
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import {
  destroyRoomType,
  retrieveRoomTypes,
  storeRoomType,
  updateRoomType,
} from "../api/roomtype";
import {
  deleteSubject,
  getSubjects,
  storeSubject,
  updateSubject,
} from "../api/subject";
import { getSections } from "../api/section";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Mainpage from "../components/Mainpage";
import SubjectPage from "../components/Subjectpage";
import RoomTypepage from "../components/RoomTypepage";
import Sectionpage from "../components/Sectionpage";

function Home() {
  const [selectedSidebar, setSelectedSidebar] = useState("Dashboard");
  const [open, setOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [roomTypeName, setRoomTypeName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
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

  const toggleSidebar = () => {
    setOpen(!open);
  };

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

  const [subjectType, setSubjectType] = useState("");
  const [warnings, setWarnings] = useState({});
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
  const [editDialog, setEditDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

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
    <>
      {user ? (
        <Box sx={{ display: "flex" }}>
          {/* Sidebar (Drawer) */}
          <Sidebar
            open={open}
            handleSidebarClick={handleSidebarClick}
            handleLogout={handleLogout}
          />
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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography variant="h6">MFI</Typography>
                  <Typography>{user?.name}</Typography>
                </Box>
              </Toolbar>
            </AppBar>

            {/* Dashboard Section */}
            <CSSTransition
              nodeRef={contentRef}
              timeout={300}
              classNames="fade"
              unmountOnExit
              in={selectedSidebar === "Dashboard"}
            >
              <Mainpage
                bookings={bookings}
                rooms={rooms}
                subjects={subjects}
                sections={sections}
                user={user}
                store={store}
                cookies={cookies}
                retrieve={retrieve}
              />
            </CSSTransition>

            {/* Bookings Section */}
            <CSSTransition
              nodeRef={contentRef}
              timeout={300}
              classNames="fade"
              unmountOnExit
              in={selectedSidebar === "Bookings"}
            >
              <h1 ref={contentRef}>Bookings</h1>
            </CSSTransition>

            {/* Subjects Section */}
            <CSSTransition
              nodeRef={contentRef}
              timeout={300}
              classNames="fade"
              unmountOnExit
              in={selectedSidebar === "Subjects"}
            >
              <SubjectPage
                cookies={cookies}
                retrieve={retrieve}
                subjects={subjects}
              />
            </CSSTransition>

            {/* Room Types Section */}
            <CSSTransition
              nodeRef={contentRef}
              timeout={300}
              classNames="fade"
              unmountOnExit
              in={selectedSidebar === "Room Types"}
            >
              <RoomTypepage
                cookies={cookies}
                retrieve={retrieve}
                roomTypes={roomTypes}
              />
            </CSSTransition>

            {/* Sections Section */}
            <CSSTransition
              nodeRef={contentRef}
              timeout={300}
              classNames="fade"
              unmountOnExit
              in={selectedSidebar === "Sections"}
            >
              <Sectionpage
                cookies={cookies}
                retrieve={retrieve}
                sections={sections}
              />
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
 
