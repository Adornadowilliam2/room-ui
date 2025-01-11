  import { Close } from "@mui/icons-material";
  import { Drawer, List, ListItem, ListItemText } from "@mui/material";

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
              button="true"
            >
              <Close />
            </ListItem>
          ) : null}
          <ListItem
            onClick={() => {
              setOpen(false);
              handleSidebarClick("Dashboard");
            }}
            sx={{
              cursor: "pointer",
              backgroundColor:
                selectedSidebar === "Dashboard" ? "gray" : "transparent", // Highlight when selected
            }}
            button="true"
          >
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              backgroundColor:
                selectedSidebar === "Bookings" ? "gray" : "transparent", // Highlight when selected
            }}
            button="true"
            onClick={() => {
              handleSidebarClick("Bookings");
              setOpen(false);
            }}
          >
            <ListItemText primary="Bookings" />
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              backgroundColor:
                selectedSidebar === "Rooms" ? "gray" : "transparent", // Highlight when selected
            }}
            button="true"
            onClick={() => {
              handleSidebarClick("Rooms");
              setOpen(false);
            }}
          >
            <ListItemText primary="Rooms" />
          </ListItem>
          <ListItem
            onClick={() => {
              handleSidebarClick("Subjects");
              setOpen(false);
            }}
            sx={{
              cursor: "pointer",
              backgroundColor:
                selectedSidebar === "Subjects" ? "gray" : "transparent", // Highlight when selected
            }}
            button="true"
          >
            <ListItemText primary="Subjects" />
          </ListItem>
          <ListItem
            onClick={() => {
              handleSidebarClick("Room Types");
              setOpen(false);
            }}
            sx={{
              cursor: "pointer",
              backgroundColor:
                selectedSidebar === "Room Types" ? "gray" : "transparent", // Highlight when selected
            }}
            button="true"
          >
            <ListItemText primary="Room Types" />
          </ListItem>
          <ListItem
            onClick={() => {
              setOpen(false);
              handleSidebarClick("Sections");
            }}
            sx={{
              cursor: "pointer",
              backgroundColor:
                selectedSidebar === "Sections" ? "gray" : "transparent", // Highlight when selected
            }}
            button="true"
          >
            <ListItemText primary="Sections" />
          </ListItem>
          <ListItem
            onClick={() => handleLogout()}
            sx={{
              cursor: "pointer",
              backgroundColor:
                selectedSidebar === "Logout" ? "gray" : "transparent", // Highlight when selected
            }}
            button="true"
          >
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    );
  }
