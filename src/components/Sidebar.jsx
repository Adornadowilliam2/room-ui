  import { Close } from "@mui/icons-material";
  import { Drawer, List, ListItem, ListItemText } from "@mui/material";

  export default function Sidebar({
    open,
    handleSidebarClick,
    isSmallScreen,
    handleLogout,
    setOpen,
    selectedSidebar, // Add this prop to receive the selected section
  }) {
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
              button="true"
            >
              <Close />
            </ListItem>
          ) : null}
          <ListItem
            onClick={() => handleSidebarClick("Dashboard")}
            sx={{
              cursor: "pointer",
              backgroundColor: selectedSidebar === "Dashboard" ? "gray" : "transparent", // Highlight when selected
            }}
            button="true"
          >
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              backgroundColor: selectedSidebar === "Bookings" ? "gray" : "transparent", // Highlight when selected
            }}
            button="true"
            onClick={() => handleSidebarClick("Bookings")}
          >
            <ListItemText primary="Bookings" />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              backgroundColor: selectedSidebar === "Rooms" ? "gray" : "transparent", // Highlight when selected
            }}
            button="true"
            onClick={() => handleSidebarClick("Rooms")}
          >
            <ListItemText primary="Rooms" />
          </ListItem>
          <ListItem
            onClick={() => handleSidebarClick("Subjects")}
            sx={{
              cursor: "pointer",
              backgroundColor: selectedSidebar === "Subjects" ? "gray" : "transparent", // Highlight when selected
            }}
            button="true"
          >
            <ListItemText primary="Subjects" />
          </ListItem>
          <ListItem
            onClick={() => handleSidebarClick("Room Types")}
            sx={{
              cursor: "pointer",
              backgroundColor: selectedSidebar === "Room Types" ? "gray" : "transparent", // Highlight when selected
            }}
            button="true"
          >
            <ListItemText primary="Room Types" />
          </ListItem>
          <ListItem
            onClick={() => handleSidebarClick("Sections")}
            sx={{
              cursor: "pointer",
              backgroundColor: selectedSidebar === "Sections" ? "gray" : "transparent", // Highlight when selected
            }}
            button="true"
          >
            <ListItemText primary="Sections" />
          </ListItem>
          <ListItem
            onClick={() => handleLogout()}
            sx={{
              cursor: "pointer",
              backgroundColor: selectedSidebar === "Logout" ? "gray" : "transparent", // Highlight when selected
            }}
            button="true"
          >
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    );
  }
