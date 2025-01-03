import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import Calendar from "react-calendar";

function Bookingpage({
  bookings,
  rooms,
  sections,
  subjects,
  retrieve,
  store,
  cookies,
}) {
  const [selectedSection, setSelectedSection] = useState(""); // Track selected section
  const [selectedDate, setSelectedDate] = useState(new Date()); // Track selected date
  const [dialogOpen, setDialogOpen] = useState(false); // Track if booking dialog is open
  const [selectedRoom, setSelectedRoom] = useState(""); // Track selected room
  const [selectedSubject, setSelectedSubject] = useState(""); // Track selected subject
  const [startTime, setStartTime] = useState(dayjs().startOf("hour")); // Track start time
  const [endTime, setEndTime] = useState(dayjs().add(1, "hour")); // Track end time

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setDialogOpen(true); // Open the booking dialog when a date is selected
  };

  // Handle booking form submission
  const handleSaveBooking = () => {
    const body = {
      roomId: selectedRoom,
      subjectId: selectedSubject,
      sectionId: selectedSection,
      startTime,
      endTime,
      date_from: selectedDate,
      date_until: endTime,
    };

    store(body, cookies.AUTH_TOKEN).then((res) => {
      if (res?.ok) {
        toast.success("Booking saved successfully!");
        retrieve();
      } else {
        toast.error(res.message);
      }
    });

    setDialogOpen(false); // Close the dialog after saving
  };

  // Filter bookings by selected section
  const filteredBookings = bookings.filter(
    (booking) => booking?.sections?.id === selectedSection
  );

  // Create a set of booked dates (ISO format YYYY-MM-DD)
  const bookedDates = new Set(
    filteredBookings
      .map((booking) => {
        const startDate = dayjs(booking.book_from).format("YYYY-MM-DD");
        const endDate = dayjs(booking.book_until).format("YYYY-MM-DD");

        // Include both start and end dates in the bookedDates set
        return startDate === endDate ? startDate : [startDate, endDate];
      })
      .flat()
  );

  // Define tile content to show red dot on booked dates
  const tileContent = ({ date, view }) => {
    const dateString = date.toISOString().split("T")[0]; // Get ISO date (YYYY-MM-DD)
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

  return (
    <Box sx={{ padding: 2 }}>
      {/* Section Selector */}
      <FormControl fullWidth>
        <InputLabel>Section name</InputLabel>
        <Select
          fullWidth
          value={selectedSection} // The value of the select
          onChange={(e) => setSelectedSection(e.target.value)} // Update selectedSection when a new value is selected
          sx={{ mb: 2 }}
        >
          {/* Map over the sections to create the MenuItems */}
          {sections && sections.length > 0 ? (
            sections.map((section) => (
              <MenuItem key={section.id} value={section.id}>
                {section.section_name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="">
              <em>No Sections Available</em>
            </MenuItem>
          )}
        </Select>
      </FormControl>

      {/* Calendar with Red Dots for Bookings */}
      <Calendar
        onChange={handleDateSelect}
        value={selectedDate}
        tileContent={tileContent}
      />

      {/* Bookings Table for the selected section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">
          Bookings for{" "}
          {
            sections.find((section) => section.id === selectedSection)
              ?.section_name
          }
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Room</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(filteredBookings.length > 0 ? filteredBookings : bookings).map(
                (booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking?.users?.name}</TableCell>
                    <TableCell>{booking?.rooms?.room_name}</TableCell>
                    <TableCell>{booking?.subjects?.subject_name}</TableCell>
                    <TableCell>{booking?.book_from}</TableCell>
                    <TableCell>{booking?.book_until}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default Bookingpage;
