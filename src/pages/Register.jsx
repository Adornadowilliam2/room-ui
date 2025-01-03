import { useState } from "react";
import { TextField, Button, Box, Container, IconButton, Typography } from "@mui/material";
import { Close, Email, Lock, Person } from "@mui/icons-material";
import { register } from "../api/auth";
import $ from "jquery";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
export default function Register() {
    const [warnings, setWarnings] = useState({});
    const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  const dispatch = useDispatch();
  
  const handleSubmit = (e) => {
      e.preventDefault();
      const body = {
          name: $("#name").val(), 
          email: $("#email").val(),
          password: $("#password").val(),
          password_confirmation: $("#password_confirmation").val(),
      }
      register(body).then((res) => {
            if (res?.ok) {
                toast.success(res.message);
                setWarnings({});
              navigate("/");
              setCookie("AUTH_TOKEN", res.data.token);
              dispatch(login(res.data));
            } else {
              toast.error(res.message);
              setWarnings(res?.errors);
            }
        })

 
  };

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "300px",
          border: "1px solid black",
          p: 2,
          borderRadius: "5px",
        }}
      >
        <IconButton onClick={() => navigate("/")}>
          <Close />
        </IconButton>
        <h2 style={{ textAlign: "center" }}>Register</h2>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          id="name"
          error={!!warnings?.name}
          helperText={warnings?.name}
          InputProps={{
            startAdornment: <Person style={{ marginRight: "8px" }} />,
          }}
          placeholder="Enter your username"
        />

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          id="email"
          error={!!warnings?.email}
          helperText={warnings?.email}
          InputProps={{
            startAdornment: <Email style={{ marginRight: "8px" }} />,
          }}
          placeholder="Enter your email"
        />

        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          id="password"
          error={!!warnings?.password}
          helperText={warnings?.password}
          InputProps={{
            startAdornment: <Lock style={{ marginRight: "8px" }} />,
          }}
          placeholder="Enter your password"
        />

        <TextField
          label="Confirm Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          id="password_confirmation"
          error={!!warnings?.password_confirmation}
          helperText={warnings?.password_confirmation}
          InputProps={{
            startAdornment: <Lock style={{ marginRight: "8px" }} />,
          }}
          placeholder="Confirm your password"
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
        <Typography variant="body2" align="center" mt={2}>
          <Link to="/login" style={{ textDecoration: "none", color: "black" }}>
            Already have an account?{" "}
            <span style={{ color: "blue" }}>Login</span>
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
