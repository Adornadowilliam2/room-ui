import { Close, Dashboard, EventNote, Hotel, Subject,Settings, Assignment, Logout } from "@mui/icons-material";
import { Drawer, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";

export default function Sidebar({
  open,
  handleSidebarClick,
  isSmallScreen,
  handleLogout,
  setOpen,
  selectedSidebar,
}) {
  return (
    <Drawer
      sx={{
        width: 200,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 200,
          boxSizing: "border-box",
        },
      }}
      variant={isSmallScreen ? "temporary" : "permanent"}
      anchor="left"
      open={isSmallScreen ? !open : !!open}
    >
      <List>
        {isSmallScreen ? (
          <ListItem
            onClick={() => setOpen(!open)}
            sx={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "end",
            }}
            button
          >
            <Close />
          </ListItem>
        ) : null}

        {/* Dashboard Item */}
        <ListItem
          onClick={() => {
            setOpen(false);
            handleSidebarClick("Dashboard");
          }}
          sx={{
            cursor: "pointer",
            backgroundColor:
              selectedSidebar === "Dashboard" ? "gray" : "transparent",
            color: selectedSidebar === "Dashboard" ? "white" : "black",
            "&:hover": {
              color: "black",
            },
          }}
          button
        >
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        {/* Bookings Item */}
        <ListItem
          sx={{
            cursor: "pointer",
            backgroundColor:
              selectedSidebar === "Bookings" ? "gray" : "transparent",
            color: selectedSidebar === "Bookings" ? "white" : "black",
            "&:hover": {
              color: "black",
            },
          }}
          button
          onClick={() => {
            handleSidebarClick("Bookings");
            setOpen(false);
          }}
        >
          <ListItemIcon>
            <EventNote />
          </ListItemIcon>
          <ListItemText primary="Bookings" />
        </ListItem>

        {/* Rooms Item */}
        <ListItem
          sx={{
            cursor: "pointer",
            backgroundColor:
              selectedSidebar === "Rooms" ? "gray" : "transparent",
            color: selectedSidebar === "Rooms" ? "white" : "black",
            "&:hover": {
              color: "black",
            },
          }}
          button
          onClick={() => {
            handleSidebarClick("Rooms");
            setOpen(false);
          }}
        >
          <ListItemIcon>
            <Hotel />
          </ListItemIcon>
          <ListItemText primary="Rooms" />
        </ListItem>

        {/* Subjects Item */}
        <ListItem
          onClick={() => {
            handleSidebarClick("Subjects");
            setOpen(false);
          }}
          sx={{
            cursor: "pointer",
            backgroundColor:
              selectedSidebar === "Subjects" ? "gray" : "transparent",
            color: selectedSidebar === "Subjects" ? "white" : "black",
            "&:hover": {
              color: "black",
            },
          }}
          button
        >
          <ListItemIcon>
            <Subject />
          </ListItemIcon>
          <ListItemText primary="Subjects" />
        </ListItem>

        {/* Room Types Item */}
        <ListItem
          onClick={() => {
            handleSidebarClick("Room Types");
            setOpen(false);
          }}
          sx={{
            cursor: "pointer",
            backgroundColor:
              selectedSidebar === "Room Types" ? "gray" : "transparent",
            color: selectedSidebar === "Room Types" ? "white" : "black",
            "&:hover": {
              color: "black",
            },
          }}
          button
        >
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Room Types" />
        </ListItem>

        {/* Sections Item */}
        <ListItem
          onClick={() => {
            setOpen(false);
            handleSidebarClick("Sections");
          }}
          sx={{
            cursor: "pointer",
            backgroundColor:
              selectedSidebar === "Sections" ? "gray" : "transparent",
            color: selectedSidebar === "Sections" ? "white" : "black",
            "&:hover": {
              color: "black",
            },
          }}
          button
        >
          <ListItemIcon>
            <Assignment />
          </ListItemIcon>
          <ListItemText primary="Sections" />
        </ListItem>

        {/* Logout Item */}
        <ListItem
          onClick={() => handleLogout()}
          sx={{
            cursor: "pointer",
            backgroundColor:
              selectedSidebar === "Logout" ? "gray" : "transparent",
            color: selectedSidebar === "Logout" ? "white" : "black",
            "&:hover": {
              color: "black",
            },
            mt: 2,
          }}
          button
        >
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
}
