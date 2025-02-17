import { useState, useRef, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography, Box,
  IconButton, useTheme,
  useMediaQuery
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
  retrieveRoomTypes
} from "../api/roomtype";
import {
  getSubjects
} from "../api/subject";
import { getSections } from "../api/section";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Mainpage from "../components/Mainpage";
import SubjectPage from "../components/Subjectpage";
import RoomTypepage from "../components/RoomTypepage";
import Sectionpage from "../components/Sectionpage";
import Bookingpage from "../components/Bookingpage";
import Roompage from "../components/Roompage";
import Register from "./Register";

function Home() {
  const [selectedSidebar, setSelectedSidebar] = useState("Dashboard");
  const [open, setOpen] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
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


  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md")); 

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

  const contentRef = useRef(null);





  return (
    <>
      {user ? (
        <Box sx={{ display: "flex", padding: 0, margin: 0 }}>
          {/* Sidebar (Drawer) */}
          <Sidebar
            open={open}
            handleSidebarClick={handleSidebarClick}
            handleLogout={handleLogout}
            isSmallScreen={isSmallScreen}
            setOpen={setOpen}
            selectedSidebar={selectedSidebar}
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
                isSmallScreen={isSmallScreen}
                isMediumScreen={isMediumScreen}
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
              <Bookingpage
                bookings={bookings}
                retrieve={retrieve}
                rooms={rooms}
                subjects={subjects}
                sections={sections}
                user={user}
                cookies={cookies}
                store={store}
                isSmallScreen={isSmallScreen}
              />
            </CSSTransition>
            {/* Rooms Section */}
            <CSSTransition
              nodeRef={contentRef}
              timeout={300}
              classNames="fade"
              unmountOnExit
              in={selectedSidebar === "Rooms"}
            >
              <Roompage
                rooms={rooms}
                cookies={cookies}
                retrieve={retrieve}
                user={user}
                roomTypes={roomTypes}
              />
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
                user={user}
                isSmallScreen={isSmallScreen}
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
                user={user}
                isSmallScreen={isSmallScreen}
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
                user={user}
                isSmallScreen={isSmallScreen}
              />
            </CSSTransition>
          </Box>
        </Box>
      ) : (
        <>
        <Login retrieve={retrieve}/>
        <Box style={{display:"none"}}>
        <Register retrieve={retrieve} />
        </Box>
        </>
      )}
    </>
  );
}

export default checkAuth(Home);
