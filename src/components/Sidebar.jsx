import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import "react-calendar/dist/Calendar.css";
export default function Sidebar({ open, handleSidebarClick, handleLogout }) {
  return (
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
  );
}
